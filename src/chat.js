var $ = require('jquery');
var http = require('http');
var puzzleUrl = "https://utakata-umigame.herokuapp.com/puzzles?room="
var crypto = require('crypto');
function fetchData($scope, room){
  http.get(puzzleUrl+room, (res) => {
    let body = '';
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', (res) => {
      res = JSON.parse(body);
      console.log(res);
      var mondai = res.mondai;
      $scope.mondai = mondai||{sender:"-",content:"クリックして問題文を入力"};
      if(mondai!=null){
        $scope.trueAns=mondai.trueAns||"クリックして解説を入力";
      }
      else{
        $scope.trueAns="クリックして解説を入力";
      }
      $scope.currentRoom= room;
      $scope.messages= res.question;
      $scope.privateMessages = res.chat;
      $scope.$apply();
      var elem = document.getElementById('question-area');
      elem.scrollTop = elem.scrollHeight;
    });
  }).on('error', (e) => {
    console.log(e.message); //エラー時
  });
}
var chatController = function ($scope, $routeParams) {
  var room= $routeParams.room;
  $scope.messages = [];
  $scope.privateMessages = [];
  $scope.roster = [];
  $scope.name = '';
  $scope.text = '';
  $scope.answer = '';
  $scope.sender = '';
  $scope.mondai ={
      sender:'',
      content:''
  }
  $scope.ansContent='';
  $scope.publicText='';
  $scope.privateText='';
  $scope.toId=-1;
  $scope.currentRoom='-';
  $scope.isGoodSent = false;
  
  fetchData($scope, room);
  
  $scope.reload = function reload(){
    fetchData($scope, room);
  }
  
  $scope.quit = function quit(){
	location.href = '/';
  }
  /*socket.on('connect', function () {
    $scope.setName();
    socket.emit('join',room);
  });
  socket.on('join', function(roomNum){
    $scope.currentRoom=roomNum;
  });
  socket.on('mondai', function(msg){
    $scope.mondai = msg||{sender:"-",content:"クリックして問題文を入力"};
    $scope.$apply();
  });
  socket.on('trueAns', function(msg){
     $scope.trueAns=msg||"クリックして解説を入力";
     $scope.$apply();     
  });
  socket.on('message', function (msg) {
    $scope.messages=msg;
    $scope.$apply();
    var elem = document.getElementById('question-area');
    elem.scrollTop = elem.scrollHeight;
  });

  socket.on('roster', function (names) {
    $scope.roster = names;
    $scope.$apply();
  });

  socket.on('chatMessage', function(msg){
    $scope.privateMessages.push(msg);
    $scope.$apply();
    var elem = document.getElementById('private-chat-area');
    elem.scrollTop = elem.scrollHeight;
  });
  socket.on('clearChat', function(){
    var privates = $scope.privateMessages.filter(x=>x.private);
    $scope.privateMessages = [];
    privates.forEach(function(item){
        $scope.privateMessages.push(item);
    });
    $scope.$apply();      
    console.log('clear chat');
  });
  socket.on('loadChat', function(msg){
    $scope.privateMessages = [];
    msg.forEach(function(item){
        $scope.privateMessages.push(item);
    });
    $scope.$apply();
  });
  socket.on('redirect', function(msg){
	location.href = '/';
  });
  $scope.sendMondai = function sendMondai(){
    if(window.confirm('問題文が変更されます。続行しますか？')){
      var data = {
		  type:"mondai",
		  content:$scope.content,
		  created_month: new Date().getMonth()+1,
		  created_date:new Date().getDate()
      }
    socket.emit("message",data);
    }
    else{
      window.alert('キャンセルしました。')
    }
  };
  
  $scope.sendTrueAns = function sendTrueAns(){
    if(window.confirm('正解が公開されます。続行しますか？')){
      var data = {
      type:"trueAns",
      content:$scope.ansContent
      }
      socket.emit("message",data);
    }
    else{
      window.alert('キャンセルしました。')
    }

  };
  
  $scope.send = function send() {
    var data = {
      type:"question",
      question:$scope.text,
      answer: "waiting an answer"
    }
    console.log('Sending message:',data);
    socket.emit('message', data);
    $scope.text = '';
  };
  
  $scope.sendAnswer = function sendAnswer() {
    var id = document.getElementById("ques_id_input").value || 0;
    var data = {
      type:"answer",
      answerer: String($scope.name||"Anonymous"),
      id:id,
      answer: $scope.answer
    }
    console.log('Sending message:',data);
    socket.emit('message', data);
    $scope.answer = '';
  };
  $scope.sendPublicMessage = function sendPublicMessage(){
    var data = {
      type:"publicMessage",
      content:$scope.publicText
    }
    console.log('Sending message:', data);
    socket.emit('message', data);
    $scope.publicText='';
  };
  $scope.sendPrivateMessage = function sendPrivateMessage(){
    var data = {
        type:"privateMessage",
        to:document.getElementById("toIdLabel").value,
        content:$scope.privateText
    }
    console.log('Sending message:',data);
    socket.emit('message', data);
    $scope.privateText='';
  };
  $scope.setName = function setName() {
    var doc = $scope.name.split('#');
    if(doc.length ==2){
      var sha1 = crypto.createHash('sha1');
      sha1.update(doc[1]);
      var hash = sha1.digest('hex');
      var txt = doc[0]+ "◆" +window.btoa(hash).substr(1,10);
    }
    else{
      var txt = doc[0];
    }
    socket.emit('identify', txt);
  };
  $scope.fetchData = function fetchData(){
    socket.emit('refresh',null);
  };
  $scope.quit = function quit(){
	socket.emit('disconnect');
	location.href = '/';
  }
  $scope.clearAll = function clearAll(){
    if(window.confirm('問題、質問、回答がすべて消えます。続行しますか？')){
      socket.emit('clear');
    }
    else{
      window.alert('キャンセルしました。');
    }
  };
  $scope.onClick = function onClick(){
    $('.heart-animation').toggleClass('active');
    if(!$scope.isGoodSent){
      socket.emit('good');
      $scope.isGoodSent = true;
    }
  };*/
}

module.exports = chatController;