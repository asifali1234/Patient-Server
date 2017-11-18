/**
 * Created by aravind on 11/11/17.
 */

const calendarapi = require('node-google-calendar');
const config = require('../settings.js');

let cal = new calendarapi(config);

var event = {
    'summary': 'Doctor Appointement',
    'start': {
        'dateTime': new Date(),
        'timeZone': 'Asia/Calcutta',
    },
    'end': {
        'timeZone': 'Asia/Calcutta',
    },
    'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
    ],
    'reminders': {
        'useDefault': false,
        'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10},
        ],
    },
};

let bookforDoctor = (db,userid,doctorid,date,doctorName,patientemail,starttime)=>{
	let currdate = new Date().getDate()+""+new Date().getMonth()+""+new Date().getFullYear();
	console.log(currdate);
	return new Promise((resolve,reject)=>{
		db.token.findAndModify({query:{doctorid:doctorid,date:date},update:{$inc:{tokenno:1}},upsert:true,new:true},(err,docs)=>{
			if(!err){
				let token =docs.tokenno;
				db.appointements.save({googleid:userid,doctorid:doctorid,date:date,tokenno:token,doctorName:doctorName},(err)=>{
					if(!err){
					    event.description = "Your token no is"+token+"Please don\'t forget about appointement!!";
					    event.attendees.push({'email':patientemail});
					    event.end.dateTime = new Date();
					    cal.Events.insert('primary',event).then((resp)=>{
					        docs.calendarid = resp.id;
					        resolve(docs);
                        }).catch((err)=>{
					        docs.calendarerror = err;
					        resolve(docs);
                        });

					}
					else{
						reject(err);
					}
				});
			}
			else{
				reject(err);
			}
		});
	}).then((docs)=>{
		return docs;
	}).catch((err)=>{
		return err;
	});
};

module.exports = {booking:bookforDoctor};