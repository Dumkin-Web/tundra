import React, { useEffect, useRef, useState } from "react"
import { Badge, Button, Container, Form, InputGroup } from "react-bootstrap";
import { deleteProjectQuery, getAllProjects, leaveFromProjectQuery } from "../http/projectApi";
import ProjectCreationModal from "../components/modals/ProjectCreationModal";
import { useNavigate } from "react-router-dom";
import { PROJECT_ROUTE } from "../routing/consts";
import { useDispatch, useSelector } from "react-redux";
import { setProjectAction } from "../store/projectReducers";
import { HandySvg } from 'handy-svg'

import leaveIcon from '../svgIcons/right-from-bracket-solid.svg'
import trash from '../svgIcons/trash-solid.svg'

import '../style/projectList.scss'
import ProjectSearch from "../services/ProjectSearchService";


const ProjectList = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = useSelector(state => state.user.id)
  const [projectList, setProjectList] = useState([]);
  const [searchProject, setSearchProject] = useState([])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)

  const searchInput = useRef()

  useEffect(() => {
    getAllProjects().then(projects => {
      setProjectList(projects)
      setSearchProject(projects)
      setLoading(false)
    })
  }, [loading])

  const projectNavigate = (id, name, projectType) => {
    console.log(projectType);
    dispatch(setProjectAction({id, name, projectType}))
    navigate(PROJECT_ROUTE + "/" + id)
  }

  const deleteProject = async (e, {projectId}) => {
      e.stopPropagation()
      const response = await deleteProjectQuery({projectId})

      setLoading(true)
  }

  const leaveFromProject = async (e, {projectId}) => {
    e.stopPropagation()

    const response = await leaveFromProjectQuery({projectId, userId})

    setLoading(true)
  }

  const search = (e) => {
    e.preventDefault()

    setSearchProject(ProjectSearch(projectList, searchInput.current.value))

  }

  return (
    <section className="my-5 ProjectList">
      <Container className="d-flex justify-content-between align-items-center">
        <Button style={{visibility: "hidden"}}>Create</Button>
        <h2 className="tc-white ">Projects</h2>
        <Button onClick={() => setShow(true)}>Create</Button>
      </Container>
      <Container className="d-flex justify-content-center">
        <Form style={{width: "500px"}} onSubmit={search}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Project name or #Kanban"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              defaultValue={""}
              ref={searchInput}
              onInput={search}
              style={{outline: 'none', border: 'none'}}
            />
            <Button variant="outline-success" id="button-addon2" type="submit">
              Search
            </Button>
          </InputGroup>
        </Form>
      </Container>
      <div>
        {Array.from(searchProject).map(({id, name, project_type, ownerId}) => {
          return  <Container key={name+id} className="bg-white rounded p-2 my-4 d-flex justify-content-between align-items-center project" style={{width: "500px"}} onClick={() => projectNavigate(id, name, project_type.name)}>
                    <div>{name} <Badge bg="secondary">{project_type.name}</Badge></div>
                    {userId == ownerId ? <HandySvg className='trashIcon' onClick={(e) => deleteProject(e, {projectId: id})} src={trash} style={{width: "15px", height: "15px"}}/> : <HandySvg className='trashIcon' onClick={(e) => leaveFromProject(e, {projectId: id})} src={leaveIcon} style={{width: "15px", height: "15px"}}/>}
                  </Container>
        })}
      </div>
      <ProjectCreationModal show={show} setShow={setShow} setLoading={setLoading}/>
    </section>
  )
};

export default ProjectList;
