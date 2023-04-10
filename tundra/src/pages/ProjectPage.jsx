import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import KanbanProject from "../components/Kanban/KanbanProject";
import Chat from "../components/Chat/Chat";
import { resetProjectAction, setProjectAction } from "../store/projectReducers";
import { getProjectQuery, getProjectTypes } from "../http/projectApi";
import Scrum from "../components/Scrum/Scrum";

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

    return () => {
      dispatch(resetProjectAction())
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

    if(project.projectType === "Scrum"){
      return  <>
                <Scrum parentLoading={parentLoading}/>
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
