import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portal from "./pages/Portal.jsx";
import Home from "./pages/Home.jsx";
import Page404 from "./pages/Page404.jsx";

import App from "./App.jsx";
import "./index.css";
import { PrivateRoutes } from "./utils/PrivateRoutes.jsx";
import SignUp from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import { AuthProvider } from "./utils/AuthContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleAuthToken = import.meta.env.VITE_GOOGLE_AUTH_TOKEN;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={`${googleAuthToken}`}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route Component={PrivateRoutes}>
            <Route path="/portal" Component={Portal} />
          </Route>
          <Route path="/dashboard" Component={App} />
          <Route path="/signin" Component={Signin} />
          <Route path="/signup" Component={SignUp} />
          <Route path="*" Component={Page404} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
