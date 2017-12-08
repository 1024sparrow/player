function ApiListener(){
    B.StateSubscriber.call(this);
    var self = this;
    API.fileSaved = function(id, ok, errorMessage){
        self._state.locality.save_rem = [{id:id, ok:ok, errorMessage:errorMessage}];
        self._registerStateChanges();
    }
    API.fileRemoved = function(id, ok, errorMessage){
        self._state.locality.remove_rem = [{id:id, ok:ok, errorMessage:errorMessage}];
        self._registerStateChanges();
    }
    API.playbackFinished = function(id){
        self._state.player.playing = undefined;
        self._registerStateChanges();
    }
    //API.fileSaved = function(id)
}
ApiListener.prototype = Object.create(B.StateSubscriber.prototype);
ApiListener.prototype.constructor = ApiListener;
ApiListener.prototype.processStateChanges = function(s){
    var i = 0, l;
    l = s.locality.remove_add;

    for (i = 0 ; i < l.length ; i++){
        API.removeFile(l[i]);
    }
    s.locality.remove_add = [];

    l = s.locality.save_add;
    for (i = 0 ; i < l.length ; i++){
        API.saveFile(l[i]);
    }
    s.locality.save_add = [];
}
