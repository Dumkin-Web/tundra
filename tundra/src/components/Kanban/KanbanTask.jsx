import { HandySvg } from "handy-svg";
import React, { useState } from "react"
import KanbanTaskFullModal from "./KanbanTaskFullModal";
import { useSelector } from "react-redux";

import flag from '../../svgIcons/flag-checkered-solid.svg'
import trash from '../../svgIcons/trash-solid.svg'
import start from '../../svgIcons/play-solid.svg'
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
        const offset = deadlineDate.getTimezoneOffset() * -60 * 1000
        console.log(offset);
        console.log(deadlineDate - currentDate);
        const estimatedTime = new Date(deadlineDate - currentDate - offset)

        console.log(estimatedTime);
        const eMonth = estimatedTime.getMonth()
        const eDay = estimatedTime.getDate() - 1
        const eHours = estimatedTime.getHours()
        const eMinutes = estimatedTime.getMinutes()

        console.log(eHours);

        if(deadlineDate - currentDate)
        return `${eMonth}m ${eDay}d ${eHours}h ${eMinutes}m`

        return "Overdue"
    }

    const getExecutor = (executorId) => {
        let result = ""
        executors.map((exe) => {
            if(exe.id == executorId){
                result = `${exe.fullName.split(" ")[0]} (${exe.email})`
            }
        })
        return result
    }

    const deleteTask = async (e) => {
        e.stopPropagation()

        const response = await deleteKanbanTask(projectId, task.id)

        setLoading(true)
    }

    const startTask = async (e) => {
        e.stopPropagation()

        if(task.inWord){
            return
        }

        const currentDate = new Date(Date.now())

        const response = await updateKanbanTask({inWork: currentDate}, projectId, task.id)

        setLoading(true)

    }

    const finishTask = async (e) => {
        e.stopPropagation()

        const currentDate = new Date(Date.now())

        const response = await updateKanbanTask({done: true, timeSpent: currentDate}, projectId, task.id)

        setLoading(true)
    }

    const getSpentTime = () => {
        let result = ""
        if(!task.timeSpent || !task.inWork){
            console.log('cant calculate');
            return result
        }

        const start = new Date(task.inWork)
        const end = new Date(task.timeSpent)

        const offset = start.getTimezoneOffset() * -60 * 1000
        
        const odd = new Date(end - start - offset);

        const month = odd.getMonth();
        const days = odd.getDate() - 1;
        const hours = odd.getHours() - offset;
        const minutes = odd.getMinutes();
        const seconds = odd.getSeconds();

        result = `${month}m ${days}d ${hours}h ${minutes}m ${seconds}s`

        return result
    }

    return (
        <>
            <div className="kanbanTask" onClick={() => setShowFull(true)} draggable={true} onDragOver={onDragOver} onDragLeave={onDragLeave} onDragStart={onDragStart} onDragEnd={onDragEnd} onDrop={onDrop}>
                <div className="infoContainer">
                    <div className="taskHeader">
                        <h4 style={{textDecoration: decoration}}>{task.name}</h4>
                    </div>

                    {!task.done && <div className="deadline">{convertDeadline(task.deadline)}</div>}
                    {task.done && <div className="timeSpent">{getSpentTime()}</div>}
                    <div className="executor">{getExecutor(task.executorId)}</div>
                </div>
                <div className="buttonContainer">
                    <HandySvg className="taskButton" onClick={finishTask} style={{fill: task.done && 'white'}} src={flag}/>
                    <HandySvg className="taskButton" src={start} style={{fill: task.inWork && 'white'}} onClick={startTask}/>
                    <HandySvg className="taskButton" src={trash} onClick={deleteTask}/>
                </div>
            </div>
            <KanbanTaskFullModal show={showFull} setShow={setShowFull} task={task} setLoading={setLoading}/>
        </>
    )
};

export default KanbanTask;
