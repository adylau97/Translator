//Request'GET' to get API results
var request = new XMLHttpRequest();

//Initialize variables  to link with html elements by id or class
var input = document.querySelector('.new-translate input');
var container = document.querySelector('.translate-container');
var lang = document.querySelector('#lang');
var langto = document.querySelector('#langto');
var translateBtn = document.querySelector('.translate');
var clearBtn = document.querySelector('.clear');

//Add event listeners to buttons
translateBtn.addEventListener('click', translate);
clearBtn.addEventListener('click', clearAll);

//Generic error handler
function onError(error) {
  console.log(error);
}

//Display previously-saved stored results on startup 
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

//Perform translation, store and display result
//Perform translation by using API and getting back JSON file that consist results
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

//Function to store results into storage 
function storeTranslate(input, translate) {
  var storing = browser.storage.local.set({ [input] : translate });
  storing.then(() => {
    displayTranslate(input,translate);
  }, onError);
}

//Function to display the results in a container
function displayTranslate(input, translate) {

  //Initialize varialbe to create element for displaying the results
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

  //Set up listener for the delete functionality
  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
    browser.storage.local.remove(input);
  });
}

//Clear all results from the display/storage
function clearAll() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  browser.storage.local.clear();
}
