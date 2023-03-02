//const url = 'https://script.google.com/macros/s/AKfycbxH9O5OOVojRbq0pHHDhHzbG-K42-EDMXV5Uc3dbDg/dev';
const url = 'https://script.google.com/macros/s/AKfycbzf35A4dqHlC3rYERX7z3CARQGSSpx63myokgO-wT02WxoJ4gQxUpEZLAbfLgEijyii/exec';

function server(query){
  const script = document.createElement('script'); document.body.append(script);
  script.setAttribute('src', url + '?' + query); 
}

/*--GETTERS--*/
function getDB(){
  server('getDB=handleDB');
}

/*--SETTERS--*/
function setter(string, query){
  let store = JSON.stringify(myStorage.get('cache'+string));
  console.log(string, store);
  if(store == 'null'){
    toasty(`No ${string} to Save`); return;
  }
  toast('Saving '+string); server(query+'&cord='+store);
}

function setPKM(){
  setter('Pkm','setPKM=handlePKM');
}

function setPTY(){
  setter('Pty','setPTY=handlePTY');
}

/*--HANDLERS--*/
function handleDB(data){
  console.log(data); receiveDB(data);
}

function handlePKM(){
  toast('Saved Pokemon'); myStorage.set('cachePkm',null);
}
 
function handlePTY(){
  toast('Saved Party'); myStorage.set('cachePty',null);
}

/*--ALERT--*/
let bigTimer, lilTimer;

function toast(message){
  let TOAST = document.getElementById('js-alert');
  if(!TOAST) TOAST = create(document.body, 'div', {'id':'js-alert','class':'alert'});
  const MSG = create(TOAST, 'div', {'class':'alert__msg'});
  MSG.textContent = message;
  clearTimeout(bigTimer);
  bigTimer = setTimeout(()=>TOAST.remove(),1500)
  setTimeout(()=>MSG.remove(),1500)
}

function toasty(message){
  let TOAST = document.getElementById('js-alerty');
  if(!TOAST) TOAST = create(document.body, 'div', {'id':'js-alerty','class':'alert alerty'});
  const MSG = create(TOAST, 'div', {'class':'alert__msg'});
  MSG.textContent = message;
  clearTimeout(lilTimer);
  lilTimer = setTimeout(()=>TOAST.remove(),1000)
  setTimeout(()=>MSG.remove(),1000)
}
