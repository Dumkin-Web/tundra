import React, { useRef, useState } from "react"
import { Button, Form } from "react-bootstrap";

import './userPage.scss'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../http/userApi";
import { setAuthAction } from "../../store/userReducers";

const UserPage = () => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const [edit, setEdit] = useState(false)
    const navigate = useNavigate()

    const passwordInput = useRef()
    const passwordInputR = useRef()

    const changeUserInfo = async (e) => {
        e.preventDefault()

        const requestData = {};

        (new FormData(e.target)).forEach((value, key) => {
            requestData[key] = value;
        })

        if(requestData.password != requestData.passwordRepeat){
            passwordInputR.current.focus()
            return
        }

        delete requestData.passwordRepeat;

        Object.keys(requestData).forEach((key) => {
            if(requestData[key] == user[key]){
                delete requestData[key]
            }
        })

        const newUserData = await updateUser(requestData)

        dispatch(setAuthAction(newUserData))
        setEdit(false)

        passwordInput.current.value = ''
        passwordInputR.current.value = ''
    }

    const logOut = () => {

        localStorage.clear()
        navigate(0)
    }

    return (
        <div className="userProfile">
            <div className="userContainer">
                <div className="profileHeader">User profile</div>
                <div className="userInfo">
                    <Form onSubmit={changeUserInfo}>

                        <Form.Group>
                            <Form.Label className="fs-m tc-dark mt-4">{user.email[0].includes('@') ? 'Telegram' : 'Email'}</Form.Label>
                            <Form.Control type="text" name="email" placeholder="mail@example.com" autoComplete="email login" defaultValue={user.email} disabled/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="fs-m tc-dark mt-4">Name&Surname</Form.Label>
                            <Form.Control type="text" name="fullName" placeholder="Name and surname" autoComplete="off" defaultValue={user.fullName} readOnly={!edit} disabled={user.email[0].includes('@')} required minLength={3} />
                        </Form.Group>

                        {!user.email[0].includes('@') && <Form.Group>
                            <Form.Label className="fs-m tc-dark mt-4">Password</Form.Label>
                            <Form.Control ref={passwordInput} type="password" name="password" autoComplete="off" placeholder="Password" readOnly={!edit}/>
                        </Form.Group>}

                        {!user.email[0].includes('@') && <Form.Group>
                            <Form.Label className="fs-m tc-dark mt-4">Password repeat</Form.Label>
                            <Form.Control ref={passwordInputR} type="password" name="passwordRepeat" autoComplete="off" placeholder="Repeat password" readOnly={!edit}/>
                        </Form.Group>}
                        
                        <div className="buttonsContainer mt-4">
                            <Button variant="danger" onClick={logOut}>Logout</Button>
                            {!user.email[0].includes('@') && !edit && <Button onClick={() => setEdit(true)}>Edit</Button>}
                            {!user.email[0].includes('@') && edit &&<div>
                                <Button variant="secondary" className="me-2" onClick={() => setEdit(false)}>Cancel</Button>
                                <Button variant="success" type="submit">Save</Button>
                            </div>}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
};

export default UserPage;
