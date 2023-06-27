import { createSession } from "./session.js";
import { createTokens } from "./tokens.js";

export async function logUserIn(userId, request, reply) {
    const connectionInformation = {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
    }
    // create the session
    const sessionToken = await createSession(userId, connectionInformation);
    // create the jwt
    const {accessToken, refreshToken} = await createTokens(sessionToken, userId);
    // set the cookie
    const now = new Date();
    const refreshExpires = now.setDate(now.getDate() + 30);
    reply.setCookie('refreshToken', refreshToken,{
        path: '/',
        domain: 'localhost',
        httpOnly: true,
        expires: refreshExpires,
    })
    .setCookie('accessToken', accessToken,{
        path: '/',
        domain: 'localhost',
        httpOnly: true,
    })
}