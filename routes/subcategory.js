let express=require("express");
let router=express.Router();
const subcatc = require("../controller/subcategorycontroller");

router
    .route("/addsubcat")
    .post(subcatc.addsubcat);

router
    .route("/allsubcat")
    .get(subcatc.allsubcat);

router
    .route("/deletesubcat/:id")
    .delete(subcatc.deletesubcat);

router
    .route("/subcatpagination/:page")
    .post(subcatc.subcatpagination);

module.exports=router;