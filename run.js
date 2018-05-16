var common = {};
// 生成指定长度的随机字符串
common.getRandomStr = function(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i = 0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
// 注入DOM并将DOM的data属性复制为想要的参数
common.getTargetPageVar = function(obj, type) {
    var injectDom = document.createElement('div');
    injectDom.setAttribute('id', 'dom-' + randomStr);
    injectDom.setAttribute('style', 'display:none');
    document.documentElement.appendChild(injectDom);
    var script = '(function(){';
    script += 'var string = null;';
    script += 'if (typeof ' + obj + ' == "string") string = ' + obj + ';';
    script += 'else if (typeof ' + obj + ' == "object") string = JSON.stringify(' + obj + ');';
    script += 'document.querySelector("#dom-' + randomStr + '").setAttribute("data", string);';
    script += '})()';
    var injectScript = document.createElement('script');
    injectScript.setAttribute('id', 'js-' + randomStr);
    injectScript.setAttribute('style', 'display:none');
    injectScript[(injectScript.innerText === undefined ? 'textContent' : 'innerText')] = script;
    document.documentElement.appendChild(injectScript);
    var domData = document.querySelector('#dom-' + randomStr).getAttribute('data');

    // clearup
    document.querySelector('#dom-' + randomStr).remove();
    document.querySelector('#js-' + randomStr).remove();

    if (type === 'string')
        return domData;
    else if (type === 'object' || type === 'json')
        return JSON.parse(domData);
    else
        return null;
}

var button = {};

button.getBtn = function(selector) {
    return document.querySelector(selector);
}

button.addBtn = function(string, id, to) {
    var btn = document.createElement('a');
    btn.href = 'javascript:void(0)';
    if (typeof id == 'string') {
        btn.setAttribute('id', id);
    }
    btn.innerText = string;

    if (to !== undefined) {
        document.querySelector(to).appendChild(btn);
    }
    else {
        if (document.querySelector('.bookmark-container') != null) {
            document.querySelector('.bookmark-container').appendChild(btn);
        } else {
            document.querySelector('.bookmark').appendChild(btn);
        }
    }
    return btn;
}

button.notice = function(selector, string) {
    document.querySelector(selector).innerText = string;
}

button.addDownloadLink = function(selector, url, string) {
    var btn = document.querySelector(selector)
    btn.href = url;
    btn.setAttribute('download', string);
}

var randomStr = common.getRandomStr(10);