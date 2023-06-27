import bcryptjs from "bcryptjs";

const { genSalt, hash } = bcryptjs;

export async function registerUser(email, password){
    const {user} = await import("../user/user.js")
    // generate the salt
    const salt = await genSalt(10);
    // hash with the salt
    const hashedPassword = await hash(password, salt)
    // store in database
    const result = await user.insertOne({
        email: {
            address: email,
            verified: false,
        },
        password: hashedPassword,
    })
    // return the user
    return result.insertedId
}