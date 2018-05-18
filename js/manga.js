(function(common, button, RetryTicker) {
    function createDownloadButtonWrapper($buttons) {
        let $wrapper = document.createElement('div');
        $wrapper.className = common.classname('download-btns-wrapper');
        $wrapper.style = 'position:fixed;z-index:2501;top:45px;right:16px;border-radius:5px;overflow:hidden;box-shadow:2px 2px 2px #ccc';

        let $pageMenu = document.querySelector('.page-menu');

        $pageMenu.parentNode.insertBefore($wrapper, $pageMenu.nextSibling);

        return $wrapper;
    }

    /**
     * Request image page content
     * @param {string} url Manga page image url
     */
    function requestImagePage(url) {
        let _this = this;

        return new Promise(function (resolve, reject) {
            var pxhr = new XMLHttpRequest();
            pxhr.open('get', url);
            pxhr.onload = function() {
                resolve(this.responseText); 
            };
            pxhr.onerror = function() {
                if (!retryTicker.reachLimit()) {
                    resolve(_this.requestImagePage(url));
                } else {
                    reject();
                }
            };
            pxhr.send();
        });
    }

    /**
     * 
     * @param {String} url Manga image url
     * @param {JSZip} zip JSZip instance
     */
    function saveImage(url, zip) {
        let _this = this;

        return new Promise(function (resolve, reject) {
            let ixhr = new XMLHttpRequest();
            ixhr.overrideMimeType('text/plain; charset=x-user-defined');
            ixhr.open('get', url);
            ixhr.onload = function () {
                zip.file((this.responseURL.match(/\d+\.[^.]+$/))[0], this.responseText, {binary: true});
                resolve();
            };
            ixhr.onerror = function() {
                if (!retryTicker.reachLimit()) {
                    resolve(_this.saveImage(url, zip));
                } else {
                    reject();
                }
            };
            ixhr.send();
        })
    }

    function Queue() {
        this.stack = [];
        this.index = 0;
        this.complete = 0;
        this.fail = 0;
        this.total = 0;
        this.onItemComplete;
        this.onItemFail;
    }

    Queue.prototype = {
        add: function (item) {
            this.stack.push(item);
            this.total = this.stack.length;
        },

        next: function () {
            if (this.index < this.stack.length) {
                this.index++;
            }
        },

        current: function () {
            return this.stack[this.index];
        },

        start: function (callback, done) {
            let _this = this,
                item;

            if (item = this.current()) {
                callback(item).then(function () {
                    _this.complete++;
                    if (_this.onItemComplete) {
                        _this.onItemComplete.call(_this);
                    }
                }).catch(function () {
                    _this.fail++;
                    if (_this.onItemFail) {
                        _this.onItemFail.call(_this, this.index);
                    }
                }).finally(function () {
                    _this.next();
                    _this.start(callback, done);
                });
            } else {
                if (_this.onDone) {
                    _this.onDone.call(_this);
                }
            }
        }
    }

    var downloading = false,
        retryTicker = new RetryTicker(),
        queue = new Queue();
        $wrapper = createDownloadButtonWrapper(),
        pixivContext = common.getTargetPageVar('pixiv.context', 'object'),
        $downloadBtn = null,
        startIndex = 0,
        splitSize = 100,
        chunks = [];

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
        let startPage = parseInt(chunk.start) + 1,
            endPage = parseInt(chunk.end) + 1,
            fileName = pixivContext.illustId + '_' + startPage + '-' + endPage + '.zip';

        $downloadBtn = button.addBtn(common.lan.msg('downloadPage') + ' ' + startPage + '-' + endPage, common.classname("download-btn_" + startPage + '-' + endPage), $wrapper);
        $downloadBtn.style = "display:block;padding:8px;background:#fff;border-bottom:1px solid #eee";
        $downloadBtn.addEventListener("click", function () {
            let $btn = this;
            let oldText = $btn.innerText;

            if ($btn.getAttribute('complete')) {
                return;
            }

            if (downloading) {
                alert(common.lan.msg('waitDownload'));
                return;
            }

            downloading = true;
            zip = new JSZip();

            queue.onItemComplete = function () {
                $btn.innerText = oldText + ' C:' + queue.complete + '/F:' + queue.fail + '/T:' + queue.total;
            }

            queue.onItemFail = function (page) {
                $btn.innerText = oldText + ' C:' + queue.complete + '/F:' + queue.fail + '/T:' + queue.total;
            }

            queue.onDone = function () {
                zip.generateAsync({
                    type: 'blob',
                }).then(function (blob) {
                    $btn.setAttribute('complete', true);
                    $btn.setAttribute('download', fileName);
                    $btn.href = URL.createObjectURL(blob);
                    $btn.innerText = common.lan.msg('save_page') + ' ' + startPage + '-' + endPage;
                    downloading = false;
                });
            }

            for (var i = chunk.start; i <= chunk.end; i++) {
                queue.add(fullSizePageA[i].href);
            }

            queue.start(function (url) {
                return new Promise(function (resolve, reject) {
                    requestImagePage(url).then(function (body) {
                        var originalUrl = (body.match(/https?:\/\/i\d?.(?:pixiv|pximg)\.net\/img\-original\/img\/[^"']+\.(?:png|jpg|jpeg|gif)/im))[0];
                        saveImage(originalUrl, zip).then(function () {
                            resolve();
                        }).catch(function () {
                            reject();
                        });
                    }).catch(function () {
                        reject();
                    })
                });
            });
        });
    });
})(_pumd.common, _pumd.button, _pumd.RetryTicker);