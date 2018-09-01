const fs = require('fs');
const path = require('path');

const PICS_DIR = '/assets/pics/';

let pics = {};

let dirs = fs.readdirSync(__dirname + PICS_DIR);
for (let i = 0; i < dirs.length; i++) {
  let curdir = path.join(__dirname, PICS_DIR, dirs[i]);
  let files = fs.readdirSync(curdir);
  files = files.map(x=>{
    return {
      name: x,
      category: dirs[i],
      path: path.posix.join(PICS_DIR, dirs[i], x)
    };
  });
  pics[dirs[i]] = files;
}
delete pics["exclude"];
let data = JSON.stringify(pics, null, 2);

data = `let pics = ${data};`;

fs.writeFileSync(__dirname + '/js/pics.js', data);