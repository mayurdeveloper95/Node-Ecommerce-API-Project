let mongoose=require("mongoose");
let joi=require("joi");
let jwt=require("jsonwebtoken");
let config=require("config");
let url="http://localhost:4500/./uploads/users/pp.png";

let UserSchema= new mongoose.Schema({
    firstname:{type:String,required:true,min:4,max:25},
    lastname:{type:String,required:true,min:3,max:25},
    address:{type:String,min:20,max:100},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,min:8,max:25},
    termsAcceptCheck:{type:Boolean,required:true},
    newsLetterCheck:{type:Boolean,default:true},
    resetPasswordToken:{type:String},
    resetPasswordExpires:{type:Date},
    isAdmin:{type:Boolean,default:false},
    recordDate:{type:Date, default:Date.now},
    updateDate:{type:Date, default:Date.now},
    profilepic:{type:String,default:url}
});

UserSchema.methods.genToken=function()
{
let token = jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get("key"));
return token;
}

let UserModel=mongoose.model("users",UserSchema);

function validationError (error)
{
    let schema=joi.object({
        firstname:joi.string().required().min(4).max(30),
        lastname:joi.string().required().min(3).max(30),
        address:joi.string().min(20).max(100),
        email:joi.string().required().email(),
        password:joi.string().required().min(8).max(25),
        termsAcceptCheck:joi.boolean().required(),
        newsLetterCheck:joi.boolean(),
        resetPasswordToken:joi.string(),
        resetPasswordExpires:joi.date(),
        isAdmin:joi.boolean(),
        recordDate:joi.date(),
        updateDate:joi.date(),
        profilepic:joi.string()
    });
    return schema.validate(error);
}


module.exports={UserModel,validationError}