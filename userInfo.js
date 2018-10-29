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


var openid='';
var table_name='';
var exactDate='';
var table_name_sentence='';
var table_name_keyWord='';

app.post('/start',function(req,res){

    req.on('data',function(data){
    	var chunk = "";
    	chunk += data;
    	var dataJson=JSON.parse(chunk);
    	console.log('openid of the user：'+ dataJson.openid); 
    	openid=dataJson.openid;
    	var firstKeyWord=dataJson.keyWord1;
    	var nowDate=new Date();
    	var exactDate=nowDate.toLocaleDateString()+" "+nowDate.toLocaleTimeString();
    	table_name_sentence = 'sentence_'+exactDate+' '+ openid;
    	table_name_keyWord = 'keyWord_'+exactDate+' '+ openid;
    	
    	//create a table for the sentences
    	var createTable="create table ?? (id int primary key auto_increment, sentence varchar(255))";
    	connection.query(createTable, [table_name_sentence], function(err,result){
           if (err) throw err;
    		console.log('table for sentences created successfully!');
         })

    	//create a table for the key words
    	var createTable="create table ?? (id int primary key auto_increment, keyWord varchar(255))";
    	connection.query(createTable, [table_name_keyWord], function(err,result){
           if (err) throw err;
    		console.log('table for key words created successfully!');
         })


    	//record this event
    	connection.query('insert into event (openid, time) values (?,?)', [openid,exactDate], function(err,result){
    		 if (err) throw err;
    		console.log('event recorded!');
    	})

    	//insert first key word;
    	connection.query('insert into ?? (keyWord) values (?)', [table_name_keyWord, firstKeyWord], function(err,result){
    		 if (err) throw err;
    		console.log('First key word recorded!');
    	})

      var arr=[];
      arr[0]=table_name_keyWord;
      arr[1]=table_name_sentence;
      res.send(arr);

      res.end();
    });
})

app.post('/insert',function(req,res){
    var chunk = "";
   
    req.on('data',function(data){
    chunk += data;
    var dataJson=JSON.parse(chunk);

    var newSentence=dataJson.sentence1;
    var nextKeyWord=dataJson.nextKeyWord;
    var table_name_sentence=dataJson.tableNameSentence;
    var table_name_keyWord=dataJson.tableNameKeyWord;

    connection.query('insert into ?? (sentence) values (?)', [table_name_sentence, newSentence], function(err,result){
    	if (err) throw err;
    		console.log('New sentence inserted successfully!');
    })

    connection.query('insert into ?? (keyWord) values (?)', [table_name_keyWord, nextKeyWord], function(err,result){
    	if (err) throw err;
    		console.log('Next key word inserted successfully!');
    })

    console.log(dataJson.sentence1); 
    });

    res.writeHead(200,{"ContentType":"application/json;charset=utf-8"});
    res.end();
})


var arrSentences=[];
app.get('/show',function(req,res){
  var table_name_keyWord=req.query.tableNameKeyWord;
  console.log(table_name_keyWord);
	connection.query('select keyWord from ??', [table_name_keyWord], function(err,results){
		if (err) throw err;
		for (var i=0;i<results.length;i++){
  		arrSentences[i]=results[i];
  		console.log('key word selected:'+ arrSentences);

 
    	res.send(arrSentences);	
      res.end();
  }
	})
})



console.log('Server running on 8084...');

var server = app.listen(8084, function () {   
  var host = server.address().address
  var port = server.address().port
  console.log("Address visited: http://%s:%s", host, port)
})
