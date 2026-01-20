const authService = require("./authService")

async function register(req,res){
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

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const token = await authService.login(username, password);

    return res.status(200).json({
      message: "Login successful",
      accessToken: token
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message
    });
  }
}

module.exports = {
    register,
    login
}