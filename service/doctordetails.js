/**
 * Created by aravind on 11/11/17.
 */
let doctordetails = (db)=>{

	return new Promise((resolve,reject)=>{
		db.doctors.find((err,docs)=>{
			if(!err){
				resolve(docs);
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
	doctordetails:doctordetails
};