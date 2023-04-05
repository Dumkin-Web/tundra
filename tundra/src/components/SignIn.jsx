import React from "react"
import { Button, Form } from "react-bootstrap";
import { userLogin } from "../http/userApi";
import { Link, useNavigate } from "react-router-dom";
import { PROJECT_LIST_ROUTE, SIGN_UP_ROUTE } from "../routing/consts";
import { setAuthAction } from "../store/userReducers";
import { useDispatch } from "react-redux";

const SignIn = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault();

        const requestData = {};

        (new FormData(e.target)).forEach((value, key) => {
            requestData[key] = value;
        })  

        try{
            const data = await userLogin(requestData)
    
            dispatch(setAuthAction(data))
    
            navigate(PROJECT_LIST_ROUTE)
          }
          catch(e){
            console.log(e);
          }
    }

    return (
        <Form onSubmit={login} className="bg-dark-green p-4 rounded" style={{width: "400px"}}>
            <h1 style={{textAlign: "center"}} className="tc-white fs-xl">Sign In</h1>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className="fs-m tc-white">Email address</Form.Label>
                <Form.Control type="email" name="email" autoComplete="email" placeholder="name@example.com" style={{border: 'none'}}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label className="fs-m tc-white">Password</Form.Label>
                <Form.Control type="password" name="password" autoComplete="password" placeholder="Password" style={{border: 'none'}}/>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mt-4">
                <Link to={SIGN_UP_ROUTE} className="href tc-white tc-white-h fs-s fw-r">Already have an account?</Link>
                <Button style={{border: "none"}} variant="dark" type="submit">Sign in</Button>
            </div>
        </Form>
    )
};

export default SignIn;
