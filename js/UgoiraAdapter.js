console.log('Ugoria adatper is loaded');

_pumd.UgoiraAdapter = (function (common) {
    function UgoiraAdapter() {
        this.illustTitle;
        this.illustAuthor;
        this.illustId;
        this.illustAuthorId;
        this.illustFrames;
        this.illustSrc;
        this.illustOriginalSrc;
        this.illustMimeType;
    }

    UgoiraAdapter.prototype = {
        inital : function () {
            return new Promise((function(resolve, reject) {
                let pixivContext = common.getTargetPageVar('globalInitData.preload', 'object');

                if (!pixivContext) {
                    reject();
                    return;
                }

                resolve(Adapter180607.run(pixivContext, this));
            }).bind(this));
        }
    }

    Adapter180607 = {
        run: function (context, adapter) {
            let illustContext = common.objFirst(context.illust);
            adapter.illustId = illustContext.illustId;
            adapter.illustTitle = illustContext.illustTitle;
            let illustUser = common.objFirst(context.user);
            adapter.illustAuthor = illustUser.name;
            adapter.illustAuthorId = illustUser.userId;

            return new Promise((function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open('get', this.buildMetaUrl(adapter.illustId));
                xhr.onload = function () {
                    let response = JSON.parse(this.responseText);

                    if (response.error) {
                        reject();
                        return;
                    }

                    adapter.illustSrc = response.body.src;
                    adapter.illustOriginalSrc = response.body.originalSrc;
                    adapter.illustFrames = response.body.frames;
                    adapter.illustMimeType = response.body.mime_type;

                    resolve(adapter);
                };
                xhr.send();
            }).bind(this));
        },

        buildMetaUrl: function (illustId) {
            return '//www.pixiv.net/ajax/illust/' + illustId + '/ugoira_meta';
        }
    }

    return UgoiraAdapter;
})(_pumd.common);
