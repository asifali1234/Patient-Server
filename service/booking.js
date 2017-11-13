/**
 * Created by aravind on 11/11/17.
 */

let bookforDoctor = (db,userid,doctorid,date)=>{
	let currdate = new Date().getDate()+""+new Date().getMonth()+""+new Date().getFullYear();
	console.log(currdate);
	return new Promise((resolve,reject)=>{
		db.token.findAndModify({query:{doctorid:doctorid,date:date},update:{$inc:{tokenno:1}},upsert:true,new:true},(err,docs)=>{
			if(!err){
				let token =docs.tokenno;
				db.appointements.save({googleid:userid,doctorid:doctorid,date:date,tokenno:token},(err)=>{
					if(!err){
						resolve(docs);
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