import './env.js'
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './db.js';
import { registerUser } from './accounts/register.js';
import { authorizeUser } from './accounts/authorize.js';
import { logUserIn } from './accounts/logUserIn.js';
import { getUserFromCookies } from './accounts/user.js';

//esm specific code
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();


async function startApp() {
    try {
        app.register(fastifyCookie, {
            secret: process.env.COOKIE_SIGNATURE
        })
        app.register(fastifyStatic, {
            root: path.join(__dirname, 'public'),
        })
        app.post('/api/register', {}, async (request, reply) => {
            try {
                const userId = await registerUser(request.body.email, request.body.password)
            }
            catch (e) {
                console.error('e', e)
            }
        })
        app.post('/api/authorize', {}, async (request, reply) => {
            try {
                console.log(request.body.email, request.body.password)
                const { isAuthorized, userID } = await authorizeUser(request.body.email, request.body.password)
                if (isAuthorized) {
                    await logUserIn(userID, request, reply)
                    reply.send({ data: 'Auth Failed' })
                }
            }
            catch (e) {
                console.error('e', e)
            }
        })
        app.get('/test', {}, async (request, reply) => {
            try {
                //verify user logged in
                const user = await getUserFromCookies(request)
                console.log('user', user)
                //return user email, if it exists, otherwise return unauthorized
                if (user?._id) {
                reply.send({ data: user, })
                }else{reply.send({ data: 'Auth Failed' })}
                
            } catch (e) {
                console.error('e', e)
            }
        })
        await app.listen({ port: '3000' })
        console.log('server listening on port 3000')
    } catch (e) {
        console.error('e', e)
    }
}

connectDb().then(() => {
    startApp()
})

