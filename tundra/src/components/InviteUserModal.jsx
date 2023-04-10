import React, { useRef } from "react"
import { Modal, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { inviteUserQuery } from "../http/projectApi";

const InviteUserModal = ({show, setShow, setLoading}) => {

    const projectId = useSelector(state => state.project.id)
    const emailInput = useRef()
    const formAlert = useRef()

    const inviteUser = async (e) => {
        e.preventDefault()

        const email = emailInput.current.value

        if(email.replaceAll(" ", "") == ""){
            return
        }

        try{
            const response = await inviteUserQuery({projectId, email})
            setShow(false)
            setLoading(true)
        }
        catch(e){
            formAlert.current.innerHTML = e.response.data.message
            //console.log(e.response.data.message);
        }
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Invite teammate</Modal.Title>
                </Modal.Header>
                <Form onSubmit={inviteUser}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label className="fs-m tc-dark">User email or Telegram username</Form.Label>
                            <Form.Control ref={emailInput} type="text" name="email" autoComplete="off" placeholder="useremail@example.com | @telegram_user"/>
                        </Form.Group>
                        <Form.Text className="text-danger" ref={formAlert}>
                            
                        </Form.Text>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="success" type="submit">
                        Invite
                    </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
    )
};

export default InviteUserModal;
