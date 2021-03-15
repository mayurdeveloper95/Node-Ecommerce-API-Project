let express=require("express");
let router=express.Router();
const catc = require("../controller/categorycontroller");

router
    .route("/addcat")
    .post(catc.addcat);

router
    .route("/allcat")
    .get(catc.allcat);

router
    .route("/findcatbyid/:id")
    .get(catc.findcatbyid);

router
    .route("/deletecat/:id")
    .delete(catc.deletecat);

router
    .route("/catpagination/:page")
    .post(catc.catpagination);

module.exports=router;