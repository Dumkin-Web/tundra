import { $authHost } from "."

// SCRUM TASK //
export const createScrumTask = async (responseBody, projectId) => {
    const {data} = await $authHost.post(`/api/project/${projectId}/scrum/newTask`, responseBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}

export const updateScrumTask = async (responseBody, projectId, taskId) => {
    const {data} = await $authHost.patch(`/api/project/${projectId}/scrum/${taskId}`, responseBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}

export const createScrumSprint = async (responseBody, projectId) => {
    const {data} = await $authHost.post(`/api/project/${projectId}/scrum/createSprint`, responseBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}

export const moveScrumTasks = async (responseBody, projectId) => {
    const {data} = await $authHost.patch(`/api/project/${projectId}/scrum/moveTasks`, responseBody, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data
}