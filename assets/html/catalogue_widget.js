function CatalogueWidget(wContainer){
    B.StateSubscriber.call(this);
	this.wList = new B.Strip(B.Strip__Orient__vert, wContainer);
    this.wList._div.className = 'catalogue';
	wContainer.setContent(this.wList);

    this.mapBnPlay = {};//элементы-кнопки "Play" по ключу "id"
    this.mapBnLocal = {};
    this.mapRow = {};

    this._onIndexLoaded(
"[ { \"id\":\"1\", \"title\": \"Moscow calling\" }, { \"id\":\"2\", \"title\": \"All roads\" }, { \"id\":\"3\", \"title\": \"Politics Of Love\" }, { \"id\":\"4\", \"title\": \"Tomorrow\" }, { \"id\":\"5\", \"title\": \"Stranger\" }, { \"id\":\"6\", \"title\": \"Фикситон\" } ]"
    );

    /*setTimeout(function(self){
        return function(){
            B.ajax({
                sourcePath: GLOBAL.url_prefix + 'index.json',
                readyFunc: function(s){self._onIndexLoaded(s);},
                errorFunc: function(s){self._onIndexLoadError(s);}
    });
        };
    }(this), 2000);*/

    /*B.ajax({
        sourcePath: GLOBAL.url_prefix + 'index.json',
        readyFunc: function(self){return function(s){self._onIndexLoaded(s);};}(this),
        errorFunc: function(self){return function(s){self._onIndexLoadError(s);};}(this)
    });*/
    this._currentPlaying = undefined;
}
(function(){
CatalogueWidget.prototype = Object.create(B.StateSubscriber.prototype);
CatalogueWidget.prototype.constructor = CatalogueWidget;
CatalogueWidget.prototype.processStateChanges = function(s){
    if (s.player.playing !== this._currentPlaying){
        var prevId = this._currentPlaying;
        this._currentPlaying = s.player.playing;
        if (prevId){
            //сбрасываем состояние "проигрываемости" соотв. виджету
            var t1, t2;
            t1 = this.mapBnPlay[prevId];
            t2 = this.mapRow[prevId];
            if (t1 && t2)
                this._className_bnPlay(t1._div, t2._div, prevId);
            else
                console.log('epic fail');
        }
        if (s.player.playing){
            //устанавливаем состояние "проигрываемости" соотв. виджету
            //not implemented (until not needed)
        }
    }
    var i, l, o, w, changed = false;
    if (API.canUseLocalStorage()){
        l = s.locality.remove_rem;
        changed |= l.length;
        for (i = 0 ; i < l.length ; i++){
            o = l[i];
            w = this.mapBnLocal[o.id];
            if (!w){
                console.log('epic fail');
                continue;
            }
            this._className_bnSave(w._div, o.id, o.ok ? SAVE_STATUS__NOT_SAVED : SAVE_STATUS__SAVED);
        }
        s.locality.remove_rem = [];
        l = s.locality.save_rem;
        changed |= l.length;
        for (i = 0 ; i < l.length ; i++){
            o = l[i];
            w = this.mapBnLocal[o.id];
            if (!w){
                console.log('epic fail');
                continue;
            }
            this._className_bnSave(w._div, o.id, o.ok ? SAVE_STATUS__SAVED : SAVE_STATUS__NOT_SAVED);
        }
        s.locality.save_rem = [];
        if (changed)
            this._registerStateChanges();
    }
}
CatalogueWidget.prototype._onIndexLoaded = function(result){
    this.mapBnPlay = {};
    this.mapBnLocal = {};
    var list = JSON.parse(result);
    var i, o, t, t1, t2, t3;
    for (i = 0 ; i < list.length ; i++){
        o = list[i];
        t = new B.Strip(B.Strip__Orient__hor, this.wList);
        t._div.className = 'row';
        if (API.canUseLocalStorage()){
            t1 = new B.Widget(t);
            this._className_bnSave(t1._div, o.id, API.fileExists(o.id) ? SAVE_STATUS__SAVED : SAVE_STATUS__NOT_SAVED);
            t1._div.addEventListener('click', function(self, itemId){return function(){self._onBnSaveClicked(itemId)};}(this, o.id));
            t.addItem(t1, '32px');
            this.mapBnLocal[o.id] = t1;
        }

        t1 = new B.Widget(t);
        t1._div.className = 'bn_play';
        t1._div.addEventListener('click', function(self, itemId, eBn, eRow){return function(){self._onBnPlayClicked(itemId, eBn, eRow)};}(this, o.id, t1._div, t._div));
        t.addItem(t1, '32px');
        this.mapBnPlay[o.id] = t1;

        t1 = new B.Widget(t);
        t2 = document.createElement('p');
        t3 = document.createTextNode(o.title);
        t2.appendChild(t3);
        t1.setContent(t2);
        t1._div.className = 'title';
        t.addItem(t1);

        this.wList.addItem(t, '32px');
        this.mapRow[o.id] = t;
    }
}
CatalogueWidget.prototype._onIndexLoadError = function(isNetworkProblem){
    console.log('oops.. it seems to be failed index loading..');
}
CatalogueWidget.prototype._onBnSaveClicked = function(p_id){
    console.log('clicked bnSave '+p_id);
    var wBnSave = this.mapBnLocal[p_id];
    if (!wBnSave){
        console.log('epic fail');
        return;
    }
    this._className_bnSave(wBnSave._div, p_id, SAVE_STATUS__PROCESSING);
    if (API.fileExists(p_id)){
        API.removeFile(p_id);
    }
    else{
        API.saveFile(p_id, GLOBAL.url_prefix + p_id + '.mpeg');
    }
}
CatalogueWidget.prototype._onBnPlayClicked = function(p_id, p_eBn, p_eRow){
    var prevId = this._state.player.playing;
    if (p_id !== prevId){ // stop previous, start new
        this._state.player.playing = p_id;
        if (prevId){
            var t1 = this.mapBnPlay[prevId];
            var t2 = this.mapRow[prevId];
            if (t1 && t2)
                this._className_bnPlay(t1._div, t2._div, prevId);
            else
                console.log('epic fail');
        }
    }
    else{ // stopping current
        this._state.player.playing = undefined;
    }
    this._currentPlaying = this._state.player.playing;
    this._registerStateChanges();
    this._className_bnPlay(p_eBn, p_eRow, p_id);
}
CatalogueWidget.prototype._className_bnPlay = function(p_eBn, p_eRow, p_id){
    if (this._state.player.playing === p_id){
        p_eRow.className = 'row playing';
    }
    else{
        p_eRow.className = 'row';
    }
}
var SAVE_STATUS__NOT_SAVED = 0;
var SAVE_STATUS__SAVED = 1;
var SAVE_STATUS__PROCESSING = 2;
CatalogueWidget.prototype._className_bnSave = function(p_eBn, p_id, status){
    if (status == SAVE_STATUS__NOT_SAVED)
        p_eBn.className = 'bn_local not_saved';
    else if (status == SAVE_STATUS__SAVED)
        p_eBn.className = 'bn_local saved';
    else if (status == SAVE_STATUS__PROCESSING)
        p_eBn.className = 'bn_local processing';
    else
        p_eBn.className = 'bn_local';
}
})();
