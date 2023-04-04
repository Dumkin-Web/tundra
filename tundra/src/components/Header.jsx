import React from "react"
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MAIN_ROUTE, PROJECT_LIST_ROUTE, PROJECT_ROUTE, SIGN_IN_ROUTE } from "../routing/consts";
import { useSelector } from "react-redux";


const Header = () => {

    const navigate = useNavigate();

    const isAuth = useSelector(state => state.user.isAuth)

    const navigateLogin = () => {
        navigate(SIGN_IN_ROUTE)
    }

    return (
        <Navbar style={{backgroundColor: "#232323"}}>
            <Container>
                <Link to={MAIN_ROUTE} className="href tc-green tc-green-h fs-xl fw-m me-5">Tundra</Link>
                <Nav className="me-auto">
                    <Link to={PROJECT_LIST_ROUTE} className="href tc-dark-green tc-dark-green-h fs-m fw-m me-auto">Проекты</Link>
                </Nav>
                {isAuth && <Button onClick={navigateLogin} style={{border: "none"}} className="bg-green bg-green-h tc-dark">Войти</Button>}
            </Container>
        </Navbar>
    )
};

export default Header;
