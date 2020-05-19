const express = require('express');
const mongodb = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

//MongoDB
const MongoClient = mongodb.MongoClient;

const connectionURL = `mongodb://127.0.0.1:27017`;
const databaseName = 'users-database';

MongoClient.connect(
	connectionURL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(error, client) => {
		if (error) {
			return console.log(`unable to connect to the server`);
		}
		const db = client.db(databaseName);
		const usersCollection = db.collection('users');

		// Express server
		app.use(express.json());

		//GET 
		app.get('/api/v1/users', (req, res) => {
            usersCollection.find().toArray((error,result)=>{
                if(error){
                    return console.log(error);
                }
                res.status(200).json({
                    success: 200,
                    results: result.length,
                    data: {
                        user: result
                    }
                });
            })
		});

		//GET single user
		app.get('/api/v1/users/:username', (req, res) => {
            usersCollection.findOne({username:req.params.username.toLowerCase()},(error,result)=>{
                if(error){
                    return console.log(error);
                }
                res.status(200).json({
                    success: 200,
                    data: {
                        user: result
                    }
                });
            })
		});

		//POST
		app.post('/api/v1/users', (req, res) => {

            if(!req.body.name && req.body.username && req.body.email){
                    return res.status(404).json({
                        message:"Invalid Data"
                    })
            }
            
			usersCollection.insertOne({
                name:req.body.name,
                username:req.body.username,
                email:req.body.email
            },(error,result)=>{
                if(error){
                    return console.log(error);
                }
                res.status(201).json({
					status: 'success',
					data: {
						user: result.ops
					}
				});
            })
		});

		//UPDATE 
		app.patch('/api/v1/users/:username', (req, res) => {

            usersCollection.findOneAndUpdate({username:req.params.username.toLowerCase()},
            {
                $set:{
                    name:req.body.name,
                    username:req.body.username,
                    email:req.body.email
                }
            },(error,result)=>{
                if(error){
                    return console.log(error);
                }
                res.status(201).json({
					status: 'success',
					data: {
						user: `Updated ${result.ok} user`
					}
				});
            })
		});

		//DELETE

		app.delete('/api/v1/users/:username', (req, res) => {
            usersCollection.deleteOne({username:req.params.username.toLowerCase()},(error,result)=>{
            
                if(error){
                    return console.log(error);
                }
                    res.status(201).json({
                        status: 'success',
                        data: {
                            user: `Deleted ${result.deletedCount} user(s)`
                        }
                    });

                
            })
		});
	}
);

//npm start
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
