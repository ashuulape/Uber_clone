import React  from 'react'
import {Routes,Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import UserSignUp from './pages/UserSignUp.jsx'
import Userlogin from './pages/Userlogin.jsx'
import CaptainSignUp from './pages/CaptainSignUp.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'


const App = () => {



  return (
    <div>
        <Routes>
          
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<UserSignUp/>}/>
            <Route path='/login' element={<Userlogin/>}/>
            <Route path='/captain/register' element={<CaptainSignUp/>}/>
            <Route path='/captain/login' element={<CaptainLogin/>}/>
            
        </Routes>

    </div>
  )
}

export default App