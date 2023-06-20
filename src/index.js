import './env.js'
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import {connectDb} from './db.js';
import { connect } from 'http2';

//esm specific code
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();


async function startApp(){
    try{
        app.register(fastifyStatic, {
            root: path.join(__dirname, 'public'),
        })
        // app.get('/', {}, (request, reply) => {
        //     reply.send({ 'hello': 'world'})
        // })
        await app.listen({port: '3000'})
        console.log('server listening on port 3000')
    }catch(e){
        console.error('e', e)
    }
}

connectDb().then(()=>{
   startApp() 
})

