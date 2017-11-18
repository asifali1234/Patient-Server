/**
 * Created by aravind on 10/11/17.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = require('./router.js');

const slack = require('slack-notify')("https://hooks.slack.com/services/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");






app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use('/api',router);

app.listen(3000,()=>{
	console.log("Server listening at port 3000");
});

