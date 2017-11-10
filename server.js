/**
 * Created by aravind on 10/11/17.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = require('./router.js');

const slack = require('slack-notify')("https://hooks.slack.com/services/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");

app.use((err,req,res,next)=>{
	slack.bug(err);
	console.log(err);
});

app.use((req,res)=>{
	slack.bug("404 error"+req.url);
	res.send("404 error");
});


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/',router);

app.listen(process.env.PORT||3000,()=>{
	console.log("Server listening at port 3000");
});

