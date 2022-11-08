import axios from "axios";

const RASA_BASE = "http://127.0.0.1:5005/webhooks/rest/webhook/"
const SENTI_BASE = "http://127.0.0.1:8000/chats/"

export async function sendToRasa (body){
    return axios({
        url:RASA_BASE,
        method: "POST",
        data: body
    })
}

export async function getChats (id){
    return axios({
        url:SENTI_BASE + id,
        method:"GET"
    })
}