import React, { useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap";
import { createScrumSprint, moveScrumTasks } from "../../http/scrumApi";
import { useSelector } from "react-redux";

const ScrumSprintFullModal = ({creation, show, setShow, setLoading, sprint}) => {

    const [edit, setEdit] = useState(false)

    const [scrumId, projectId] = useSelector(state => [state.project?.scrum?.id ?? 0, state.project.id])

    const backlog = useSelector(state => state.project?.scrum?.scrum_tasks ?? [])

    const nameInput = useRef()

    const sendSprint = (e) => {
        e.preventDefault();

        const requestData = {};

        const requestDataMoveTasks = []

        const temp = (new FormData(e.target)).forEach((value, key) => {

            if(key.match(/[^A-z]/)){
                requestDataMoveTasks.push({id: key})
            }
            else{
                requestData[key] = value;
            }
        });

        console.log(requestData.name);


        if(requestData.name.length != 0 && requestData.sprintStart && requestData.sprintEnd && requestDataMoveTasks.length > 0){

            if(creation){
                console.log(requestData);
                console.log(requestDataMoveTasks);
                createScrumSprint(requestData, projectId).then(data => {
                    moveScrumTasks({tasksId: requestDataMoveTasks, scrumId: data.scrumId}, projectId).then(data => {
                        setShow(false)
                        setLoading(true)
                    })
                    
                })

            }
            else{
                // updateScrumTask(requestData, projectId, task.id).then(data => {

                //     setEdit(false)
                //     setShow(false)
                //     setLoading(true)
                // })
            }

        }
        else{
            nameInput.current.focus()
        }
    } 

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
            <Modal.Title>{creation ? "Sprint creation" : "Scrum sprint " + sprint.name}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={sendSprint}>
                <Modal.Body>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark">Sprint name</Form.Label>
                        <Form.Control ref={nameInput} type="text" name="name" autoComplete="no" placeholder="Sprint name" defaultValue={sprint.name} readOnly={!creation && !edit}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Sprint start</Form.Label>
                        <Form.Control type="datetime-local" name="sprintStart" autoComplete="no" defaultValue={''} readOnly={!creation && !edit}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Sprint end</Form.Label>
                        <Form.Control type="datetime-local" name="sprintEnd" autoComplete="no" defaultValue={''} readOnly={!creation && !edit}/>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Sprint tasks</Form.Label>
                        {backlog.map(task => {
                            return  <Form.Check 
                                        key={task.id}
                                        type='checkbox'
                                        id={`task-${task.id}`}
                                        name={task.id}
                                        label={`${task.name} | SP: ${task.storyPoints}`}
                                    />
                        })}
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

export default ScrumSprintFullModal;
