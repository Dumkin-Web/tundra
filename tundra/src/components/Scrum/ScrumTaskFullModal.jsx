import React, { useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap";
import { createScrumTask, updateScrumTask } from "../../http/scrumApi";
import { useSelector } from "react-redux";

const ScrumTaskFullModal = ({creation, show, setShow, setLoading, task}) => {

    const [edit, setEdit] = useState(false)

    const projectId = useSelector(state => state.project.id)

    const nameInput = useRef()

    const scrumTask = (e) => {
        e.preventDefault();

        const requestData = {};

        const temp = (new FormData(e.target)).forEach((value, key) => {
            requestData[key] = value;
        });

        console.log(requestData.name);

        if(requestData.storyPoints == ''){
            delete requestData.storyPoints;
        }

        if(requestData.name.length != 0){

            if(creation){

                createScrumTask(requestData, projectId).then(data => {

                    setShow(false)
                    setLoading(true)
                })

            }
            else{
                updateScrumTask(requestData, projectId, task.id).then(data => {

                    setEdit(false)
                    setShow(false)
                    setLoading(true)
                })
            }

        }
        else{
            nameInput.current.focus()
        }
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
            <Modal.Title>{creation ? "Task creation" : "Scrum task " + task.name}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={scrumTask}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label className="fs-m tc-dark">Task name</Form.Label>
                        <Form.Control ref={nameInput} type="text" name="name" autoComplete="no" placeholder="Task name" defaultValue={task.name} readOnly={!creation && !edit}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Task description</Form.Label>
                        <Form.Control type="text" as="textarea" name="description" autoComplete="no" placeholder="Task description" defaultValue={task.description} readOnly={!creation && !edit}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Task SP</Form.Label>
                        <Form.Control type="number" name="storyPoints" autoComplete="no" placeholder="10" defaultValue={task.storyPoints} readOnly={!creation && !edit}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    {!creation && edit ? 
                        <Button variant="primary" type="submit">
                            Save
                        </Button> : 
                        <Button variant="danger" onClick={(e) => {e.preventDefault(); setEdit(true)}} hidden={creation}>
                            Edit
                        </Button>
                    }
                    {creation && <Button variant="primary" type="submit">
                        Create
                    </Button>}
                </Modal.Footer>
            </Form>
        </Modal>
    )
};

export default ScrumTaskFullModal;
