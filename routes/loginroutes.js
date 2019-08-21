var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'gamers'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
});


exports.register = function(req,res){
    var today = new Date();
    var users={
      "first_name":req.body.first_name,
      "last_name":req.body.last_name,
      "email":req.body.email,
      "password":req.body.password,
      "created":today,
      "modified":today,
      "isAdmin":0
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
    }
    });
  }


exports.record = function(req,res){
  var today = new Date();
  var feedback1={
    "user":req.body.user,
    "session":req.body.session,
    "stars":req.body.stars,
    "description":req.body.description,
    "created":today
  }
  connection.query('INSERT INTO feedback SET ?',feedback1, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    res.send({
      "code":200,
      "success":"feedback registered sucessfully"
        });
  }
  });
}

exports.read = function(req,res){
 
  connection.query('SELECT * FROM feedback', function (error, results, fields) {
  if (error) {
    res.send({
      "code":400,
      "failed":"error retrieving data ocurred"
    })
  }else{
        res.send({
          "results":results,
          "success":"data available"
            });
  }
  });
}

exports.sorted = function(req,res){
 
  connection.query('SELECT * FROM feedback ORDER BY CAST(stars AS CHAR) DESC', function (error, results, fields) {
  if (error) {
    res.send({
      "code":400,
      "failed":"error retrieving data ocurred"
    })
  }else{
        res.send({
          "results":results,
          "success":"data available"
            });
  }
  });
}

  exports.login = function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        if(results[0].isAdmin == 1){
         
          res.send({
            "code":300,
            "success":"welcome admin"
              });
        }
        
        else if(results[0].password == password){
          res.send({
            "code":200,
            "success":"login sucessful"
              });
        }
        else{
          res.send({
            "code":204,
            "success":"Email and password does not match"
              });
        }
      }
      else{
        res.send({
          "code":204,
          "success":"Email does not exits"
            });
      }
    }
    });
  }