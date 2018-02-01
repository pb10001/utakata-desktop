var $ = require('jquery');
var http = require('http');
var puzzleUrl = "http://localhost:5000";
//var puzzleUrl = "https://utakata-umigame.herokuapp.com";
var crypto = require('crypto');
function reflectResponse($scope, room,res){
  //戻り値を画面に反映する
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
}
function fetchData($scope, room){
  //チャット画面を読み込む
  http.get(puzzleUrl+'/puzzles?room='+room, (res) => {
    reflectResponse($scope, room, res);
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
  $scope.sendMondai = function sendMondai(){
    if(window.confirm('問題文が変更されます。続行しますか？')){
      http.get(puzzleUrl+"/puzzles/update?name="+$scope.name+"&room="+room+"&content="+$scope.content, (res)=>{
      }).on('error', (e) => {
        console.log(e.message); //エラー時
      });
    }
    else{
      window.alert('キャンセルしました。')
    }
  };

  $scope.sendTrueAns = function sendTrueAns(){
    if(window.confirm('正解が公開されます。続行しますか？')){
      http.get(puzzleUrl+"/puzzles/update?name="+$scope.name+"&room="+room+"&trueAns="+$scope.ansContent, (res)=>{
      }).on('error', (e) => {
        console.log(e.message); //エラー時
      });
    }
    else{
      window.alert('キャンセルしました。')
    }

  };
  $scope.send = function send() {
    if($scope.text != ''){
      http.get(puzzleUrl + "/puzzles/update?name="+$scope.name+"&room=" + room + "&question=" + $scope.text, (res)=>{
      }).on('error', (e)=> {
        console.log(e.message);
      });
    }
  };

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

chatComponent = {
  template:[
    '<div>',
 ' <div class="container-fluid">',
 '   <div class= "col-xs-12 col-sm-8 col-md-9">',
 '     <div class="row">',
 '       <div>',
'          <div class="panel-body multiline-box">',
'            <a class="clear-deco"><p data-toggle="collapse" href="#mondai-input" id="mondai-text" class="pre-line primary-text">{{mondai.content}}</p></a>',
 '           <div class="row">',
  '            <div class="col-xs-9">',
 '               <p data-toggle="collapse" id="sender-text" class="secondary-text">出題者:{{mondai.sender}}</p>',
 '               <p data-toggle="collapse" id="sender-text" class="secondary-text">出題日:{{mondai.created_month}}月{{mondai.created_date}}日</p>',
  '            </div>',
   '         </div>',
     '       <form class="collapse" id="mondai-input" ng-submit="sendMondai()">',
   '           <textarea class="form-control" placeholder="Content" ng-model="content"></textarea><br>',
    '          <input class="btn warning-btn btn-danger" type="submit" value="Start a New Soup">',
 '           </form>',
    '      </div>',
  '      </div>',
 '     </div>',
  '    <div class="row">',
  '      <div>',
     '     <div id="question-area" class ="chat-area">',
   '         <div class= "row chat-row" ng-repeat="msg in messages">',
     '         <div class="col-xs-12 col-md-7">',
  '              <div class="chat-box">',
      '            <button class="btn chat-id-button" ng-bind="msg.questionNum" name= "{{msg.id}}" onClick="document.getElementById("id_input").value=this.textContent; document.getElementById("ques_id_input").value = this.name; document.answerForm.answerBox.focus();"></button>',
      '            <small class="secondary-text" ng-bind="msg.name"></small>',
    '              <span class="primary-text message-text" ng-bind="msg.text"></span>',
     '           </div>',
  '            </div>',
     '         <div class="col-xs-12 col-md-5">',
 '               <div class="chat-box">',
     '             <small class="secondary-text" ng-bind="msg.answerer"></small>',
    '              <span class="primary-text message-text" ng-bind="msg.answer"></span>',
    '            </div>',
  '            </div>',
  '          </div>',
  '        </div>',
  '      </div>',
  '    </div>',
  '    <div class="row">',
  '      <div class="controls panel">',
  '        <div class="row control-row">',
  '          <form ng-submit="send()">',
  '            <div class ="input-append">',
  '              <input type="text" class="form-control" ng-model="text" placeholder="Question">',
  '              <input type="submit" class="btn btn-default" value="Send">',
  '            </div>',
  '          </form>',
  '        </div>',
  '        <div class="row control-row">',
  '          <form ng-submit="sendAnswer()" name="answerForm">',
  '            <div class="input-append">',
  '              <input type="number" min=1 id="id_input" class="form-control" ng-model="id" placeholder="Id">',
  '              <div style="display:none;" id="ques_id_input"></div>',
  '              <input type="text" class="form-control" ng-model="answer" placeholder="Answer" name="answerBox">',
  '              <input type="submit" class="btn btn-default" value="Send">',
  '            </div>',
  '          </form>',
  '        </div>',
  '      </div>',
  '    </div>',
  '    <div class="row">',
  '      <div>',
  '        <div class="multiline-box panel-body">',
  '          <a class="clear-deco"><p id="trueAns-text" data-toggle="collapse" href="#trueAns-input" class="pre-line primary-text" ng-bind="trueAns"></p></a>',
  '          <form class="collapse" id="trueAns-input" ng-submit="sendTrueAns()">',
  '            <textarea class="form-control" placeholder="True answer" ng-model="ansContent"></textarea><br>',
  '            <input class="btn warning-btn btn-danger" type="submit" value="Put the True Answer">',
  '          </form>',
  '        </div>',
  '      </div> ',
  '    </div>',
  '  </div>',
  '  <div>',
  '    <div class="right-controls col-xs-12 col-sm-4 col-md-3">',
  '      <div class="panel">',
  '        <div class="panel-heading">',
  '          <div class="panel-text">',
  '          部屋',
  '          </div>',
  '        </div>',
  '        <div class="panel-body">',
  '          <div class="row select-row">',
  '            <form ng-submit="void(0)">',
  '              <label>現在の部屋: {{currentRoom}}</label>',
  '              <div class="row control-row">',
  '                <input id="name-box" type="text" class="form-control" ng-model="name" ng-change="setName()" placeholder="Your Name">',
  '              </div>',
  '            </form>',
  '            <form class="wide-button" ng-submit="reload()">',
  '              <input class="btn btn-default" type="submit" value="更新する">',
  '            </form>',
  '            <form class="wide-button">',
  '              <a class="btn btn-default" type="submit" ng-href ="/">退室する</a>',
  '            </form>',
  '            <form class="wide-button" ng-submit="clearAll()">',
  '              <input class="btn warning-btn btn-danger" type="submit" value="Clear This Room">',
  '            </form>',
  '          </div>',
  '        </div>',
  '      </div>',
  '      <div class="users-row">',
  '       <div class="panel user-list">',
  '          <div class="panel-heading">',
  '            <div class="panel-text">',
  '            ユーザー一覧',
  '            </div>',
  '          </div>',
  '          <div class="panel-body">',
  '            <ul>',
  '              <li style="list-style:none;" ng-repeat="user in roster">',
  '                <button class="btn transparent" value="{{user.id}}" name="{{user.name}}" data-toggle="modal" data-target="#sampleModal" onclick="document.getElementById("toIdLabel").value= this.value;document.getElementById("toIdLabel").textContent= this.name;">',
  '                <span ng-bind="user.name"></span>',
  '                </button>',
  '              </li>',
  '            </ul>',
  '          </div>',
  '        </div>',
  '        <div class="panel">',
  '          <div class= "panel-heading">',
  '            <div class="panel-text">',
  '            チャット',
  '            </div>',
  '          </div>',
  '          <div class= "panel-body">',
  '            <div class="row chat-row input-append">',
  '              <form ng-submit="sendPublicMessage()">',
  '                <input type="text" class="form-control" ng-model="publicText" placeholder="Send message to all">',
  '                <input type="submit" class="btn btn-default" value="Send">',
  '              </form>',
  '            </div>',
  '            <div id="private-chat-area">',
  '              <div class="row chat-row" ng-repeat="msg in privateMessages">',
  '                <div class="chat-box private-chat">',
  '                  <small class="secondary-text">{{msg.sent_from}}→{{msg.sent_to}}</small>',
  '                  <span ng-bind="msg.content"></span>',
  '                </div>',
  '              </div>',
  '            </div>',
  '          </div>',
  '        </div>',
  '      </div>',
  '    </div>',
  '  </div>',
  '</div>',
'</div>',
  ].join(''),
  controller: chatController
};
module.exports = chatComponent;
