import React, {useContext, useEffect, useState} from 'react';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = React.createContext()
const googleProvider = new GoogleAuthProvider()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    async function signUp(auth, email, password){
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        return credential.user
    }

    function logOut(auth){
        return signOut(auth)
    }

    function signIn(auth, email, password){

            return signInWithEmailAndPassword(auth, email, password);
    }

    async function googleSignIn(auth){
        try{

            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if(!userSnap.exists()) {

                const prefixes = (name) => {
                    let prefixArray = []
                    for(let i = 3; i< name.length; i++){
                        let prefix = name.substring(0,i + 1);
                        let lowerCasePrefix = prefix.toLowerCase();
                        prefixArray.push(lowerCasePrefix);
                    }
                    return prefixArray;
                }
                let newUserPrefixArray = prefixes(displayName);

                await setDoc(userRef, {
                    displayName: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    prefixes: newUserPrefixArray,
                    createdAt: serverTimestamp(),
                    online: true
                });
                
            }  
            await updateDoc(userRef, {
                online: true
            });
        } catch (error) {
            console.error('Error signing in with Google: ', error);
        }

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
        signIn,
        googleSignIn,
        loading,
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}