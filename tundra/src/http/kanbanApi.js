import { $authHost } from "."

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

export const updateKanbanTask = async (responseBody, projectId, taskId) => {
    const {data} = await $authHost.patch(`/api/project/${projectId}/kanban/updateTask/${taskId}`, responseBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}