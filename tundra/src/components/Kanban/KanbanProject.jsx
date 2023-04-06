import React, { useEffect, useState } from "react"
import './style.scss'
import { useDispatch, useSelector } from "react-redux";
import { getProject, getProjectMembers } from "../../http/projectApi";
import { setProjectAction } from "../../store/projectReducers";
import KanbanBoard from "./KanbanBoard";
import Chat from "../Chat/Chat";
import { Button } from "react-bootstrap";
import InviteUserModal from "../InviteUserModal";
import { createKanbanBoard } from "../../http/kanbanApi";
import GantModal from "../Gant/GantModal";
import KanbanProjectSettingsModal from "./KanbanProjectSettingsModal";

const KanbanProject = ({parentLoading}) => {

    const [id, name, projectType, boards, ownerId] = useSelector(state => [state.project.id, state.project.name, state.project.projectType, state.project.kanban_boards || [], state.project.ownerId])
    const userId = useSelector(state => state.user.id)

    const [loading, setLoading] = useState(true)
    const [loadingExe, setLoadingExe] = useState(true)
    const [showInvite, setShowInvite] = useState(false)
    const [showGant, setShowGant] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const [currentColumn, setCurrentColumn] = useState(null)
    const [currentTask, setCurrentTask] = useState(null)

    const dispatch = useDispatch()

    useEffect(() => {
        getProject({id, projectType}).then(res => {
            dispatch(setProjectAction(res))
            getProjectMembers({projectId: id}).then(members => {
                dispatch(setProjectAction({executors: members}))
            })
            setLoading(false)
        })
    }, [loading, parentLoading])

    useEffect(() => {
        getProjectMembers({projectId: id}).then(members => {
            dispatch(setProjectAction({executors: members}))
            setLoadingExe(false)
        })
    }, [loadingExe])

    const createNewBoard = async () => {

        try{
            const response = await createKanbanBoard(id)
            setLoading(true)
        }
        catch(e){

        }

    }

    const getProjectTasks = (boards) => {
        const tempTasks = []

        boards.forEach(({kanban_columns}) => {
            kanban_columns.forEach(({kanban_tasks}) => {
                kanban_tasks.forEach(task => {
                    tempTasks.push(task)
                })
            })
        });

        return tempTasks
    }

    if(loadingExe){
        return <div></div>
    }

    return (
        <div className="kanbanProject">
            <div className="contentContainer">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="tc-yellow fs-xl fw-m">{name}</h1>
                    <div className="d-flex align-items-center">
                        {userId == ownerId && <Button variant="success me-2" onClick={() => setShowInvite(true)}>+ Invite</Button>}
                        <Button variant="success me-2" onClick={() => setShowGant(!showGant)}>Gant</Button>
                        {userId == ownerId && <Button onClick={() => setShowSettings(true)}>Settings</Button>}
                    </div>
                </div>
                {boards.map(({id, name}, index) => {
                    return <KanbanBoard key={id} id={id} index={index} setLoading={setLoading} currentColumn={currentColumn} setCurrentColumn={setCurrentColumn} currentTask={currentTask} setCurrentTask={setCurrentTask} />
                })}
                <Button className="mt-2" onClick={createNewBoard}>+ Board</Button>
            </div>
            <Chat connect={true} projectId={id} loading={loading} setLoading={setLoading}/>
            <InviteUserModal setLoading={setLoading} show={showInvite} setShow={setShowInvite} />
            <GantModal show={showGant} setShow={setShowGant} tasks={getProjectTasks(boards)}/>
            <KanbanProjectSettingsModal show={showSettings} setShow={setShowSettings} setLoading={setLoading} />
        </div>
    )
};

export default KanbanProject;
