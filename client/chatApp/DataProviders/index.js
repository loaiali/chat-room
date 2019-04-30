import base64 from 'base-64'
import { getStoreToken as getToken } from '../store'
import CONFIG from '../config.json'

export const login = async (username, password) => {
    const url = `http://${CONFIG.server_ip}/login`
    console.log(url)
    const headers = new Headers()
    headers.append('Authorization', `Basic ${base64.encode(`${username}:${password}`)}`)
    const response = await fetch(url, {
        method: 'GET',
        headers,
    })

    if (response.status === 200) {
        const { token } = await response.json()
        console.log(token)
        return {token}
    }
    const { err } = await response.json()
    throw new Error(err)
}



export const createNewRoom = async roomInfo => {
    const response = await fetch(`http://${CONFIG.server_ip}/rooms`, {
        method: 'POST',
        headers: { 'x-access-token': getUserToken() },
        body: JSON.stringify(roomInfo),
    })
    if (response.status === 200) {
        const { mes } = await response.json()
        // codes.unshift(" Please choose department ");
        return mes
    }
    const { err } = await response.text()
    throw new Error(err)
}

export const loadRooms = async () => {
    const url = `http://${CONFIG.server_ip}/user/rooms`
    console.log(url, getToken())
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-access-token': getToken() },
    })
    console.log(response)

    if (response.status === 200) {
        const { data } = await response.json()
        console.log(data)
        return data
    }
    const { err } = response.json()
    console.log("error")
    throw new Error(err)
}


export const loadOldMessages = async (roomId) => {
    const url = `http://${CONFIG.server_ip}/rooms/${roomId}`
    console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-access-token': getToken() },
    })
    console.log(response)

    if (response.status === 200) {
        const { data } = await response.json()
        console.log(data)
        return data
    }
    const { err } = response.json()
    console.log("error")
    throw new Error(err)
}