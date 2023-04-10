import React, { useEffect } from "react"
import style from '../style/Main.module.css'

import '../style/mainPage.scss'
import { Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PROJECT_LIST_ROUTE, SIGN_UP_ROUTE } from "../routing/consts";
import { userLogin, userRegistration } from "../http/userApi";
import { setAuthAction } from "../store/userReducers";
import { useDispatch } from "react-redux";

const Main = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   const id = searchParams.get('id')
  //   const firstName = searchParams.get('first_name')
  //   const lastName = searchParams.get('last_name')
  //   const username = searchParams.get('username')
  //   console.log(id);
  //   const requestData = {
  //     email: '@' + username,
  //     password: id,
  //     fullName: lastName + ' ' + firstName
  //   }

  //   if(id){
  //     userLogin(requestData).then(data => {

  //       dispatch(setAuthAction(data))
  //       navigate(PROJECT_LIST_ROUTE)
  //     }).catch(() => {
  //       userRegistration(requestData).then(data => {
  //         dispatch(setAuthAction(data)) 
  //         navigate(PROJECT_LIST_ROUTE)
  //       })
  //     })
  //   }
  // })

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
