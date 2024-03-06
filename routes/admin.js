var express = require('express');
const async = require('hbs/lib/async');
const { response } = require('../app');
const adminHelper = require('../helpers/admin-helper');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers');
const { getAllShippedProducts } = require('../helpers/user-helpers');
const userHelpers = require('../helpers/user-helpers');
var user=require('../routes/users')
const verifyLogin = (req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/admin-login')
  }
}

router.get('/',verifyLogin, function(req, res) {
  if(req.session.loggeIn){
    let admin=req.session.admin
    productHelpers.getallHospital().then((hospitals)=>{
    res.render('admi/view-products',{admin,hospitals});
  })
  }else{
    res.render('admi/admin-login')
  }
});

router.get("/admin-login",(req,res)=>{
    res.render('admi/admin-login')
})

router.post("/admin-login",(req,res)=>{
  adminHelper.adminLogin(req.body).then((adminres)=>{
    if(adminres.stat){
      req.session.loggeIn=true
      req.session.admin=adminres.admin
      res.redirect('/admin')
    }else{
      res.render('admi/admin-login')
    }
  })
})



router.get('/delete-products/:id',(req,res)=>{
  let proId =req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/edit-products/:id',async(req,res)=>{
  let newPro =await productHelpers.productDetails(req.params.id)
    res.render('admi/edit-products',{admin:true,newPro})
})    

router.get('/admin-logout',(req,res)=>{
  req.session.admin=null
  req.session.loggeIn=null
  res.redirect('/admin')
})

router.post('/edit-products/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let id = req.params.id
      let image = req.files.image
    image.mv('./public/images/'+id+'.jpg')
    }
  })
})




router.get('/all-users',async(req,res)=>{
 let users =await productHelpers.getAllUsers()
 res.render('admi/all-users',{users,admin:true})
})

router.get('/add-hospital',verifyLogin,(req,res)=>{
  res.render('admi/add-hospital',{admin:true})
})

router.post('/add-hospital',(req,res)=>{
  productHelpers.addHospital(req.body).then((response)=>{
    let image = req.files.image
    image.mv('./public/images/'+response.insertedId+'.jpg')
    res.redirect('/admin/add-hospital')
  })
})






module.exports = router;
