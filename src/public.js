function publicController(){
  this.roomName = 'Public';
}
module.exports = {
  template:'<a class="btn btn-default" ng-href="/mondai/{{$ctrl.roomName}}">Publicルームへ</a>',
  controller: publicController
};
