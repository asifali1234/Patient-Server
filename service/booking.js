/**
 * Created by aravind on 11/11/17.
 */

let bookforDoctor = (db,userid,doctorid,date)=>{
	let currdate = new Date().getDate()+""+new Date().getMonth()+""+new Date().getFullYear();
	let booking = {
		date:date,
		doctorid:doctorid
	};
	return new Promise((resolve,reject)=>{
		db.token.find({doctorid:doctorid},(err,docs)=>{
			if(docs.length==0){
				db.token.save({doctorid:doctorid,date:date,tokenno:1},(err)=>{
					if(!err){
						booking.tokenno = 1;
						db.users.update({googleid:userid},{$push:{booking:booking}},(err)=>{
							if(!err){
								resolve(booking);
							}
							else{
								reject(err);
							}
						})
					}
					else{
						reject(err);
					}
				});
			}
			else{
				if(docs[0].date==currdate){
					let tokenno = docs[0].tokenno+1;
					booking.tokenno = tokenno;
					db.token.update({doctorid:doctorid},{$inc:{tokenno:1}},(err,docs)=>{
						if(!err){
							db.users.update({googleid:userid},{$push:{booking:booking}},(err)=>{
								if(!err){
									resolve(booking);
								}
								else{
									reject(err);
								}
							})
						}
						else{
							reject(err);
						}
					});
				}
				else{
					booking.tokenno =1;
					db.token.update({doctorid:doctorid},{date:date,tokenno:1},(err)=>{
						if(!err){
							resolve(booking);
						}
						else{
							reject(err);
						}
					})
				}
			}
		});
	});
};

module.exports = {booking:bookforDoctor};