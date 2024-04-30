import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portal from "./pages/Portal.jsx";

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/portal" Component={Portal}/>
          <Route path='/' Component={App}/>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)
