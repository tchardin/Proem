
bs = require('blockstack');



var db = openDatabase('myDatabase', '1.0', 'myDatabase', 10000000);


bs.getFile('bitfinex.db'):

processQuery(db, 2, response.split(';\n'), 'myDatabase');
$.get('bitfinex.sql', function(response) {
  // console.log("got db dump!", response);

});


function processQuery(db, i, queries, dbname) {
    if(i < queries.length -1) {
      console.log(i +' of '+queries.length);
      if(!queries[i+1].match(/(INSERT|CREATE|DROP|PRAGMA|BEGIN|COMMIT)/)) {
        queries[i+1] = queries[i]+ ';\n' + queries[i+1];
         return processQuery(db, i+1, queries, dbname);
      }
      console.log('------------>', queries[i]);
      db.transaction( function (query){
        query.executeSql(queries[i]+';', [], function(tx, result) {
          processQuery(db, i +1, queries,dbname);
        });
      }, function(err) {
      console.log("Query error in ", queries[i], err.message);
      processQuery(db, i +1, queries, dbname);
      });
  } else {
      console.log("Done importing!");
  }
}
