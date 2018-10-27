//create a new table. The name of the new table is 'openid of the user'+'time when this called'
//insert the information of this event into table event 

var express=require('express');
var mysql=require('mysql');
var app=express();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Wangyl@2011',
  database : 'xuxu',
  socketPath: '/tmp/mysql.sock',
  multipleStatements:true,
});
connection.connect();

app.post('/start',function(req,res){

	var chunk = "";
	var openid='';
	var table_name='';
	var exactDate='';

    req.on('data',function(data){
    	chunk += data;
    	var dataJson=JSON.parse(chunk);
    	console.log('openid of the user：'+ dataJson.openid); 
    	openid=dataJson.openid;
    	var nowDate=new Date();
    	var exactDate=nowDate.toLocaleDateString()+" "+nowDate.toLocaleTimeString();
    	table_name = exactDate+' '+ openid;
    	
    	console.log('Name of the table:'+ table_name);
    	
    	var createTable="create table ?? (firstSentence varchar(255), secondSentence varchar(255), thirdSentence varchar(255))";

    	connection.query(createTable, [table_name], function(err,result){
           if (err) throw err;
    		console.log('table created successfully!');
         })

    	connection.query('insert into event (openid, time) values (?,?)', [openid,exactDate], function(err,result){
    		 if (err) throw err;
    		console.log('event recorded!');
    	})

    });

    res.writeHead(200,{"ContentType":"application/json;charset=utf-8"});
    res.end();

})

console.log('Server running on 8084...');

var server = app.listen(8084, function () {   
  var host = server.address().address
  var port = server.address().port
  console.log("Address visited: http://%s:%s", host, port)
})
