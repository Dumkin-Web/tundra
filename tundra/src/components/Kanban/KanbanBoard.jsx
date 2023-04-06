import React, { useEffect, useReducer, useRef, useState } from "react"
import { useSelector } from "react-redux";
import KanbanTaskCreationModal from "../modals/KanbanTaskCreationModal";
import { deleteKanbanBoard, updateKanbanBoard, updateKanbanTask } from "../../http/kanbanApi";
import KanbanTask from "./KanbanTask";
import { HandySvg } from "handy-svg";

import pen from '../../svgIcons/pen-solid.svg'
import trash from '../../svgIcons/trash-solid.svg'

const KanbanBoard = ({id, index, setLoading, currentColumn, setCurrentColumn, currentTask, setCurrentTask}) => {

    const projectId = useSelector(state => state.project.id)
    const board = useSelector(state => state.project.kanban_boards[index])
    const [show, setShow] = useState(false)

    const sortColumns = (columns) => {
        const temp = columns.sort((a, b) => a.order - b.order)
        return temp
    }

    const [editBoardName, setEditBoardName] = useState(false)

    const boardNameInput = useRef()

    useEffect(() => {
        console.log(currentTask);
    }, [currentTask])

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
        try{
            if(column.id === currentColumn.id){
                return
            }
        }
        catch(e){

        }
        console.log(column.id);
        console.log(currentTask.id);

        const response = await updateKanbanTask({kanbanColumnId: column.id}, board.projectId, currentTask.id)
        setLoading(true)
    }

    const changeBoardName = async () => {
        if(editBoardName && board.name != boardNameInput.current.value){

            const requestBody = {name: boardNameInput.current.value}
            
            const response = await updateKanbanBoard(requestBody, projectId, id)

            setLoading(true)
        }
    }

    const deleteBoard = async () => {

        const response = await deleteKanbanBoard(projectId, id)

        setLoading(true)
    }

    return (
        <>
            <div className="kanbanBoard">
            <div className="kanbanNaming">
                <div>
                    {editBoardName ? 
                        <input ref={boardNameInput} onSubmit={() => {changeBoardName(); setEditBoardName(!editBoardName);}} type="text" className="inputBoardName tc-orange fs-l fw-m" placeholder="Name the board" defaultValue={board.name} /> : 
                        <h2 className="tc-orange fs-l fw-m">{board.name}</h2>
                    }
                    <HandySvg className="editName" src={pen} onClick={() => {changeBoardName(); setEditBoardName(!editBoardName);}}/>
                </div>
                <HandySvg className="deleteBoard" onClick={deleteBoard} src={trash} />
            </div>

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
                                { +column.wip < 100 && <h3 className="wip">WIP {column.wip}</h3>}
                            </div>
                })}
            </div>

            
            </div>
            <KanbanTaskCreationModal show={show} setShow={setShow} setLoading={setLoading} boardIndex={index}/>
        </>
    )
};

export default KanbanBoard;
