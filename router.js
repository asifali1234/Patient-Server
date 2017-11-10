/**
 * Created by aravind on 10/11/17.
 */

const express = require('express');
const mongojs = require('mongojs');
const slack = require('slack-notify')("https://hooks.slack.com/services/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");
const app = express();

const db = mongojs('mongodb://carehack:carehack@ds155695.mlab.com:55695/carehack',['users','doctors']);

const sigin = require('./service/signin.js');
const otp = require('./service/otp.js');
const patientdetails = require('./service/updateDetails.js');

app.use('/favicon.ico',(req,res)=>{
	res.sendStatus(204);
});

app.post('/checkUserexists',(req,res)=>{
	console.log(req.body);
	sigin.newUser(db,req.body.GoogleID).then((docs)=>{
		res.send(docs);
	}).catch((err)=>{
		slack.bug(err);
		res.send("error");
	});
});

app.post('/mobileVerification',(req,res)=>{
	console.log(req.body.number);
	otp.otpverification(db,req.body.number,req.body.GoogleID).then((succ)=>{
		res.send(succ);
	}).catch((Err)=>{
		slack.bug(Err);
		res.send(Err);
	});
});

app.post('/verify',(req,res)=>{
	otp.verify(db,req.body.GoogleID,req.body.otpno).then((succ)=>{
		res.send(succ);
	}).catch((err)=>{
		slack.bug(err);
		res.send(err);
	})
});

app.post('/patientDetails',(req,res)=>{
	patientdetails.details(db,req.body.GoogleID,req.body).then((succ)=>{
		res.send(succ);
	}).catch((err)=>{
		slack.bug(err);
		res.send(err);
	});
});

module.exports = app;