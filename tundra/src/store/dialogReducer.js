const defaultState = {
    id: "1",
    name: "",
    dialogType: ""
}


const SET_PROJECT = "SET_PROJECT"

export const dialogReducer = (state = defaultState, action) => {
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

export const setDialogAction = (payload) => ({type: SET_PROJECT, payload})