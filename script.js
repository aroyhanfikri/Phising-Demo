const SKINS = [
  { id:1,  img:'img/1.jpg',  emoji:'✨', name:'Radiant Angel',   rarity:'Legend' },
  { id:2,  img:'img/2.jpg',  emoji:'❄', name:'Frost Queen',     rarity:'Legend' },
  { id:3,  img:'img/3.jpg',  emoji:'🦇', name:'Vampire Lady',    rarity:'Epic'   },
  { id:4,  img:'img/4.jpg',  emoji:'🦋', name:'Mystic Wing',     rarity:'Epic'   },
  { id:5,  img:'img/5.jpg',  emoji:'⚔', name:'Shadow Blade',    rarity:'Epic'   },
  { id:6,  img:'img/6.jpg',  emoji:'🌿', name:'Nature Spirit',   rarity:'Legend' },
  { id:7,  img:'img/7.jpg',  emoji:'🔥', name:'Twin Elements',   rarity:'Legend' },
  { id:8,  img:'img/8.jpg',  emoji:'🌟', name:'Golden Hero',     rarity:'Epic'   },
  { id:9,  img:'img/9.jpg',  emoji:'🗡', name:'Blood Warrior',   rarity:'Epic'   },
  { id:10, img:'img/10.jpg', emoji:'💠', name:'Neon Archer',     rarity:'Rare'   }
];

let selected = null;
let provider = '';

function go(id){
  document.querySelectorAll('.screen').forEach(function(s){
    s.classList.remove('active');
  });
  const el = document.getElementById(id);
  if(el){
    requestAnimationFrame(function(){
      el.classList.add('active');
      el.scrollTop = 0;
    });
  }
}

(function makeStars(){
  const c = document.getElementById('stars');
  if(!c) return;
  const count = window.innerWidth < 500 ? 22
              : window.innerWidth < 900 ? 32
              : 45;
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'star';
    s.style.left = (Math.random()*100) + '%';
    s.style.top  = (Math.random()*100) + '%';
    const size = (1 + Math.random()*2) + 'px';
    s.style.width = size;
    s.style.height = size;
    s.style.animationDelay = (Math.random()*3) + 's';
    s.style.animationDuration = (2 + Math.random()*3) + 's';
    c.appendChild(s);
  }
})();

(function buildSkinGrid(){
  const g = document.getElementById('skinGrid');
  if(!g) return;
  SKINS.forEach(function(skin, i){
    const card = document.createElement('div');
    card.className = 'skin-card';
    card.dataset.id = skin.id;

    const img = document.createElement('img');
    img.className = 'skin-img';
    img.src = skin.img;
    img.alt = skin.name;
    img.loading = 'lazy';
    img.onerror = function(){
      const em = document.createElement('span');
      em.className = 'skin-emoji';
      em.textContent = skin.emoji;
      if(img.parentNode){ img.parentNode.replaceChild(em, img); }
    };
    card.appendChild(img);

    const info = document.createElement('div');
    info.className = 'skin-info';

    const nameEl = document.createElement('span');
    nameEl.className = 'skin-name';
    nameEl.textContent = skin.name;
    info.appendChild(nameEl);

    const rarEl = document.createElement('span');
    rarEl.className = 'skin-rarity';
    rarEl.textContent = skin.rarity;
    info.appendChild(rarEl);

    card.appendChild(info);
    card.style.animationDelay = (i * 0.06) + 's';
    card.addEventListener('click', function(){ selectSkin(card, skin); });
    g.appendChild(card);
  });
})();

function selectSkin(card, skin){
  document.querySelectorAll('.skin-card').forEach(function(c){
    c.classList.remove('selected');
  });
  card.classList.add('selected');
  selected = skin;
  if(navigator.vibrate){ try{ navigator.vibrate(15); }catch(e){} }
}

function confirmSkin(){
  if(!selected){
    toast('Pilih dulu','Silakan pilih salah satu skin.');
    return;
  }
  const gi = document.getElementById('giftInner');
  gi.innerHTML = '';
  const im = document.createElement('img');
  im.src = selected.img;
  im.alt = selected.name;
  im.onerror = function(){ gi.textContent = selected.emoji; };
  gi.appendChild(im);
  document.getElementById('revealName').textContent = selected.name;
  document.getElementById('revealSub').textContent =
    'Hadiah ' + selected.name + ' siap diklaim. Lanjutkan untuk memilih metode login.';
  document.getElementById('revealBtn').textContent = 'Klaim Sekarang →';
  go('reveal');
}

function revealNext(){
  if(selected){ go('login'); } else { go('skins'); }
}

function simulate(name){
  provider = name;
  toast('Mode Demo','Simulasi login ' + name + '...');
  go('loading');
  const t = document.getElementById('loadingText');
  const p = document.getElementById('progressText');
  t.textContent = 'Menghubungkan ke ' + name + '...';
  p.textContent = '0%';
  let pct = 0;
  const steps = [
    { at:25,  label:'Membuka sesi ' + name + '...' },
    { at:55,  label:'Memverifikasi akun...' },
    { at:80,  label:'Mengambil data skin...' },
    { at:100, label:'Menyelesaikan...' }
  ];
  const iv = setInterval(function(){
    pct += Math.random()*8 + 3;
    if(pct > 100) pct = 100;
    p.textContent = Math.floor(pct) + '%';
    for(let i=0;i<steps.length;i++){
      if(pct >= steps[i].at && t.textContent !== steps[i].label){
        t.textContent = steps[i].label;
      }
    }
    if(pct >= 100){ clearInterval(iv); setTimeout(finish, 500); }
  }, 120);
}

function finish(){
  const name = selected ? selected.name : 'Skin Pilihan';
  document.getElementById('successText').textContent =
    name + ' telah "diklaim" via ' + provider +
    ' (simulasi). Tidak ada data nyata yang diproses.';
  go('success');
  if(navigator.vibrate){ try{ navigator.vibrate([40,60,40]); }catch(e){} }
}

function reset(){
  selected = null;
  provider = '';
  document.querySelectorAll('.skin-card').forEach(function(c){
    c.classList.remove('selected');
  });
  document.getElementById('progressText').textContent = '0%';
  document.getElementById('giftInner').textContent = '🎁';
  document.getElementById('revealName').textContent = 'Skin ML';
  document.getElementById('revealSub').textContent =
    'Hadiah eksklusif telah dikunci untuk akunmu. Lanjutkan untuk mengklaim.';
  document.getElementById('revealBtn').textContent = 'Lanjutkan →';

  const bar = document.getElementById('splashBar');
  if(bar){
    bar.style.animation = 'none';
    void bar.offsetHeight;
    bar.style.animation = '';
  }

  const statusEl = document.getElementById('splashStatus');
  if(statusEl){ statusEl.textContent = 'Menghubungkan ke server...'; }
  const percentEl = document.getElementById('splashPercent');
  if(percentEl){ percentEl.textContent = '0%'; }

  go('splash');
  setTimeout(function(){ go('reveal'); }, 2800);
}

let toastTimer;
function toast(title, msg){
  const t = document.getElementById('toast');
  t.querySelector('strong').textContent = title;
  t.querySelector('span').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2200);
}

(function splashSequence(){
  const statusEl = document.getElementById('splashStatus');
  const percentEl = document.getElementById('splashPercent');
  if(!statusEl || !percentEl) return;

  const messages = [
    'Menghubungkan ke server...',
    'Memuat data skin...',
    'Menyiapkan hadiah...',
    'Hampir selesai...'
  ];

  let pct = 0;
  let msgIdx = 0;
  statusEl.textContent = messages[0];

  const msgTimer = setInterval(function(){
    msgIdx++;
    if(msgIdx < messages.length){
      statusEl.textContent = messages[msgIdx];
    } else {
      clearInterval(msgTimer);
    }
  }, 700);

  const pctTimer = setInterval(function(){
    pct += Math.random() * 6 + 2;
    if(pct >= 100){
      pct = 100;
      clearInterval(pctTimer);
      clearInterval(msgTimer);
      statusEl.textContent = 'Siap!';
    }
    percentEl.textContent = Math.floor(pct) + '%';
  }, 100);
})();

window.addEventListener('load', function(){
  setTimeout(function(){ go('reveal'); }, 2800);
});