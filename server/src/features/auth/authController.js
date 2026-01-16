const authService = require("./authService")
const {pool} = require("../../shared/config/db");

async function register(req,res){
    console.log("RAW BODY:", req.body);

    try{
        const {
            firstName,
            lastName,
            userName,
            email,
            phoneNumber,
            password,
            address
        } = req.body

        if(
            !firstName ||
            !lastName ||
            !userName ||
            !email ||
            !phoneNumber ||
            !password ||
            !address
        ){
            return res.status(400).json({message:"Missing required fields!"});
        }
        const token = await authService.register(
            {
                firstName,
                lastName,
                userName,
                email,
                phoneNumber,
                password
            },
            address
        )

        return res.status(201).json({
            message:"User Registered Successfully!",
            token
        })
    }catch(err){
        return res.status(400).json({
            message:`${err.message} Could not register user! try again!`
        })
    }
}

module.exports = {
    register
}