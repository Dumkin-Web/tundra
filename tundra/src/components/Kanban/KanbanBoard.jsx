import React, { useState } from "react"
import { useSelector } from "react-redux";
import KanbanTaskCreationModal from "../modals/KanbanTaskCreationModal";
import { updateKanbanTask } from "../../http/kanbanApi";
import KanbanTask from "./KanbanTask";

const KanbanBoard = ({id, index, setLoading}) => {

    const board = useSelector(state => state.project.kanban_boards[index])
    const [show, setShow] = useState(false)

    const sortColumns = (columns) => {
        const temp = columns.sort((a, b) => a.order - b.order)
        return temp
    }

    const [currentColumn, setCurrentColumn] = useState(null)
    const [currentTask, setCurrentTask] = useState(null)

    const dragOverHandler = (e) => {
        e.preventDefault()
        if(e.target.className === 'column')
            e.target.style.opacity = '0.5';
        e.stopPropagation()
    }

    const dragLeaveHandler = (e) => {
        e.target.style.opacity = '1'
    }

    const dragStartHandler = (e, column, task) => {
        setCurrentColumn(column)
        setCurrentTask(task)
    }

    const dragEndHandler = (e, column, task) => {
        e.target.style.opacity = '1'
    }

    const dropHandler = (e, column, task) => {
        e.preventDefault();
    }

    const dropCardHandler = async (e, column) => {
        e.preventDefault();
        e.target.style.opacity = '1'
        if(column.id === currentColumn.id){
            return
        }

        const response = await updateKanbanTask({kanbanColumnId: column.id}, board.projectId, currentTask.id)
        setLoading(true)
    }

    return (
        <>
            <div className="kanbanBoard">
            <h2 className="tc-orange fs-l fw-m">{board.name}</h2>

            <div className="board">
                {sortColumns(board.kanban_columns).map((column, index) => {
                    return  <div key={column.id} className="column" style={{backgroundColor: column.color}}
                                onDragOver={(e) => dragOverHandler(e)}
                                onDragLeave={(e) => dragLeaveHandler(e)}
                                onDragEnd={(e) => dragEndHandler(e)}
                                onDrop={(e) => dropCardHandler(e, column)}
                            >
                                <div className="columnHeader">
                                    <h3 className="tc-dark fs-l fw-m">{column.name}</h3>
                                    <button onClick={() => setShow(true)}>New task</button>
                                </div>
                                <div className="columnTasks">
                                    {column.kanban_tasks.map((task) => {
                                        return  <KanbanTask key={task.id} className="kanbanTask"
                                                    onDragOver={(e) => dragOverHandler(e)}
                                                    onDragLeave={(e) => dragLeaveHandler(e)}
                                                    onDragStart={(e) => dragStartHandler(e, column, task)}
                                                    onDragEnd={(e) => dragEndHandler(e, column, task)}
                                                    onDrop={(e) => dropHandler(e, column, task)}
                                                    draggable={true}
                                                    task={task}
                                                    setLoading={setLoading}
                                                >
                                                </KanbanTask>
                                    })}
                                </div>
                            </div>
                })}
            </div>

            
            </div>
            <KanbanTaskCreationModal show={show} setShow={setShow} setLoading={setLoading} boardIndex={index}/>
        </>
    )
};

export default KanbanBoard;
