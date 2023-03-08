const LDB = myStorage.get('DB').Pokemon;

/*HOME*/
function home(){
  if(myStorage.get('calc')) calculate();
  let HOME = document.getElementById('js-home')
  norm = myStorage.get('norm')
  
  const TH = create(HOME, 'div', {'class': 'type-header'});
  const TF = create(HOME, 'div', {'class': 'type-footer'});
  makeBanners(TH, TF)
  
  let pd = Object.values(myStorage.get('pData'))
  HOME.style = `grid-template-rows: max-content repeat(${pd.length}, 1fr) max-content;`
  pd.forEach(pkmn => {
    const MON = create(HOME, 'div', {'class': 'pokemon'});

    const INFO = create(MON, 'div', {'class': 'info'});
    makeInfo(INFO, pkmn, MON)

    const MOVES = create(MON, 'div', {'class': 'moves'});
    const MDATA = create(MOVES, 'div', {'class': 'moves--data'});
    const MTYPE = create(MOVES, 'div', {'class': 'moves--type'});
    pkmn.MOVES.forEach((move, mi) => {
      makeMoveData(MDATA, move, mi+1)
      makeMoveType(MTYPE, pkmn, move, mi+1)
    })

    const WEAK = create(MON, 'div', {'class': 'weak'});
    makeWeakness(WEAK, pkmn)
  });

}

function makeInfo(CONT, pkmn, ROOT){
  const PKMN = LDB[pkmn.INDEX]

  let t1 = PKMN.Type1.toLowerCase()
  let t2 = PKMN.Type2? PKMN.Type2.toLowerCase(): t1
  let d = Math.abs(PKMN.ATK - PKMN.SPATK)

  ROOT.style.setProperty('--c1', `var(--${t1})`);
  ROOT.style.setProperty('--c2', `var(--${t2})`);
  
  const BG = create(CONT, 'div', {'class': 'info--bg'});
  const CN = create(CONT, 'div', {'class': 'info--cont'});
  
  const PIC = create(BG, 'img', {'class': 'info__img'});
  getPokemon(PIC, PKMN.Name)
  setError(PIC)

  const NAME = create(CN, 'div', {'class': 'info__name'});
  NAME.textContent = PKMN.Name
  
  const FOCUS = create(CN, 'div', {'class': 'info__focus'});
  FOCUS.textContent = PKMN.ATK > PKMN.SPATK? 'P': 'S';
  FOCUS.textContent += '-' + d;
  
  const TYPE1 = create(CN, 'div', {'class': 'info__type', 'data-color': PKMN.Type1});
  TYPE1.textContent = PKMN.Type1
  if(PKMN.Type2){
    const TYPE2 = create(CN, 'div', {'class': 'info__type', 'data-color': PKMN.Type2});
    TYPE2.textContent = PKMN.Type2
  }
}

function makeMoveData(CONT, move, index){
  const MOVE = create(CONT, 'div', {'class': 'move', 'data-color': move.type});
  MOVE.style = `grid-row: ${index};`
  
  const NAME = create(MOVE, 'div', {'class': 'move__name'});
  const NAMET = create(NAME, 'div');
  NAMET.textContent = move.name
  
  const TYPE = create(MOVE, 'div', {'class': 'move__type'});
  const TYPET = create(TYPE, 'div');
  TYPET.textContent = move.type
  
  const POW = create(MOVE, 'div', {'class': 'move__pow'});
  const POWT = create(POW, 'div');
  POWT.textContent = move.power
  
  const CAT = create(MOVE, 'div', {'class': 'move__cat'});
  const CATI = create(CAT, 'img', {'class': 'move__img', 'src':getCat(move.category)});
  setError(CATI)
  
  const DMG = create(MOVE, 'div', {'class': 'move__dmg'});
  const DMGT = create(DMG, 'div');
  DMGT.textContent = Math.floor(move.dmg*norm)
}

function makeMoveType(CONT, pkmn, move, index){
  move.effectiveness.forEach((value, i) => {
    const TEFF = create(CONT, 'div', {'class': 'teff', 'data-color': SDB_TYPES[i]});
    TEFF.style = `grid-row: ${index};`
    
    let text = value > 1? 'star': value < 1? 'block': ''
    if(value == 0){
      TEFF.classList.add('teff--none')
      text = ''
    }
    else{
      switch(pkmn.WEAKNESS[i]){
        case 4: TEFF.classList.add('teff--darkest');
        break;
        case 2: TEFF.classList.add('teff--dark');
        break;
        case 0.5: TEFF.classList.add('teff--light');
        break;
        case 0.25: TEFF.classList.add('teff--lightest');
        break;
        case 0: TEFF.classList.add('teff--immune');
        break;
      }
    }
        
    create(TEFF, 'div', {'class': 'teff__bg'});
    const TEFFT = create(TEFF, 'span', {'class': 'teff__tx material-symbols-outlined'});
    TEFFT.textContent = text
  })
}

function makeWeakness(CONT, pkmn){
  const w4H = create(CONT, 'div', {'class': 'weak__header'})
  const w4T = create(w4H, 'div')
  w4T.textContent = '4'
  const w2H = create(CONT, 'div', {'class': 'weak__header'})
  const w2T = create(w2H, 'div')
  w2T.textContent = '2'
  const r2H = create(CONT, 'div', {'class': 'weak__header'})
  const r2T = create(r2H, 'div')
  r2T.textContent = '½'
  const r4H = create(CONT, 'div', {'class': 'weak__header'})
  const r4T = create(r4H, 'div')
  r4T.textContent = '¼'
  const x0H = create(CONT, 'div', {'class': 'weak__header weak__header--immune'})
  const x0T = create(x0H, 'div')
  x0T.textContent = '0'

  const w4 = create(CONT, 'div', {'class': 'weak__cont'})
  const w2 = create(CONT, 'div', {'class': 'weak__cont'})
  const r2 = create(CONT, 'div', {'class': 'weak__cont'})
  const r4 = create(CONT, 'div', {'class': 'weak__cont'})
  const x0 = create(CONT, 'div', {'class': 'weak__cont'})

  Object.values(pkmn.WEAKNESS).forEach((value, i) => {
    let c
    if(value == 1) return
    else if (value == 4) c = w4
    else if (value == 2) c = w2
    else if (value == 0.5) c = r2
    else if (value == 0.25) c = r4
    else c = x0
    let type = create(c, 'div', {'class': 'weak__type', 'data-color': SDB_TYPES[i]})
    type.textContent = SDB_TYPES[i]
  })

}

function makeBanners(HEAD, FOOT){
  let totals = myStorage.get('pivot').TCOMB
  SDB_TYPES.forEach((type, i) => {
    let h = create(HEAD, 'div', {'class': 'btype', 'data-color': type})
    h.textContent = type.substring(0,3)
    let f = create(FOOT, 'div', {'class': 'btype btype--foot', 'data-color': type})
    f.textContent = totals[i]
  })
}
