//execution
require('dotenv').config();
const dbconnect = require("./shared/config/db");

dbconnect.connection();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT,(req,res)=>{
    console.log(`Server running on port ${PORT}`);
})