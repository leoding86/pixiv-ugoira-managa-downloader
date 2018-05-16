(function(common, button) {
    var pixivContext = common.getTargetPageVar('pixiv.context', 'object');
    var zip = new JSZip();
    var fullSizePagesA = document.querySelectorAll('a.full-size-container');
    var canvas = document.createElement('canvas');
    var counter = 0;

    chrome.runtime.sendMessage({from: 'pixivContentScript', to: 'background', step: 'download', p: 0});

    for (var i = 0, l = fullSizePagesA.length; i < l; i++) {
        var pageUrl = fullSizePagesA[i].href;
        var pxhr = new XMLHttpRequest();
        pxhr.open('get', pageUrl);
        pxhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var originalUrl = (this.responseText.match(/https?:\/\/i\d?.(?:pixiv|pximg)\.net\/img\-original\/img\/[^"']+\.(?:png|jpg|jpeg|gif)/im))[0];
                var ixhr = new XMLHttpRequest();
                ixhr.overrideMimeType('text/plain; charset=x-user-defined');
                ixhr.open('get', originalUrl);
                ixhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var _this = this;
                        zip.file((_this.responseURL.match(/\d+\.[^.]+$/))[0], _this.responseText, {binary: true});
                        counter++;
                        chrome.runtime.sendMessage({from: 'pixivContentScript', to: 'background', step: 'download', p: Math.round(counter * 100 / l)});
                    }
                };
                ixhr.send();
            }
        };
        pxhr.send();
    }

    function doChunk() {
        if (counter == pixivContext.images.length) {
            chrome.runtime.sendMessage({from: 'pixivContentScript', to: 'background', step: 'prepare'});
            var btn = button.addBtn('', 'chrome-ext_download-btn', 'nav.page-menu');
            btn.className = 'page-button switch _ui-tooltip';
            btn.style = 'display:block;float:right;width:20px;height:20px;background:#fff url(' + chrome.extension.getURL('img') + '/download.png) no-repeat center center;background-size:70% 70%';
            button.addDownloadLink('#chrome-ext_download-btn', URL.createObjectURL(zip.generate({type: "blob"})), pixivContext.illustId + '.zip');
        }
        else {
            setTimeout(doChunk, 500);
        }
    }

    doChunk();
})(_pumd.common, _pumd.button);