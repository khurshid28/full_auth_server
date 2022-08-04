const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken")
const express = require("express")
const app = express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("AUTH Server is running here!!!")
})

require("dotenv").config()
let PORT = process.env.PORT || 5555
let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

let users = []

app.post("/auth/signup", (req, res) => {

    let { gmail, password, username } = req.body
    let mylist =[]
    users.forEach((element)=>{
        if(element.gmail == gmail){
            mylist.push(element)
        }
    })
    if (mylist.length !== 0) {
        res.json({
            "success": false,
            "massage": "an user is already registered "
        });
    } else {
        JWT.sign({ gmail, password, username }, JWT_SECRET_KEY, (err, token) => {

            if (err) {

                return res.json({
                    "success": false,
                    "massage": "Can't be Registered "
                });
            }
            bcrypt.hash(password, 10).then(function(hash) {
                password = hash
                users.push({username,password,gmail})
                res.json({
                    "success": true,
                    "massage": "Register Successfully",
                    "data": {
                        username,gmail,
                        token
                    }
                })
            });
            
        });
    }


})



app.post("/auth/signin", (req, res) => {

    let { gmail, password, username } = req.body
    let mylist =[]
    users.forEach((element)=>{
        if(element.gmail == gmail){
            mylist.push(element)
        }
    })
    if(mylist.length !==0 ){
        JWT.sign({ gmail, password, username }, JWT_SECRET_KEY, (err, token) => {

    
            if (err) return res.json({
                "success": false,
                "massage": "Can't  be logged "
            });
            
            bcrypt.compare(password, mylist[0].password).then(function(result) {
                if(result && username == mylist[0].username){
                    res.json({
                        "success": true,
                        "massage": "Login Successfully",
                        "data": {
                            username,
                            gmail,
                            token
                        }
                    })
                }else{
                    res.json({
                        "success": false,
                        "massage": "Username or Password invalid!",
                        
                    })
                }
            });

            
            
        });
    }else{
        res.json({
            "success": false,
            "massage": "an user isnot found "
        });
    }

    





})










app.get("/users", verify, (req, res) => {
    let { token, user } = req
    let mylist=[];
        users.forEach((element)=>{
          mylist.push({
            username:element.username,
            gmail:element.gmail
          })
        })
        res.json({
            "success": true,
            "data": mylist,
        })
    
})







app.post("/auth/signout", (req, res) => {
    res.json({
        "success": true,
        "massage": `logout successfully`,
    })


})

function verify(req, res, next) {
    let token = req.headers["authorization"].split(" ")[1]

    JWT.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) return res.json({
            "success": false,
            "massage": "token invalid!",
        });
        else {
            req.token = token;
            req.user = user
            next();
        }
    })
}


app.listen(PORT, () => {
    console.log("server is running on 5555");
})