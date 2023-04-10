import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import Chat from "../Chat/Chat";
import InviteUserModal from "../InviteUserModal";
import KanbanProjectSettingsModal from "../Kanban/KanbanProjectSettingsModal";
import { setProjectLoading } from "../../store/projectLoadingReducer";
import { setProjectAction } from "../../store/projectReducers";
import { getProject, getProjectMembers } from "../../http/projectApi";
import { Button } from "react-bootstrap";
import './scrum.scss'
import ScrumTaskFullModal from "./ScrumTaskFullModal";
import ScrumSprintFullModal from "./ScrumSprintFullModal";
import { HandySvg } from "handy-svg";
import finish from '../../svgIcons/flag-checkered-solid.svg'
import { updateScrumTask } from "../../http/scrumApi";

const convertDate = (date) => {
    const temp = new Date(date)
    const now = new Date(Date.now())
    const offset = now.getTimezoneOffset()*-60*1000

    const result = new Date(temp - now - offset)

    return `${result.getMonth()}m ${result.getDate()-1}d ${result.getHours()}h`
}

const findSprint = (list, id) => {
    return list.filter((sprint) => sprint.id == id)[0]
}

const Scrum = ({parentLoading}) => {

    const dispatch = useDispatch()

    const [id, name, projectType, scrumTasks, ownerId, sprints] = useSelector(state => [state.project.id, state.project.name, state.project.projectType, state.project.scrum?.scrum_tasks || [], state.project.ownerId, state.project.sprints])
    const userId = useSelector(state => state.user.id)

    const loading = useSelector(state => state.projectLoading.loading)
    const setLoading = (arg) => dispatch(setProjectLoading(arg))

    const [loadingExe, setLoadingExe] = useState(true)
    const [showInvite, setShowInvite] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    //TASK MODAL
    const [showTaskModal, setShowTaskModal] = useState(false)
    const [taskCreation, setTaskCreation] = useState(false)
    const [task, setTask] = useState({name: ''})

    //SPRINT MODAL
    const [showSprintModal, setShowSprintModal] = useState(false)
    const [sprintCreation, setSprintCreation] = useState(false)
    const [sprint, setSprint] = useState({name: ''})

    //SPRINT
    const [currentSprint, setCurrentSprint] = useState({id: -1})

    useEffect(() => {
        getProject({id, projectType}).then(res => {
            dispatch(setProjectAction(res))
            getProjectMembers({projectId: id}).then(members => {
                dispatch(setProjectAction({executors: members}))
            })
            setLoading(false)
            
        })

        if(currentSprint.id != -1){
            setCurrentSprint(findSprint(sprints, currentSprint.id))
        }

    }, [loading, parentLoading])

    useEffect(() => {
        getProjectMembers({projectId: id}).then(members => {
            dispatch(setProjectAction({executors: members}))
            setLoadingExe(false)
        })
    }, [loadingExe])

    const sortTasks = (tasks) => {
        return tasks.sort((a, b) => b.storyPoints - a.storyPoints)
    }

    const sortSprints = (sprints) => {
        try{
            return sprints.sort((a, b) => {
                return (new Date(a.sprintStart)).getTime() - (new Date(b.sprintStart)).getTime()
            })
        }
        catch(e){
            return []
        }
    }

    const taskDone = (e, taskId) => {
        e.stopPropagation()

        updateScrumTask({done: true}, id, taskId).then(data => {

            setLoading(true)
        })
    }

    if(loadingExe){
        return <div></div>
    }

    return (
        <div className="scrumProject">
            <div className="contentContainer">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="tc-yellow fs-xl fw-m">{name}</h1>
                    <div className="d-flex align-items-center">
                        {userId == ownerId && <Button variant="success me-2" onClick={() => setShowInvite(true)}>+ Invite</Button>}
                        {userId == ownerId && <Button onClick={() => setShowSettings(true)}>Settings</Button>}
                    </div>
                </div>
                <div className="scrumBody">
                    <div className="backlog">
                        <div className="backlogHeader">
                            <h2>Backlog</h2>
                            <Button onClick={() => {setTaskCreation(true); setTask({name: ''}); setShowTaskModal(true);}}>New task</Button>
                        </div>
                        <div className="taskContainer">
                            {sortTasks(scrumTasks).map((task) => {
                                return  <div key={task.id} className="task" onClick={() => {setTaskCreation(false); setTask(task); setShowTaskModal(true);}}>
                                            <div className="taskName">
                                                {task.name}
                                            </div>
                                            {task.storyPoints !== 0 && <div className="taskSP">
                                                {task.storyPoints}
                                            </div>}
                                        </div>
                            })}
                        </div>
                        <ScrumTaskFullModal creation={taskCreation} show={showTaskModal} setShow={setShowTaskModal} setLoading={setLoading} task={task}/>
                    </div>
                    <div className="sprints">
                        <div className="sprintsHeader">
                            <h2>Sprints</h2>
                            <Button onClick={() => {setSprintCreation(true); setSprint({name: ''}); setShowSprintModal(true);}}>New sprint</Button>
                        </div>
                        <div className="sprintsContainer">
                            {sortSprints(sprints).map((sprint) => {
                                return  <div key={sprint.id} className={currentSprint.id == (sprint.id) ? "sprint chosenSprint" : "sprint"}onClick={() => setCurrentSprint(sprint)}>
                                            <div className="sprintHeader">
                                                <div className="sprintName">
                                                    {sprint.name}
                                                </div>
                                                <div className="sprintTasks">
                                                    {sprint.scrum_tasks.length}
                                                </div>
                                            </div>
                                            <div className="sprintTime">
                                                Sprint starts in <span>{convertDate(sprint.sprintStart)}</span>
                                            </div>
                                            <div className="sprintTime">
                                                Sprint ends in <span>{convertDate(sprint.sprintEnd)}</span>
                                            </div>
                                        </div>
                            })}
                            <ScrumSprintFullModal creation={sprintCreation} show={showSprintModal} setShow={setShowSprintModal} setLoading={setLoading} sprint={sprint} />
                        </div>
                    </div>
                    {currentSprint.id != -1 &&  <div className="currentSprint">
                                                        <div className="sprintHeader">
                                                            <h3>{currentSprint.name}</h3>
                                                            <button onClick={() => {setCurrentSprint({id: -1})}}>
                                                                x
                                                            </button>
                                                        </div>
                                                        {sortTasks(currentSprint.scrum_tasks).map((task) => {
                                                            return  <div key={task.id} className="task" onClick={() => {setTaskCreation(false); setTask(task); setShowTaskModal(true);}}>
                                                                        <div className="taskName" style={{textDecoration: task.done ? 'line-through' : 'none'}}>
                                                                            {task.name}
                                                                        </div>
                                                                        {task.storyPoints !== 0 && <div className="taskSP">
                                                                            SP: {task.storyPoints}
                                                                        </div>}
                                                                        {!task.done && <HandySvg src={finish} onClick={e => taskDone(e, task.id)} className='svg'/>}
                                                                    </div>
                                                        })}
                                                </div>
                    }
                </div>
            </div>



            <Chat connect={true} projectId={id} loading={loading} setLoading={setLoading}/>
            <InviteUserModal setLoading={setLoading} show={showInvite} setShow={setShowInvite} />
            <KanbanProjectSettingsModal show={showSettings} setShow={setShowSettings} setLoading={setLoading} />
        </div>
    )
};

export default Scrum;
