package ru.traliva.player;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.JavascriptInterface;
import android.graphics.Bitmap;
import android.net.Uri;
import java.io.IOException;

/*public class MyApplication extends Application {
    private static Context context;

    public void onCreate() {
        super.onCreate();
        MyApplication.context = getApplicationContext();
    }
    public static Context getAppContext() {
        return MyApplication.context;
    }
}*/

public class MainActivity extends Activity {
    private WebView eWebView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        eWebView = (WebView)findViewById(R.id.e_webview);
        //WebView eWebView = new WebView(this);
        eWebView.setWebViewClient(new Proxy());
        eWebView.getSettings().setJavaScriptEnabled(true);
        eWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

        //eWebView.addJavascriptInterface(new JsApi(), "API");//<-----------

        eWebView.loadUrl("http://player.traliva.ru");
        //eWebView.loadUrl("file:///android_asset/html/index.html");
        //setContentView(eWebView);
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event)
    {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && eWebView.canGoBack()) {
            eWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    //http://www.technotalkative.com/android-webviewclient-example/
    public class Proxy extends WebViewClient
    {
        /*
        Uri urlIndex,
            urlCssStyle,
            urlJsPredefined,
            urlJsApi,
            urlJsTraliva,
            urlJsCatalogueWidget,
            urlJsPlayer,
            urlJsApilistener,
            urlJsGameplay;
        */

        public Proxy() {
            /*
            urlIndex = new Uri("http://player.traliva.ru");
            urlCssStyle = new Uri("http://player.traliva.ru/css/style.css");
            urlJsPredefined = new Uri("http://player.traliva.ru/predefined.js");
            urlJsApi = new Uri("http://player.traliva.ru/api.js");
            urlJsTraliva = new Uri("http://player.traliva.ru/traliva.js");
            urlJsCatalogueWidget = new Uri("http://player.traliva.ru/catalogue_widget.js");
            urlJsPlayer = new Uri("http://player.traliva.ru/player.js");
            urlJsApilistener = new Uri("http://player.traliva.ru/apilistener.js");
            urlJsGameplay = new Uri("http://player.traliva.ru/gameplay.js");
            //urlIndex = new Uri();
            //
            */
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            // TODO Auto-generated method stub
            super.onPageStarted(view, url, favicon);
        }
 
        /*@Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {//deprecated -- look at here: https://developer.android.com/reference/android/webkit/WebViewClient.html#shouldOverrideUrlLoading(android.webkit.WebView,%20android.webkit.WebResourceRequest)
            return false;
 
            //view.loadUrl(url);
            //return true;
        }*/
        //public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request){
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request){
            String url = request.getUrl().getPath();
            url = url.replaceFirst("http://player.traliva.ru/", "html/");
            String mimeType = "text/html";
            if (url.matches("\\.html$"))
                mimeType = "text/html";
            else if (url.matches("\\.css$"))
                mimeType = "text/css";
            else if (url.matches("\\.json$"))
                mimeType = "text/plain";
            else if (url.matches("\\.gif$"))
                mimeType = "image/gif";
            else if (url.matches("\\.png$"))
                mimeType = "image/png";
            try{
                return new WebResourceResponse(mimeType, "utf8", getAssets().open(url));
            }
            catch (IOException e){
            }
            return super.shouldInterceptRequest(view, request);
        }

        /*public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request){
            return super.shouldInterceptRequest(view, request);
        }*/
    }

    /*public class JsApi {
        String filesPath;
        //HttpLoader httpLoader;

        public JsApi() {
            filesPath = "";
            //httpLoader = new HtpLoader();
        }
        @JavascriptInterface
        public boolean canUseLocalStorage() {return true;}
        @JavascriptInterface
        public boolean fileExists(String id){return false;}
        @JavascriptInterface
        public void saveFile(String id, String url){}
        @JavascriptInterface
        public void removeFile(String id){}
        @JavascriptInterface
        public void play(String id){}
        @JavascriptInterface
        public void stop(){}
    }*/
}
