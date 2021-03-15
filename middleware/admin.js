exports.Admin=(req,res,next)=>
{
if(!req.userschema.isAdmin)
{
   return res.status(402).send({message:"invalid access"});
}
next();
}
