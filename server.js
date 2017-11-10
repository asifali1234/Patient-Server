/**
 * Created by aravind on 10/11/17.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = require('./router.js');

app.use((err,req,res,next)=>{
	console.log(err);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/',router);

app.listen(process.env.PORT||3000,()=>{
	console.log("Server listening at port 3000");
});

