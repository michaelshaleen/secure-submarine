const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {rejectUnauthenticated} = require('../modules/authentication-middleware');


router.get('/', rejectUnauthenticated, (req, res) => {

  let queryText;
  let queryParams;
  // what is the value of req.user????
  console.log('req.user:', req.user);
  console.log("auth", req.isAuthenticated());
  // if(!req.isAuthenticated()){ // if not logged in or authenticated send 403
  //   res.sendStatus(403);
  //   return;
  // }

  if(req.user.clearance_level === 10){
    queryText = `  
  SELECT * FROM "secret"
  WHERE "secrecy_level" <= $1;
  `
  queryParams = [req.user.clearance_level]
  }
  

  pool
    .query(queryText, queryParams)
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
