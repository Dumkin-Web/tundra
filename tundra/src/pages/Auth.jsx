import React from "react"
import { useLocation } from "react-router-dom";
import { SIGN_IN_ROUTE } from "../routing/consts";
import { Container } from "react-bootstrap";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const Auth = () => {

    const isLogin = useLocation().pathname === SIGN_IN_ROUTE

  return (
    <main>
        <Container className="d-flex justify-content-center align-items-center" style={{height: "85vh"}}>
            {isLogin ? <SignIn /> : <SignUp />}
        </Container>
    </main>
  )
};

export default Auth;
