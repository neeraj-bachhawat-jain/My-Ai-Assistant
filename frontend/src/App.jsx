import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Customize from './Pages/Customize'
import Home from './Pages/Home'
import { userDataContext } from './Context/UserContext'
import Customize2 from './Pages/Customize2'

function App() {
  const {userData, setUserData} = useContext(userDataContext);
  return (
    <Routes>
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName) ? <Home/> : <Navigate to={"/customize"} />}/>
      <Route path='/signup' element={!userData ? <Signup /> : <Navigate to={"/"} />}/>
      <Route path='/login' element={!userData ? <Login /> : <Navigate to={"/"} />}/>
      <Route path='/customize' element={userData?<Customize /> : <Navigate to={"/signup"}/>}/>
      <Route path='/customize2' element={userData?<Customize2 /> : <Navigate to={"/signup"}/>}/>
      <Route path='*' element={<h1>Page not found</h1>} />
    </Routes>
  )
}

export default App
