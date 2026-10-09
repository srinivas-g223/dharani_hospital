(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* preloader */
  var pre = document.getElementById('preloader');
  function hidePre(){ pre.classList.add('done'); }
  window.addEventListener('load', function(){ setTimeout(hidePre, reduce ? 0 : 2100); });
  setTimeout(hidePre, 4500);

  /* header + progress + active link */
  var header = document.getElementById('header');
  var bar = document.getElementById('progress');
  var links = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var secs = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  function onScroll(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('stuck', y > 40);
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    var cur = 0;
    secs.forEach(function(s, i){ if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
    links.forEach(function(a, i){ a.classList.toggle('active', i === cur && !a.classList.contains('btn')); });
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mobile menu */
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  function toggle(open){ nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); }
  burger.addEventListener('click', function(){ toggle(!nav.classList.contains('open')); });
  nav.addEventListener('click', function(e){ if (e.target.closest('a')) toggle(false); });

  /* reveal on scroll with small stagger inside grids */
  var revs = [].slice.call(document.querySelectorAll('.reveal'));
  revs.forEach(function(el){
    var p = el.parentElement; var sibs = [].slice.call(p.children).filter(function(c){return c.classList.contains('reveal');});
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 6) * 0.07 + 's');
  });
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold:0.12, rootMargin:'0px 0px -6% 0px'});
    revs.forEach(function(el){ io.observe(el); });
  } else { revs.forEach(function(el){ el.classList.add('in'); }); }

  /* counters */
  var nums = [].slice.call(document.querySelectorAll('.num[data-count]'));
  function runCount(el){
    var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null, dur = 1800;
    function step(t){ if(!t0) t0 = t; var p = Math.min((t - t0) / dur, 1); var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(step); }
    reduce ? (el.textContent = end + suf) : requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window){
    var co = new IntersectionObserver(function(en){ en.forEach(function(x){ if (x.isIntersecting){ runCount(x.target); co.unobserve(x.target); } }); }, {threshold:0.6});
    nums.forEach(function(n){ co.observe(n); });
  } else nums.forEach(runCount);

  /* doctor filter */
  var chips = document.getElementById('chips'), docs = [].slice.call(document.querySelectorAll('.doc'));
  chips.addEventListener('click', function(e){
    var b = e.target.closest('.chip'); if (!b) return;
    [].forEach.call(chips.children, function(c){ c.classList.toggle('on', c === b); });
    var f = b.dataset.f;
    docs.forEach(function(d){ d.classList.toggle('hide', f !== 'all' && d.dataset.cat !== f); d.classList.add('in'); });
  });

  /* enquiry form -> WhatsApp (frontend only) */
  var form = document.getElementById('enquiry'), note = document.getElementById('formNote');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var f = form.elements, ok = true;
    ['name','phone','dept'].forEach(function(n){ var bad = !f[n].value.trim(); f[n].classList.toggle('err', bad); if (bad) ok = false; });
    if (!ok){ note.textContent = 'Please fill in your name, phone number and department.'; return; }
    var m = 'Hello New Dharani Hospitals, I would like to enquire.%0A' +
      'Name: ' + encodeURIComponent(f.name.value.trim()) + '%0A' +
      (f.age.value ? 'Age: ' + encodeURIComponent(f.age.value) + '%0A' : '') +
      'Phone: ' + encodeURIComponent(f.phone.value.trim()) + '%0A' +
      (f.email.value ? 'Email: ' + encodeURIComponent(f.email.value.trim()) + '%0A' : '') +
      'Department: ' + encodeURIComponent(f.dept.value) + '%0A' +
      (f.msg.value ? 'Message: ' + encodeURIComponent(f.msg.value.trim()) : '');
    note.textContent = 'Opening WhatsApp to send your enquiry...';
    window.open('https://wa.me/917671841424?text=' + m, '_blank', 'noopener');
    form.reset();
  });

  /* hero particles (gold dust) */
  var cv = document.getElementById('particles');
  if (cv && !reduce){
    var ctx = cv.getContext('2d'), pts = [], W, H, dpr = Math.min(devicePixelRatio || 1, 2);
    function size(){ W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    size(); window.addEventListener('resize', size);
    var N = innerWidth < 700 ? 28 : 60;
    for (var i = 0; i < N; i++) pts.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.8+.4, vy:Math.random()*.25+.05, vx:(Math.random()-.5)*.15, a:Math.random()*.6+.2});
    (function loop(){
      ctx.clearRect(0,0,W,H);
      pts.forEach(function(p){
        p.y -= p.vy; p.x += p.vx; if (p.y < -5){ p.y = H + 5; p.x = Math.random()*W; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = 'rgba(200,130,110,' + p.a + ')'; ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  }
})();

/* ===== extra premium effects ===== */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* heading underline draw */
  var hs = [].slice.call(document.querySelectorAll('.sec-head h2,.achieve-head h2'));
  if ('IntersectionObserver' in window){
    var ho = new IntersectionObserver(function(en){ en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); ho.unobserve(x.target);} }); },{threshold:.6});
    hs.forEach(function(h){ ho.observe(h); });
  } else hs.forEach(function(h){ h.classList.add('in'); });

  /* back to top */
  var tt = document.getElementById('toTop');
  window.addEventListener('scroll', function(){ tt.classList.toggle('show', scrollY > 700); }, {passive:true});
  tt.addEventListener('click', function(){ scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); });

  if (reduce || !fine) return;

  /* cursor glow */
  var glow = document.getElementById('glow');
  window.addEventListener('mousemove', function(e){ glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; glow.classList.add('on'); });
  document.addEventListener('mouseleave', function(){ glow.classList.remove('on'); });

  /* hero parallax */
  var hero = document.querySelector('.hero'), wheel = document.querySelector('.wheel-wrap');
  var blobs = [].slice.call(document.querySelectorAll('.blob'));
  hero.addEventListener('mousemove', function(e){
    var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    wheel.style.transform = 'translate(' + x * -22 + 'px,' + y * -22 + 'px)';
    blobs.forEach(function(b, i){ b.style.translate = (x * (30 + i * 20)) + 'px ' + (y * (30 + i * 20)) + 'px'; });
  });

  /* 3D tilt cards */
  [].slice.call(document.querySelectorAll('.dep,.em-card,.doc,.feat li,.info-card')).forEach(function(c){
    c.addEventListener('mousemove', function(e){
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transition = 'transform .08s linear';
      c.style.transform = 'perspective(800px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 8) + 'deg) translateY(-6px)';
    });
    c.addEventListener('mouseleave', function(){ c.style.transition = 'transform .6s cubic-bezier(.2,.7,.2,1)'; c.style.transform = ''; });
  });

  /* magnetic buttons */
  [].slice.call(document.querySelectorAll('.btn-gold,.btn-crimson,.btn-ghost')).forEach(function(b){
    b.addEventListener('mousemove', function(e){
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3) + 'px)';
    });
    b.addEventListener('mouseleave', function(){ b.style.transform = ''; });
  });
})();

/* Desktop call fix: tel: links open a "Pick an app" popup on PCs.
   On phones/tablets the link works normally; on desktop we show the number with Copy instead. */
(function(){
  var desktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!desktop) return;
  var box;
  function build(){
    box = document.createElement('div');
    box.className = 'call-pop';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-modal','true');
    box.hidden = true;
    box.innerHTML = '<div class="call-card"><button class="call-x" aria-label="Close">&times;</button>' +
      '<h3>Call New Dharani Hospitals</h3><p class="call-num"></p>' +
      '<p class="call-note">Dial this number from your phone, or copy it.</p>' +
      '<div class="call-actions"><button class="btn btn-crimson call-copy" type="button">Copy number</button>' +
      '<a class="btn btn-ghost call-open" href="#">Open phone app</a></div></div>';
    document.body.appendChild(box);
    box.addEventListener('click', function(e){ if (e.target === box || e.target.closest('.call-x')) close(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
    box.querySelector('.call-copy').addEventListener('click', function(){
      var n = box.querySelector('.call-num').textContent, b = this;
      function done(){ b.textContent = 'Copied \u2713'; setTimeout(function(){ b.textContent = 'Copy number'; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(n).then(done, done);
      else { var t = document.createElement('textarea'); t.value = n; document.body.appendChild(t); t.select(); try{document.execCommand('copy');}catch(_){} t.remove(); done(); }
    });
  }
  function close(){ if (box) box.hidden = true; }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="tel:"]');
    if (!a || a.classList.contains('call-open')) return;
    e.preventDefault();
    if (!box) build();
    var num = a.getAttribute('href').replace('tel:','');
    box.querySelector('.call-num').textContent = num;
    box.querySelector('.call-open').setAttribute('href', 'tel:' + num);
    box.hidden = false;
  });
})();
