let express=require("express");
let router=express.Router();
const contactc = require("../controller/contactcontroller");

router
    .route("/addcontact")
    .post(contactc.addcontact);

router
    .route("/allcontact")
    .get(contactc.allcontact);

module.exports=router;