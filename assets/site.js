const C = window.SITE_CONTENT || {};
    const esc = (v='') => String(v).replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
    const arrowIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>`;
    const skillIcon = `<svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M7 4v16m10-16v16M4 17h16"/></svg>`;
    const contactIcon = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>`;
    const externalIcon = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M9 7h8v8"/></svg>`;

    function renderChannelCard(ch, compact=false){
      const image = ch.image ? `<img src="${esc(ch.image)}" alt="${esc(ch.imageAlt || ch.name)}" loading="lazy">` : `<div class="qr-placeholder"><span>${esc((ch.name || 'QR').slice(0,3))}</span><small>后台上传</small></div>`;
      return `<article class="qr-card${compact ? ' compact' : ''}"><div class="qr-image">${image}</div><div class="qr-info"><div class="qr-label">${esc(ch.label || '扫码了解')}</div><h3>${esc(ch.name || '联系渠道')}</h3><p>${esc(ch.description || '')}</p></div></article>`;
    }

    function renderChannelBookmark(ch, index=0){
      const name = ch.name || '联系渠道';
      const type = name.includes('微信') ? 'wechat' : name.includes('抖音') ? 'douyin' : 'rednote';
      const logos = {
        wechat:`<img class="platform-logo-main" src="assets/images/contact/logo-wechat-app.png" alt="微信" loading="lazy"><img class="platform-logo-qr" src="assets/images/contact/wechat-qr-hover.png" alt="微信二维码" loading="lazy">`,
        douyin:`<img src="assets/images/contact/logo-douyin-app.png" alt="抖音" loading="lazy">`,
        rednote:`<img src="assets/images/contact/logo-rednote-app.png" alt="小红书" loading="lazy">`
      };
      const copy = {
        wechat:{desktop:{title:'微信咨询',lines:['发送户型图出方案'],hint:''},mobile:{title:'微信咨询',lines:['发送户型图、面积、预算诉求'],hint:'点击复制微信号'}},
        douyin:{desktop:{title:'装修干货',lines:[],hint:'点击卡片跳转链接'},mobile:{title:'抖音主页',lines:['施工现场 / 装修避坑'],hint:'点击跳转主页'}},
        rednote:{desktop:{title:'小红书主页',lines:[],hint:'点击卡片跳转链接'},mobile:{title:'小红书主页',lines:['案例笔记待补充'],hint:'链接待补充'}}
      }[type];
      const actionType = type === 'wechat' ? 'copy' : 'link';
      const renderCopySet = (set, cls) => `<div class="qr-copy-set ${cls}"><h3>${esc(set.title)}</h3>${set.lines.map(line=>`<p>${esc(line)}</p>`).join('')}${set.hint ? `<span class="channel-hint">${esc(set.hint)}</span>` : ''}</div>`;
      const text = `<div class="qr-bookmark-info">${renderCopySet(copy.desktop,'desktop-channel-copy')}${renderCopySet(copy.mobile,'mobile-channel-copy')}</div>`;
      const inner = `<div class="qr-bookmark-top"><span class="platform-logo ${type}">${logos[type]}</span></div>${text}`;
      const cls = `qr-bookmark contact-action-card ${type} ${type === 'wechat' ? 'primary' : ''}`;
      if(actionType === 'copy') return `<button class="${cls} js-copy-channel" type="button" style="--qr-index:${index}" data-copy="${esc(C.contact?.wechatId || 'biaoliruyi_dong')}" data-done="已复制微信号" aria-label="复制微信号，悬停查看二维码">${inner}</button>`;
      const url = type === 'douyin' ? (C.contact?.douyinUrl || '#contact') : (ch.url || '#contact');
      return `<a class="${cls}" style="--qr-index:${index}" href="${esc(url)}" target="_blank" rel="noopener" aria-label="打开${esc(name)}">${inner}</a>`;
    }

    function renderNavContact(){
      const channels = C.contact?.channels || [];
      if(!channels.length) return `<a href="#contact">${esc(C.nav.contact)}</a>`;
      return `<div class="nav-contact-wrap"><a class="nav-contact-trigger" href="#contact" aria-haspopup="true" aria-expanded="false">${esc(C.nav.contact)}</a><div class="nav-contact-panel" role="group" aria-label="联系二维码"><div class="nav-contact-panel-head"><strong>扫码快速联系</strong><span>微信 / 抖音 / 小红书</span></div><div class="nav-qr-grid">${channels.map(ch=>renderChannelCard(ch,true)).join('')}</div></div></div>`;
    }

    function render(){
      document.title = C.site?.title || '广东表里如一工程有限公司 | BLRY';
      document.getElementById('app').innerHTML = `
        <nav id="navbar" class="nav-shell" aria-label="主导航">
          <div class="nav-inner">
            <a class="brand" href="#hero" aria-label="返回首页"><span class="brand-mark${C.site.logoImage ? ' has-logo' : ''}">${C.site.logoImage ? `<img src="${esc(C.site.logoImage)}" alt="${esc(C.site.logoImageAlt || '公司 LOGO')}">` : 'BL'}</span><span class="brand-text">${esc(C.site.logo).replace(/\.$/,'<span class="gradient-text">.</span>')}</span></a>
            <div class="nav-links">
              <a href="#about">${esc(C.nav.about)}</a>
              <a href="#projects">${esc(C.nav.projects)}</a>
              <a href="#skills">${esc(C.nav.skills)}</a>
              ${renderNavContact()}
              <button class="theme-toggle js-theme-toggle" type="button" aria-label="切换浅色、深色或系统主题">
                <span class="theme-toggle-icon" aria-hidden="true"></span>
                <span class="theme-toggle-label">当前主题：系统</span>
              </button>
              <button class="nav-login js-login-entry" type="button" aria-label="登录管理后台">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                登录
              </button>
            </div>
            <div class="nav-actions">
              <button class="theme-toggle js-theme-toggle mobile-theme-toggle" type="button" aria-label="切换浅色、深色或系统主题">
                <span class="theme-toggle-icon" aria-hidden="true"></span>
                <span class="theme-toggle-label">当前主题：系统</span>
              </button>
              <button id="menuToggle" class="menu-toggle" type="button" aria-controls="mobileMenu" aria-expanded="false">菜单</button>
            </div>
          </div>
          <div id="mobileMenu" class="mobile-menu">
            <a href="#about">${esc(C.nav.about)} ${arrowIcon}</a>
            <a href="#projects">${esc(C.nav.projects)} ${arrowIcon}</a>
            <a href="#skills">${esc(C.nav.skills)} ${arrowIcon}</a>
            <a href="#contact">${esc(C.nav.contact)} ${arrowIcon}</a>
            <a class="js-edit-entry" href="javascript:void(0)">登录 ${arrowIcon}</a>
          </div>
        </nav>

        <main>
          <section id="hero" class="hero">
            <div class="container-page hero-grid">
              <div class="hero-copy">
                <span class="eyebrow reveal">${esc(C.hero.eyebrow)}</span>
                <h1 class="font-display hero-title reveal"><span class="gradient-text">${esc(C.hero.titleHighlight)}</span><br><span class="hero-title-main">${C.hero.titleMain === '把家装成理想生活' ? '<span class="mobile-title-line">把家</span><span class="mobile-title-line">装成理想生活</span>' : esc(C.hero.titleMain)}</span></h1>
                <p class="hero-subtitle reveal">${esc(C.hero.subtitle)}</p>
                <div class="hero-actions reveal">
                  <a href="${esc(C.hero.primaryUrl || '#projects')}" class="btn-primary"${/^https?:\/\//.test(C.hero.primaryUrl || '') ? ' target="_blank" rel="noopener"' : ''}>${esc(C.hero.primaryButton)} ${/^https?:\/\//.test(C.hero.primaryUrl || '') ? externalIcon : arrowIcon}</a>
                  <a href="${esc(C.hero.secondaryUrl || '#contact')}" class="btn-outline">${esc(C.hero.secondaryButton)}</a>
                </div>
                <div class="stats-row hero-stats-desktop reveal">
                  ${(C.hero.stats||[]).map(s=>`<div class="stat-pill"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('')}
                </div>
              </div>
              <div class="hero-visual reveal">
                <div class="hero-frame">
                  <img src="${esc(C.hero.image)}" alt="${esc(C.hero.imageAlt)}" loading="eager">
                  <div class="status-card"><small>${esc(C.hero.statusLabel)}</small><strong>${esc(C.hero.statusText)}</strong></div>
                </div>
              </div>
              <div class="stats-row hero-stats-mobile reveal">
                ${(C.hero.stats||[]).map(s=>`<div class="stat-pill"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('')}
              </div>
            </div>
          </section>

          <section id="about" class="scroll-stage">
            <div class="container-page about-grid">
              <div class="sticky-copy">
                <span class="eyebrow reveal">${esc(C.about.eyebrow)}</span>
                <h2 class="font-display section-title reveal">${esc(C.about.titleTop)}<br><span class="gradient-text">${esc(C.about.titleHighlight)}</span></h2>
                <p class="section-desc about-desc reveal"><span class="about-desc-full">${esc(C.about.description)}</span><span class="about-desc-short">把预算、材料、工艺和验收节点讲清楚，让每一步都经得起检查。</span></p><div class="about-promise-tags reveal"><span>预算透明</span><span>材料清晰</span><span>工艺可追踪</span><span>交付可验收</span></div>
              </div>
              <div class="about-content">
                <div class="timeline">
                  ${(C.about.experiences||[]).map(e=>`<article class="glass-card timeline-card reveal"><div class="timeline-top"><span class="period" data-step="${esc(e.period.replace('STEP ',''))}">${esc(e.period)}</span><div><h3>${esc(e.role)}</h3><div class="company">${esc(e.company)}</div><div class="company-tags" aria-label="${esc(e.company)}">${esc(e.company).split(' / ').slice(0,4).map(t=>`<span>${t}</span>`).join('')}</div></div></div><p>${esc(e.description)}</p></article>`).join('')}
                </div>
                <div class="about-proof-label reveal">交付不是口号，是结果沉淀</div>
                <div class="about-stats">
                  ${(C.about.stats||[]).map(s=>`<div class="glass-card about-stat reveal"><div class="stat-number gradient-text" data-count="${Number(s.value)||0}" data-suffix="${esc(s.suffix)}">${esc(s.value)}${esc(s.suffix)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join('')}
                </div>
              </div>
            </div>
          </section>

          <section id="projects" class="scroll-stage">
            <div class="container-page">
              <div class="section-head">
                <span class="eyebrow reveal">${esc(C.projectsSection.eyebrow)}</span>
                <h2 class="font-display section-title reveal">${esc(C.projectsSection.titlePrefix)}<span class="gradient-text">${esc(C.projectsSection.titleHighlight)}</span></h2>
                <p class="section-desc reveal">${esc(C.projectsSection.description)}</p>
              </div>
              <div class="projects-grid">
                ${(C.projects||[]).map(p=>`<article class="project-card glass-card reveal"><div class="project-media"><img src="${esc(p.image)}" alt="${esc(p.title)}" class="project-image" loading="lazy"></div><div class="project-body"><div class="meta-row"><span class="badge">${esc(p.category)}</span><span class="year">${esc(p.year)}</span></div><h3>${esc(p.title)}</h3><div class="project-tags"><span>${esc(p.category)}</span><span>预算规划</span><span>交付可验</span></div><p>${esc(p.description)}</p><a href="${esc(p.link||'#contact')}" class="text-link">查看方案 ${arrowIcon}</a></div></article>`).join('')}
              </div>
            </div>
          </section>

          <section id="skills" class="scroll-stage">
            <div class="container-page">
              <div class="section-head">
                <span class="eyebrow reveal">${esc(C.skillsSection.eyebrow)}</span>
                <h2 class="font-display section-title reveal">${esc(C.skillsSection.titlePrefix)}<span class="gradient-text">${esc(C.skillsSection.titleHighlight)}</span></h2>
                <p class="section-desc reveal">${esc(C.skillsSection.description)}</p>
              </div>
              <div class="skills-grid">
                ${[...(C.skillGroups||[])].sort((a,b)=>(b.featured===true)-(a.featured===true)).map((g,index)=>{const featured=g.featured===true;const brief={整装:['整体打包报价','设计材料施工统一核算','省心托管，风格和落地一起管。',['统一核算','主材配置','施工交付','省心托管']],传统报价式半包:['人工 + 辅材 + 清单','主材业主自购','主材自己选，施工和现场有人管。',['清单报价','主材自购','辅材施工','节点验收']],特色式半包:['只收工程管理费','其他项目成本价','管理费透明收，材料施工按成本价走。',['费用拆开','成本可看','材料明细','节点验收']]}[g.title]||[g.price||g.title,(g.items||[])[0]||'报价清楚',g.standard||'',(g.items||[]).slice(0,4)];return `<article class="glass-card skill-card reveal${featured ? ' featured' : ''}">${featured ? '<span class="featured-badge">✦ 最省钱</span>' : ''}<div class="pricing-card-head"><div class="icon-box">${skillIcon}</div></div><h3>${esc(g.title)}</h3><div class="pricing-promise"><strong>${esc(brief[0])}</strong><span>${esc(brief[1])}</span></div>${brief[2] ? `<p class="pricing-standard">${esc(brief[2])}</p>` : ''}<div class="skill-tags">${brief[3].map(x=>`<span class="skill-tag">${esc(x)}</span>`).join('')}</div></article>`}).join('')}
              </div>
            </div>
          </section>

          <section id="contact" class="contact scroll-stage">
            <div class="container-page contact-grid">
              <div class="contact-copy">
                <div class="section-head">
                  <span class="eyebrow reveal"><span class="desktop-copy">${esc(C.contact.eyebrow)}</span><span class="mobile-copy">${esc(C.contact.mobile?.eyebrow || C.contact.eyebrow)}</span></span>
                  <h2 class="font-display section-title reveal"><span class="desktop-copy">${esc(C.contact.titleTop)}<br><span class="gradient-text">${esc(C.contact.titleHighlight)}</span></span><span class="mobile-copy">${esc(C.contact.mobile?.titleTop || C.contact.titleTop)}<br><span class="gradient-text">${esc(C.contact.mobile?.titleHighlight || C.contact.titleHighlight)}</span></span></h2>
                  <p class="section-desc reveal"><span class="desktop-copy">${esc(C.contact.description)}</span><span class="mobile-copy">${esc(C.contact.mobile?.description || C.contact.description)}</span></p>
                </div>
                <div class="qr-fan-board reveal is-open" aria-label="扫码联系与关注">
                  ${(C.contact.channels||[]).sort((a,b)=>{
                    const rank = n => n.includes('微信') ? 0 : n.includes('抖音') ? 1 : n.includes('小红书') ? 2 : 3;
                    return rank(a.name || '') - rank(b.name || '');
                  }).map((ch,index)=>renderChannelBookmark(ch,index)).join('')}
                </div>
              </div>
              <form class="glass-card quote-form reveal" novalidate>
                <div class="form-head"><span>预算预估表单</span><strong>补充房屋信息</strong><p>信息越完整，初步判断越接近真实预算。</p></div>
                <div class="field"><label for="name">${esc(C.contact.form.nameLabel)}</label><input id="name" name="name" type="text" placeholder="${esc(C.contact.form.namePlaceholder)}" autocomplete="name" required><small class="field-error" data-error-for="name"></small></div>
                <div class="field"><label for="email"><span class="desktop-copy">邮箱</span><span class="mobile-copy">邮箱 / 手机号</span></label><input id="email" name="email" type="text" placeholder="${esc(C.contact.form.emailPlaceholder)}" autocomplete="email" required><small class="field-error" data-error-for="email"></small></div>
                <div class="field"><label for="type">${esc(C.contact.form.typeLabel)}</label><select id="type" name="type" required><option value="" disabled selected>${esc(C.contact.form.typePlaceholder)}</option>${(C.contact.form.typeOptions||[]).map(o=>`<option>${esc(o)}</option>`).join('')}</select><small class="field-error" data-error-for="type"></small></div>
                <div class="field"><label for="message">${esc(C.contact.form.messageLabel)}</label><textarea id="message" name="message" placeholder="${esc(C.contact.form.messagePlaceholder)}" required></textarea><small class="field-error" data-error-for="message"></small></div>
                <button class="btn-primary submit-btn" type="submit"><span class="submit-spinner" aria-hidden="true"></span><span class="submit-label">${esc(C.contact.form.submitText)}</span> ${arrowIcon}</button>
                <p class="form-feedback" aria-live="polite"></p>
                <p class="form-note">提交后页面会在本机生成沟通摘要；正式沟通建议同时发送邮箱，便于附户型图和现场照片。</p>
              </form>
            </div>
          </section>
        </main>

        <footer>
          <div class="container-page footer-row"><p>${esc(C.site.footerLeft)}</p><p>${esc(C.site.footerRight)}</p></div>
        </footer>`;
    }

    const THEME_STORAGE_KEY = 'blry-theme-mode';

    function systemTheme(){
      if(window.matchMedia){
        if(window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        if(window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
      }
      const hour = new Date().getHours();
      return (hour >= 6 && hour < 18) ? 'light' : 'dark';
    }

    function getThemeMode(){
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return ['light','dark','system'].includes(saved) ? saved : 'system';
    }

    function resolveTheme(mode = getThemeMode()){
      return mode === 'system' ? systemTheme() : mode;
    }

    function applyTheme(mode = getThemeMode()){
      const resolved = resolveTheme(mode);
      document.documentElement.dataset.themeMode = mode;
      document.documentElement.dataset.theme = resolved;
      const meta = document.querySelector('meta[name="theme-color"]');
      if(meta) meta.setAttribute('content', resolved === 'dark' ? '#0b0b0f' : '#f5f5f7');
      document.querySelectorAll('.js-theme-toggle').forEach(btn=>{
        btn.setAttribute('aria-pressed', mode !== 'system' ? 'true' : 'false');
        btn.setAttribute('data-mode', mode);
        const label = mode === 'light' ? '浅色' : mode === 'dark' ? '深色' : '系统';
        const sr = btn.querySelector('.theme-toggle-label');
        if(sr) sr.textContent = `当前主题：${label}`;
      });
    }

    function cycleTheme(){
      const modes = ['system','light','dark'];
      const current = getThemeMode();
      const next = modes[(modes.indexOf(current) + 1) % modes.length] || 'system';
      localStorage.setItem(THEME_STORAGE_KEY, next);
      applyTheme(next);
    }

    function initTheme(){
      applyTheme(getThemeMode());
      document.querySelectorAll('.js-theme-toggle').forEach(btn=>btn.addEventListener('click',cycleTheme));
      const onSystemChange = () => { if(getThemeMode() === 'system') applyTheme('system'); };
      window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change',onSystemChange);
      window.matchMedia?.('(prefers-color-scheme: light)').addEventListener?.('change',onSystemChange);
    }

    function initMenu(){
      const nav = document.getElementById('navbar');
      const btn = document.getElementById('menuToggle');
      const menu = document.getElementById('mobileMenu');
      const body = document.body;
      const scrollY = () => window.scrollY;
      let savedScroll = 0;

      function openMenu(){
        savedScroll = scrollY();
        menu.classList.add('open');
        nav.classList.add('menu-open');
        body.classList.add('menu-locked');
        body.style.top = `-${savedScroll}px`;
        btn.setAttribute('aria-expanded','true');
        btn.textContent = '关闭';
        // Prevent background touch-scroll
        menu.addEventListener('touchmove',preventScroll,{passive:false});
      }

      function closeMenu(){
        menu.classList.remove('open');
        nav.classList.remove('menu-open');
        body.classList.remove('menu-locked');
        body.style.top = '';
        window.scrollTo({top:savedScroll,behavior:'instant'});
        btn.setAttribute('aria-expanded','false');
        btn.textContent = '菜单';
        menu.removeEventListener('touchmove',preventScroll);
      }

      function preventScroll(e){ e.preventDefault(); }

      function toggleMenu(e){
        e.preventDefault();
        if(menu.classList.contains('open')){ closeMenu(); }
        else { openMenu(); }
      }

      btn?.addEventListener('click',toggleMenu);
      btn?.addEventListener('touchend',e=>{ e.preventDefault(); toggleMenu(e); });

      menu?.querySelectorAll('a:not(.js-edit-entry)').forEach(a=>{
        a.addEventListener('click',()=>{ closeMenu(); });
        a.addEventListener('touchend',e=>{
          e.preventDefault();
          const href = a.getAttribute('href');
          closeMenu();
          setTimeout(()=>{ if(href) window.location.hash = href; },260);
        });
      });
      // Login link: close menu first, then open login modal after scroll lock is released
      menu?.querySelectorAll('a.js-edit-entry').forEach(a=>{
        a.addEventListener('click',e=>{ e.preventDefault(); closeMenu(); setTimeout(()=>openLoginModal(e),40); });
        a.addEventListener('touchend',e=>{ e.preventDefault(); closeMenu(); setTimeout(()=>openLoginModal(e),40); });
      });

      // Close menu on Escape key
      document.addEventListener('keydown',e=>{
        if(e.key === 'Escape' && menu?.classList.contains('open')) closeMenu();
      });
    }

    function doLogin(){
      const username = (document.getElementById('loginUsername')?.value || '').trim();
      const password = document.getElementById('loginPassword')?.value || '';
      const err = document.querySelector('.js-login-error');
      if((username === 'admin' || username === '') && password === 'hqd125125'){
        sessionStorage.setItem('portfolio-cms-entry-ok','1');
        localStorage.setItem('portfolio-cms-entry-ok','1');
        closeLoginModal();
        location.href = 'editor.html?entry=auth';
      }else{
        if(err) err.classList.add('show');
      }
    }

    function openLoginModal(e){
      e?.preventDefault();
      const overlay = document.getElementById('loginOverlay');
      if(!overlay) return;
      // Ensure body is free before locking for modal
      document.body.style.overflow = 'hidden';
      overlay.classList.add('open');
      const err = overlay.querySelector('.js-login-error');
      if(err) err.classList.remove('show');
      const pw = overlay.querySelector('#loginPassword');
      if(pw){ pw.value = ''; setTimeout(()=>pw.focus(),260); }
    }

    function closeLoginModal(){
      const overlay = document.getElementById('loginOverlay');
      if(!overlay) return;
      overlay.classList.remove('open');
      if(!document.body.classList.contains('menu-locked')) document.body.style.overflow = '';
    }

    function initLogin(){
      document.querySelectorAll('.js-login-entry').forEach(a=>a.addEventListener('click',openLoginModal));
      document.querySelector('.js-login-submit')?.addEventListener('click',doLogin);
      document.querySelector('.js-login-close')?.addEventListener('click',closeLoginModal);
      document.getElementById('loginOverlay')?.addEventListener('click',e=>{ if(e.target === e.currentTarget) closeLoginModal(); });
      document.addEventListener('keydown',e=>{
        if(e.key === 'Escape') closeLoginModal();
        if(e.key === 'Enter' && document.getElementById('loginOverlay')?.classList.contains('open')) doLogin();
      });
    }

    function initContactForm(){
      const form = document.querySelector('.quote-form');
      if(!form) return;
      const feedback = form.querySelector('.form-feedback');
      const submit = form.querySelector('.submit-btn');
      const label = form.querySelector('.submit-label');
      const setError = (name,msg='') => {
        const field = form.elements[name];
        const error = form.querySelector(`[data-error-for="${name}"]`);
        field?.classList.toggle('invalid', Boolean(msg));
        if(error) error.textContent = msg;
      };
      const showFeedback = (msg,type='success') => {
        if(!feedback) return;
        feedback.textContent = msg;
        feedback.className = `form-feedback show ${type}`;
      };
      const validate = () => {
        const values = Object.fromEntries(new FormData(form).entries());
        let ok = true;
        setError('name'); setError('email'); setError('type'); setError('message');
        if(!String(values.name||'').trim()){ setError('name','请留下称呼，方便后续沟通。'); ok=false; }
        const contact = String(values.email||'').trim();
        const isEmail = /^\S+@\S+\.\S+$/.test(contact);
        const isPhone = /^1[3-9]\d{9}$/.test(contact.replace(/[\s-]/g,''));
        if(!isEmail && !isPhone){ setError('email','请输入有效邮箱或手机号，便于接收方案反馈。'); ok=false; }
        if(!String(values.type||'').trim()){ setError('type','请选择项目类型。'); ok=false; }
        if(String(values.message||'').trim().length < 8){ setError('message','请简单描述项目需求，至少 8 个字。'); ok=false; }
        return { ok, values };
      };
      document.querySelectorAll('.js-copy-channel').forEach(btn=>btn.addEventListener('click',async()=>{
        const value = btn.dataset.copy || '';
        if(!value) return;
        const hint = btn.querySelector('.channel-hint');
        const original = hint?.textContent || '';
        try{
          if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
          else { const ta=document.createElement('textarea'); ta.value=value; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
          if(hint) hint.textContent = btn.dataset.done || '已复制';
          btn.classList.add('copied');
          window.setTimeout(()=>{ if(hint) hint.textContent=original; btn.classList.remove('copied')},1800);
        }catch(err){ if(hint) hint.textContent = value; }
      }));
      form.querySelectorAll('input,select,textarea').forEach(el=>el.addEventListener('input',()=>setError(el.name)));
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const { ok, values } = validate();
        if(!ok){ showFeedback('请先完善标红字段，再提交沟通信息。','error'); return; }
        submit.disabled = true; submit.classList.add('loading'); if(label) label.textContent = '正在提交...';
        try {
          const res = await fetch('/api/send-inquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: values.name, email: values.email, type: values.type, message: values.message })
          });
          const data = await res.json();
          if(!res.ok || !data.ok) throw new Error(data.error || '发送失败');
          showFeedback('需求已收到，我们会尽快联系你。', 'success');
          form.reset();
          if(label) label.textContent = '已提交 ✓';
        } catch(err) {
          showFeedback('提交失败，请稍后重试或直接联系微信。', 'error');
          submit.disabled = false; submit.classList.remove('loading'); if(label) label.textContent = C.contact.form.submitText || '提交需求';
        }
      });
    }

    function initAnimations(){
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const nav = document.getElementById('navbar');
      const setNav = () => nav?.classList.toggle('nav-blur', window.scrollY > 24);
      const ready = () => document.body.classList.add('motion-ready');
      const unique = nodes => Array.from(new Set(Array.from(nodes).filter(Boolean)));
      const setStagger = (nodes, step = 1) => unique(nodes).forEach((el,i)=>el.style.setProperty('--stagger-index', String(i * step)));
      const bindPressFeedback = () => {
        unique(document.querySelectorAll('.project-card, .skill-card, .contact-link, .qr-card, .qr-bookmark, .btn-primary, .btn-outline, .menu-toggle, .theme-toggle')).forEach(el=>{
          const down = () => el.classList.add('is-pressed');
          const up = () => el.classList.remove('is-pressed');
          el.addEventListener('pointerdown', down, { passive:true });
          el.addEventListener('pointerup', up, { passive:true });
          el.addEventListener('pointercancel', up, { passive:true });
          el.addEventListener('pointerleave', up, { passive:true });
        });
      };
      const runTransitionPulse = () => {
        document.body.classList.add('section-transition');
        window.setTimeout(()=>document.body.classList.remove('section-transition'), 280);
      };
      setNav(); window.addEventListener('scroll', setNav, { passive:true });
      setStagger(document.querySelectorAll('.hero-copy .reveal, .hero-actions, .hero-visual, .hero-stats-mobile .stat-pill'), 1);
      bindPressFeedback();
      window.addEventListener('load', ()=>window.setTimeout(ready, 180), { once:true });
      window.setTimeout(ready, 520);
      initContactForm();
      document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href')); if(t){e.preventDefault(); runTransitionPulse(); if(window.gsap && !reduce && !isMobile){gsap.to(window,{duration:.72,scrollTo:{y:t,offsetY:96},ease:'power3.out'})}else{t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}}}));
      if(reduce){document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity=1;el.style.transform='none'});document.querySelectorAll('.qr-fan-board').forEach(el=>el.classList.add('is-open'));ready();return;}
      if(isMobile){
        if(window.ScrollTrigger){ ScrollTrigger.getAll().forEach(st=>st.kill()); }
        const mobileTargets = unique(document.querySelectorAll('.hero-copy .reveal, .hero-visual, .hero-stats-mobile .stat-pill, .section-head .reveal, .sticky-copy .reveal, .timeline-card, .project-card, .skill-card, .about-stat, .qr-fan-board, .qr-card, .qr-bookmark, .quote-form'));
        mobileTargets.forEach((el,i)=>{
          el.classList.add('mobile-reveal');
          el.style.transitionDelay = `${Math.min(i * 60, 350)}ms`;
        });
        const show = el => {
          el.classList.add('is-visible');
          if(el.classList.contains('qr-fan-board')) el.classList.add('is-open');
          window.setTimeout(()=>{ el.style.transitionDelay = ''; }, 760);
        };
        const showSectionGroup = target => {
          const section = target.closest('section');
          if(!section) return;
          unique(section.querySelectorAll('.mobile-reveal:not(.is-visible)')).forEach((el,i)=>{
            el.style.transitionDelay = `${Math.min(i * 40, 200)}ms`;
            show(el);
          });
        };
        const observer = new IntersectionObserver(entries=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              showSectionGroup(entry.target);
              show(entry.target);
              observer.unobserve(entry.target);
            }
          });
        }, { root:null, rootMargin:'18% 0px -8% 0px', threshold:.06 });
        mobileTargets.forEach(el=>observer.observe(el));
        const featuredLightObserver = new IntersectionObserver(entries=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              entry.target.classList.add('is-lit');
              featuredLightObserver.unobserve(entry.target);
            }
          });
        }, { root:null, rootMargin:'-18% 0px -18% 0px', threshold:.42 });
        document.querySelectorAll('.skill-card.featured').forEach(el=>featuredLightObserver.observe(el));
        setTimeout(()=>document.querySelectorAll('.hero .mobile-reveal').forEach(show), 180);
        const animateNumber = stat => {
          if(stat.dataset.counted === 'true') return;
          stat.dataset.counted = 'true';
          const target = parseInt(stat.dataset.count) || 0;
          const suffix = stat.dataset.suffix || '';
          const start = performance.now();
          const duration = 1180;
          const ease = t => 1 - Math.pow(1 - t, 3);
          const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            stat.textContent = Math.round(target * ease(p)) + suffix;
            if(p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        };
        const statObserver = new IntersectionObserver(entries=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              animateNumber(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        }, { root:null, rootMargin:'0px 0px -12% 0px', threshold:.2 });
        document.querySelectorAll('.stat-number').forEach(stat=>statObserver.observe(stat));
        return;
      }
      if(!window.gsap){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));document.querySelectorAll('.qr-fan-board').forEach(el=>el.classList.add('is-open'));return;}
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      // Apple-style: simple fade-up reveals, no pin, no scrub, no blur
      const stDefaults = { start:'top 76%', toggleActions:'play none none none', once:true };

      // Section titles — subtle rise with ordered cascade
      document.querySelectorAll('.section-head, .sticky-copy').forEach(group=>{
        gsap.fromTo(group.querySelectorAll('.reveal'), { opacity:0, y:28 }, { scrollTrigger:{trigger:group,...stDefaults}, opacity:1, y:0, duration:.68, stagger:.075, ease:'power3.out' });
      });

      // Timeline cards — rise from below, stagger
      document.querySelectorAll('.timeline-card').forEach((el,i)=>{
        gsap.fromTo(el, { opacity:0, y:36 }, { scrollTrigger:{trigger:el,...stDefaults}, opacity:1, y:0, duration:.58, delay:Math.min(i*.08,.32), ease:'power3.out' });
      });

      // About stats — pop in
      document.querySelectorAll('.about-stat').forEach((el,i)=>{
        gsap.fromTo(el, { opacity:0, y:24, scale:.96 }, { scrollTrigger:{trigger:el,...stDefaults}, opacity:1, y:0, scale:1, duration:.52, delay:Math.min(i*.06,.2), ease:'back.out(1.25)' });
      });

      // Project cards — fade up, stagger
      document.querySelectorAll('.project-card').forEach((el,i)=>{
        gsap.fromTo(el, { opacity:0, y:48 }, { scrollTrigger:{trigger:el,...stDefaults}, opacity:1, y:0, duration:.66, delay:Math.min(i*.09,.36), ease:'power3.out' });
      });

      // Skill cards — side + fade
      document.querySelectorAll('.skill-card').forEach((el,i)=>{
        gsap.fromTo(el, { opacity:0, x:-36, y:12 }, { scrollTrigger:{trigger:el,...stDefaults}, opacity:1, x:0, y:0, duration:.62, delay:Math.min(i*.12,.36), ease:'power3.out' });
      });

      // Contact form — keep QR fan visible; only animate the form reveal
      document.querySelectorAll('.quote-form').forEach((el,i)=>{
        gsap.fromTo(el, { opacity:0, y:32 }, { scrollTrigger:{trigger:el,...stDefaults}, opacity:1, y:0, duration:.6, delay:Math.min(i*.06,.18), ease:'power3.out' });
      });

      // Hero elements — staged page load moment
        gsap.fromTo('.hero-copy .reveal', { opacity:0, y:38, filter:'blur(10px)' }, { opacity:1, y:0, filter:'blur(0px)', duration:.86, stagger:.085, ease:'power3.out' });
      gsap.fromTo('.hero-visual', { opacity:0, y:46, scale:.975, filter:'blur(8px)' }, { opacity:1, y:0, scale:1, filter:'blur(0px)', duration:.92, delay:.16, ease:'power3.out' });
      gsap.fromTo('.hero-stats-desktop .stat-pill', { opacity:0, y:22, scale:.96 }, { opacity:1, y:0, scale:1, duration:.62, delay:.34, stagger:.075, ease:'back.out(1.18)' });

      // Gentle desktop parallax — no pin, no layout refresh pressure
      document.querySelectorAll('.hero-visual, .project-media img').forEach(el=>{
        gsap.to(el, { yPercent: el.classList.contains('hero-visual') ? -4 : -6, ease:'none', scrollTrigger:{ trigger:el, start:'top bottom', end:'bottom top', scrub:.45 } });
      });

      // Stat counters
      document.querySelectorAll('.stat-number').forEach(stat=>{const target=parseInt(stat.dataset.count)||0;const suffix=stat.dataset.suffix||'';gsap.fromTo(stat,{innerHTML:0,scale:.96},{scrollTrigger:{trigger:stat,start:'top 84%',once:true},innerHTML:target,scale:1,duration:1.35,ease:'power3.out',snap:{innerHTML:1},onUpdate(){stat.innerHTML=Math.round(this.targets()[0].innerHTML)+suffix}})});
    }

    function initWebGL(){
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isDark = document.documentElement.dataset.theme === 'dark';
      if(isMobile || reduce || !window.THREE || !isDark)return;
      const canvas=document.getElementById('webgl-bg');
      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,1000);camera.position.z=30;
      const geo=new THREE.BufferGeometry();const count=150;const pos=new Float32Array(count*3);
      for(let i=0;i<count*3;i++)pos[i]=(Math.random()-.5)*100;
      geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
      const mat=new THREE.PointsMaterial({size:.18,color:0xae8555,transparent:true,opacity:.55,blending:THREE.AdditiveBlending});
      const pts=new THREE.Points(geo,mat);scene.add(pts);
      let id,visible=true;
      function animate(){if(!visible)return;id=requestAnimationFrame(animate);const time=performance.now()*.001;pts.rotation.y=time*.035;pts.rotation.x=time*.012;renderer.render(scene,camera)}
      animate();
      document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible)animate();else cancelAnimationFrame(id)});
      addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)},{passive:true});
    }

    function initFullPageScroll(){
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const sections = Array.from(document.querySelectorAll('section[id]'));
      if(!sections.length || isMobile) return;
      let current = 0;
      let busy = false;
      const THROTTLE = 900;
      const MIN_DELTA = 40;

      function go(idx){
        if(busy || idx<0 || idx>=sections.length) return;
        busy = true;
        current = idx;
        const top = sections[idx].offsetTop;
        if(window.gsap && !reduce){
          gsap.to(window, {duration:.7, scrollTo:{y:top, offsetY:80}, ease:'power3.out', onComplete(){busy=false}});
        } else {
          window.scrollTo({top:top-80, behavior:'smooth'});
          setTimeout(()=>{busy=false}, THROTTLE);
        }
      }

      window.addEventListener('wheel', (e)=>{
        if(busy || !isDesktop()) return;
        if(Math.abs(e.deltaY) < MIN_DELTA) return;
        e.preventDefault();
        if(e.deltaY > 0) go(current+1);
        else go(current-1);
      }, {passive:false});

      document.addEventListener('keydown', (e)=>{
        if(busy || !isDesktop()) return;
        if(e.key === 'ArrowDown' || e.key === 'PageDown'){ e.preventDefault(); go(current+1); }
        if(e.key === 'ArrowUp' || e.key === 'PageUp'){ e.preventDefault(); go(current-1); }
      });

      function isDesktop(){ return window.innerWidth > 767; }

      // keep current index in sync when user swipes or navigates via nav
      window.addEventListener('scroll', ()=>{
        if(busy) return;
        const cy = window.scrollY + window.innerHeight * .45;
        let best = 0;
        for(let i=0; i<sections.length; i++){
          if(cy >= sections[i].offsetTop) best = i;
        }
        current = best;
      }, {passive:true});
    }

    render();
    initTheme();
    initMenu();
    initLogin();
    initWebGL();
    initAnimations();