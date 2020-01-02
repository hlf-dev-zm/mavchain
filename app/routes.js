//SPDX-License-Identifier: Apache-2.0

let express = require('express');
let router = express.Router();
let dapp = require('./controller.js');
let format = require('date-format');

module.exports = router;

router.use(function(req, res, next) {

  console.log(format.asString('hh:mm:ss.SSS', new Date())+'::............ '+req.url+' .............');
  next(); // make sure we go to the next routes and don't stop here

  function afterResponse() {
      res.removeListener('finish', afterResponse);          
  }    
  res.on('finish', afterResponse);

});

router.post('/generateHash', dapp.generate_hash);
router.post('/updateHashStatus', dapp.update_hash_status);
router.post('/getHashStatus', dapp.get_hash_status);
router.post('/verifyHash', dapp.verify_hash);