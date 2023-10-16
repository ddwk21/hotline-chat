import {useState} from 'react'

import { auth, googleProvider } from "../config/firebase"
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signUp, currentUser, logOut} = useAuth();
    const navigate = useNavigate();

    const newSignIn = async () => {
        console.log(currentUser)
        try {
            await signUp(auth, email, password);
            navigate('/')
        } catch (err) {
            console.error(err);
        }
    }
    const signInWithGoogle = async () => {
        try{
            await signInWithPopup(auth, googleProvider);
            console.log()
        } catch (err) {
            console.error(err);
        }
    }
    const handleLogOut = async () => {
        try{
            await logOut(auth);
            console.log(currentUser)
        } catch (err) {
            console.error(err);
        }
    }

     
    return ( 
        <div className='loginForm'>
            <div className="inputs">    
                <input 
                placeholder="email" 
                onChange={(e) => setEmail(e.target.value)}
                />
                
                <input 
                placeholder="password" 
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="buttons">
                <button onClick={newSignIn}> Sign In </button>

                <button onClick={signInWithGoogle}> Sign In With Google </button>

                <button onClick={handleLogOut}> Logout </button>
            </div>
        </div>
     );
}
 
export default Auth;