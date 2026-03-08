import { useState } from "react"
import WelcomePage from "./pages/Welcomepage"
import { BrowserRouter, Route, Routes } from "react-router-dom"



function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
    </>
    
  )
}

export default App