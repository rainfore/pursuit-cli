'use strict';

let markextend = require('markextend');
let codemirror = require('codemirror-highlight');

markextend.setOptions({
    // 代码高亮
    highlight(code, lang) {
        if(lang && !codemirror.modes[lang]) {
            if(lang === 'coffee') lang = 'coffeescript';
            if(lang === 'json') lang = 'javascript';
            if(lang === 'html') lang = 'xml';
            if(lang === 'rgl') lang = 'xml';
            if(lang === 'console') return code;

            try {
                codemirror.loadMode(lang);
            } catch(e) {
                console.error(e);
            }
        }

        if(codemirror.modes[lang])
            return codemirror.highlight(code, {mode: lang});
        else
            return code;
    }
});

module.exports = markextend;
