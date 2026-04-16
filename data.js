// ═══════════════════════════ GESTURE DATA ═══════════════════════════

const ALPHA   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE'];
const NUM_DISPLAY = {
  'ZERO':'0','ONE':'1','TWO':'2','THREE':'3','FOUR':'4',
  'FIVE':'5','SIX':'6','SEVEN':'7','EIGHT':'8','NINE':'9'
};
const WORDS = [
  'HELLO','HI','BYE','PLEASE','SORRY','THANK_YOU','YES','NO',
  'HELP','STOP','GOOD','BAD','LOVE','NAME','EAT','WATER',
  'BATHROOM','HAPPY','SAD','MORE'
];
const PHRASES = [
  'HOW_ARE_YOU','I_AM_FINE','NICE_TO_MEET_YOU','WHAT_IS_YOUR_NAME',
  'MY_NAME_IS','I_LOVE_YOU','I_AM_SORRY','EXCUSE_ME',
  'CAN_YOU_HELP','I_DO_NOT_UNDERSTAND','PLEASE_REPEAT',
  'WHERE_IS','GOOD_MORNING','GOOD_NIGHT'
];

// ═══════════════════════════ MODE SYSTEM ═══════════════════════════

let activeMode = 'all';

const MODE_CONFIG = {
  all:    { label:'ALL DATASETS',  color:'rgba(0,229,160,.3)',   text:'var(--alpha)', total:72 },
  alpha:  { label:'ALPHABETS A–Z', color:'rgba(0,229,160,.35)',  text:'var(--alpha)', total:26 },
  num:    { label:'NUMBERS 0–9',   color:'rgba(245,158,11,.35)', text:'var(--num)',   total:10 },
  word:   { label:'WORDS',         color:'rgba(0,170,255,.35)',  text:'var(--word)',  total:20 },
  phrase: { label:'PHRASES',       color:'rgba(167,139,250,.35)',text:'var(--phrase)',total:14 },
};

function getType(l) {
  if (ALPHA.includes(l))   return 'alpha';
  if (NUMBERS.includes(l)) return 'num';
  if (PHRASES.includes(l)) return 'phrase';
  return 'word';
}

function isAllowed(l) {
  if (activeMode === 'all') return true;
  return getType(l) === activeMode;
}
