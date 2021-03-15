const Subcat=require("../schema/subcategoryschema");

exports.addsubcat=async(req,res)=>
{
    try{
        let {error}=Subcat.validationError(req.body);
        if(error){return res.status(402).send(error.details[0].message)};
        let newsub=new Subcat.SubCategoryModel({
            subcatname:req.body.subcatname,
            parent:req.body.parent
        });
        
        let createsub=await newsub.save();
        res.send({message:"subcategory created",c:createsub});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.allsubcat=async(req,res)=>
{
    try
    {
        let getsubcategory=await Subcat.SubCategoryModel.find();
        res.send(getsubcategory);
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};

exports.deletesubcat=async(req,res)=>
{
    try{
        let catby=await Subcat.SubCategoryModel.findById(req.params.id);
        if(!catby){return res.status(400).send({message:"Subcategory id not in database"})};
        let catdelete=await Subcat.SubCategoryModel.findByIdAndDelete({_id:req.params.id});
        if(!catdelete){return res.status(400).send({message:"Subcategory id not found"})};
        res.send({message:"SubCategory deleted"});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.subcatpagination=async(req,res)=>
{
    try
    {
        let perpage=2;
        let currentpage=req.params.page || 1;
        let data=await Subcat.SubCategoryModel
                                    .find()
                                    .skip((perpage*currentpage)-perpage)
                                    .limit(perpage)
        let pagecount=await Subcat.SubCategoryModel.count();
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