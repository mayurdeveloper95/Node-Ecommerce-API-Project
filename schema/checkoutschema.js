let mongoose=require("mongoose");
let joi=require("joi");

let CheckoutSchema=new mongoose.Schema({
    userEmail:{type:String,required:true,min:5,max:50},
    products:[
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: 'products',
                required: true
            },
            quantity:{type:Number,min:[1,"quantity cannot be less thane 1"],required:true},
        }
    ],
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postalcode: {
            type: Number,
            required: true,
            min: [6, "Postal Code Must Be 6 digits in length"],
        },
        country: {
            type: String,
            required: true,
        },

    paymentMethod: {
        type: String,
        required: true,
    },

    isPaid: {
        type: Boolean,
        default: false
    },

    isDelivered: {
        type: Boolean,
        default: false
    },

    deliveredAt: {
        type: Date,
        default:Date.now()
    },

    paidAt: {
        type: Date,
        default:Date.now
    }
});

CheckoutSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'productId',
        select: '-__v'
    })
    next();
})

let CheckoutModel=mongoose.model("checkout",CheckoutSchema);

function validationError(error)
{
let schema=joi.object({
    productId:joi.string().min(2).max(50).required(),
    quantity:joi.number().min(1).required(),
    address:joi.string().min(20).max(500).required(),
    city:joi.string().min(5).max(20).required(),
    postalcode:joi.number().min(6).required(),
    country:joi.string().min(5).max(30).required(),
    paymentMethod:joi.string().min(5).max(30),
    isPaid:joi.boolean(),
    isDelivered:joi.boolean(),
    deliveredAt:joi.date(),
    paidAt:joi.Date(),
});
return schema.validate(error);
}

module.exports={CheckoutModel,CheckoutSchema,validationError};