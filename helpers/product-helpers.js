var db = require ('../config/connection')
var nodemailer = require('nodemailer')
var collName = require("../config/collections") 
var promise = require("promise")
const { resolve, reject } = require('promise')
const { response } = require('express')
const async = require('hbs/lib/async')
var objectId = require('mongodb').ObjectId

module.exports ={

    getallHospital:()=>{
        return new promise(async(resolve,reject)=>{
            let product =await db.get().collection(collName.hospital_collection).find().toArray()
            resolve(product)
        })
    },
    deleteProduct:(proId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.hospital_collection).deleteOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    productDetails:(proId)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.hospital_collection).findOne({_id:objectId(proId)}).then((products)=>{
                resolve(products)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.hospital_collection)
            .updateOne({_id:objectId(proId)},
            {$set:{
                name:proDetails.name,
                loginCode:proDetails.loginCode,
                description:proDetails.description,
            }}).then((response)=>{
                resolve(response)
            })
            
        })
    },

    getAllUsers:()=>{
        return new promise((resolve,reject)=>{
            db.get().collection(collName.user_collection).find().toArray().then((response)=>{
                resolve(response)
            })
        })
    },

    addHospital:(details)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.hospital_collection).insertOne(details).then((response)=>{
                resolve(response)
            })
        });
    },
    addDoctor:(details)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collName.doctor_collection).insertOne(details).then((response)=>{
                resolve(response)
            })
        });
    }
}