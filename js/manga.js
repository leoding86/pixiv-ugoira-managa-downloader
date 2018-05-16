(function(common, button) {
    function createDownloadButtonWrapper($buttons) {
        let $wrapper = document.createElement('div');
        $wrapper.className = common.classname('download-btns-wrapper');
        $wrapper.style = 'position:fixed;z-index:2501;top:45px;right:16px;border-radius:5px;overflow:hidden;box-shadow:2px 2px 2px #ccc';

        let $pageMenu = document.querySelector('.page-menu');

        $pageMenu.parentNode.insertBefore($wrapper, $pageMenu.nextSibling);

        return $wrapper;
    }

    var downloading = false;
    var $wrapper = createDownloadButtonWrapper();
    var pixivContext = common.getTargetPageVar('pixiv.context', 'object');
    var $downloadBtn;
    var startIndex = 0;
    var splitSize = 100;
    var chunks = [];

    while (startIndex < pixivContext.images.length - 1) {
        var chunk = {};
        chunk.start = startIndex;

        if (startIndex + splitSize < pixivContext.images.length) {
            chunk.end = startIndex + splitSize;
        } else {
            chunk.end = pixivContext.images.length - 1;
        }

        chunks.push(chunk);

        startIndex = chunk.end + 1;
    }
    
    var zip;
    var fullSizePageA = document.querySelectorAll('a.full-size-container');

    chunks.forEach(function (chunk) {
        $downloadBtn = button.addBtn(common.lan.msg('downloadPage') + ' ' + (parseInt(chunk.start) + 1) + '-' + (parseInt(chunk.end) + 1), common.classname("download-btn" + chunk.start + '-' + chunk.end), $wrapper);
        $downloadBtn.style = "display:block;padding:8px;background:#fff;border-bottom:1px solid #eee";
        $downloadBtn.addEventListener("click", function () {
            if (downloading) {
                alert('Downloading, please wait...');
                return;
            }

            downloading = true;
            zip = new JSZip();

            for (var i = chunk.start; i < chunk.end; i++) {
                var pageUrl = fullSizePageA[i].href;
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

                                // complete notice
                            }
                        };
                        ixhr.send();
                    }
                };
                pxhr.send();
            }

            // waiting
            
        });
    });
})(_pumd.common, _pumd.button);