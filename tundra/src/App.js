import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import AppRouter from './routing/AppRouter'
import Footer from "./components/Footer";

import './style/style.css'
import { useEffect, useState } from "react";
import { refreshToken } from "./http/userApi";
import { useDispatch } from "react-redux";
import { setAuthAction } from "./store/userReducers";

function App() {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token){
      refreshToken().then(data => {
        dispatch(setAuthAction(data))
        setLoading(false)
      })
      .catch(e => {
        localStorage.clear()
      })
    }
    else{
      setLoading(false)
    }
  }, [])

  if(loading){
    return <div style={{backgroundColor: "#272727", minHeight: "100vh"}}></div>
  }

  return (
    <div style={{backgroundColor: "#272727", minHeight: "100vh"}}>
      <BrowserRouter>
        <Header />
        <AppRouter />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
