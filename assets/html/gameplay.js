//https://duckduckgo.com/?q=android+interaction+with+webview&t=h_&ia=qa
//https://developer.android.com/reference/android/webkit/WebView.html
//https://developer.android.com/guide/webapps/webview.html

var wRoot = new B.Strip(B.Strip__Orient__vert);
//var wTitle = new B.Widget(wRoot);
//wTitle.setContent(undefined, '#024');
//wRoot.addItem(wTitle, '64px');
var wBody = new B.Stack(wRoot);
	var wCatalogue = new B.Widget(wBody);
	wCatalogue.setContent(undefined, '#888');
	wBody.addItem(wCatalogue);
wRoot.addItem(wBody);
//var wPlayer = new B.Widget(wRoot);
//wPlayer.setContent(undefined, '#400');
//wRoot.addItem(wPlayer, '64px');

var init_state = {
    tracks_all: undefined,
	player: {
        playing: undefined
    },
    locality:{
        save_add:[], // added save tasks; [{id: .. , path: ..}, ...]
        save_rem:[], // taken save task responds (i.e. removed save tasks); [{id: .. , ok: false, errorMessage: ..}, ...]
        remove_add:[], // analogous for remove tasks; [1, 2, 4, ...]
        remove_rem:[] // ; [{id: .. , ok: false, errorMessage: ..}, ...]
    }
};

var p = new B.StatePublisher();
p.setState(init_state);
p.registerSubscriber(new CatalogueWidget(wCatalogue));
p.registerSubscriber(new Player());
p.registerSubscriber(new ApiListener());
