import { $authHost } from "."

export const getAllProjects = async () => {
    const {data} = await $authHost.get('/api/project/allProjects')

    
    return data
}

export const getProjectTypes = async () => {
    const {data} = await $authHost.get('/api/project/projectTypes')

    
    return data
}

export const createProject = async ({name, projectType}) => {
    const {data} = await $authHost.post('/api/project/newProject', {name, projectType}, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    
    return data.message
}

export const getProject = async ({id, projectType}) => {
    const {data} = await $authHost.get('/api/project/' + id + "/" + projectType.toLowerCase())

    
    return data
}

export const getProjectMembers = async ({projectId}) => {
    const {data} = await $authHost.get(`/api/project/${projectId}/members`)
    
    return data
}

export const getProjectMessages = async ({projectId}) => {
    const {data} = await $authHost.get(`/api/project/${projectId}/messages`)
    
    return data
}

export const inviteUserQuery = async ({projectId, email}) => {
    const {data} = await $authHost.post(`/api/project/${projectId}/invite`, {email}, {
        headers: {
            'content-type' : 'application/json'
        }
    })
    
    return data
}

export const leaveFromProjectQuery = async ({projectId, userId}) => {
    const {data} = await $authHost.post(`/api/project/${projectId}/leaveFromProject`, {userId}, {
        headers: {
            'content-type' : 'application/json'
        }
    })
    
    return data
}

export const deleteProjectQuery = async ({projectId}) => {
    const {data} = await $authHost.delete(`/api/project/${projectId}`)
    
    return data
}

export const getProjectQuery = async ({projectId}) => {
    const {data} = await $authHost.get(`/api/project/${projectId}`)
    
    return data
}