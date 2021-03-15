let userRegister=require("../routes/user");
let Subcategory=require("../routes/subcategory");
let Category=require("../routes/category");
let Product=require("../routes/product");
let Contact=require("../routes/contact");
let Cart=require("../routes/cart");
let Checkout=require("../routes/checkout");

module.exports=function(ex)
{
ex.use("/api",userRegister);
ex.use("/api",Subcategory);
ex.use("/api",Category);
ex.use("/api",Product);
ex.use("/api",Contact);
ex.use("/api",Cart);
ex.use("/api",Checkout);
}