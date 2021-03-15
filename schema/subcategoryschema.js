let mongoose=require("mongoose");
let joi=require("joi");

let SubCategorySchema=new mongoose.Schema({
    subcatname:{type:String,required:true,min:1,max:100},
    parent:{type:String,min:1,max:50}
});

let SubCategoryModel=mongoose.model("subcategories",SubCategorySchema);

function validationError(error)
{
let schema=joi.object({
    subcatname:joi.string().required().min(1).max(100),
    parent:joi.string().min(1).max(50)
});
return schema.validate(error);
}

module.exports={SubCategoryModel,SubCategorySchema,validationError};