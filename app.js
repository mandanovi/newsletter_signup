const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const { json } = require("body-parser");
require("dotenv").config()



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const apiKey = process.env.apiKey;
    const listID = process.env.listID;
    const data = { 
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url="https://us10.api.mailchimp.com/3.0/lists/"+listID
    const options= {
        method: "POST",
        auth: "novita:"+apiKey
    }
    const request = https.request(url, options, function(response) {
        const status = response.statusCode;
        if (status === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        
    })
    request.write(jsonData);
    request.end();
    
    

})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("server 3000");
})
