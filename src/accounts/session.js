import { randomBytes} from 'crypto';


export async function createSession(userId, connection){
    try{// generate a session token
    const sessionToken = randomBytes(43).toString('hex');
    // retrieve the connection information
    const { ip, userAgent } = connection;
    // database insert for the session
    const {session} = await import("../session/session.js")
    await session.insertOne({
        sessionToken,
        userId,
        valid: true,
        userAgent,
        ip,
        updatedAt: new Date(),
        createdAt: new Date(),
    })
    // return the session 
    return sessionToken
    }catch(e){
        throw new Error('Session could not be created')
    }
    
}