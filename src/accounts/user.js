import mongo from 'mongodb';
import jwt from 'jsonwebtoken';
import { createTokens } from './tokens.js';

const { ObjectId } = mongo;

const JWTSignature = process.env.JWT_SIGNATURE;


export async function getUserFromCookies(request, reply) {
    try {
        const { user } = await import("../user/user.js")
        const { session } = await import("../session/session.js")
        console.log("user",user, "session", session)
        // check to make sure access token is present
        if (request?.cookies?.accessToken) {
            // if access token
            const { accessToken } = request.cookies;
            // decode access token
            const decodedAccessToken = jwt.verify(accessToken, JWTSignature)
            // return user from record
            const user = await user.findOne({
                _id: new ObjectId(decodedAccessToken?.userId),
            })
             console.log('user', user) 
            return user;
        }
        //get the access and refresh tokens
        if(request?.cookies?.refreshToken){
            const {refreshToken} = request.cookies;
            // decode refresh token
            const {sessionToken} = jwt.verify(refreshToken, JWTSignature)
            // look up session
          
            const currentSession = await session.findOne({
                sessionToken:sessionToken
            })
            console.log('currentSession', currentSession)
            // confirm session is valid
            if(currentSession.valid){
                // look up current user
                const currentUser = await user.findOne({
                    _id: new ObjectId(currentSession?.userId),
                })
                // refresh tokens
                await refreshTokens(sessionToken, currentUser._id, reply)
                // return current user
                return currentUser;
            }
        }

    } catch (e) {
        console.error('e', e)
    }
}
export async function refreshTokens(sessionToken, userId, reply) {
    try {
        const {accessToken, refreshToken} = await createTokens(sessionToken, userId);
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
    } catch (e) {
        console.error('e', e)
    }
}