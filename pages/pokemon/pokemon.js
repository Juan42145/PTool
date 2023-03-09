let LDB

function pokemon(){
  LDB = myStorage.get('DB');
  makePicker()
  makePokemon()
}

function makePicker(){
  let PICK = document.getElementById('js-picker')
  let pty = LDB.Party
  for(let i = 0; i < 6; i++){
    let v = pty[i] != undefined? pty[i]: ''
    const INP = create(PICK, 'input', {'class': 'input', 'value': v, 'type':'text','pattern':'\\d*'});
    makeInput(INP, i)
  }
}

function makeInput(INP, index){
  const PARTY = LDB.Party
  INP.addEventListener('blur',()=>{ if(INP.defaultValue === INP.value) return;
    let value
    if(INP.value < 0 || INP.value >= LDB.Pokemon.length) value = INP.value = ''
    else value = +INP.value
    PARTY[index] = value; store('Party', PARTY);
    myStorage.set('calc', true); caching('cachePty', null, PARTY);
    makePokemon()
  }, false);
  INP.addEventListener('click', (e)=>{focusText(e)})
}

function makePokemon(){
  const MONS = document.getElementById('js-mons')
  MONS.innerHTML = ''
  LDB.Pokemon.forEach((PKMN, i) => {
    let t1 = PKMN.Type1.toLowerCase()
    let t2 = PKMN.Type2? PKMN.Type2.toLowerCase(): t1
    
    const CARD = create(MONS, 'div', {'class': 'card'});
    CARD.style.setProperty('--c1', `var(--${t1})`);
    CARD.style.setProperty('--c2', `var(--${t2})`);
    
    const TITLE = create(CARD, 'div', {'class': 'card--title'});
    if(LDB.Party.includes(i)) TITLE.classList.add('picked')
    const INDEX = create(TITLE, 'div', {'class': 'card__index'});
    INDEX.textContent = i
    const NAME = create(TITLE, 'div', {'class': 'card__name'});
    NAME.textContent = PKMN.Name

    const INFO = create(CARD, 'div', {'class': 'card--info'});
    const BG = create(INFO, 'div', {'class': 'card__bg'});
    const PIC = create(BG, 'img', {'class': 'card__img'});
    getPokemon(PIC, PKMN.Name)
    setError(PIC)
    const TYPE1 = create(INFO, 'div', {'class': 'card__type', 'data-color': PKMN.Type1});
    TYPE1.textContent = PKMN.Type1
    if(PKMN.Type2){
      const TYPE2 = create(INFO, 'div', {'class': 'card__type', 'data-color': PKMN.Type2});
      TYPE2.textContent = PKMN.Type2
    }

    const MOVES = create(CARD, 'div', {'class': 'card--moves'});
    for(let i = 1; i <= 4; i++){
      const MOVE = create(MOVES, 'div', {'class': 'card__move', 'data-color': PKMN['T'+i]});  
      MOVE.textContent = PKMN['M'+i]
    }
  });
}

function save(){
  store('Party', LDB.Party); setPTY();
}