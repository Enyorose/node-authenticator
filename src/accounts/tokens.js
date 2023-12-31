import jwt from 'jsonwebtoken';

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId){
    try {
        // create a refresh token
            // session id
        const refreshToken = jwt.sign({
            sessionToken
        }, JWTSignature)
        // create an access token
            // session id. User id
        const accessToken = jwt.sign({
           sessionToken,
            userId
        }, JWTSignature)
        // return refresh token and access token
        return {refreshToken, accessToken}
    }
    catch(e){
        console.error('e', e)
    }
}