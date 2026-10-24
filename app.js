(function(){
  var WA='33767717586';
  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}

  /* nav */
  var nav=$('#nav'),bg=$('#burger');
  if(bg)bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  $$('.drawer a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});
  addEventListener('scroll',function(){nav&&nav.classList.toggle('stuck',scrollY>10)},{passive:true});

  /* apparition */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});
    $$('.rv').forEach(function(el,i){el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
  } else $$('.rv').forEach(function(el){el.classList.add('in')});

  /* simulateur */
  var sim=$('.sim');
  if(sim){
    var tabs=$$('.tabs button',sim),rows=$$('.row',sim),sum=$('#sum'),tot=$('#total'),link=$('#sim-wa'),city=sim.dataset.city||'';
    tabs.forEach(function(t){t.addEventListener('click',function(){
      tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);$('#p-'+x.dataset.tab).hidden=!on});
    })});
    function val(r){var q=+r.dataset.q||0,p=+r.dataset.p;return r.dataset.unit?(q?Math.max(49,q*p):0):q*p}
    function render(){
      var total=0,lines=[],html='';
      rows.forEach(function(r){
        var q=+r.dataset.q||0,u=r.dataset.unit;
        r.querySelector('output').textContent=u?q+' m²':q;
        if(!q)return;
        var v=val(r);total+=v;
        var label=u?r.dataset.name+' ('+q+' m²)':(q>1?q+' × ':'')+r.dataset.name;
        html+='<li><span>'+label+'</span><span>'+v+' €</span></li>';
        lines.push('- '+label+' : '+v+' €');
      });
      sum.innerHTML=html||'<li class="empty">Rien d\'ajouté pour l\'instant.</li>';
      tot.textContent=total.toLocaleString('fr-FR')+' €';
      tabs.forEach(function(t){var n=$$('#p-'+t.dataset.tab+' .row').reduce(function(a,r){return a+((+r.dataset.q||0)>0?1:0)},0),b=t.querySelector('.n');b.textContent=n;b.hidden=!n});
      var msg='Bonjour, je souhaite réserver un nettoyage'+(city?' à '+city:'')+' :\n'+(lines.length?lines.join('\n')+'\nTotal estimé : '+total+' €':'(à préciser)')+(city?'':'\nMa ville : ');
    }
    rows.forEach(function(r){
      var b=r.querySelectorAll('button'),u=r.dataset.unit;
      b[0].addEventListener('click',function(){var q=+r.dataset.q||0;r.dataset.q=u?(q<=4?0:q-1):Math.max(0,q-1);render()});
      b[1].addEventListener('click',function(){var q=+r.dataset.q||0;r.dataset.q=u?(q?q+1:4):q+1;render()});
    });
    render();
  }

  /* simulateur -> formulaire */
  if(link)link.addEventListener('click',function(){
    var m=$('#f-msg'),rs=$$('.row',sim).filter(function(r){return +r.dataset.q>0});
    if(m&&rs.length){m.value=rs.map(function(r){var u=r.dataset.unit,q=+r.dataset.q;return (u?r.dataset.name+' ('+q+' m²)':(q>1?q+' × ':'')+r.dataset.name)+' : '+val(r)+' €'}).join('\n')+'\nTotal estimé : '+tot.textContent}
    var keys={};rs.forEach(function(r){keys[r.closest('[id^=p-]').id.slice(2)]=1});
    $$('input[name=svc]').forEach(function(i){var k=i.value.toLowerCase();Object.keys(keys).forEach(function(t){if(k.indexOf(t.slice(0,4))===0)i.checked=true})});
  });

  /* formulaire : envoi instantané par mail */
  var f=$('#form'),MAIL='garyhamza107@gmail.com';
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#f-name'),t=$('#f-tel'),c=$('#f-city'),bad=null;
    var tel=t.value.replace(/[^\d+]/g,'');
    [[n,n.value.trim()],[t,tel.replace(/\D/g,'').length>=9],[c,c.value]].forEach(function(x){if(!x[1]){x[0].style.borderColor='#DC2626';bad=bad||x[0]}else x[0].style.borderColor=''});
    if(bad){bad.focus();return}
    if(f._honey&&f._honey.value)return;
    var svc=$$('input[name=svc]:checked',f).map(function(i){return i.value}).join(', ')||'à préciser';
    var data={_subject:'Nouvelle demande de devis – '+svc+' – '+c.value,_template:'table',_captcha:'false',
      'Prénom':n.value.trim(),'Téléphone':t.value.trim(),'Ville':c.value,'Services':svc,'Précisions':$('#f-msg').value.trim()||'-','Page':location.pathname};
    /* confirmation immédiate pour le client */
    f.innerHTML='<div class="sent full"><div class="ok">✓</div><h3>Demande envoyée !</h3><p>Merci '+n.value.trim().replace(/</g,'')+', on vous rappelle très vite au '+t.value.trim().replace(/</g,'')+' pour votre devis gratuit.</p></div>';
    try{if(window.fbq)fbq('track','Lead',{content_name:svc,content_category:c.value})}catch(_){}
    try{if(window.gtag)gtag('event','generate_lead')}catch(_){}
    fetch('https://formsubmit.co/ajax/'+MAIL,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)}).catch(function(){});
  });
})();
