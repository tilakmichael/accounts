var express = require("express");
var router  = express.Router() ;
var url = require('url') ;
//var mongojs=require('mongojs') ;
//var monDB = mongojs('mongodb://name:password@ds031641.mlab.com:31641/vadavai', ['loc']) ;
//var mongoose = require("mongoose");
var jsonfile  = require('jsonfile');
//var randomId  = require('random-id-generator') ;

//mongoose.connect('Shamina:27017/hr')
//var MonSchema = mongoose.Schema ;



module.exports = router ;
// select function
function consoleLog(msg){
    if (msg){
       console.log(msg);
    }
};

function getAll(req, res, next, sql){
    consoleLog('query : '+sql);
     try {
  		var query = url.parse(req.url,true).query;

        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query(sql, function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resLoc = [];
                    for (var indx in rows) {
                        var obj = rows[indx];
                        resLoc.push(obj);
                    }
                    res.json(resLoc);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }

};
//insert function

function insertData (req,resp, next, sql,data) {
  consoleLog('Insert : '+sql +' : '+ data) ;
  try{
     req.getConnection( function(err, conn) {
         if (err) {
             console.error("Sql Connection Error: ", err) ;
             return next(err) ;
         }else {
             var query = conn.query(sql,data, function(err, result) {
                 if (err) {
                     console.error("Sql Insert Error: ", err) ;
                     return next(err) ;
                 }
                 consoleLog("insert success")
                 consoleLog(result) ;
                 var id = result.insertId ;
                 resp.json({"id":id}) ;

             } )  ;
         }
     }) ;
   } catch(ex){
       consoleLog("internal error ", ex);
       return next(ex);
   }
}  ;

//updta function
function updateData (req, resp, next,sql,data,id){
 consoleLog('Update :'+ sql +' : '+id) ;
 consoleLog('Update data :'+ data) ;

 try{
     req.getConnection( function(err, conn) {
         if (err) {
             console.error("Sql Connection Error: ", err) ;
             return next(err) ;
         }else {
             var query = conn.query(sql,[data, id], function(err, result) {
                 if (err) {
                     console.error("Sql update Error: ", err) ;
                     return next(err) ;
                 }
                 consoleLog("Update success") ;
                 consoleLog(result) ;
                 resp.json(result) ;
             }
             )  ;
         }
     }) ;
   } catch(ex){
       consoleLog("internal error ", ex);
       return next(ex);
   }
 } ;
// delete function
function deleteData (req, resp, next, sql, id){
 consoleLog('Delete : '+ sql +' : '+ id) ;
 try{
         req.getConnection( function(err, conn) {
         if (err) {
             console.error("Sql Connection Error: ", err) ;
             return next(err) ;
         }else {
             var query = conn.query(sql,[id], function(err, result) {
                 if (err) {
                     console.error("Sql delete Error: ", err) ;
                     return next(err) ;
                 }
                 consoleLog(result) ;
                 resp.json(result) ;
             } )  ;
         }
     }) ;
   } catch(ex){
       console.log("internal error ", ex);
       return next(ex);
   }
}  ;

/*----------End of CRUD ------------------------------------------------------------------------*/

/* organization Table -----------------------------*/
router.get('/acc/v1/orgs', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM accorgs order by name')
});


router.post('/acc/v1/orgs', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO ACCORGS SET ? ",reqObj);

});

router.put('/acc/v1/orgs' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE ACCORGS SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/orgs/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM ACCORGS WHERE ID = ? ",id ) ;
 }
} ) ;

/* Lookups Table -----------------------------*/
router.get('/acc/v1/lookups', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM lookups order by name')
});


router.post('/acc/v1/lookups', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO LOOKUPS SET ? ",reqObj);

});

router.put('/acc/v1/lookups' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE LOOKUPS SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/lookups/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM LOOKUPS WHERE ID = ? ",id ) ;
 }
} ) ;
//   ---------------------------  acctypes ---------------------------------------
router.get('/acc/v1/types', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM acctypes order by level, name')
});

// to get last level gl types
router.get('/acc/v1/gltypes', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM acctypes a where not EXISTS (select 1 from acctypes b where a.id=b.refid ) order by name')
});

router.post('/acc/v1/types', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO ACCTYPES SET ? ",reqObj);

});

router.put('/acc/v1/types' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE ACCTYPES SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/types/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM ACCTYPES WHERE ID = ? ",id ) ;
 }
} ) ;

//---------------------   accledgers  ---------------------------------------------------------


/* period Table ----------------------------- */
router.get('/acc/v1/period', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM accperiod order by startdt')
});


router.post('/acc/v1/period', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO accperiod SET ? ",reqObj);

});

router.put('/acc/v1/period' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE accperiod SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/period/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM accperiod WHERE ID = ? ",id ) ;
 }
} ) ;


/* gl Table -----------------------------*/
router.get('/acc/v1/gl', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM accgl order by name')
});


router.post('/acc/v1/gl', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO accgl SET ? ",reqObj);

});

router.put('/acc/v1/gl' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE accgl SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/gl/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM accgl WHERE ID = ? ",id ) ;
 }
} ) ;


/* ----------------------------------------------- SLBOOKS ----------------------------------*/

router.get('/acc/v1/slbook', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM accslbooks order by name')
});


router.post('/acc/v1/slbook', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO accslbooks SET ? ",reqObj);

}
);

router.put('/acc/v1/slbook' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE accslbooks SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/slbook/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM accslbooks WHERE ID = ? ",id ) ;
 }
}
) ;

/* ----------------------------------------------- SL ----------------------------------*/
router.get('/acc/v1/sl', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM accsl order by name')
});


router.post('/acc/v1/sl', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO accsl SET ? ",reqObj);

}
);

router.put('/acc/v1/sl' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE accsl SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/sl/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM accsl WHERE ID = ? ",id ) ;
 }
}
) ;



/* -----------------------------------------------Doc ----------------------------------*/
router.get('/acc/v1/doc', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM accdoc order by docdate ')
});

router.get('/acc/v1/doc/:id', function(req, res, next) {
    consoleLog('Select one from Rest') ;
    var id = req.params.id ;
    if (id == null|| id =="" || id==undefined) {
        consoleLog("Id not found : ") ;
    }else {
       getAll(req,res,next,'SELECT * FROM accdoc where id='+id);
    }
});


router.post('/acc/v1/doc', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO accdoc SET ? ",reqObj);

}
);

router.put('/acc/v1/doc' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE accdoc SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/doc/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM accdoc WHERE ID = ? ",id ) ;
 }
}
) ;


/* -----------------------------------------------Doc Detail ----------------------------------*/
router.get('/acc/v1/docdet', function(req, res, next) {
    consoleLog('Select from Rest') ;
    getAll(req,res,next,'SELECT * FROM accdocdet order by docid');
});

router.get('/acc/v1/docdet/:id', function(req, res, next) {
    consoleLog('Select one from Rest') ;
    var id = req.params.id ;
    if (id == null|| id =="" || id==undefined) {
        consoleLog("Id not found : ") ;
    }else {
       getAll(req,res,next,'SELECT * FROM accdocdet where docid='+id);
    }
});


router.post('/acc/v1/docdet', function(req,resp, next) {
  consoleLog('Insert from Rest') ;
  var reqObj = req.body ;
  delete reqObj.id ;
  consoleLog(reqObj) ;
  insertData(req,resp, next,"INSERT INTO accdocdet SET ? ",reqObj);

}
);

router.put('/acc/v1/docdet' , function(req, resp, next){
 consoleLog('Update from Rest') ;
 var input = req.body ;
 consoleLog(input) ;
 var id = input.id ;
 consoleLog('update id '+ id) ;

 if (id == null || id == undefined) {
     consoleLog("Id not found : ") ;
     console.error("Sql update Error: ",'Id not found' ) ;
     return next() ;

 }
 delete input.id ;
 updateData (req, resp, next, "UPDATE accdocdet SET ? WHERE ID = ? ", input, id);

  }
) ;

router.delete ('/acc/v1/docdet/:id' , function(req, resp, next){
 consoleLog('Delete from Rest') ;
 var id = req.params.id ;
 if (id == null|| id =="" || id==undefined) {
     consoleLog("Id not found : ") ;
 }else {
   deleteData(req, resp, next,"DELETE FROM accdocdet WHERE ID = ? ",id ) ;
 }
}
) ;
