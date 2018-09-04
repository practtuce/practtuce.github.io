const fs = require('fs');
const path = require('path');
const misc = require('./custom_modules/misc');

const PICS_DIR = '/assets/pics/';
const PICS_EXTS = ['jpg', 'jpeg', 'gif', 'png'];

let pics = {};

let dirs = fs.readdirSync(__dirname + PICS_DIR);
for (let i = 0; i < dirs.length; i++) {
  let curdir = path.join(__dirname, PICS_DIR, dirs[i]);
  let files = misc.filterByExtension(fs.readdirSync(curdir), PICS_EXTS);
  files = files.map(x => {
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