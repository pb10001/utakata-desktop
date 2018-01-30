function enterController(){
  this.roomName = '';
}
module.exports = {
	template: ['<h3 class="sawarabi">チャットをはじめる</h3>',
        '<div class="input-append">',
			  '<input ng-model="$ctrl.roomName" class="form-control" placeholder="Room Name">',
			  '<a class="btn btn-default" ng-href="/mondai/{{$ctrl.roomName}}">新規作成/入室</a>',
		      '</div>'].join(''),
  controller: enterController
};
