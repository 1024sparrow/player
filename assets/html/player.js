function Player(){
    B.StateSubscriber.call(this);
    this._local = false;
    this._current = undefined;
    this._eAudio = document.createElement('audio');
    this._eAudio.addEventListener('abort', function(self){return function(){self._onNetwAborted();};}(this));
    this._eAudio.addEventListener('error', function(self){return function(){self._onNetwError();};}(this));
    this._eAudio.addEventListener('ended', function(self){return function(){self._onNetwFinished();};}(this));
}
Player.prototype = Object.create(B.StateSubscriber.prototype);
Player.prototype.constructor = Player;
Player.prototype.processStateChanges = function(s){
    if (s.player.playing === this._current)
        return;
    if (this._current){
        API.stop();
        if (this._local)
            API.stop();
        else{
            //stop
            this._eAudio.src = undefined;
        }
    }
    if (s.player.playing){
        this._current = s.player.playing;
        this._local = API.fileExists(this._current);
        if (this._local)
            API.play();
        else{
            //play
            this._eAudio.src = GLOBAL.url_prefix + this._current + '.mpeg';
            this._eAudio.play();
        }
    }
    else{
        this._current = undefined;
        this._local = false;
    }
}
Player.prototype._registerPlaybackFinished = function(){
    this._state.player.playing = undefined;
    this._registerStateChanges();
}
Player.prototype._onNetwAborted = function(){
    this._registerPlaybackFinished();
}
Player.prototype._onNetwError = function(){
    this._registerPlaybackFinished();
}
Player.prototype._onNetwFinished = function(){
    this._registerPlaybackFinished();
}
