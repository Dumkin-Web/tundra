import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import KanbanProject from "../components/Kanban/KanbanProject";
import Chat from "../components/Chat/Chat";
import { setProjectAction } from "../store/projectReducers";
import { getProjectQuery, getProjectTypes } from "../http/projectApi";

const findProject = (projects, projectId) => {
    const result = projects.map((project) => {
      if(project.id == projectId){
        return project
      }
    })[0]

    return result
}

const ProjectPage = () => {

  const dispatch = useDispatch()
  const isSettings = useLocation().pathname.includes("/project")
  const projectId = useLocation().pathname.split('/')[2]
  const project = useSelector(state => state.project)
  const [parentLoading, setParentLoading] = useState(true)

  useEffect(() => {
    console.log(project);
    if(project.id == ''){
      getProjectTypes().then(types => {
        getProjectQuery({projectId}).then((data) => {
          types.forEach((type) => {
            if(type.id == data.projectTypeId){
              data.projectType = type.name
            }
          })
          dispatch(setProjectAction(data))
          setParentLoading(false)
        })
      })
    }
    else{
      setParentLoading(false)
    }
    
  }, [])

  if(parentLoading){
    return <div></div>
  }

    if(project.projectType === "Kanban"){
      return  <>
                <KanbanProject parentLoading={parentLoading}/>
              </>
    }
    return (
      <div>
        Hi
        {isSettings}
      </div>
    )
};

export default ProjectPage;
