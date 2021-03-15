let mongoose=require("mongoose");
let joi=require("joi");
let subcategory=require("./subcategoryschema");
let category=require("./categoryschema");

let ProductSchema=new mongoose.Schema({
    pname:{type:String,required:true,min:5,max:200,unique:true},
    imagepic:{type:String,required:true,min:5},
    description:{type:String,required:true,min:5,max:5000},
    manufacturer:{type:String,min:5,max:200},
    dimensions:{type:String,min:5},
    netquantity:{type:Number,required:true,minlength:1},
    weight:{type:Number},
    price:{type:Number,required:true,minlength:1},
    stocks:{type:Number,required:true,min:1,max:1000},
    offerPrice:{type:Number,default:0},
    isAvailable:{type:Boolean,required:true},
    isTodayOffer:{type:Boolean,required:true},
    category:{
        type:category.CategorySchema,required:true
    },
    subCategory:{
        type:subcategory.SubCategorySchema
    },
    recordDate:{type:Date,default:Date.now},
    updateDate:{type:Date,default:Date.now}
    });

    let ProductModel=mongoose.model("products",ProductSchema);
    
    function validationError(error)
    {
        schema=joi.object({
            pname:joi.string().required().min(5).max(200),
            imagepic:joi.string().min(5),
            description:joi.string().required().min(5).max(5000),
            manufacturer:joi.string().min(5).max(200),
            dimensions:joi.string().min(5),
            netquantity:joi.number().required().min(1),
            weight:joi.number(),
            price:joi.number().required().min(1),
            stocks:joi.number().required().min(1).max(1000),
            offerPrice:joi.number().min(0),
            isAvailable:joi.boolean().required(),
            isTodayOffer:joi.boolean().required(),
            categoryId:joi.string(),
            subcategoryId:joi.string(),
            subcatname:joi.string(),
            recordDate:joi.date(),
            updateDate:joi.date()
        });
        return schema.validate(error);
    }
    
    module.exports={ProductModel,ProductSchema,validationError};