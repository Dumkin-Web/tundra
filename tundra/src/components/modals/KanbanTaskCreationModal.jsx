import React, { useEffect, useState } from "react"
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { createKanbanTask } from "../../http/kanbanApi";

const KanbanTaskCreationModal = ({show, setShow, setLoading, boardIndex}) => {

    const [columns, projectId, boardId, executors] = useSelector(state => [state.project.kanban_boards[boardIndex].kanban_columns, state.project.id, state.project.kanban_boards[boardIndex].id, state.project.executors])


    const createNewTask = async (e) => {
        e.preventDefault()

        const requestData = {order: 1};

        (new FormData(e.target)).forEach((value, key) => {
            requestData[key] = value;
        })

        if(requestData.name === ""){
            return
        }

        if(!requestData.deadline){
            delete requestData.deadline
        }

        const data = await createKanbanTask(requestData, projectId, boardId)
        console.log(data);
        setShow(false)
        setLoading(true)
        
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Task creation</Modal.Title>
            </Modal.Header>
            <Form onSubmit={createNewTask}>
                <Modal.Body>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark">Task name</Form.Label>
                        <Form.Control type="text" name="name" autoComplete="no" placeholder="Todo..."/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Task name</Form.Label>
                        <Form.Control type="text" name="description" as="textarea" rows={3} placeholder="Describe the task"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Select column</Form.Label>
                        <Form.Select name="kanbanColumnId">
                            {columns.map(({id, name})=> {
                                return <option key={id} value={id}>{name}</option>
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Select column</Form.Label>
                        <Form.Select name="executorId">
                            <option value={-1}>Empty</option>
                            {executors.map(({id, fullName, email})=> {
                                return <option key={id} value={id}>{fullName} ({email})</option>
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Deadline</Form.Label>
                        <Form.Control type="datetime-local" name="deadline" defaultValue={null}/>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Create
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
};

export default KanbanTaskCreationModal;
