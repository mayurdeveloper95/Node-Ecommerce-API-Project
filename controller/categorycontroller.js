const Cat=require("../schema/categoryschema");
const Subcat=require("../schema/subcategoryschema");

exports.addcat=async(req,res)=>
{
    try{
        let {error}=Cat.validationError(req.body);
        if(error){return res.status(402).send(error.details[0].message)};
        let checksubcat=await Subcat.SubCategoryModel.findById(req.body.subcatId);
        if(!checksubcat){return res.status(402).send({message:"subcategory id not matched"})};
        let newcat=new Cat.CategoryModel({
            catname:checksubcat.parent,
            subcat:{
                _id:checksubcat._id,
                subcatname:checksubcat.subcatname,
                parent:checksubcat.parent
            }
        });
    
        let createcat=await newcat.save();
        res.send({message:"category created",c:createcat});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.allcat=async(req,res)=>
{
    try
    {
        let getcategory=await Cat.CategoryModel.find();
        res.send(getcategory);
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.findcatbyid=async(req,res)=>
{
    try{
        let catbyid=await Cat.CategoryModel.findById(req.params.id);
        if(!catbyid){return res.status(400).send({message:"category id not found"})};
        res.send(catbyid);
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.deletecat=async(req,res)=>
{
    try{
        let catby=await Cat.CategoryModel.findById(req.params.id);
        if(!catby){return res.status(400).send({message:"category id not in database"})};
        let catdelete=await Cat.CategoryModel.findByIdAndDelete({_id:req.params.id});
        if(!catdelete){return res.status(400).send({message:"category id not found"})};
        res.send({message:"Category deleted"});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.catpagination=async(req,res)=>
{
    try{
        let perpage=1;
        let currentpage=req.params.page || 1;
        let data=await Cat.CategoryModel
                                    .find()
                                    .skip((perpage*currentpage)-perpage)
                                    .limit(perpage)
        let pagecount=await Cat.CategoryModel.count();
        let totalpages=Math.ceil(pagecount/perpage);
        res.send({
                perpage:perpage,
                data:data,
                totalpages:totalpages,
                currentpage:currentpage
                });
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};