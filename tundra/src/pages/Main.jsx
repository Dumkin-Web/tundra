import React from "react"
import style from '../style/Main.module.css'

import '../style/mainPage.scss'
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { SIGN_UP_ROUTE } from "../routing/consts";

const Main = () => {

  const navigate = useNavigate()

  return (
    <main style={{height: "auto"}} className="mainPage">
      <div className="mainContainer">
        <h1 className="headerText">Makes your development better</h1>

        <div className="description">Tundra web application will help speed up all stages of product development and improve communication in the team!</div>

        <Button size="lg" variant="success" onClick={() => navigate(SIGN_UP_ROUTE)} className="signupButton">Start now!</Button>
      </div>
      <div className={style.bg_container}>
        <img src="tundra.jpg" alt="Tundra" className={style.bg_img}/>
        <div className={style.bg_filter}></div>
      </div>
    </main>
  )
};

export default Main;
