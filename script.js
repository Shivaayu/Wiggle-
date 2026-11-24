const pages = [
  {chapter:"A LITTLE SURPRISE", render:()=>`
    <span class="sticker s1">♡</span><span class="sticker s2">🎀</span><span class="sticker s3">✦</span><span class="sticker s4">🍫</span>
    <p class="kicker">a tiny book, made with love</p>
    <h1 class="hero-title">The Little Book<br>of <em>Thankuuu</em></h1>
    <p class="subtitle">A little sweetness for the lovely human who made my day sweeter.</p>
    <div class="teddy-row"><img class="teddy" src="assets/teddy.png" alt="Shivaayu's little teddy mascot"></div>
    <button class="action-btn" data-action="open">TAP TO OPEN THE BOOK ✨</button>
    <p class="small-note">psst... there's a tiny surprise inside</p>`},
  {chapter:"A LITTLE HELLO", render:()=>`
    <span class="sticker s1">♡</span><span class="sticker s2">✧</span>
    <p class="kicker">page one · the beginning</p>
    <img class="teddy" src="assets/teddy.png" alt="A fluffy brown teddy bear">
    <div class="speech">Oh! You made it! I was waiting for you. 🧸</div>
    <h2 class="hero-title" style="font-size:clamp(32px,6vw,53px)">Hiii, <em>you!</em></h2>
    <p class="subtitle">I'm the little bear behind this book. I have something sweet to tell you...</p>
    <p class="small-note">turn the page, there's more ♡</p>`},
  {chapter:"A LITTLE LETTER", render:()=>`
    <span class="sticker s1">💌</span><span class="sticker s2">♡</span>
    <p class="kicker">page two · a note from shivaayu</p>
    <div class="paper-letter"><span class="washi"></span>
      <h2 class="letter-title">A little note for you...</h2>
      <p class="letter-copy">Hey you! 🤎

Thank you for taking a moment to wish me on my special day. Your message, your time and your kindness genuinely made me happy.

I wanted to send something a little more special than a simple “thank you”, so here's this tiny corner of the internet, made just for everyone who made my day sweeter.

Sending you a big bundle of chocolatey happiness!</p>
      <p class="signature">— With love, Shivaayu ♡</p>
    </div>
    <p class="small-note" style="margin-top:22px">sealed with a little chocolate love 🍫</p>`},
  {chapter:"SPECIAL MESSAGE", render:()=>`
    <span class="sticker s1">🌷</span><span class="sticker s2">♡</span><span class="sticker s3">✦</span><span class="sticker s4">🧸</span>
    <p class="kicker">page three · just for you</p>
    <h2 class="hero-title" style="font-size:clamp(34px,6vw,58px)">You made my<br><em>day special!</em></h2>
    <p class="message-lines">Every wish, every little message and every bit of love made my day brighter. <strong>Thank you for being a part of it.</strong><br><br>Some gestures may be small, but the happiness they bring can be really big. Yours meant a lot. 🤎</p>
    <img class="teddy small" src="assets/teddy.png" alt="Teddy bear sending love">
    <p class="small-note">you are appreciated more than you know ♡</p>`},
  {chapter:"LET'S CELEBRATE!", render:()=>`
    <span class="sticker s1">🎈</span><span class="sticker s2">🎀</span><span class="sticker s3">🍬</span><span class="sticker s4">✨</span>
    <p class="kicker">page four · the sweet chaos</p>
    <h2 class="party-title">OKAY, ENOUGH<br><span>EMOTIONS!</span></h2>
    <div class="cake">🎂</div>
    <p class="subtitle">It's party time! You helped make this day extra sweet.</p>
    <div class="party-buttons">
      <button class="action-btn" data-action="confetti">MORE CONFETTI! 🎉</button>
      <button class="action-btn secondary" data-action="pop">PARTY POP! 🎊</button>
    </div>
    <img class="teddy small" src="assets/teddy.png" alt="Teddy celebrating" style="max-height:20%;margin-top:4px">
    <p class="small-note">P.S. this page is allowed to be a little extra.</p>`},
  {chapter:"LET'S CONNECT", render:()=>`
    <span class="sticker s1">♡</span><span class="sticker s2">🍫</span>
    <p class="kicker">the last page · not the last hello</p>
    <h2 class="hero-title" style="font-size:clamp(35px,6vw,58px)">Until next<br><em>time!</em></h2>
    <img class="teddy small" src="assets/teddy.png" alt="Teddy waving goodbye">
    <p class="subtitle">Thank you for being part of my little celebration. Let's stay connected!</p>
    <a class="social-card" href="https://www.instagram.com/Pvt_Shivaayu/" target="_blank" rel="noopener noreferrer"><span class="social-icon">♡</span><span>Instagram<br><small style="font-weight:400;color:#9b7b66">@Pvt_Shivaayu</small></span><span style="margin-left:auto">↗</span></a>
    <p class="small-note">made with lots of sweetness by Shivaayu 🤎</p>`}
];

const pageEl=document.getElementById('page');
const content=document.getElementById('pageContent');
const pageNo=document.getElementById('pageNumber');
const chapter=document.getElementById('chapterLabel');
const dots=document.getElementById('pageDots');
const prev=document.getElementById('prevBtn');
const next=document.getElementById('nextBtn');
const partyLayer=document.getElementById('partyLayer');
const toast=document.getElementById('toast');
const soundToggle=document.getElementById('soundToggle');
const soundState=document.getElementById('soundState');
let current=0, soundOn=false, audioCtx=null, musicTimer=null, musicStep=0, partyPlayed=false, busy=false;

function renderPage(index){
  content.innerHTML=pages[index].render();
  chapter.textContent=pages[index].chapter;
  pageNo.textContent=index===0?'♡':`${index}  ·  ${pages.length-1}`;
  prev.disabled=index===0;
  next.disabled=index===pages.length-1;
  dots.innerHTML=pages.map((_,i)=>`<button class="dot ${i===index?'active':''}" aria-label="Go to page ${i+1}" data-dot="${i}"></button>`).join('');
  if(index===pages.length-2 && !partyPlayed){partyPlayed=true;setTimeout(()=>{if(current===index){flipBurst();partyPop();confetti(95);playPop()}},420)}
}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)}
function ensureAudio(){
  if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(AC)audioCtx=new AC()}
  if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume();
}
function tone(freq,duration=.12,type='sine',volume=.045,when=0){
  if(!soundOn)return;ensureAudio();if(!audioCtx)return;
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime+when);
  g.gain.setValueAtTime(.0001,audioCtx.currentTime+when);g.gain.exponentialRampToValueAtTime(volume,audioCtx.currentTime+when+.015);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+when+duration);
  o.connect(g);g.connect(audioCtx.destination);o.start(audioCtx.currentTime+when);o.stop(audioCtx.currentTime+when+duration+.03);
}
function pageSound(){tone(420,.08,'triangle',.035);tone(290,.12,'triangle',.025,.05)}
function clickSound(){tone(620,.07,'sine',.025)}
function playPop(){[440,554,659,880].forEach((f,i)=>tone(f,.22,'triangle',.035,i*.07))}
function startMusic(){
  if(!soundOn||musicTimer)return;
  ensureAudio();
  // Original gentle music-box style loop, generated locally with Web Audio (no external song).
  const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,523.25,659.25,783.99,1046.5,880,783.99,659.25,587.33];
  musicTimer=setInterval(()=>{if(soundOn){tone(notes[musicStep%notes.length],.42,'sine',.012);if(musicStep%4===0)tone(notes[musicStep%notes.length]/2,.55,'sine',.008,.02);musicStep++}},430);
}
function stopMusic(){if(musicTimer){clearInterval(musicTimer);musicTimer=null}}
function updateSound(){soundState.textContent=soundOn?'Sound on':'Sound off';soundToggle.setAttribute('aria-pressed',String(soundOn));if(soundOn){ensureAudio();startMusic();pageSound()}else stopMusic()}
soundToggle.addEventListener('click',()=>{soundOn=!soundOn;updateSound();if(soundOn)showToast('A little tune is playing ♫');else showToast('Sound turned off')});

function goTo(index,dir=1){
  if(busy||index<0||index>=pages.length||index===current)return;
  busy=true;const old=current;pageSound();
  pageEl.classList.remove('turning','back');void pageEl.offsetWidth;
  pageEl.classList.add('turning');if(dir<0)pageEl.classList.add('back');
  setTimeout(()=>{current=index;renderPage(current);pageEl.classList.remove('turning','back');busy=false;if(current===pages.length-2&&!partyPlayed){/* handled in render */}},590);
}
function flipBurst(){
  if(busy)return;
  const shell=document.getElementById('bookShell');
  pageEl.classList.remove('rushing');void pageEl.offsetWidth;pageEl.classList.add('rushing');
  setTimeout(()=>pageEl.classList.remove('rushing'),850);
  shell.animate([{transform:'scale(1)'},{transform:'scale(1.025) rotate(-1deg)'},{transform:'scale(1)'}],{duration:420,easing:'ease-out'});
  showToast('A little book magic... ✨');
}
function confetti(count=55){
  const colors=['#b77e69','#e7b9b8','#d5ad7f','#f4dfc5','#8d654d','#fff4e6'];
  for(let i=0;i<count;i++){
    const el=document.createElement('i');el.className='confetti';el.style.left=Math.random()*100+'%';el.style.background=colors[i%colors.length];
    el.style.setProperty('--dur',(2.1+Math.random()*2.3)+'s');el.style.setProperty('--drift',(Math.random()*220-110)+'px');el.style.setProperty('--rot',(Math.random()*180)+'deg');
    partyLayer.appendChild(el);setTimeout(()=>el.remove(),4700);
  }
}
function partyPop(){
  const emojis=['🎉','🎊','✨','♡','🍬','🎀','⭐'];
  for(let i=0;i<22;i++){const el=document.createElement('span');el.className='burst';el.textContent=emojis[i%emojis.length];el.style.setProperty('--x',(5+Math.random()*90)+'%');el.style.setProperty('--y',(18+Math.random()*65)+'%');el.style.animationDelay=(Math.random()*.45)+'s';partyLayer.appendChild(el);setTimeout(()=>el.remove(),1700)}
}
function nextPage(){goTo(Math.min(pages.length-1,current+1),1)}
function prevPage(){goTo(Math.max(0,current-1),-1)}
prev.addEventListener('click',prevPage);next.addEventListener('click',nextPage);
dots.addEventListener('click',e=>{const b=e.target.closest('[data-dot]');if(b)goTo(Number(b.dataset.dot),Number(b.dataset.dot)>current?1:-1)});
content.addEventListener('click',e=>{
  const b=e.target.closest('[data-action]');if(!b)return;clickSound();
  if(b.dataset.action==='open')nextPage();
  if(b.dataset.action==='confetti'){confetti(110);partyPop();playPop()}
  if(b.dataset.action==='pop'){partyPop();confetti(45);playPop();showToast('POOOF! A little celebration for you!')}
});

// Touch, stylus and mouse dragging: swipe anywhere horizontally, or pull from the page edge.
let startX=0,startY=0,dragging=false;
pageEl.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;dragging=true;pageEl.setPointerCapture?.(e.pointerId)});
pageEl.addEventListener('pointerup',e=>{
  if(!dragging)return;dragging=false;const dx=e.clientX-startX,dy=e.clientY-startY;
  if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.25){dx<0?nextPage():prevPage()}
});
pageEl.addEventListener('pointercancel',()=>dragging=false);
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();nextPage()}if(e.key==='ArrowLeft'){e.preventDefault();prevPage()}});
renderPage(0);
