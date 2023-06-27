import bcryptjs from "bcryptjs";

const { compare } = bcryptjs;

export async function authorizeUser(email, password) {
    // Import user collection
    const { user } = await import("../user/user.js");    
    // Look up user
    const userData = await user.findOne({ "email.address": email })
    console.log('userData', userData)
    // Get User Password
    const savedPassword = userData.password;
    //compare the password with one in database
    const isAuthorized = await compare(password, savedPassword)
    console.log('isAuthorized', isAuthorized)
    //return the boolean if password is correct
    return {isAuthorized, userID: userData._id}
}