let mongoose=require("mongoose");
let joi=require("joi");
let subcategory=require("./subcategoryschema");

let CategorySchema=new mongoose.Schema({
    catname:{type:String,min:1,max:100},
    subcat:{type:subcategory.SubCategorySchema}
});

let CategoryModel=mongoose.model("categories",CategorySchema);

function validationError(error)
{
let schema=joi.object({
    catname:joi.string().min(5).max(100),
    subcatId:joi.string().required()
});
return schema.validate(error);
}

module.exports={CategoryModel,CategorySchema,validationError};