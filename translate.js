/* initialise variables */
var request = new XMLHttpRequest();
var input = document.querySelector('.new-translate input');
var container = document.querySelector('.translate-container');
var lang = document.querySelector('#lang');
var langto = document.querySelector('#langto');

var translateBtn = document.querySelector('.translate');
var clearBtn = document.querySelector('.clear');

/*  add event listeners to buttons */

translateBtn.addEventListener('click', translate);
clearBtn.addEventListener('click', clearAll);

/* generic error handler */
function onError(error) {
  console.log(error);
}

/* display previously-saved stored notes on startup */

initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var listKeys = Object.keys(results);
    for (let listKey of listKeys) {
      var curValue = results[listKey];
      displayTranslate(listKey,curValue);
    }
  }, onError);
}

/* Add a note to the display, and storage */

function translate() {
  var input_t = input.value;
  if(input_t !== '') {
    request.open('GET','https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181015T123439Z.ad20b6258773f522.bd993211d9174481633344dd748a9204960f248f&text='+input_t+'&lang='+lang.value+'-'+langto.value,true);
    input.value = '';
    request.onload = function(){
      var data = JSON.parse(this.response);
      storeTranslate(input_t,data.text);
    }
    request.send();
  }else{
    alert('Please insert word for translation!!');
  }
}

/* function to store a new note in storage */

function storeTranslate(input, translate) {
  var storing = browser.storage.local.set({ [input] : translate });
  storing.then(() => {
    displayTranslate(input,translate);
  }, onError);
}

/* function to display a note in the note box */

function displayTranslate(input, translate) {

  /* create note display box */
  var list = document.createElement('div');
  var listDisplay = document.createElement('div');
  var listH = document.createElement('h2');
  var listPara = document.createElement('p');
  var deleteBtn = document.createElement('button');
  var clearFix = document.createElement('div');

  list.setAttribute('class','list');

  listH.textContent = input;
  listPara.textContent = translate;
  deleteBtn.setAttribute('class','delete');
  deleteBtn.textContent = 'Delete';
  clearFix.setAttribute('class','clearfix');

  listDisplay.appendChild(listH);
  listDisplay.appendChild(listPara);
  listDisplay.appendChild(deleteBtn);
  listDisplay.appendChild(clearFix);

  list.appendChild(listDisplay);
  container.appendChild(list);

  /* set up listener for the delete functionality */

  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(input);
  });
}

/* Clear all notes from the display/storage */

function clearAll() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  browser.storage.local.clear();
}
