import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import KanbanProject from "../components/Kanban/KanbanProject";
import Chat from "../components/Chat/Chat";

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
  const projectType = useSelector(state => state.project.projectType)


    if(projectType === "Kanban"){
      return  <>
                <KanbanProject />
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
