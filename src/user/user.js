import {client} from '../db.js'

export const user = client.db("cluster0").collection("user");