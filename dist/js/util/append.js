// 添加js
function appendJs(src, cache = true, typeModule = true, load) {
    const script = document.createElement('script');
    script.setAttribute('src', cache ? `${src}?t=${+new Date()}` : src);
    script.setAttribute('type', typeModule ? 'module' : 'text/javascript');
    script.addEventListener('load', load);
    document.body.appendChild(script);
}

// 添加css
function appendCss(src, cache = true) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', cache ? `${src}?t=${+new Date()}` : src);
    document.head.appendChild(link);
}