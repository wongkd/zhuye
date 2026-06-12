(()=>{
      const mq = window.matchMedia;
      if(mq) {
        if(mq('(prefers-color-scheme: dark)').matches) { document.documentElement.dataset.theme = 'dark'; return; }
        if(mq('(prefers-color-scheme: light)').matches) { document.documentElement.dataset.theme = 'light'; return; }
      }
      const hour = new Date().getHours();
      document.documentElement.dataset.theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
    })();
