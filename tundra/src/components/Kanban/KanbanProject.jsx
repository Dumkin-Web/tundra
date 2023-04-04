import React, { useEffect, useState } from "react"
import './style.scss'
import { useDispatch, useSelector } from "react-redux";
import { getProject, getProjectMembers } from "../../http/projectApi";
import { setProjectAction } from "../../store/projectReducers";
import KanbanBoard from "./KanbanBoard";
import Chat from "../Chat/Chat";
import { Button } from "react-bootstrap";
import InviteUserModal from "../InviteUserModal";

const KanbanProject = () => {

    const [id, name, projectType, boards, ownerId] = useSelector(state => [state.project.id, state.project.name, state.project.projectType, state.project.kanban_boards || [], state.project.ownerId])
    const userId = useSelector(state => state.user.id)

    const [loading, setLoading] = useState(true)
    const [loadingExe, setLoadingExe] = useState(true)
    const [showInvite, setShowInvite] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        getProject({id, projectType}).then(res => {
            dispatch(setProjectAction(res))
            getProjectMembers({projectId: id}).then(members => {
                dispatch(setProjectAction({executors: members}))
            })
            setLoading(false)
        })
    }, [loading])

    useEffect(() => {
        getProjectMembers({projectId: id}).then(members => {
            dispatch(setProjectAction({executors: members}))
            setLoadingExe(false)
        })
    }, [loadingExe])

    if(loadingExe){
        return <div></div>
    }

    return (
        <div className="kanbanProject">
            <div className="contentContainer">
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="tc-yellow fs-xl fw-m">{name}</h1>
                    {userId == ownerId && 
                    <div className="d-flex align-items-center">
                        <Button variant="success me-2" onClick={() => setShowInvite(true)}>+ Invite</Button>
                        <Button>Settings</Button>
                    </div>}
                </div>
                {boards.map(({id, name}, index) => {
                    return <KanbanBoard key={id} id={id} index={index} setLoading={setLoading} />
                })}
            </div>
            <Chat connect={true} projectId={id} loading={loading} setLoading={setLoading}/>
            <InviteUserModal setLoading={setLoading} show={showInvite} setShow={setShowInvite} />
        </div>
    )
};

export default KanbanProject;
