let mongoose=require("mongoose");
let joi=require("joi");

let CartSchema=new mongoose.Schema({
    userEmail:{type:String,required:true,min:5,max:50},
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'products',
        required: true
    },
    quantity:{type:Number,min:[1,"quantity cannot be less thane 1"],required:true},
});

CartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'productId',
        select: '-__v'
    })
    next();
})

let CartModel=mongoose.model("cart",CartSchema);

function validationError(error)
{
let schema=joi.object({
    productId:joi.string().min(2).max(50),
    quantity:joi.number().min(1),
});
return schema.validate(error);
}

module.exports={CartModel,CartSchema,validationError};