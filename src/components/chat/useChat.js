// ─────────────────────────────────────────────────────────────────
// useChat.js  —  Firebase real-time chat hook
// Firestore structure:
//   conversations/{conversationId}
//     uid, userName, userAvatar, status, lastMessage,
//     lastMessageAt, unreadAdmin, unreadUser, createdAt
//
//   conversations/{conversationId}/messages/{messageId}
//     text, senderId, senderName, senderRole (user|admin),
//     timestamp, read, type (text|image|system)
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import {
  collection, doc, addDoc, updateDoc, onSnapshot,
  query, orderBy, serverTimestamp, getDoc, setDoc,
  where, getDocs, limit,
} from "firebase/firestore";
import { db, auth } from "../../utils/firebase/firebase";

// ─── Get or create a conversation for a user ─────────────────────
export async function getOrCreateConversation(uid, userName, userAvatar = "") {
  const ref = doc(db, "conversations", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      userName,
      userAvatar,
      status: "open",           // open | closed | pending
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
      unreadAdmin: 0,
      unreadUser: 0,
      createdAt: serverTimestamp(),
    });
  }
  return uid; // conversationId === uid for simplicity
}

// ─── useUserChat — for the customer widget / chat page ───────────
export function useUserChat() {
  const user = auth.currentUser;
  const [messages, setMessages]       = useState([]);
  const [convData, setConvData]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sending, setSending]         = useState(false);
  const [convId, setConvId]           = useState(null);
  const unsubMsgs  = useRef(null);
  const unsubConv  = useRef(null);

  // Initialise conversation
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      const id = await getOrCreateConversation(
        user.uid,
        user.displayName || user.email?.split("@")[0] || "Customer",
        user.photoURL || ""
      );
      if (cancelled) return;
      setConvId(id);
    })();

    return () => { cancelled = true; };
  }, [user]);

  // Subscribe to messages + conversation doc
  useEffect(() => {
    if (!convId) return;

    // Messages sub
    const msgsQ = query(
      collection(db, "conversations", convId, "messages"),
      orderBy("timestamp", "asc")
    );
    unsubMsgs.current = onSnapshot(msgsQ, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    // Conversation doc sub
    unsubConv.current = onSnapshot(doc(db, "conversations", convId), snap => {
      if (snap.exists()) setConvData(snap.data());
    });

    // Mark user messages as read when they open the chat
    updateDoc(doc(db, "conversations", convId), { unreadUser: 0 }).catch(() => {});

    return () => {
      unsubMsgs.current?.();
      unsubConv.current?.();
    };
  }, [convId]);

  // Send a message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !convId || sending) return;
    setSending(true);
    try {
      const msg = {
        text: text.trim(),
        senderId: user.uid,
        senderName: user.displayName || user.email?.split("@")[0] || "Customer",
        senderRole: "user",
        timestamp: serverTimestamp(),
        read: false,
        type: "text",
      };
      await addDoc(collection(db, "conversations", convId, "messages"), msg);
      await updateDoc(doc(db, "conversations", convId), {
        lastMessage: text.trim(),
        lastMessageAt: serverTimestamp(),
        unreadAdmin: (convData?.unreadAdmin || 0) + 1,
        status: "open",
      });
    } finally {
      setSending(false);
    }
  }, [convId, user, convData, sending]);

  // Mark messages read when chat is opened
  const markRead = useCallback(() => {
    if (convId) updateDoc(doc(db, "conversations", convId), { unreadUser: 0 }).catch(() => {});
  }, [convId]);

  return { messages, convData, loading, sending, sendMessage, markRead, unreadCount: convData?.unreadUser || 0 };
}

// ─── useAdminChat — for the admin panel ──────────────────────────
export function useAdminChat(selectedConvId = null) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages]           = useState([]);
  const [sending, setSending]             = useState(false);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const unsubConvs = useRef(null);
  const unsubMsgs  = useRef(null);

  // Subscribe to all conversations
  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      orderBy("lastMessageAt", "desc")
    );
    unsubConvs.current = onSnapshot(q, snap => {
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubConvs.current?.();
  }, []);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    unsubMsgs.current?.();
    if (!selectedConvId) { setMessages([]); return; }

    setLoadingMsgs(true);
    const q = query(
      collection(db, "conversations", selectedConvId, "messages"),
      orderBy("timestamp", "asc")
    );
    unsubMsgs.current = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingMsgs(false);
    });

    // Mark as read by admin
    updateDoc(doc(db, "conversations", selectedConvId), { unreadAdmin: 0 }).catch(() => {});

    return () => unsubMsgs.current?.();
  }, [selectedConvId]);

  // Admin send message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !selectedConvId || sending) return;
    setSending(true);
    try {
      const msg = {
        text: text.trim(),
        senderId: "admin",
        senderName: "Support Agent",
        senderRole: "admin",
        timestamp: serverTimestamp(),
        read: false,
        type: "text",
      };
      await addDoc(collection(db, "conversations", selectedConvId, "messages"), msg);

      // Get current unreadUser count
      const convSnap = await getDoc(doc(db, "conversations", selectedConvId));
      const current = convSnap.data()?.unreadUser || 0;

      await updateDoc(doc(db, "conversations", selectedConvId), {
        lastMessage: text.trim(),
        lastMessageAt: serverTimestamp(),
        unreadUser: current + 1,
        status: "open",
      });
    } finally {
      setSending(false);
    }
  }, [selectedConvId, sending]);

  // Update conversation status
  const setStatus = useCallback(async (convId, status) => {
    await updateDoc(doc(db, "conversations", convId), { status });
  }, []);

  const totalUnread = conversations.reduce((s, c) => s + (c.unreadAdmin || 0), 0);

  return { conversations, messages, sending, loadingMsgs, sendMessage, setStatus, totalUnread };
}