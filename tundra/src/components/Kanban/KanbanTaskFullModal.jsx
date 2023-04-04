import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getProjectMembers } from "../../http/projectApi";
import { HandySvg } from "handy-svg";

import check from '../../svgIcons/check-solid.svg'
import { updateKanbanTask } from "../../http/kanbanApi";

const KanbanTaskFullModal = ({show, setShow, task, setLoading}) => {

    const {id, name, description, done, timeSpent, executorId, kanbanColumnId} = task;
    const deadline = String(task.deadline).slice(0, 16)

    const [projectId, executors] = useSelector(state => [state.project.id, state.project.executors])

    const [edit, setEdit] = useState(false)

    const nameInput = useRef()

    const editKanbanTask = async (e) => {
        e.preventDefault()

        const requestData = {};

        (new FormData(e.target)).forEach((value, key) => {
            console.log(key);
            if(key == 'deadline' && deadline != value){
                requestData[key] = value;
            }
            else if(key.toString() != 'deadline' && task[key] != value){
                requestData[key] = value;
            }
        })

        if(Object.keys(requestData).length != 0){

            const response = await updateKanbanTask(requestData, projectId, id)
            setShow(false)
            setEdit(false)
            setLoading(true)
        }
    }

    return (
        <Modal show={show} onHide={() => {setShow(false); setEdit(false);}}>
            <Modal.Header closeButton>
            <Modal.Title>Kanban task {done && <HandySvg style={{width: "20px", height: "25px", marginLeft: "5px", fill: "rgb(70, 183, 34)"}} src={check} />} </Modal.Title>
            </Modal.Header>
            <Form onSubmit={editKanbanTask}>
                <Modal.Body>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark">Task name</Form.Label>
                        <Form.Control ref={nameInput} type="text" name="name" autoComplete="no" placeholder="Todo..." defaultValue={name} readOnly={!edit}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Task description</Form.Label>
                        <Form.Control type="text" as="textarea" name="description" autoComplete="no" placeholder="Describe your task" defaultValue={description} readOnly={!edit}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Task deadline</Form.Label>
                        <Form.Control type="datetime-local" name="deadline" autoComplete="no" onChange={(e) => console.log(e.target.value)} defaultValue={deadline} readOnly={!edit}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Task executor</Form.Label>
                        <Form.Select name="executorId" defaultValue={executorId} disabled={!edit}>
                            <option value={-1}>Empty</option>
                            {executors.map(({id, fullName, email})=> {
                                return <option key={id} value={id}>{fullName} ({email})</option>
                            })}
                        </Form.Select>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShow(false); setEdit(false);}}>
                    Close
                </Button>
                {edit ? 
                    <Button variant="primary" type="submit">
                        Save
                    </Button> : 
                    <Button variant="danger" onClick={(e) => {e.preventDefault(); setEdit(true); nameInput.current.focus()}}>
                        Edit
                    </Button>
                }
                </Modal.Footer>
            </Form>
        </Modal>
    )
};

export default KanbanTaskFullModal;
