'use strict';

let fs = require('fs');
let path = require('path');

// 读取views目录下所有ejs文件
let views = fs.readdirSync(path.join(__dirname, 'view'));
let reg = /\.ejs$/;
views.forEach((view) => {
    if(reg.test(view))
        exports[view.replace(reg, '')] = fs.readFileSync(path.join(__dirname, 'view/' + view), 'utf8');
});
