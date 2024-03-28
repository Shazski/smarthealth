var db = require('../config/connection')
var collName = require("../config/collections")
const bcrypt = require('bcrypt')
const promise = require('promise')
const { reject, resolve } = require('promise')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { response } = require('express')
const res = require('express/lib/response')
var nodemailer = require('nodemailer');


module.exports = {
    doSignup: (userData) => {
        return new promise(async (resolve, reject) => {

            let respo = {}
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collName.user_collection).findOne({ $or: [{ email: userData.email }, { name: userData.name }] }).then((status) => {
                if (status) {
                    respo.status = true
                    resolve(respo)
                } else {
                    db.get().collection(collName.user_collection).insertOne(userData)
                    resolve({ status: false })
                }
            })


        })


    },


    doLogin: (loginData) => {
        return new promise(async (resolve, reject) => {
            let Status = false
            let response = {}
            let user = await db.get().collection(collName.user_collection).findOne({ email: loginData.email })
            if (user) {

                bcrypt.compare(loginData.password, user.password).then((status) => {

                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)

                    } else {
                        resolve({ status: false })
                    }

                })
            } else {
                console.log("login failed");
                resolve({ status: false })
            }
        })
    },

    getHospital: (departments, district) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collName.hospital_collection).find({ departments: departments, district: district }).toArray().then((response) => {
                resolve(response)
            })
        });
    },
    getDoctors: (departments, id) => {
        console.log(departments, id);
        return new Promise((resolve, reject) => {
            db.get().collection(collName.doctor_collection).find({ Specialization: departments, hospitalCode: id }).toArray().then((response) => {
                resolve(response)
            })
        });
    },
    hospitalLogin: (id) => {
        respo = {}
        return new Promise(async (resolve, reject) => {
            let status = await db.get().collection(collName.hospital_collection).findOne({ loginCode: id })
            if (status) {
                respo.details = status
                respo.status = true
                resolve(respo)
            } else {
                resolve({ status: false })
            }
        });
    },

    addAppoinment: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collName.appoinment_collection).insertOne(details).then((response) => {
                resolve(response)
            })
        });
    },

    getDoctorName: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collName.doctor_collection).findOne({ _id: ObjectId(id) }).then((response) => {
                resolve(response.name)
            })
        });
    },

    getAppoinmentRequests: (hospitalId) => {
        console.log("where", hospitalId);
        return new Promise((resolve, reject) => {
            db.get().collection(collName.appoinment_collection).find({ hospitalId: hospitalId, status: "waiting" }).toArray().then((response) => {
                console.log(response);
                resolve(response)
            })
        });
    },

    sentApproveMail: (email, id, time) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collName.appoinment_collection).updateOne({ _id: ObjectId(id) }, { $set: { status: "booked" } }).then((response) => {
                var transporter = nodemailer.createTransport({
                    secure: true,
                    port: 465,
                    service: 'gmail',
                    auth: {
                        user: "ecommerce1419@gmail.com",
                        pass: "iqtyaldszzgoweap"
                    }
                });

                var mailOptions = {
                    from: 'ecommerce1419@gmail.com',
                    to: email,
                    subject: 'Appoinment Update',
                    text: `Your Appoinment has been Booked on ${time}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                resolve(response)
            })
        });
    },
    sentRejectMail: (email, id, rejectReason) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collName.appoinment_collection).deleteOne({ _id: ObjectId(id) }).then((response) => {
                var transporter = nodemailer.createTransport({
                    secure: true,
                    port: 465,
                    service: 'gmail',
                    auth: {
                        user: "ecommerce1419@gmail.com",
                        pass: "iqtyaldszzgoweap"
                    }
                });

                var mailOptions = {
                    from: 'ecommerce1419@gmail.com',
                    to: email,
                    subject: 'Appoinment Update',
                    text: `Your Appoinment has been rejected due to the reason ${rejectReason} `
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                resolve(response)
            })
        });
    },

    getAcceptedAppoinment: (hospitalId) => {
        console.log("where", hospitalId);
        return new Promise((resolve, reject) => {
            db.get().collection(collName.appoinment_collection).find({ hospitalId: hospitalId, status: "booked" }).toArray().then((response) => {
                console.log(response);
                resolve(response)
            })
        });
    },

    deleteAppoinment: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collName.appoinment_collection).deleteOne({ _id: ObjectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },

    getAllDoctors: (hospitalId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collName.doctor_collection).find({ hospitalCode: hospitalId }).toArray().then((response) => {
                resolve(response)
            })
        });
    }

}
