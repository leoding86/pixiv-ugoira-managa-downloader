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

var injectScripts = function(tabId, injectDetails, i) {
    var i = i === undefined ? 0 : i;
    var injectDetail = injectDetails[i];

    if (injectDetail) {
        chrome.tabs.executeScript(tabId, injectDetail, function() {
            injectScripts(tabId, injectDetails, ++i);
        });
    }
}

chrome.webRequest.onCompleted.addListener(function (details) {
    if (details.method == 'HEAD' && details.statusCode == 200) {
        var injectDetails = [];

        scriptFiles.forEach(function(file) {
            injectDetails.push({
                file: file
            });
        });

        [
            'lib/gifjs/gif.js',
            'lib/whammy.js',
            'js/ugoira.js',
            'js/UgoiraAdapter.js',
            'js/180607/ugoira.js'
        ].forEach(function(file) {
            injectDetails.push({
                file: file
            });
        });

        setTimeout(function() {
            injectScripts(details.tabId, injectDetails);
        }, 300);
    }
}, {
    urls: [
        "*://*.pximg.net/img-zip-ugoira/img/*/*/*/*/*/*/*_ugoira*.zip"
    ]
});

chrome.webRequest.onCompleted.addListener(function(details) {
    if (details.frameId === 0 && details.statusCode === 200) {
        var injectDetails = [];

        scriptFiles.forEach(function(file) {
            injectDetails.push({
                file: file
            });
        });

        injectDetails.push({
            file: 'js/manga.js'
        });

        setTimeout(function() {
            injectScripts(details.tabId, injectDetails);
        }, 300);
    }
}, {urls: ["*://*.pixiv.net/member_illust.php?mode=manga&illust_id=*"]});

chrome.webRequest.onCompleted.addListener(function(details) {
    if (details.frameId === 0) {
        console.log('Load noval app');

        scriptFiles.forEach(function(scriptFile) {
            chrome.tabs.executeScript(details.tabId, {file: scriptFile});
        })

        chrome.tabs.executeScript(details.tabId, {file: 'lib/js-epub-maker/js-epub-maker.min.js'});
        chrome.tabs.executeScript(details.tabId, {file: 'js/NovalAdapter.js'});
        chrome.tabs.executeScript(details.tabId, {file: 'js/190115/Noval.js'});
    }
}, {
    urls: ["*://*.pixiv.net/novel/show.php?id=*"]
});

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

function readPackageFile(path, callback) {
    chrome.runtime.getPackageDirectoryEntry(function (directoryEntry) {
        directoryEntry.getFile(path, undefined, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader;
                reader.addEventListener("load", function (event) {
                    callback(reader.result);
                });
                reader.readAsText(file);
            });
        });
    });
}

console.log('start boot')
readPackageFile('manifest.json', function (result) {
    var manifest = JSON.parse(result);
    var version = manifest.version;

    // Inital settings
    chrome.storage.local.get(null, function (items) {
        console.log('version check');
        if (items.version === undefined ||
            versionCompare(items.version, version) < 0
        ) {
            var defaultSettings = {
                version: version,
                enableExtend: false,
                enableWhenUnderSeconds: 1,
                extendDuration: 3,

                ugoiraRenameFormat: '',
                mangaRenameFormat: '',
                mangaImageRenameFormat: ''
            };

            /**
             * setting key need to be removed after settings updated
             */
            var settingsNeedRemoved = [
                'metasConfig',
                'mangaMetasConfig',
                'mangaImageNamePrefix',
                'mangaImagesMetasConfig'
            ];

            /**
             * Update settings
             */
            if (items.mangaMetasConfig) {
                items.mangaRenameFormat = '';

                items.mangaMetasConfig.forEach(function(meta) {
                    if (!!meta.enable) {
                        switch (meta.value) {
                            case 'id':
                            case 'authorId':
                                items.mangaRenameFormat += '_{' + meta.value + '}';
                        }
                    }
                });

                if (items.mangaRenameFormat.indexOf('_') === 0) {
                    items.mangaRenameFormat = items.mangaRenameFormat.slice(1);
                }
            }

            if (items.mangaImagesMetasConfig) {
                items.mangaImageRenameFormat = '';

                items.mangaImageRenameFormat.forEach(function(meta) {
                    if (!!meta.enable) {
                        switch (meta.value) {
                            case 'id':
                            case 'authorId':
                            items.mangaImageRenameFormat += '_{' + meta.value + '}';
                        }
                    }
                });

                if (items.mangaImageRenameFormat.indexOf('_') === 0) {
                    items.mangaImageRenameFormat = items.mangaImageRenameFormat.slice(1);
                }

                if (items.mangaImageNamePrefix) {
                    items.mangaImageRenameFormat = items.mangaImageNamePrefix + items.mangaImageRenameFormat;
                }
            }

            if (items.metasConfig) {
                items.ugoiraRenameFormat = '';

                items.metasConfig.forEach(function(meta) {
                    if (!!meta.enable) {
                        switch (meta.value) {
                            case 'id':
                            case 'authorId':
                            case 'title':
                            case 'author':
                                items.ugoiraRenameFormat += '_{' + meta.value + '}';
                        }
                    }
                });

                if (items.ugoiraRenameFormat.indexOf('_') === 0) {
                    items.ugoiraRenameFormat = items.ugoiraRenameFormat.slice(1);
                }
            }

            /**
             * Update settings end ^^^
             */

            /**
             * Remove useless settings
             */
            chrome.storage.local.remove(settingsNeedRemoved);

            /**
             * Merge settings
             */
            Object.keys(defaultSettings).forEach(function (key) {
                if (undefined === items[key]) {
                    items[key] = defaultSettings[key];
                }
            });

            items.version = version; // update version

            chrome.storage.local.set(items, function () {
                // Do nothing;
            });

            console.log('updated');
        }

        console.log('booted');
    });
});
