var scriptFiles = ['js/common.js', 'lib/jszip/jszip.js'];

var badge = {}
badge.tabId = null;
badge.bgColor = [21, 158, 221, 255];
badge.text = '';
badge.setText = function(string) {
    this.text = string;
    return this;
};
badge.setTabId = function(tabId) {
    this.tabId = tabId;
    return this;
};
badge.setBgColor = function(color) {
    this.bgColor = color;
    return this;
};
badge.render = function() {
    chrome.browserAction.setBadgeText({text: this.text, tabId: this.tabId});
    chrome.browserAction.setBadgeBackgroundColor({color: this.bgColor, tabId: this.tabId});
};

chrome.webRequest.onCompleted.addListener(function (details) {
    if (details.method == 'HEAD' && details.statusCode == 200) {
        for (var i in scriptFiles) {
            chrome.tabs.executeScript(details.tabId, {file: scriptFiles[i]});
        }
        chrome.tabs.executeScript(details.tabId, {file: 'lib/gifjs/gif.js'}); // Load gif.js lib
        chrome.tabs.executeScript(details.tabId, {file: 'lib/whammy.js'}); // Load whammy lib
        chrome.tabs.executeScript(details.tabId, {file: 'js/ugoira.js'}); // Load logic ugoira
    }
}, {
    urls: [
        "*://*.pximg.net/img-zip-ugoira/img/*/*/*/*/*/*/*_ugoira*.zip"
    ]
});

chrome.webRequest.onCompleted.addListener(function(details) {
    if (details.frameId == 0) {
        for (var i in scriptFiles) {
            chrome.tabs.executeScript(details.tabId, {file: scriptFiles[i]});
        }
        chrome.tabs.executeScript(details.tabId, {file: 'js/manga.js'});
    }
}, {urls: ["*://*.pixiv.net/member_illust.php?mode=manga&illust_id=*"]});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    var string = null;
    if (message.from == 'pixivContentScript' && message.to == 'background') {
        // console.log(message.step);
        switch (message.step) {
            case 'download':
                string = 'D' + (message.p == undefined ? '' : message.p);
                break;
            case 'prepare':
                string = message.step.substr(0, 1).toUpperCase();
                break;
        }
        badge.setTabId(sender.tab.id).setText(string).setBgColor([21, 158, 221, 255]).render();
    }
});