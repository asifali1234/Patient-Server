/**
 * Created by aravind on 10/11/17.
 */

const express = require('express');
const mongojs = require('mongojs');
const slack = require('slack-notify')("https://hooks.slack.com/services/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");
const app = express();

const db = mongojs('mongodb://carehack:carehack@ds155695.mlab.com:55695/carehack',['users','doctors']);

const sigin = require('./service/signin.js');

app.use('/favicon.ico',(req,res)=>{
	res.sendStatus(204);
});

app.post('/login',(req,res)=>{
	console.log(req.body.googleid);
	//console.log(db.users.find());
	sigin.newUser(db,req.body.googleid).then((docs)=>{
		res.send(docs);
	}).catch((err)=>{
		slack.bug(err);
		res.send("error");
	});
});

module.exports = app;