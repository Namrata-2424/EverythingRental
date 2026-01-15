const {Pool} = require("pg")
require("dotenv").config();

if(!process.env.DATABASE_URL){
    console.log("DATABASE_URL missing!");
    process.exit(1);
}

const pool = new Pool({
    connectionString : process.env.DATABASE_URL
})

const connection = async()=>{
    try{
        await pool.query("SELECT NOW()");
        console.log("Connected to Postgres");
    }
    catch(err){
        console.log(`Error Connecting ${err}`);
    }
}

// pool.on('connect',()=>{
//     console.log(`Connected to Postgres`);
// });

// pool.on('error',()=>{
//     console.log(`Error connecting to Postgres`);
//     //terminate server if not connected to DB
//     process.exit(1);
// })

module.exports ={ connection, pool};