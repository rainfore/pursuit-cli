'use strict';

let rule = {
    example: /<div class="m-example(?:.*?)"><\/div>([\s\S]+?)(?:##|$)/g,
    pre: /```(.+?)\n([\s\S]+?)\n```/g
}

function parse(content) {
    let examples = [];
    let cap, cap2;
    while(cap = rule.example.exec(content)) {
        let example = {};
        let part = cap[1];
        while(cap2 = rule.pre.exec(part))
            if(cap2[1])
                example[cap2[1]] = cap2[2];
        examples.push(example);
    }

    return examples;
}

exports.premark = function(content) {
    let result = {};

    let examples = parse(content);
    let i = 0;

    let strings = ['let index = 0;'];
    result.content = content.replace(/<div class="m-example"><\/div>/g, () => {
        let example = examples[i++];
        example.rgl = example.xml;

        if(example.rgl) {
            strings.push('((index) => {');
            strings.push('    let template = `' + example.rgl + '`;');
            if(example.javascript)
                strings.push(example.javascript);
            else {
                strings.push('let component = new RGUI.Component({');
                strings.push('    template: template');
                strings.push('});');
            }
            strings.push('    component && component.$inject($$(".m-example")[index]);');
            strings.push('})(index++);');
        }

        return '<div class="m-example">'
            + (example.css ? '<style>' + example.css + '</style>' : '')
            + (example.html || '')
            + '</div>';
    });

    result.script = strings.join('\n');

    return result;
}
