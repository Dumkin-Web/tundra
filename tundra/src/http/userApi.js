import {$host, $authHost} from '.'
import jwt_decode from 'jwt-decode'


export const userLogin = async ({email, password}) => {
    const {data} = await $host.post('/api/user/signIn', {email, password}, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const userRegistration = async ({email, fullName, password}) => {
    const {data} = await $host.post('/api/user/signUp', {email, fullName, password}, {
        headers: {
            'content-type' : 'application/json'
        }
    })

    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const refreshToken = async () => {
    const {data} = await $authHost.get('/api/user/auth')

    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}