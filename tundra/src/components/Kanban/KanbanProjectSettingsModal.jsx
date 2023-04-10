import React from "react"
import { Button, ListGroup, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

import leaveIcon from '../../svgIcons/right-from-bracket-solid.svg'
import { HandySvg } from "handy-svg";
import { leaveFromProjectQuery } from "../../http/projectApi";

const KanbanProjectSettingsModal = ({show, setShow, setLoading}) => {

    const project = useSelector(state => state.project)

    const deleteUser = async (userId) => {

        const response = await leaveFromProjectQuery({projectId: project.id, userId})

        setLoading(true)
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}> 
            <Modal.Header closeButton>
                <Modal.Title style={{fontWeight: "400"}}>Project <span style={{fontWeight: "600"}}>{project.name}'s</span> settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <h5>Project members:</h5>
            <ListGroup>
                {project.executors.map(({id, fullName, email}) => {
                    return  <ListGroup.Item key={id} className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <h5 className="fs-s fw-m m-0 me-2">{email}</h5>
                                    <h5 className="fs-s fw-r m-0">{fullName}</h5>
                                </div>
                                {project.ownerId != id && <HandySvg src={leaveIcon} className='leaveIconUniqe' onClick={() => deleteUser(id)} />}
                            </ListGroup.Item>
                })}
            </ListGroup>
            <h5 className="mt-3">Project bot token for integration:</h5>
            <ListGroup>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <h5 className="fs-s fw-m m-0 me-2">{project.botToken}</h5>
                        </div>
                    </ListGroup.Item>
            </ListGroup>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default KanbanProjectSettingsModal;
