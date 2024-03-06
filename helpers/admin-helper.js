var db = require ('../config/connection')
var collName = require("../config/collections") 
const promise = require('promise')


module.exports ={
    adminLogin:(loginData)=>{
        adminrespo = {}
        return new promise((resolve,reject)=>{
        db.get().collection(collName.admin_collection).findOne({admincode:loginData.admincode}).then((status)=>{
          console.log(status);
            adminrespo.admin=status
            if(status){
                adminrespo.stat=true
                resolve(adminrespo)
            }else{
                resolve({stat:false})
            }
        })
        })
    }
}