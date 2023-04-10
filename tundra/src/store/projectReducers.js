const defaultState = {
    id: "",
    name: "",
    projectType: ""
}


const SET_PROJECT = "SET_PROJECT"
const RESET_PROJECT = "RESET_PROJECT"

export const projectReducer = (state = defaultState, action) => {
    const payload = action.payload

    switch (action.type) {
        case SET_PROJECT:
            return {
                ...state,
                ...payload
            }
        case RESET_PROJECT:
            return defaultState
        default:
            return state
    }
}

export const setProjectAction = (payload) => ({type: SET_PROJECT, payload})
export const resetProjectAction = (payload) => ({type: RESET_PROJECT, payload})
