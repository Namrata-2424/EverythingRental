const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authRepository = require("./authRepository");
const {pool} = require("../../shared/config/db")
require("dotenv").config();

const SALT_ROUNDS = 10;

async function generateToken(user){
    return jwt.sign(
        {
            userId:user.user_uuid,
            userEmail:user.email
        },
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION_TIME}
    )
}

async function register(userData, addressData){
    const client = await pool.connect();

    try{
        //transaction to add rows to user and address table simultaneously
        await client.query("BEGIN");

        //check if user already exists
        const existingUser =  await authRepository.findUserByEmail(client,userData.email);

        if(existingUser){
            throw new Error("User already exists!");
        }

        //hash password
        const hashedPassword = await bcrypt.hash(
            userData.password,
            SALT_ROUNDS
        )

        //add rows into user and address table
        const user = await authRepository.createUserWithAddress(client,{...userData,hashedPassword},addressData);

        //end transaction
        await client.query("COMMIT");

        //return token
        return generateToken(user);
    }catch(err){
        await client.query("ROLLBACK");
        throw err;
    }finally{
        client.release();
    }
}

module.exports = {
    register
}