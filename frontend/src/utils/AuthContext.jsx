import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    const signin = () => {
        setIsSignedIn(true);
    }

    const signout = () => {
        setIsSignedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isSignedIn, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
}
