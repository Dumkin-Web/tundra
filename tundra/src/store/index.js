import {createStore, combineReducers} from 'redux'
import { userReducer } from './userReducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import { projectReducer } from './projectReducers'
import { dialogReducer } from './dialogReducer'

const rootReducer = combineReducers({
    user: userReducer,
    project: projectReducer,
    dialog: dialogReducer
})

export const store = createStore(rootReducer, composeWithDevTools())