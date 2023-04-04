const defaultState = {
    id: "",
    name: "",
    projectType: ""
}


const SET_PROJECT = "SET_PROJECT"
//const SET_NOTAUTH = "SET_NOTAUTH"

export const projectReducer = (state = defaultState, action) => {
    const payload = action.payload

    switch (action.type) {
        case SET_PROJECT:
            return {
                ...state,
                ...payload
            }
        default:
            return state
    }
}

export const setProjectAction = (payload) => ({type: SET_PROJECT, payload})
//export const setNotAuthAction = (payload) => ({type: SET_NOTAUTH, payload})
