import {client} from '../db.js'

export const session = client.db("cluster0").collection("session");
