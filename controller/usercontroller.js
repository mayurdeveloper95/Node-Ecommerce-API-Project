const User=require("../schema/userschema");
let bcrypt=require("bcrypt");
let nodemailer=require("nodemailer");
let crypto=require("crypto");

exports.alluser=async(req,res)=>
{
    try
    {
        const user=await User.UserModel.find().find({isAdmin:false});
        res.send(user);
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.signup=async(req,res)=>
{
    try
    {
        let {error}=User.validationError(req.body);
        if(error){return res.status(403).send(error.details[0].message)};
        let emailid=await User.UserModel.findOne({"email":req.body.email});
        if(emailid){return res.status(403).send({message:"Email Id Already Exists!!!"})};
        let createuser=new User.UserModel({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            address:req.body.address,
            password:req.body.password,
            isAdmin:req.body.isAdmin,
            termsAcceptCheck:req.body.termsAcceptCheck,
            newsLetterCheck:req.body.newsLetterCheck,
            resetPasswordToken:req.body.resetPasswordToken,
            resetPasswordExpires:req.body.resetPasswordToken,
            recordDate:req.body.recordDate,
            updateDate:req.body.updateDate,
            profilepic:req.body.profilepic
        });

        if (!createuser.termsAcceptCheck) {
            return res.status(403).send({message:"Please Accept Our Policy... Otherwise you cannot proceed further"});
          }
 
        let salt=await bcrypt.genSalt(10);
        createuser.password=await bcrypt.hash(createuser.password,salt);
        let user=await createuser.save();

        let token=user.genToken();
        res.header('auth-key',token).send({message:`New user registered and your login information send to ${user.email}`,u:user,t:token});

        //sender details
        let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        user: "******************", // generated ethereal user
        pass: "**************", // generated ethereal password
        },
    });

        let mailoptions=  {
        from: '"Fred Foo 👻" <vanmalimayur45@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "New User Registered", // Subject line
        text: "new user registered",
        html: `Email:${user.email} <br/>
                Password:${user.password}`
        };
        
        transporter.sendMail(mailoptions,(error,info)=>{
            if(error){return console.error(error)}
            else{
                console.log(`email send ,${info.messageId}`);
            }
          });
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.forgotPassword=async(req,res)=>
{
    try
    {
        let userdata=await User.UserModel.findOne({"email":req.body.email});
        if(!userdata){return res.status(402).send({message:"Email id not present in Database"})};
        let token=crypto.randomBytes(35).toString("hex");
        userdata.resetPasswordToken=token;
        userdata.resetPasswordExpires=Date.now() + 300000;
        await userdata.save();

        //sender details
        let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        user: "**********************", // generated ethereal user
        pass: "**************", // generated ethereal password
        },
        });

    let mailoptions=  {
        from: '"Fred Foo 👻" <vanmalimayur45@gmail.com>', // sender address
        to: userdata.email, // list of receivers
        subject: "Change Password", // Subject line
        text: "open the link to change the password http://localhost:3000/resetpassword/" + token // plain text body
        };
        transporter.sendMail(mailoptions,(error,info)=>{
        if(error){return console.error(error)}
        else{
        console.log(`email send ,${info.messageId}`);
        }
        });

    res.send({message:"Please check your email for change the password",e:userdata});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.resetPassword=async(req,res)=>
{
    try
    {
        let user=await User.UserModel.findOne({
            "resetPasswordToken":req.params.token,
            "resetPasswordExpires":{
                $gt:Date.now()
            }
        });
        if(!user){return res.status(402).send({message:"Invalid token or token expires"})};
        let oldpassword=await bcrypt.compare(req.body.password,user.password);
        if(oldpassword){return res.status(402).send({message:"Password is old please change to new passowrd"})};
        user.password=req.body.password;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpires=undefined;
        let salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);
        await user.save();
        res.send({message:"password updated"});
        
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};
