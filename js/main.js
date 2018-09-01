location.hash = '';
let prev_hash = location.hash;

const LOADING_IMG = '/assets/loading.jpg';

let saved_settings;
let default_settings = {
  intervals: 120,
  rounds: 10,
  categories: []
};

let drawing = false;
let pic_elem = document.getElementById('pic');
let timer_elem = document.getElementById('timer');
let count_elem = document.getElementById('count');

pics = pics || [];
let categories = Object.keys(pics);
categories.sort();
let allpics = [];
for (let i = 0; i < categories.length; i++) {
  shuffleArr(pics[categories[i]]);
  allpics = allpics.concat(pics[categories[i]]);
}
let categories_selected = [];
let current_category_index = 0;
let current_category;
let done_stack = [];
let curpic;

const INFO_ORIGINAL_COLOR = document.getElementById('info').style.color;

let pic_interval;
let rounds;
let done_count = -1;
let timer;
let prev_date;
let win = false;
let paused = false;
let loading = false;

function nextPic() {
  changePic();
  done_count++;
  resetTimer();
  if (done_count >= rounds) {
    win = true;
    pic_elem.src = '/assets/win.jpg';
  }
}

function changePic() {
  if (curpic) curpic.done = true;
  nextCategory();
  curpic = findPic();
  loadPic(curpic.path);
}

function findPic() {
  let ret = allpics.find(x => (!x.done && x.category === current_category));
  if (!ret) {
    allpics.filter(x => x.category === current_category).forEach(x => x.done = false);
    ret = allpics.find(x => x.category === current_category);
  }
  return ret;
}

function nextCategory() {
  current_category_index += 1;
  if (current_category_index > categories_selected.length - 1) {
    current_category_index = 0;
  };
  current_category = categories_selected[current_category_index];
}

function skipPic() {
  changePic();
  resetTimer();
}

function pause() {
  paused = !paused;
  if (paused) {
    pic_elem.style.filter = 'grayscale(100%)';
    pic_elem.style.opacity = '0.3';
    timer_elem.style.color = 'white';
  }
  else {
    timer_elem.style.color = INFO_ORIGINAL_COLOR;
    pic_elem.style.filter = '';
    pic_elem.style.opacity = '1';
  }
}

init();
function init() {
  loadSettings();
  pic_elem.addEventListener('dblclick', skipPic, false);
  pic_elem.addEventListener('click', pause, false);
  pic_elem.addEventListener('load', picHasLoaded, false);
  document.getElementById('start_button').addEventListener('click', start, false);
  document.getElementById('options').addEventListener('click', updateETA, false);
  createCategories();
  updateOptionsWithSettings();
  updateETA();
  monitorHash();
}

function loadPic(paf) {
  pic_elem.src = paf;
  document.getElementById('loading').hidden = false;
  pic_elem.hidden = true;
  loading = true;
}

function picHasLoaded() {
  document.getElementById('loading').hidden = true;
  pic_elem.hidden = false;
  loading = false;
}

function loadSettings() {
  saved_settings = default_settings;
  if (localStorage.settings) {
    try {
      saved_settings = JSON.parse(localStorage.settings);
    }
    catch (e) {
      console.error('Something\'s wrong with yer local settings. CLEANIN\' THEM UP NOW');
      delete localStorage.settings;
    }
  }
}

function updateOptionsWithSettings() {
  let e = document.querySelector(`#intervals > ul > li [value="${saved_settings.intervals}"]`);
  if (e) e.checked = true;
  e = document.querySelector(`#rounds > ul > li [value="${saved_settings.rounds}"]`);
  if (e) e.checked = true;
  e = document.querySelectorAll('#categories_ul > li > input');
  for (let i = 0; i < e.length; i++) {
    if (saved_settings.categories.includes(e[i].value)) {
      e[i].checked = true;
    }
  }
}

function saveSettings() {
  saved_settings.intervals = pic_interval;
  saved_settings.rounds = rounds;
  saved_settings.categories = categories_selected;
  localStorage.setItem('settings', JSON.stringify(saved_settings));
}

function createCategories() {
  let u = document.getElementById('categories_ul');
  for (let i = 0; i < categories.length; i++) {
    u.innerHTML += `<li><input type="checkbox" name="categories" value="${categories[i]}" id="categories_${categories[i]}">
    <label for="categories_${categories[i]}">${categories[i]}</label></li>`;    
  }
}

function monitorHash() {
  setInterval(monitorHashInterval, 60);
}

function monitorHashInterval() {
  if (location.hash !== prev_hash) {
    if (!/^#?drawing$/.test(location.hash)) {
      location.reload();
    }
    else if (!drawing) location.hash = '';
  }
  prev_hash = location.hash;
}

function updateETA() {
  getOptions();
  document.getElementById('eta').textContent = (rounds * pic_interval)/60 + ' minutes';
}

function start() {
  saveSettings();
  shuffleArr(categories_selected);
  document.getElementById('drawing').hidden = false;
  document.getElementById('options').hidden = true;
  drawing = true;
  prev_date = Date.now();
  nextPic();
  update();
}

function getOptions() {
  pic_interval = parseInt(getChecked('intervals').value);
  rounds = parseInt(getChecked('rounds').value);
  categories_selected = getSelectedCategories();
}

function getSelectedCategories() {
  let ret = Array.from(document.getElementById('categories_ul').querySelectorAll('li > input:checked')).map(x => x.value);
  if (ret.length === 0) {
    ret = categories;
  }
  return ret;
}

function getChecked(namae) {
  return document.getElementById(namae).getElementsByTagName('ul')[0].querySelector('li > input:checked');
}

function resetTimer() {
  timer = pic_interval;
}

function update() {
  if (win) {
    timer_elem.textContent = 'ＹＥＳ';
    document.body.style.backgroundColor = `hsl(${180+Math.sin(prev_date/100)*180}, 60%, 90%)`;
  }
  else if (!paused && !loading) {
    timer -= (Date.now() - prev_date)/1000;
    if (timer <= 0) {
      nextPic();
    }
    timer_elem.textContent = Math.floor(timer)+1;
    count_elem.textContent = `${done_count} / ${rounds}`;
  }
  prev_date = Date.now();
  requestAnimationFrame(update);
}


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