var express = require('express');
var router = express.Router();
var pg = require('pg');


var config = {
  database: 'antares', // name of your database
  host: 'localhost', // where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time?
  idleTimeoutMillis: 30000 // 30 second time out
};


var pool = new pg.Pool(config);
router.get('/', function(req, res){
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      var queryText = 'SELECT * FROM "todo";';
      db.query(queryText, function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          res.send({tasks: result.rows});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end of GET



var pool = new pg.Pool(config);

router.post('/', function(req, res){
  var task = req.body;
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "todo" ("taskname", "details")' +
      'VALUES ($1, $2);';
      db.query(queryText, [task.taskname, task.details], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }); // end pool
}); // end of GET




router.put('/', function(req, res){
  var task = req.body;
  console.log('Put route called with book of ', task);

  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {

      var queryText = 'UPDATE "todo" SET "completed" = true WHERE id = $1;';
      db.query(queryText, [task.completedTaskId], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }); // end pool
});


router.delete('/:id', function(req, res){
  var id = req.params.id;
  console.log('Delete route called with id of', id);


  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      var queryText = 'DELETE FROM "todo" WHERE id = $1;';
      db.query(queryText, [id], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      }); // end query
    } // end if
  }); // end pool
});


module.exports = router;
