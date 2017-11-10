/**
 * Created by aravind on 10/11/17.
 */
const mongojs = require('mongojs');
const db = mongojs('mongodb://carehack:carehack@ds155695.mlab.com:55695/carehack',['users','doctors']);
const newUser = (user) =>{
	//check in db for user is already present
	console.log(db.users);
	return new Promise((resolve,reject)=>{
		db.users.find({googleid:user},(err,docs) =>{
			//console.log(docs);
			if(!err){
				if(Object.keys(docs).length!=0) {
					docs[0].registered = true;
					resolve(docs);
				}
				else{
					console.log("here");
					db.users.save({googleid:user},(err,docs)=>{
						console.log(docs);
						docs.registered = false;
						resolve(docs);
					})
				}
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

module.exports = {
	newUser:newUser
};