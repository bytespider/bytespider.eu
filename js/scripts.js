[].slice.call(document.getElementsByTagName('code'), 0).forEach(function (item) {
    item.className = 'brush:js';
});

SyntaxHighlighter.config.tagName = 'code';
SyntaxHighlighter.all();
