
// Router simple: #seccion[/subseccion]
const state = { data:null };

async function init(){
  const res = await fetch('data.json');
  state.data = await res.json();
  document.title = "Enrique García Yranzo";
  renderHeader();
  renderHero();
  route();
  window.addEventListener('hashchange', route);
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('foot-name').textContent = state.data.site.name;
}

function renderHeader(){
  document.getElementById('site-name').textContent = state.data.site.name;
  const menu = document.getElementById('menu'); menu.innerHTML = '';
  state.data.sections.forEach(sec=>{
    const a = document.createElement('a');
    a.href = `#${sec.id}`;
    a.textContent = sec.title;
    menu.appendChild(a);
  });
}

function renderHero(){
  const h = state.data.hero;
  document.getElementById('hero-tag').textContent = h.tag;
  document.getElementById('hero-title').textContent = h.title;
  document.getElementById('hero-sub').textContent = h.subtitle;
  document.getElementById('hero-img').src = h.image || '';
  const b1 = document.getElementById('hero-btn-1'); b1.textContent = h.button1.text; b1.href = `#${h.button1.to}`;
  const b2 = document.getElementById('hero-btn-2'); b2.textContent = h.button2.text; b2.href = `#${h.button2.to}`;
}

function route(){
  const hash = location.hash.replace('#','');
  const [secId, subId] = hash.split('/');
  const content = document.getElementById('content');
  const bc = document.getElementById('breadcrumbs');
  [...document.querySelectorAll('.menu a')].forEach(a=> a.classList.toggle('active', a.getAttribute('href')===`#${secId||''}`));

  if(!secId){
    // Página de inicio: mostrar resumen de secciones
    bc.innerHTML = '';
    content.innerHTML = `
      <section class="card">
        <h2 class="section-title">Explora</h2>
        <p class="section-sub">Elige una sección para ver sus subapartados.</p>
        <div class="grid cols-2">
          ${state.data.sections.map(s=>`
           <div class="card" style="padding:16px">
             <h3>${s.title}</h3>
             <ul class="list">
               ${s.subsections.map(ss=>`<li class="item"><a href="#${s.id}/${ss.id}">${ss.title}</a></li>`).join('')}
             </ul>
           </div>
          `).join('')}
        </div>
      </section>`;
    return;
  }
  const sec = state.data.sections.find(s=> s.id===secId);
  if(!sec){ content.innerHTML = '<p class="card" style="padding:16px">Sección no encontrada.</p>'; bc.innerHTML=''; return;}

  if(!subId){
    // Página de sección
    bc.innerHTML = `<a href="#">Inicio</a> · ${sec.title}`;
    content.innerHTML = `
      <section class="card">
        <h2 class="section-title">${sec.title}</h2>
        <p class="section-sub">${sec.description||''}</p>
        <div class="grid cols-2">
          <div class="card" style="padding:16px">
            <h3>Subapartados</h3>
            <ul class="list">
              ${sec.subsections.map(ss=>`<li class="item"><a href="#${sec.id}/${ss.id}">${ss.title}</a></li>`).join('')}
            </ul>
          </div>
          <div class="card" style="padding:16px">
            ${sec.summary || ''}
          </div>
        </div>
      </section>`;
    return;
  }
  const sub = sec.subsections.find(x=> x.id===subId);
  bc.innerHTML = `<a href="#">Inicio</a> · <a href="#${sec.id}">${sec.title}</a> · ${sub?sub.title:'...'}`;
  if(!sub){ content.innerHTML = '<p class="card" style="padding:16px">Subapartado no encontrado.</p>'; return;}

  // Render de subapartado (cards y texto)
  content.innerHTML = `
    <section class="card" style="padding:16px">
      <h2 class="section-title">${sub.title}</h2>
      <p class="section-sub">${sub.subtitle||''}</p>
      ${sub.body ? `<div>${sub.body}</div>` : ''}
      ${sub.items? `<div class="grid cols-3" style="margin-top:16px">
        ${sub.items.map(it=>`
          <div class="card" style="padding:14px">
            ${it.badge?`<span class="tag">${it.badge}</span>`:''}
            <h3>${it.title||''}</h3>
            <p>${it.text||''}</p>
          </div>`).join('')}
      </div>`:''}
    </section>
  `;
}

init();
