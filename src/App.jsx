// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import NewClient from "./pages/Client";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/client" element={<NewClient />} />
        
      </Routes>
    </>
  );
}

export default App;
