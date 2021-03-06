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
  socketPath: '/var/run/mysqld/mysqld.sock',
  multipleStatements:true,
});
connection.connect();


var openid='';
var table_name='';
var exactDate='';
var table_name='';

app.post('/start',function(req,res){

    req.on('data',function(data){
    	var chunk = "";
    	chunk += data;
    	var dataJson=JSON.parse(chunk);
    	console.log('openid of the host：'+ dataJson.openid); 
    	openid=dataJson.openid;
    	var firstKeyWord=dataJson.keyWord1;
    	var nowDate=new Date();
    	var exactDate=nowDate.toLocaleDateString()+" "+nowDate.toLocaleTimeString();
    	table_name = 's'+exactDate+'/'+ openid;
    	
    	//create a table for the sentences
    	var createTable="create table ?? (id int primary key auto_increment, sentence varchar(255), keyWord varchar(255), writerid varchar(255), nickName varchar(255), avatarUrl varchar(255)) CHARACTER SET=utf8mb4";
    	connection.query(createTable, [table_name], function(err,result){
           if (err) throw err;
    		console.log('New story created successfully!');
         })

    	//record this event
    	connection.query('insert into event (openid, time) values (?,?)', [openid,exactDate], function(err,result){
    		 if (err) throw err;
    		console.log('event recorded!');
    	})

      var arr=[];
      arr[0]=table_name;
      res.send(arr);
      res.end();
    });
})

app.post('/insert',function(req,res){
   
    req.on('data',function(data){
          var chunk='';
	  chunk += data;
          var dataJson=JSON.parse(chunk);
        
          var newSentence=dataJson.sentence1;
          var nextKeyWord=dataJson.nextKeyWord;
          var table_name=dataJson.tableName;
	  console.log('get table_name: '+table_name);

	  var StringDecoder = require('string_decoder').StringDecoder;
          var d = new StringDecoder('utf8');
          var b = Buffer(table_name);
	  var table_name=d.write(b);		
          console.log('write buffer table nema:'+b); //write buffer
          // write decoded buffer;
          console.log('decoded table name: '+table_name);
	  var writerid=dataJson.writerid;
	  var nickName=dataJson.nickName;
	  var avatarUrl=dataJson.avatarUrl;

          new Promise(function(resolve,reject)
          {
                connection.query('select writerid from ?? order by id desc limit 1', [table_name],function(err,result){
                  if (err) throw err;
                  console.log('writerid selected:'+result)
                  if (result.length==0||result[0].writerid!=writerid){
                      resolve();
                  }else{
                      reject();
                  }
                })
          }).then(function(){
                connection.query('insert into ?? (sentence, keyWord, writerid, nickName, avatarUrl) values (?,?,?,?,?)', [table_name, newSentence, nextKeyWord, writerid, nickName, avatarUrl], function(err,result){
                  if (err) throw err;
                  console.log('New sentence inserted successfully!');
                  res.send('inserted');
                  res.end();
                })
            }).catch(function(){
                res.send('repetitive');
                res.end();
          })
    })
})



app.get('/show',function(req,res){
  var table_name=req.query.tableName;
  console.log('on show: '+table_name);

  var arr=[];
  var lastKeyWord='';

  new Promise(function(resolve, reject){
    connection.query('select sentence, nickName, avatarUrl, keyWord from ??', [table_name], function(err,results){
        if (err) throw err;
	console.log('story: '+results)
        for (var i=0;i<results.length;i++){
          arr[i]=results[i];
        }
        connection.query('select keyWord from ?? order by id desc limit 1', [table_name], function(err,result){
          if (err) throw err;
          if (result.length!=0){
            lastKeyWord=result[0];
            console.log('Assigned keyWord: '+lastKeyWord.keyWord)
            arr[results.length]=lastKeyWord;
          }
          resolve(arr)
        })
    })
  }).then(function(arr){
        res.send(arr);
        res.end();
  })
})



var listenPort = process.argv[2];
console.log('Server running on '+ listenPort + '...');

var server = app.listen(listenPort, function () {   
  var host = server.address().address
  var port = server.address().port
  console.log("Address visited: http://%s:%s", host, port)
})
