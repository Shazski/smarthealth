var express = require('express');
const res = require('express/lib/response');
const async = require('hbs/lib/async');
const { response, render } = require('../app');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers');
const { route } = require('./admin');
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
const hospitalverify = (req, res, next) => {
  if (req.session.hospitalIndex) {
    next()
  } else {
    res.redirect('/hospital-login')
  }
}


router.get('/', verifyLogin, async function (req, res, next) {
  let user = req.session.user
  res.render('user/index', { admin: false, user });

});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')

  } else {
    res.render('user/user-login', { 'loginerror': req.session.loginErr })
    req.session.loginErr = false
  }

})

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/user-signup')

  }
})

router.post('/signup', (req, res) => {
  userHelper.doSignup(req.body).then((respo) => {

    if (respo.status) {
      emailExits = "Email or Username already taken.Try different username or email"
      res.render('user/user-signup', { emailExits })
    } else {
      res.redirect('/login')
    }
  })
})




router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid username or password!please check it"
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = null
  req.session.loggedIn = null
  res.redirect('/')
})

router.post('/hospital', (req, res) => {
  req.session.department = req.body.department
  req.session.district = req.body.district
  res.redirect('hospital')

})

router.get('/hospital', verifyLogin, async (req, res) => {
  let hospital = await userHelper.getHospital(req.session.department, req.session.district)
  res.render('user/hospital', { hospital })
})
router.get('/doctors/:id', verifyLogin, async (req, res) => {
  console.log(req.session.department, req.params.id);
  let doctors = await userHelper.getDoctors(req.session.department, req.params.id)
  req.session.hospitalId = req.params.id
  res.render('user/view-doctors', { doctors })
})

router.get('/hospital-login', (req, res) => {
  res.render('user/hospital-login', { 'loginerror': req.session.loginErr })
  req.session.loginErr = false
})

router.post('/hospital-login', (req, res) => {
  userHelper.hospitalLogin(req.body.id).then((response) => {
    req.session.hospitalIndex = response
    if (response.status) {
      res.redirect('/all-doctors',)
    } else {
      res.redirect('/hospital-login')
    }
  })
})

router.get('/hospital-index', hospitalverify, (req, res) => {
  hospital = req.session.hospitalIndex
  res.render('user/hospital-index', { hospital })
  req.session.loginErr = false
})

router.get('/add-doctor', hospitalverify, (req, res) => {
  id = req.session.hospitalIndex.details._id
  res.render('user/add-doctors', { id, hospital })
})

router.post('/add-doctor', (req, res) => {
  productHelper.addDoctor(req.body).then((response) => {
    let image = req.files.image
    image.mv('./public/images/' + response.insertedId + '.jpg')
    res.redirect('/add-doctor')
  })
})

router.get('/appoinment/:id', verifyLogin, async (req, res) => {
  doctorId = req.params.id
  let doctorName = await userHelper.getDoctorName(doctorId)
  let hospitalId = req.session.hospitalId
  res.render('user/appoinment', { doctorId, doctorName, hospitalId })
})

router.post('/appoinment', (req, res) => {
  userHelper.addAppoinment(req.body).then((response) => {
    res.redirect('/appoinment-fixed')
  })
})

router.get('/appoinment-fixed', verifyLogin, (req, res) => {
  res.render('user/appoinment-fixed')
})

router.get('/view-appoinmentreq', hospitalverify, async (req, res) => {
  hospital = req.session.hospitalIndex
  let requests = await userHelper.getAppoinmentRequests(hospital.details._id)
  res.render('user/view-appoinmentreq', { hospital, requests })
})

router.get('/approve/', hospitalverify, (req, res) => {
  console.log(req.query.time,"time data")
  userHelper.sentApproveMail(req.query.email, req.query.id, req.query.time).then((response) => {
    res.redirect('/view-appoinmentreq')
  })
})
router.get('/reject/', hospitalverify, (req, res) => {
  userHelper.sentRejectMail(req.query.email, req.query.id,req.query.reason).then((response) => {
    res.redirect('/view-appoinmentreq')
  })
})
router.get('/view-accepted-appoinment', hospitalverify, async (req, res) => {
  hospital = req.session.hospitalIndex
  let appoinments = await userHelper.getAcceptedAppoinment(hospital.details._id)
  res.render('user/accepted-appoinment', { hospital, appoinments })
})

router.get('/delete-appoinment/:id', hospitalverify, (req, res) => {
  userHelper.deleteAppoinment(req.params.id).then((response) => {
    res.redirect('/view-accepted-appoinment')
  })
})
router.get('/delete-doctor/:id', hospitalverify, (req, res) => {
  userHelper.deleteDoctor(req.params.id).then((response) => {
    res.redirect('/all-doctors')
  })
})

router.get('/all-doctors', hospitalverify, async (req, res) => {
  hospital = req.session.hospitalIndex
  let doctors = await userHelper.getAllDoctors(hospital.details._id)
  res.render('user/all-doctors', { doctors, hospital })
})

module.exports = router
