const bcrypt = require("bcrypt");
const authRepository = require("./authRepository");

async function loginUser(username, password) {
  const user = await authRepository.findUserByUsername(username);

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(password, user.user_password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  delete user.user_password;
  return user;
}

module.exports = { loginUser };
