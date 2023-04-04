import { HandySvg } from "handy-svg";
import React, { useState } from "react"
import KanbanTaskFullModal from "./KanbanTaskFullModal";
import { useSelector } from "react-redux";

import flag from '../../svgIcons/flag-checkered-solid.svg'
import trash from '../../svgIcons/trash-solid.svg'
import { deleteKanbanTask, updateKanbanTask } from "../../http/kanbanApi";

const KanbanTask = ({task, onDragOver, onDragLeave, onDragStart, onDragEnd, onDrop, setLoading}) => {

    const [showFull, setShowFull] = useState(false)
    const executors = useSelector(state => state.project.executors)

    const projectId = useSelector(state => state.project.id)

    const decoration = task.done ? "line-through" : "none"

    const convertDeadline = (deadline) => {
        if(!deadline){
            return ""
        }
        const deadlineDate = new Date(deadline)
        const currentDate = new Date(Date.now())

        const eMonth = deadlineDate.getMonth() - currentDate.getMonth()//estimatedTime.getMonth()
        const eWeek = Math.floor((deadlineDate.getDate() - currentDate.getDate()) / 7)//Math.floor(estimatedTime.getDate() / 7)
        const eDay = deadlineDate.getDate() - currentDate.getDate()//estimatedTime.getDate()
        const eHours = deadlineDate.getHours() - currentDate.getHours()//estimatedTime.getHours()
        const eMinutes = deadlineDate.getMinutes() - currentDate.getMinutes()//estimatedTime.getMinutes()

        if(Math.abs(eMonth) == 1){
            return eMonth + ' month'
        }
        else if(Math.abs(eMonth) > 1){
            return eMonth + ' months'
        }

        if(Math.abs(eWeek) == 1){ 
            return eWeek + ' week'
        }
        else if(Math.abs(eWeek) > 1){
            return eWeek + ' weeks'
        }

        if(Math.abs(eDay) == 1){
            return eDay + ' day'
        }
        else if(Math.abs(eDay) > 1){
            return eDay + ' days'
        }

        if(Math.abs(eHours) == 1){
            return eHours + ' hour'
        }
        else if(Math.abs(eHours) > 1){
            return eHours + ' hours'
        }

        if(Math.abs(eMinutes) == 1){
            return eMinutes + ' minute'
        }
        else if(Math.abs(eMinutes) > 1){
            return eMinutes + ' minutes'
        }

        return "Overdue"
    }

    const getExecutor = (executorId) => {
        let result = ""
        result = executors.map((exe) => {
            if(exe.id == executorId){
                return `${exe.fullName} (${exe.email})`
            }
        })[0]
        return result
    }

    const deleteTask = async (e) => {
        e.stopPropagation()

        const response = await deleteKanbanTask(projectId, task.id)

        setLoading(true)
    }

    const finishTask = async (e) => {
        e.stopPropagation()

        const response = await updateKanbanTask({done: true}, projectId, task.id)

        setLoading(true)
    }

    return (
        <>
            <div className="kanbanTask" onClick={() => setShowFull(true)} draggable={true} onDragOver={onDragOver} onDragLeave={onDragLeave} onDragStart={onDragStart} onDragEnd={onDragEnd} onDrop={onDrop}>
                <div className="taskHeader">
                    <h4 style={{textDecoration: decoration}}>{task.name}</h4>
                    {!task.done && <HandySvg className="finishButton" onClick={finishTask} src={flag} />}
                </div>

                {!task.done && <div className="deadline">{convertDeadline(task.deadline)}</div>}
                <div className="executor">{getExecutor(task.executorId)}</div>

                <div className="taskFooter">
                    <HandySvg className="trashButton" src={trash} onClick={deleteTask}/>
                </div>
            </div>
            <KanbanTaskFullModal show={showFull} setShow={setShowFull} task={task} setLoading={setLoading}/>
        </>
    )
};

export default KanbanTask;
