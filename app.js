const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs');

const app = express()

const publicDirectoryPath = path.join(__dirname,'./public')
app.use(express.static(publicDirectoryPath))


const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())

app.get('/api/users/:id', (req,res)=>{
   
        try {
          const data = fs.readFileSync(path.join(__dirname, './api/users.json'));
          const users = JSON.parse(data);
          const userName = users.find(user => user.username.toLowerCase() === String(req.params.id.toLowerCase()));
          if (!userName) {
            res.json({"error":"Username not found"})
          }
          res.json(userName);
        } catch (e) {
          console.log(e);
          
        }
});

//npm start
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})
