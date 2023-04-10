const defaultState = {
    loading: true
}

const SET_LOADING = "SET_LOADING"
const SET_NOTLOADING = "SET_NOTLOADING"

export const projectLoadingReducer = (state = defaultState, action) => {
    const payload = action.payload

    switch (action.type) {
        case SET_LOADING:
            return {
                loading: payload
            }
        
        default:
            return state
    }
}

export const setProjectLoading = (payload) => ({type: SET_LOADING, payload})