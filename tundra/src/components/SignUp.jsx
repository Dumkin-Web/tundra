import React from "react"
import { Button, Form } from "react-bootstrap";
import { userRegistration } from "../http/userApi";
import { useDispatch } from "react-redux";
import { setAuthAction } from "../store/userReducers";
import { Link, useNavigate } from "react-router-dom";
import { PROJECT_LIST_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from "../routing/consts";

const SignUp = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const registration = async (e) => {
      e.preventDefault();

      const requestData = {};

      (new FormData(e.target)).forEach((value, key) => {
          requestData[key] = value;
      })

      if(requestData.password !== requestData.passwordRepeat){
        return
      }

      delete requestData.passwordRepeat;

      try{
        const data = await userRegistration(requestData)

        dispatch(setAuthAction(data))

        navigate(PROJECT_LIST_ROUTE)
      }
      catch(e){
        console.log(e);
      }

  }

  return (
      <Form onSubmit={registration} className="bg-dark-green p-4 rounded" style={{width: "400px"}}>
        <h1 style={{textAlign: "center"}} className="tc-white fs-xl">Sign In</h1>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="fs-m tc-white">Email address</Form.Label>
          <Form.Control type="text" name="fullName" autoComplete="fullName" placeholder="Sergeev Sergey Sergeevich" style={{border: 'none'}}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label className="fs-m tc-white">Email address</Form.Label>
          <Form.Control type="email" name="email" autoComplete="email" placeholder="name@example.com" style={{border: 'none'}}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label className="fs-m tc-white">Password</Form.Label>
          <Form.Control type="password" name="password" autoComplete="password" placeholder="Password" style={{border: 'none'}}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label className="fs-m tc-white">Repeat password</Form.Label>
          <Form.Control type="password" name="passwordRepeat" autoComplete="password" placeholder="Repeat your password" style={{border: 'none'}}/>
        </Form.Group>
            

        <div className="d-flex justify-content-between align-items-center mt-4">
          <Link to={SIGN_IN_ROUTE} className="href tc-white tc-white-h fs-s fw-r">Already have an account?</Link>
          <Button style={{border: "none"}} variant="dark" type="submit">Login</Button>
        </div>
    </Form>
    )
};

export default SignUp;
