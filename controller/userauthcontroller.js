const User=require("../schema/userschema");
let bcrypt=require("bcrypt");
let Joi=require("joi");
let multer=require("multer");
let port="http://localhost:4500";

exports.login=async(req,res)=>
{
    try
    {
        let {error}=validateError(req.body);
        if(error){return res.status(402).send(error.details[0].message)};
        let fuser=await User.UserModel.findOne({"email":req.body.email});
        if(!fuser){return res.status(402).send({message:"Invalid Email"})};
        let password=await bcrypt.compare(req.body.password,fuser.password);
        if(!password){return res.status(402).send({message:"Invalid Password"})}
        let token=fuser.genToken();
        res.header('auth-key',token).send({message:"Login Successful",t:token});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.deleteuser=async(req,res)=>
{
    try
    {
        let deleteuser=await User.UserModel.findByIdAndDelete(req.params.id);
        if(!deleteuser){return res.status(404).send({message:"id not found"})};
        res.send({message:`${deleteuser.firstname} deleted from database`});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.getme=async(req,res)=>
{
    try
    {
        let data=await User.UserModel.findById(req.userschema._id)
                                                        .select("-password");
        res.send({userdata:data});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/users/")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  function fileFilter (req, file, cb) {
 
    if(file.mimetype === "image/jpg" || file.mimetype ==="image/png" || file.mimetype ==="image/jpeg")
    {
    cb(null, true)
    }
else{
    cb(null,false)
}  
  };
  var upload = multer({ 
    storage: storage,
    limits:{
      filesize:1024*1024*50
    },
    fileFilter:fileFilter
  });


exports.updateuser=[upload.single("profilepic"),async(req,res)=>
{
    try
    {
        if(req.file){
            data={
                profilepic : port + "/./uploads/users/" + req.file.filename,
                ...req.body
            }
        }
        else{
            data={
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                address:req.body.address
            }
        }
        
        let user = await User.UserModel.findByIdAndUpdate(req.params.id,data,{
            new:true,
            runValidators:true
        });
        if (!user) { return res.status(404).send({ message: "Invalid user id" })};
        res.send({message:"User data updated",u:user});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
}
];
function validateError(error)
{
    let schema=Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().min(8).max(20).required()
    });
    return schema.validate(error);
}