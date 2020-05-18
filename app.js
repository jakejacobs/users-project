const express = require('express')
const fs = require('fs');

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())

const users = JSON.parse(fs.readFileSync(`${__dirname}/api/users.json`))

//GET users
app.get('/api/v1/users',(req,res)=>{
  res.status(200).json({
      success:200,
      results:users.length,
      data:{
          users:users
      }
  })
})

//GET single user
app.get('/api/v1/users/:username',(req,res)=>{

  const findUser = users.find((user)=>{
      return user.username.toLowerCase() === String(req.params.username.toLowerCase())
  })
  if(!findUser){
      return res.status(404).json({
          status:"fail",
          message:"Invalid Username"
      })
  } 
      
      res.status(200).json({
          success:200,
          data:{
              user:findUser
          }
          
      })
})

//POST
app.post('/api/v1/users',(req,res)=>{
  const newid = users[users.length - 1].id + 1
  
  const newUser = Object.assign({
      id:newid,
  },req.body)
  users.push(newUser)
 fs.writeFile(`${__dirname}/api/users.json`,JSON.stringify(users),(err)=>{
     res.status(201).json({
         status:"success",
         data:{
             user:newUser
         }
     })
 })
})

//Update Post
app.patch('/api/v1/users/:username',(req,res)=>{
  let updateUser = users.find((user)=>{
      return user.username.toLowerCase() === String(req.params.username.toLowerCase())
  })

  if(!updateUser){
      return res.status(404).json({
          status:"fail",
          message:"Invalid Username"
      })
  }
  updateUser = {
      id:updateUser.id,
      name:req.body.name,
      username:req.body.username,
      email:req.body.email
      
  }

  users.splice(parseInt(updateUser.id - 1),1,updateUser)
  fs.writeFile(`${__dirname}/api/users.json`,JSON.stringify(users),(err)=>{
      res.status(201).json({
          status:"success",
          data:{
              user:updateUser
          }
      })
  })
  
})

//Delete user

app.delete('/api/v1/users/:username',(req,res)=>{
  let deleteUser = users.find((user)=>{
      return user.username.toLowerCase() === String(req.params.username.toLowerCase())
  })

  if(!deleteUser){
      return res.status(404).json({
          status:"fail",
          message:"Invalid Username"
      })
  }

  users.splice(parseInt(deleteUser.id - 1),1)
  fs.writeFile(`${__dirname}/api/users.json`,JSON.stringify(users),(err)=>{
      res.status(204).json({
          status:"success",
          data:null
      })
  })
  res.send("User deleted successfully")
})

//npm start
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})
