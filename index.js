let express=require('express');
let ex =express();
let morgan=require("morgan");
let config=require("config");
let cors = require('cors');
let mongoose=require("mongoose");
let Fawn=require('fawn');

ex.use(express.json());
ex.use(cors());
const port = process.env.PORT || 4500;

require("./startup/dbconnection")(mongoose);
require("./startup/routes")(ex);
Fawn.init(mongoose);

if(!config.get("key"))
{
    console.log("server get crashed");
    process.exit(1);
}

if(config.get('host.mode') ==="development")
{
    ex.use(morgan('tiny'));
}

ex.use("/uploads",express.static('uploads'));

ex.listen(port,()=>console.log(`connected to port ${port}`));