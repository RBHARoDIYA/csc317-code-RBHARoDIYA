// Images Search functionality through the searchbar
exports.search= function(req, res) {

    if(req.method == "POST") {
       var post  = req.body;
       var searchterm = post.q.toUpperCase();
       var userId=post.userId;
       // query for database to get all the posts
       var searchSql = "SELECT * FROM POSTS WHERE UPPER(POSTNAME) like '%" + searchterm + "%' ORDER BY TIMESTAMP DESC"; 
 
       // execute the above written query
       db.query(searchSql, function (err, result) {
          if (err) {
             console.log("inside search error");
             res.redirect('/');
          } // error clause
 
          if(req.session.userId != null) {
             // print("user" + userId + "exists");
              res.render('index1.ejs', {posts: result, userId: userId});
          } // does user exists clause
          else
              {
                  res.render('index.ejs', {posts: result});
              }
       }); // annonymous function // db.query
    } // if
 
 };
 
 //* Sign Up call
 exports.signup = function(req, res){
    message = '';
    if(req.method == "POST"){
       // initialization of variables
       var post, name, pass, email;
 
       let date_obj, timestamp;
 
       post  = req.body;
       name = post.Username;
       pass = post.Password;
       email = post.Email;
 
       // initialization of new Date object
       date_obj = new Date();
 
       // creating a timestamp using date object.
       timestamp = date_obj.getFullYear() + "-" + ("0" + (date_obj.getMonth() + 1)).slice(-2) + "-" + ("0" + date_obj.getDate()).slice(-2) + " " + date_obj.getHours() + ":" + date_obj.getMinutes() + ":" + date_obj.getSeconds();
 
       // prints date & time in YYYY-MM-DD HH:MM:SS format
       //print(timestamp);
       var createUserSql = "INSERT INTO `user`(`USERNAME`,`EMAILID`,`PASSWORD`,`TIMESTAMP`) VALUES ('" + name + "','" + email + "','" + pass + "','" + timestamp + "')";
       db.query(createUserSql, function() {
          message = "Your account has been created succesfully!";
          res.redirect('/signin');
       });
 
    } else {
       res.render('signup');
    }
 };
 
 //* Create comments call
 exports.postcomments = function(req, res) {
 
    message = '';
 
    if(req.method == "POST"){
 
       // variables
       var post, comments, postname, userId;
       let date_obj, timestamp;
 
       post  = req.body;
       comments= post.comments;
       postname= post.postame;
       userId = post.userId;
 
       console.log("postname "+postname+" userid "+userId+" comments "+comments);
 
       date_obj = new Date();
 
       timestamp = date_obj.getFullYear() + "-" + ("0" + (date_obj.getMonth() + 1)).slice(-2) + "-" + ("0" + date_obj.getDate()).slice(-2) + " " + date_obj.getHours() + ":" + date_obj.getMinutes() + ":" + date_obj.getSeconds();
 
       // prints date & time in YYYY-MM-DD HH:MM:SS format
       console.log(timestamp);
 
       if(comments!="") {
 
       var sql = "INSERT INTO COMMENTS(POSTNAME,USERNAME,COMMENTS,TIMESTAMP) VALUES ('" + postname + "','" + userId + "','" + comments + "','" + timestamp + "')";
 
       db.query(sql, function() { message = "Succesfully! Your account has been created."; });
 
       }
 
       var selectCommentsSql = "select POSTS.IMAGENAME, COMMENTS.* from POSTS,COMMENTS where POSTS.POSTNAME=COMMENTS.POSTNAME and POSTS.POSTNAME='" + postname + "' ORDER BY COMMENTS.TIMESTAMP DESC";
 
       db.query(selectCommentsSql, function(result) {
          res.render('viewcomments.ejs', {posts: result, userId: userId, postname: postname});
 
       });
    } else {
 
       if(req.query.userId=="") {
          res.render('signin');
       }else{
          var userId=req.query.userId;
          var postname=req.query.postname;
          res.render('postcomments.ejs', { userId: userId, postname: postname});
       }
    }
 }
 
 
 //* View comments call
 exports.viewcomments= function(req, res) {
    var message = '';
    const http = require('http');
    const url = require('url');
 
    var sess = req.session;
    var   userId = req.session.userId;
 
    if(req.method == "POST"){
 
    }else{
       var postname = req.query.postname;
       console.log("postname is "+postname);
 
      // if (userId == null) {
 
       //var query = "SELECT * FROM `COMMENTS` WHERE POSTNAME='"+postname+"' ORDER BY TIMESTAMP DESC "; // query database to get all the posts
       // execute query
          var query = "select POSTS.IMAGENAME, COMMENTS.* from POSTS,COMMENTS where POSTS.POSTNAME=COMMENTS.POSTNAME and POSTS.POSTNAME='"+postname+"' ORDER BY COMMENTS.TIMESTAMP DESC";
          db.query(query, function(err, result) {
          if (err) {
             log.info("inside error page")
             res.redirect('/');
          }
 
          console.log("**********");
          const queryObject = url.parse(req.url,true).query;
          console.log(req.query.postname);
          res.render('viewcomments.ejs', {posts: result, userId: userId, postname: postname});
       //res.render('viewcomments.ejs',{message: message});
    });
      // }
    }
 }
 //-----------------------------------------------signin page call------------------------------------------------------
 exports.login = function(req, res){
    var message = '';
    var sess = req.session;
 
    if(req.method == "POST"){
       var post  = req.body;
       var name= post.Username;
       var pass= post.Password;
       console.log('username '+name);
           console.log('pwd '+pass);
       var sql="SELECT username, password FROM `user` WHERE `username`='"+name+"' and password = '"+pass+"'";
       db.query(sql, function(err, results){
          if(results.length){
             req.session.userId = results[0].username;
             req.session.user = results[0];
             console.log('username '+results[0].username);
             console.log('pwd '+results[0].password);
             res.redirect('/dashboard');
          }
          else{
             message = 'Wrong Credentials.';
             res.render('signin.ejs',{message: message});
          }
 
       });
    } else {
       res.render('signin.ejs',{message: message});
    }
 
 };
 //-----------------------------------------------dashboard page functionality----------------------------------------------
 
 exports.dashboard = function(req, res){
 
    console.log("called dashboard");
 
       console.log("2nd time called dashboard");
       //var user = req.session.user;
       var   userId = req.session.userId;
       console.log('ddd=' + userId);
       if (userId == null) {
          res.redirect("/signin");
          return;
       }
    let query = "SELECT * FROM `POSTS` ORDER BY TIMESTAMP DESC"; // query database to get all the posts
    // execute query
    db.query(query, (err, result) => {
       if (err) {
          res.redirect('/');
       }
 
       var sql = "SELECT * FROM `user` WHERE `id`='" + userId + "'";
 
       db.query(sql, function (err, results) {
          res.render('dashboard.ejs', {posts: result, userId: userId});
       });
 
 
    });
 
 
 };
 //------------------------------------logout functionality----------------------------------------------
 exports.logout=function(req,res){
    req.session.destroy(function(err) {
       res.redirect("/");
    })
 };
 
 function msleep(n) {
   Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
 }
 function sleep(n) {
   msleep(n*1000);
 }
 //-----------------------------------------------fileupload page call------------------------------------------------------
 
 exports.fileupload = function(req, res){
  //  var message = '';
    var sess = req.session;
 
    if(req.method == "POST"){
       var post  = req.body;
       var name= post.title;
       var imagename= post.image;
       var userId = req.session.userId;
       console.log('username '+userId);
 
       let date_ob = new Date();
       let date = ("0" + date_ob.getDate()).slice(-2);
       let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
       let year = date_ob.getFullYear();
       let hours = date_ob.getHours();
       let minutes = date_ob.getMinutes();
       let seconds = date_ob.getSeconds();
       let tstamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
 
       if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send('No files were uploaded.');
       }
       // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
       let sampleFile = req.files.image;
       console.log('**********************');
       console.log(sampleFile);
       // Use the mv() method to place the file somewhere on your server
       var fpath = __dirname.replace('routes','public')
       sampleFile.mv(fpath+'/img/'+sampleFile.name, function(err) {
          if (err)
             return res.status(500).send(err);
 
          console.log('postname '+name);
          console.log('userId '+userId);
          var sql = "INSERT INTO `posts`(`POSTNAME`,`USERNAME`,`COMMENTS`,`TIMESTAMP`,`IMAGENAME`) VALUES ('" + name + "','" + userId + "','','" + tstamp + "','" + sampleFile.name + "')";
          console.log('sql '+sql);
          db.query(sql, function (err, results) {
             if (err) {
                console.log('**********************ERROR in insert posts*****************');
                res.render('fileupload.ejs', { userId: userId});
             }
 
          });
 
       });
       setTimeout(() => { module.exports.dashboard(req,res); }, 100);
    }else { // file upload get call
 
       var userId=req.query.userId;
    if(req.session.userId!=null) {
       res.render('fileupload.ejs', { userId: userId});
       }
       else {
             res.redirect("/login");
             }
 
 
    }
 };
 //-----------------------------------------------delete post call------------------------------------------------------
 exports.delete= function(req,res){
    var sess = req.session;
 };
 