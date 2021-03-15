const Prod=require("../schema/productschema");
const Carts=require("../schema/cartschema");
const User=require("../schema/userschema");

exports.addtocart=async(req,res)=>
{
  try{
    let uid= await User.UserModel.findById(req.userschema._id).select("email");

    let productdata=await Prod.ProductModel.findById(req.params.productId);
    if(!productdata){return res.status(402).send({message:"product id not found"})};
    //console.log(productdata); 

    let usercartData = await Carts.CartModel.findOne({userEmail:uid.email,productId:req.params.productId})
    //console.log("USER CART", usercartData);

    if(!usercartData)
    {
        let addcart=await Carts.CartModel({
            userEmail:uid.email,
            productId: req.params.productId,
            quantity:req.body.quantity
        });

        let checkoutcart=await addcart.save();
        res.send({message:"product added to cart",c:checkoutcart});
    }
    else
    {
        usercartData.quantity +=1;
        let updcartdata = await usercartData.save();

        res.send({message:"product quantity increased",up:updcartdata});
    } 
}
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.usercart=async(req,res)=>
{
    try
    {
        let uid= await User.UserModel.findById(req.userschema._id).select("email");
        let ucart = await Carts.CartModel.find({'userEmail':uid.email})
        res.send({message:'Success', data:ucart})
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.deletecart=async(req,res)=>
{
    try
    {
        let cartid= await Carts.CartModel.findOneAndDelete({productId:req.params.id});
        if(!cartid){return res.status(402).send({message:"cart id not found"})};
        res.send({message:`${cartid.productId.pname} removed item from cart`});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.addquantity=async(req,res)=>
{
    try
    {
        let usercartData = await Carts.CartModel.findOne({productId:req.params.id});

        if(!usercartData)
        {
            return res.status(403).send({message:"Product not availble in Cart "})
        }
        else
        {
        usercartData.quantity +=1;
        let updcartdata = await usercartData.save();

        res.send({message:"product quantity added",addquan:updcartdata});
        } 
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.removequantity=async(req,res)=>
{
    try
    {
        let usercartData = await Carts.CartModel.findOne({productId:req.params.id});

        if(!usercartData)
        {
            return res.status(403).send({message:"Product not availble in Cart "})
        }
        else
        {
            if(usercartData.quantity <=1)
                {
                    res.send({message:"Product Quantity cannot be less than 1"});
                }
                else
                {
                    usercartData.quantity -=1;
                    let updcartdata = await usercartData.save();

                    res.send({message:"product quantity removed",addquan:updcartdata});
                }
        } 
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
}

