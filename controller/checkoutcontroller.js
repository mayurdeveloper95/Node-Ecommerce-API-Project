const Checkout=require("../schema/checkoutschema");
const Carts=require("../schema/cartschema");
const User=require("../schema/userschema");
let Fawn=require('fawn');

exports.checkoutcart=async(req,res)=>
{
  try{
    let uid= await User.UserModel.findById(req.userschema._id).select("email");

    let usercartData = await Carts.CartModel.find({userEmail:uid.email})
    console.log("USER CART", usercartData);
    
    if(usercartData.length === 0)
    {
        res.send({message:"Cart data not found"});
    }
    else
    {
        let addcheckout=await Checkout.CheckoutModel({
            userEmail:uid.email,
            products:usercartData,
            address:req.body.address,
            city:req.body.city,
            postalcode:req.body.postalcode,
            country:req.body.country,
            paymentMethod:req.body.paymentMethod,
            isPaid:req.body.isPaid,
            isDelivered:req.body.isDelivered
            //total:req.body.total
         });
    
           /*new Fawn.Task()
                    .update("products",{_id:usercartData.productId},{
                        $inc: {
                            stocks: -usercartData.quantity
                        }
                    })
                    .run(); */
    
        await Carts.CartModel.deleteMany({ userEmail:uid.email});
        let checkoutcart=await addcheckout.save();
        res.send({message:"Your Order Place Succesfully",ch:checkoutcart});
        
    } 
}
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.getallcart=async(req,res)=>
{
    try
    {
      let getalldata=await Checkout.CheckoutModel.find();
      res.send(getalldata);
    }
    catch(error)
    {
      res.status(500).send(error.message);
    }
};


exports.getusercart=async(req,res)=>
{
    try
    {
        let uid= await User.UserModel.findById(req.userschema._id).select("email");
        let usercartData = await Checkout.CheckoutModel.find({userEmail:uid.email});
        if(usercartData.length == 0)
        {
            return res.send({message:`Cart data not found`});
        }
        else
        {
            res.send(usercartData);
        }
    }
    catch(error)
    {
      res.status(500).send(error.message);
    }
};


exports.deletecheckout=async(req,res)=>
{
    try
    {
        let deletecheeck=await Checkout.CheckoutModel.findByIdAndDelete(req.params.id);
        if(!deletecheeck){return res.status(404).send({message:"Checkout id not found"})};
        res.send({message:'order deleted from database'});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};
