// JavaScriptInterface jsInterface = new JavaScriptInterface(this);
// webView.getSettings().setJavaScriptEnabled(true);
// webView.addJavascriptInterface(jsInterface, "JSInterface");

/*
public class JavaScriptInterface {
    private Activity activity;

    public JavaScriptInterface(Activity activiy) {
        this.activity = activiy;
    }

    public void startVideo(String videoAddress){
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(Uri.parse(videoAddress), "video/3gpp"); 
        activity.startActivity(intent);
    }
}
*/
/*<video width="320" height="240" controls="controls" poster='poster.gif'
       onclick="window.JSInterface.startVideo('file:///sdcard/test.3gp');" >
   Your browser does not support the video tag.
</video>*/

//http://paul.oremland.net/2015/02/android-webview-interacting-with-web.html -- call JavaScript code from JAVA

var API;
if (!API){
    API = {
        // to call from JS
        canUseLocalStorage:function(){return false},//i.e. I am app, not web-site.
        fileExists: function(id){
            console.log('fileExists');
            return false;
        },
        saveFile: function(id, path){
            console.log('saveFile');
            //setTimeout(function(){console.log('qq');}, 2000);
            setTimeout(function(self, id){return function(){self.fileRemoved(id, true);};}(this, id), 2000);
        },
        removeFile: function(id){
            console.log('removeFile');
        },
        play: function(id){
        },
        stop: function(){
        },
        /*filterAjax: function(p){ // bool ajax(). p - as in B.ajax(p). If return false, network request will follow.
            if (p.sourcePath == (GLOBAL.url_prefix + 'index.json')){
                //
            }
        },*/

    }
}
// to call from JAVA
API.fileSaved = function(id, ok, errorMessage){
},
API.fileRemoved = function(id, ok, errorMessage){
},
API.playbackFinished = function(id){
}
