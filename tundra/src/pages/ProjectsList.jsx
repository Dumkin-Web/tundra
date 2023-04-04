import React, { useEffect, useState } from "react"
import { Badge, Button, Container } from "react-bootstrap";
import { getAllProjects } from "../http/projectApi";
import ProjectCreationModal from "../components/modals/ProjectCreationModal";
import { useNavigate } from "react-router-dom";
import { PROJECT_ROUTE } from "../routing/consts";
import { useDispatch } from "react-redux";
import { setProjectAction } from "../store/projectReducers";
import { HandySvg } from 'handy-svg'
import trash from '../svgIcons/trash-solid.svg'
import '../style/projectList.scss'


const ProjectList = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [projectList, setProjectList] = useState([]);
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProjects().then(projects => {
      setProjectList(projects)
      setLoading(false)
    })
  }, [loading])

  const projectNavigate = (id, name, projectType) => {
    console.log(projectType);
    dispatch(setProjectAction({id, name, projectType}))
    navigate(PROJECT_ROUTE + "/" + id)
  }

  return (
    <section className="my-5 ProjectList">
      <Container className="d-flex justify-content-between align-items-center">
        <Button style={{visibility: "hidden"}}>Create</Button>
        <h2 className="tc-white ">Projects</h2>
        <Button onClick={() => setShow(true)}>Create</Button>
      </Container>

      <div>
        {Array.from(projectList).map(({id, name, project_type}) => {
          return  <Container key={name+id} className="bg-white rounded p-2 my-4 d-flex justify-content-between align-items-center project" style={{width: "500px"}} onClick={() => projectNavigate(id, name, project_type.name)}>
                    <div>{name} <Badge bg="secondary">{project_type.name}</Badge></div>
                    <HandySvg className='trashIcon' src={trash} style={{width: "15px", height: "15px"}}/>
                  </Container>
        })}
      </div>
      <ProjectCreationModal show={show} setShow={setShow} setLoading={setLoading}/>
    </section>
  )
};

export default ProjectList;
