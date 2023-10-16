
import './App.css'
import Auth from './components/Auth'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Messages from './components/Messages'
import { auth } from './config/firebase'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

function App() {

    return (
        <AppBody />
      )

}

function AppBody() {
  
  const {currentUser, loading} = useAuth();
  console.log(currentUser)

  if(loading) {
    return <div>Loading!</div>;
  }

  return(

    <>
    <div>
      <Router>
          <Routes>
            
          <Route 
            path ="/" 
            element={currentUser ?  <Messages/> : <Navigate to={'/signup'}/>   }/>
            
            <Route 
            path="/signup" 
            element={<Auth/>}/>
              
          </Routes>
      </Router>
    </div>
  </>
  )
}



export default App
