const express = require('express');
const app = express();
const port  = 8080;
const path = require('path');
const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');
const methodoverride = require('method-override');

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "/views"));

app.use(methodoverride('_method'));
app.use(express.urlencoded({extended:true}));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'college',
  password: 'krishna@8400'
});

// HOME ROUTE
app.get('/', (req,res) => {
  let q = "SELECT count(*) from users";
  try {
       connection.query(q, (err, result) => {
         if(err) throw err;
         let count = result[0]["count(*)"];
         res.render("home.ejs", {count});   
       })
     } catch (err) {
       console.log(err);
       res.send("there is an error in dbms");
     }
})
 

// SHOW USER ROUTE
app.get("/user" ,(req,res) => {
  let q = "SELECT * FROM users";
  try {
    connection.query(q, (err, users) => {
      if(err) throw err;
      res.render("showuser.ejs" , {users});   
    })
  } catch (err) {
    console.log(err);
    res.send("there is an error in dbms");
  }

} )

// EDIT USERNAME ROUTE
app.get("/user/:id/edit" , (req ,res) =>{
  let{id} = req.params;
  let q = `SELECT * from users WHERE id = '${id}'`;


  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs" , {user} );   
    })
  } catch (err) {
    console.log(err);
    res.send("there is an error in dbms");
  }
  
})

// UPDATE (DB) ROUTE

app.patch("/user/:id" , (req , res) => {
  let{id} = req.params;
  let {password: formpass , username: newUser} = req.body;
  let q = `SELECT * from users WHERE id = '${id}'`;


  try {
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if(formpass != user.password){
        res.send("wrong password");
      }else{
        let q2 = `UPDATE users SET username = '${newUser}' WHERE id = '${id}'`;
        connection.query(q2 , (err , result) => {
          if(err) throw err;
          res.redirect("/user");
        })
      }
      
    })
  } catch (err) {
    console.log(err);
    res.send("there is an error in dbms");
  }
})

// ADD NEW USER
app.get("/user/new", (req,res) => {
  res.render("new.ejs");
})

app.post("/new/user", (req,res)=>{
  let {id , username , email , password} = req.body;
  let q = `insert into users(id , username ,email , password ) values(? , ?, ? , ?)`;

  try {
    connection.query(q,[id, username, email , password] ,(err, result) => {
      if(err) throw err;
      let user = result[0];
      res.redirect("/user");
    })
  } catch (err) {
    console.log(err);
    res.send("there is an error in dbms");
  }

})

// Delete User

app.delete("/user/:id" , (req,res)=>{
  let {id} = req.params;
  let q = `DELETE FROM users WHERE id = '${id}' `;

  try {
    connection.query(q ,(err, result) => {
      if(err) throw err;
      res.redirect("/user");
    })
  } catch (err) {
    console.log(err);
    res.send("there is an error in dbms");
  }

})
let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}
app.listen(port , () => {
  console.log(`app is listening on port ${port}`);
})
// try {
//   connection.query(q,[data], (err, result) => {
//     if(err) throw err;
//     console.log(result);
//   })
// } catch (err) {
//   console.log(err);
// }
// connection.end();


