function randInt(a, b) {
  return a + Math.floor(Math.random()*(b-a+1));
}

function randFloat(a, b) {
  return a + Math.random()*(b-a);
}

function randFromArr(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function shuffleArr(arr) {
  for (let i=0; i < arr.length; i++) {
    let new_index = randInt(0, arr.length-1);
    let new_val = arr[new_index];
    arr[new_index] = arr[i];
    arr[i] = new_val;
  }
  return arr;
}

function getFileAndExtension(file) {
  // getFileAndExtension("Eden.mp3") -> ["Eden", "mp3"]
  let m = /(.+)\.([^.]+)$/.exec(file);
  if (m) {
    return [m[1], m[2]];
  }
  return [file, ""];
}

function filterByExtension(files, ext) {
  // ext be a string or an array of strings (to accept/filter-by multiple extensions)
  ext = ext || "";
  if (ext.constructor === Array) {
    return files.filter(file => ext.includes(getFileAndExtension(file)[1]));
  }
  return files.filter(file => getFileAndExtension(file)[1] === ext);
}

module.exports = {
  randInt,
  randFloat,
  randFromArr,
  shuffleArr,
  getFileAndExtension,
  filterByExtension
};