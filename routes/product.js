let express=require("express");
let router=express.Router();
const prodc = require("../controller/productcontroller");
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");

router
    .route("/addproduct")
    .post(prodc.addproduct);

router
    .route("/allproducts")
    .get(prodc.allproducts);

router
    .route("/findprodbyid/:id")
    .get(prodc.findprodbyid);

router
    .route("/deleteprod/:id")
    .delete(auth.Auth,admin.Admin,prodc.deleteprod);

router
    .route("/updateprod/:id")
    .put(auth.Auth,prodc.updateprod);

router
    .route("/todayoffer")
    .get(prodc.todayoffer);

router
    .route("/latestproduct")
    .get(prodc.latestproduct);

router
    .route("/product/:page")
    .post(prodc.product);

router
    .route("/category/:catid/page/:pageno")
    .post(prodc.prodcatpagination);

router
    .route("/category/:catid/subcategory/:subcatid/page/:pageno")
    .post(prodc.prodsubcatpagination); 

module.exports=router;