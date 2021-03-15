let express=require("express");
let router=express.Router();
const checkoutc = require("../controller/checkoutcontroller");
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");

router
    .route("/checkoutcart")
    .post(auth.Auth,checkoutc.checkoutcart);

router
    .route("/getallcart")
    .get(auth.Auth,admin.Admin,checkoutc.getallcart);

router
    .route("/getusercart")
    .get(auth.Auth,checkoutc.getusercart);

router
    .route("/deletecheckout/:id")
    .delete(auth.Auth,admin.Admin,checkoutc.deletecheckout)

module.exports=router;