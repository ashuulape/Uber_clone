import React  from 'react'
import {Routes,Route, Navigate } from 'react-router-dom'
import Start from './pages/Start.jsx'
import UserSignUp from './pages/UserSignUp.jsx'
import Userlogin from './pages/Userlogin.jsx'
import CaptainSignUp from './pages/CaptainSignUp.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import Home from './pages/home.jsx'
import UserProtectedWrapper from './pages/UserProtectedWrapper.jsx'
import Userlogout from './pages/Userlogout.jsx'
import CpatainHome from './pages/CpatainHome.jsx'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper.jsx'
import Riding from './pages/Riding.jsx'
import Captainlogout from './pages/Captainlogout.jsx'
import CaptainRiding from './pages/CaptainRiding.jsx'



const App = () => {



  return (
    <div>
        <Routes>
          <Route path='*' element={<h1 >404 Page Not Found</h1>}/>
            <Route path='/' element={<Start/>}/>
            <Route path='/register' element={<UserSignUp/>}/>
            <Route path='/login' element={<Userlogin/>}/>
            <Route path='/captain/register' element={<CaptainSignUp/>}/>
            <Route path='/captain/login' element={<CaptainLogin/>}/>
            <Route path='/captain/logout' element={<Captainlogout/>}/>
            <Route path='/home' element={<UserProtectedWrapper><Home/></UserProtectedWrapper>}/>
            <Route path='/user/logout' element={<UserProtectedWrapper><Userlogout/></UserProtectedWrapper>}/>
            <Route path='/captainhome' element={<CaptainProtectedWrapper><CpatainHome/></CaptainProtectedWrapper>}/>
            <Route path='/riding' element={<UserProtectedWrapper><Riding/></UserProtectedWrapper>}/>
            <Route path='/captain/riding' element={<CaptainProtectedWrapper><CaptainRiding/></CaptainProtectedWrapper>}/>
            
        </Routes>

    </div>
  )
}

export default App