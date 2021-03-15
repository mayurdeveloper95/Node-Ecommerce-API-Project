let contact=require("../schema/contatschema");
let nodemailer=require("nodemailer");

exports.addcontact=async(req,res)=>
{
    try
    {
            let {error}=contact.validationError(req.body);
            if(error){res.status(402).send(error.details[0].message)};
            
            let createcontact=new contact.ContactModel({
            name:req.body.name,
            email:req.body.email,
            personalmessage:req.body.personalmessage
            });
            
            await createcontact.save();

            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: "******************", // generated ethereal user
                  pass: "********", // generated ethereal password
                },
              });
            
            let mailoptions=  {
                from: '"Fred Foo 👻" <testworks59@gmail.com>', // sender address
                to: "testworks59@gmail.com", // list of receivers
                subject: "Users Inquiries", // Subject line
                text: `name:${createcontact.name}</br>email:${createcontact.email}</br> message:${createcontact.personalmessage}`
              };
                    transporter.sendMail(mailoptions,(error,info)=>{
                        if(error){return console.error(error)}
                        else{
                            console.log(`email send ,${info.messageId}`);
                        }
                      });
            res.send({message:"message send"});
        }
        catch(error)
        {
        res.status(500).send(error.message);
        }
}

exports.allcontact=async(req,res)=>
{
    try
    {
        let getsubcategory=await contact.ContactModel.find();
        res.send(getsubcategory);
    }
    catch(error)
    {
        res.status(500).send(error.message);
    }
}