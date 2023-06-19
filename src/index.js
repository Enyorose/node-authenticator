
import fastify from 'fastify';

const app = fastify();

async function startApp(){
    try{
        app.get('/', {}, (request, reply) => {
            reply.send({ 'hello': 'world'})
        })
        await app.listen({port: '3000'})
        console.log('server listening on port 3000')
    }catch(e){
        console.error('e', e)
    }
}

startApp()