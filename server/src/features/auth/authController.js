const authService = require("./authService");

async function login(req, res) {
  try {
    const { username, password } = req.body; 

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required"
      });
    }

    const user = await authService.loginUser(username, password);

    res.status(200).json({
      message: "Login successful",
      user
    });
  } catch (err) {
    res.status(401).json({
      message: err.message
    });
  }
}

module.exports = { login };
