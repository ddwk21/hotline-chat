import React, {useContext, useEffect, useState} from 'react';
import { createUserWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signUp(auth, email, password){
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logOut(auth){
        return signOut(auth)
    }

    //Listens to authStateChanged and sets user -- oASC returns a method that we can use to unsubscribe from the listener when component unmounted
    useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
        setLoading(false);
        });

    return unsubscribe;

    },[])

    const value = {
        currentUser,
        signUp,
        logOut,
        loading,
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}