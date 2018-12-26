var version = '1.7';
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
        chrome.tabs.executeScript(details.tabId, {file: 'js/ugoira.js'}); // Load elder ugoira
        chrome.tabs.executeScript(details.tabId, {file: 'js/UgoiraAdapter.js'}) // Ugoria adapter
        chrome.tabs.executeScript(details.tabId, {file: 'js/180607/ugoira.js'}); // new version ugoria js
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

function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

// Inital settings
chrome.storage.local.get(null, function (items) {
    console.log('boot up', items);
    if (items.version === undefined ||
        versionCompare(items.version, version) < 0
    ) {
        var defaultSettings = {
            version: version,
            enableExtend: false,
            enableWhenUnderSeconds: 1,
            extendDuration: 3,
            mangaImageNamePrefix: ''
        };

        var settingsNeedRemoved = {}

        Object.keys(defaultSettings).forEach(function (key) {
            if (undefined === items[key]) {
                items[key] = defaultSettings[key];
            }
        });

        items.version = version; // update version

        chrome.storage.local.set(items, function () {
            // Do nothing;
        });
    }
});
