/**
 * Created by aravind on 10/11/17.
 */

const express = require('express');
const mongojs = require('mongojs');
const slack = require('slack-notify')("https://hooks.slack.com/services/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");
const app = express();

const db = mongojs('mongodb://carehack:carehack@ds155695.mlab.com:55695/carehack',['users','doctors','token','appointements']);


const sigin = require('./service/checkUserId.js');
const otp = require('./service/otp.js');
const patientdetails = require('./service/patientDetails.js');
const doctordetails = require('./service/doctordetails.js');
const booking = require('./service/booking.js');
const deletetoken = require('./service/deleteAppointement.js');
const appointements = require('./service/appointements.js');


app.use('/favicon.ico',(req,res)=>{
	res.sendStatus(204);
});

app.post('/checkUserexists',(req,res)=>{
	console.log(req.body);
	sigin.newUser(db,req.body.googleid).then((docs)=>{
		res.send(docs);
	}).catch((err)=>{
		slack.bug(err);
		res.send("error");
	});
});

app.post('/mobileVerification',(req,res)=>{
	console.log(req.body.mobilenumber);
	slack.bug(req.body.mobilenumber);
	console.log(typeof (req.body.googleid));
	otp.otpverification(db,req.body.mobilenumber,req.body.googleid).then((succ)=>{
		res.send(succ);
	}).catch((Err)=>{
		slack.bug(Err);
		res.send(Err);
	});
});

app.post('/verify',(req,res)=>{
	otp.verify(db,req.body.googleid,req.body.otpno).then((succ)=>{
		res.send({verified:succ});
	}).catch((err)=>{
		slack.bug(err);
		res.send(err);
	})
});

app.post('/patientDetails',(req,res)=>{
	patientdetails.details(db,req.body.googleid,req.body).then((succ)=>{
		res.send(succ);
	}).catch((err)=>{
		slack.bug(err);
		res.send(err);
	});
});

app.get('/doctorDetails',(req,res)=>{
	doctordetails.doctordetails(db).then((docs)=>{
		res.send(docs);
	}).catch((err)=>{
		slack.bug(err);
		res.send("error");
	})
});

app.post('/booking',(req,res)=>{
	console.log(req.body);
	booking.booking(db,req.body.googleid,req.body.doctorid,req.body.date,req.body.doctorName).then((succ)=>{
		res.send(succ);
	}).catch((err)=>{
		slack.bug(err);
		res.send(err);
	})
});

app.post('/delete',(req,res)=>{
	deletetoken.deleteappointement(db,req.body.googleid,req.body.date,req.body.doctorid,req.body.tokenno).
		then(()=>{
		res.send(true);
	}).catch((err)=>{
		res.send(err);
	});
});

app.post('/currentAppointements',(req,res)=>{
	appointements.currAppointements(db,req.body.googleid).then((docs)=>{
		res.send(docs);
	}).catch((err)=>{
		slack.bug(err);
		res.send(err);
	});
});

app.post('/previousAppointements',(req,res)=>{
	appointements.prevAppointements(db,req.body.googleid).then((docs)=>{
		res.send(docs);
	}).catch((err)=>{
		slack.bug(err);
		res.send(err);
	});
});


module.exports = app;