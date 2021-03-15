let express=require("express");
let router=express.Router();
const userc = require("../controller/usercontroller");
const userauthc = require("../controller/userauthcontroller");
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");

router
    .route("/alluser")
    .get(userc.alluser);

router
    .route("/signup")
    .post(userc.signup);

router
    .route("/login")
    .post(userauthc.login);

router
    .route("/forgotPassword")
    .post(userc.forgotPassword);

router
    .route("/resetPassword/:token")
    .post(userc.resetPassword);

router
    .route("/deleteuser/:id")
    .delete(auth.Auth,admin.Admin,userauthc.deleteuser);

router
    .route("/getme")
    .get(auth.Auth,userauthc.getme);

router
    .route("/updateuser/:id")
    .put(auth.Auth,userauthc.updateuser);

module.exports=router;