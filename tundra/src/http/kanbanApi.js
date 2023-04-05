import { $authHost } from "."


// KANBAN TASK //
export const createKanbanTask = async (responseBody, projectId, boardId) => {
    const {data} = await $authHost.post(`/api/project/${projectId}/kanban/${boardId}/newTask`, responseBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}

export const deleteKanbanTask = async (projectId, taskId) => {
    const {data} = await $authHost.delete(`/api/project/${projectId}/kanban/deleteTask/${taskId}`)

    
    return data
}

export const updateKanbanTask = async (requestBody, projectId, taskId) => {
    const {data} = await $authHost.patch(`/api/project/${projectId}/kanban/updateTask/${taskId}`, requestBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}

// KANBAN BOARD //

export const updateKanbanBoard = async (requestBody, projectId, boardId) => {
    const {data} = await $authHost.patch(`/api/project/${projectId}/kanban/updateBoard/${boardId}`, requestBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}

export const createKanbanBoard = async (projectId) => {
    const {data} = await $authHost.post(`/api/project/${projectId}/kanban/createBoard`, {}, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}

export const deleteKanbanBoard = async (projectId, boardId) => {
    const {data} = await $authHost.delete(`/api/project/${projectId}/kanban/deleteBoard/${boardId}`)

    
    return data
}