/*PROCESSING*/
function process(data){
  let object = {}
  Object.entries(data).forEach(sheet => {
    if(sheet[0] == 'Pokemon') object[sheet[0]] = parse(sheet[1]);
    else object[sheet[0]] = sheet[1]
  });
  return object;
}

function parse(range) {
  const headers = range.shift(), data = [];
  for(let r in range) {
    const row = {};
    headers.forEach((h, c) => row[h] = range[r][c])
    row['ROW'] = r;
    data.push(row);
  }
  return data;
}

/*INDEX*/
function init(){
  getDB(); myStorage.set('calc', true);
}

function receiveDB(DB){
  myStorage.set('DB', process(DB));  
  const L = document.getElementById('js-loading');
  const E = document.getElementById('js-enter');
  E.classList.remove('hide'); L.classList.add('hide')
}

function enter(){
  window.open('pages/home/home.html','_self')
}