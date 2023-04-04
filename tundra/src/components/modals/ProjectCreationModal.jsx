import React, { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap";
import { createProject, getProjectTypes } from "../../http/projectApi";
import { propTypes } from "react-bootstrap/esm/Image";

const ProjectCreationModal = ({show, setShow, setLoading}) => {

    const [types, setTypes] = useState([]);

    useEffect(() => {
        getProjectTypes().then(projectTypes => {
            console.log(projectTypes);
            setTypes(projectTypes)
        })
    }, [])

    const createNewProject = async (e) => {
        e.preventDefault()

        const requestData = {};

        (new FormData(e.target)).forEach((value, key) => {
            requestData[key] = value;
        })

        if(requestData.name === ""){
            return
        }

        const data = await createProject(requestData)
        setShow(false)
        setLoading(true)
        
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Project creation</Modal.Title>
            </Modal.Header>
            <Form onSubmit={createNewProject}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label className="fs-m tc-dark">Project name</Form.Label>
                        <Form.Control type="text" name="name" autoComplete="no" placeholder="Tundra dev"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="fs-m tc-dark mt-4">Project type</Form.Label>
                        <Form.Select name="projectType">
                            {Array.from(types).map(({name}) => {
                                return <option key={name} value={name}>{name}</option>
                            })}
                        </Form.Select>
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

export default ProjectCreationModal;
