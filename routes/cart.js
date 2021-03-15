let express=require("express");
let router=express.Router();
const cartc = require("../controller/cartcontroller");
const auth=require("../middleware/auth");

router
    .route("/usercart")
    .get(auth.Auth,cartc.usercart);

router
    .route("/addtocart/:productId")
    .post(auth.Auth,cartc.addtocart);

router
    .route("/deletecart/:id")
    .delete(auth.Auth,cartc.deletecart);

router
    .route("/addquantity/:id")
    .put(auth.Auth,cartc.addquantity);

router
    .route("/removequantity/:id")
    .delete(auth.Auth,cartc.removequantity);

module.exports=router;