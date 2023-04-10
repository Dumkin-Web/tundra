import React from "react"
import { Button, Form } from "react-bootstrap";
import { userLogin, userRegistration } from "../http/userApi";
import { useDispatch } from "react-redux";
import { setAuthAction } from "../store/userReducers";
import { Link, useNavigate } from "react-router-dom";
import { PROJECT_LIST_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE } from "../routing/consts";
import TelegramLoginButton from "telegram-login-button";

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

      if(requestData.agreement != 'on'){
        return
      }

      delete requestData.passwordRepeat;
      delete requestData.agreement;

      try{
        const data = await userRegistration(requestData)

        dispatch(setAuthAction(data))

        navigate(PROJECT_LIST_ROUTE)
      }
      catch(e){
        console.log(e);
      }

  }

  const loginTg = ({id, first_name, last_name, username}) => {

    const requestData = {
        email: '@' + username,
        password: `${id}`,
        fullName: last_name + ' ' + first_name
    }

    if(id){
        userLogin(requestData).then(data => {
  
          dispatch(setAuthAction(data))
          navigate(PROJECT_LIST_ROUTE)
        }).catch(() => {
          userRegistration(requestData).then(data => {
            dispatch(setAuthAction(data)) 
            navigate(PROJECT_LIST_ROUTE)
          })
        })
    }

}

  return (
      <Form onSubmit={registration} className="bg-dark-green p-4 rounded" style={{width: "400px"}}>
        <h1 style={{textAlign: "center"}} className="tc-white fs-xl">Sign In</h1>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="fs-m tc-white">Name & Surname</Form.Label>
          <Form.Control type="text" name="fullName" autoComplete="fullName" placeholder="Sergeev Sergey" style={{border: 'none'}} minLength={3} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label className="fs-m tc-white">Email address</Form.Label>
          <Form.Control type="email" name="email" autoComplete="email" placeholder="name@example.com" style={{border: 'none'}} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
          <Form.Label className="fs-m tc-white">Password</Form.Label>
          <Form.Control type="password" name="password" autoComplete="password" placeholder="Password" style={{border: 'none'}} minLength={6} required/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
          <Form.Label className="fs-m tc-white">Repeat password</Form.Label>
          <Form.Control type="password" name="passwordRepeat" autoComplete="password" placeholder="Repeat your password" style={{border: 'none'}} required/>
        </Form.Group>
            
        <Form.Check type="switch" id="custom-switch" name="agreement" label="Consent to the processing of personal data" className="tc-white" required/>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <Link to={SIGN_IN_ROUTE} className="href tc-white tc-white-h fs-s fw-r">Already have an account?</Link>
          <Button style={{border: "none"}} variant="dark" type="submit">Sign Up</Button>
        </div>
        <TelegramLoginButton botName="TundraWorkspaceBot" dataOnauth={(user) => loginTg(user)} className='tgButton' cornerRadius='10' />
    </Form>
    )
};

export default SignUp;
