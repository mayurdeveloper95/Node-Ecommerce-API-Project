const Prod=require("../schema/productschema");
const Cat=require("../schema/categoryschema");
let Subcat=require("../schema/subcategoryschema");
let multer=require("multer");
let port="http://localhost:4500";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/product/")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  function fileFilter (req, file, cb) {
 
    if(file.mimetype === "image/jpg" || file.mimetype ==="image/png" || file.mimetype ==="image/jpeg")
    {
    cb(null, true)
    }
else{
    cb(null,false)
}  
  };
  var upload = multer({ 
    storage: storage,
    limits:{
      filesize:1024*1024*50
    },
    fileFilter:fileFilter
  });

exports.addproduct=[upload.single("imagepic"),async(req,res)=>
{
  try{
      let {error}=Prod.validationError(req.body);
      if(error){return res.status(402).send(error.details[0].message)};
      let name=await Cat.CategoryModel.findById(req.body.categoryId);
      if(!name){return res.status(403).send({message:"category id not found "})};
    
      let newproduct= new Prod.ProductModel({
          pname:req.body.pname,
          imagepic:port + "/./uploads/product/" + req.file.filename,
          description:req.body.description,
          manufacturer:req.body.manufacturer,
          dimensions:req.body.dimensions,
          netquantity:req.body.netquantity,
          weight:req.body.weight,
          price:req.body.price,
          stocks:req.body.stocks,
          offerPrice:req.body.offerPrice,
          isAvailable:req.body.isAvailable,
          isTodayOffer:req.body.isTodayOffer,
          category:{
              _id:name._id,
              catname:name.catname,
              subcat:name.subcat
            }
      });

        let saveproduct=await newproduct.save();
        res.send({message:"Prodcut added",p:saveproduct});
    }  
    catch(error)
    {
        res.status(500).send(error.message);
    }
}
];


exports.allproducts=async(req,res)=>
{
    try
    {
      let getalldata=await Prod.ProductModel.find();
      res.send(getalldata);
    }
    catch(error)
    {
      res.status(500).send(error.message);
    }
};


exports.findprodbyid=async(req,res)=>
{
  try
  {
    let productbyid=await Prod.ProductModel.findById(req.params.id);
    if(!productbyid){return res.status(400).send({message:"Product id not found"})};
    res.send(productbyid);
  }
  catch(error)
  {
    res.status(500).send(error.message);
  }
};


exports.deleteprod=async(req,res)=>
{
    try
    {
        let deleteuser=await Prod.ProductModel.findByIdAndDelete(req.params.id);
        if(!deleteuser){return res.status(404).send({message:"Product id not found"})};
        res.send({message:`${deleteuser.name} deleted from database`});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.updateprod=[upload.single("imagepic"),async(req,res)=>
{
    try
    {
      if(req.file){
        data={
            profilepic :port + "/./uploads/product/" + req.file.filename,
            ...req.body
          }
        }
      else{
        data={
            name:req.body.name,
            description:req.body.description,
            netquantity:req.body.netquantity,
            price:req.body.price,
            stocks:req.body.stocks,
            offerPrice:req.body.offerPrice
          }
        }

        let product= await Prod.ProductModel.findByIdAndUpdate(req.params.id,data,{
          new:true,
          runValidators:true
      });

      if (!product) { return res.status(404).send({ message: "Invalid Product id" })};
      res.send({message:"Product data updated",p:product});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
}
];


exports.todayoffer=async(req,res)=>
{
    try
    {
        let todayoffer=await Prod.ProductModel.find({isTodayOffer:true});
        res.send({t:todayoffer});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.latestproduct=async(req,res)=>
{
    try
    {
        let latestproduct=await Prod.ProductModel.find({isAvailable:true});
        res.send({l:latestproduct});
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.product=async(req,res)=>
{
    try
    {
        let perpage=12;
        let currentpage=req.params.page || 1;
        let data=await Prod.ProductModel
                                .find()
                                .skip((perpage*currentpage)-perpage)
                                .limit(perpage)
        let pagecount=await Prod.ProductModel.count();
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


exports.prodcatpagination=async(req,res)=>
{
    try
    { 
        let perpage=9;
        let currentpage=req.params.pageno || 1;
        let cat=await Cat.CategoryModel.findById(req.params.catid);
        let data= await Prod.ProductModel.
                                 find({"category.catname":cat.catname})
                                .skip((perpage*currentpage)-perpage)
                                .limit(perpage);
        let pagecount=await Prod.ProductModel.find({"category.catname":cat.catname}).count();
        let totalpages=Math.ceil(pagecount/perpage);
        res.send({
              perpage:perpage,
              currentpage:currentpage,
              data:data,
              pagecount:pagecount,
              totalpages:totalpages,
            });
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};


exports.prodsubcatpagination=async(req,res)=>
{
    try
    {
        let perpage=9;
        let currentpage=req.params.pageno || 1;
        let cat=await Cat.CategoryModel.findById(req.params.catid);
        let subcat=await Subcat.SubCategoryModel.findById(req.params.subcatid);
        let data=await Prod.ProductModel.find({"category.catname":cat.catname,"category.subcat.subcatname":subcat.subcatname})
                                .skip((perpage*currentpage)-perpage)
                                .limit(perpage)
    
        let pagecount=await Prod.ProductModel.find({"category.catname":cat.catname,"category.subcat.subcatname":subcat.subcatname}).count();
        let totalpages=Math.ceil(pagecount/perpage);
  
          res.send({
              perpage:perpage,
              currentpage:currentpage,
              data:data,
              totalpages:totalpages
          });
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
};