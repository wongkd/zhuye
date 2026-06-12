(()=>{
      const key = 'blry-theme-mode';
      const saved = localStorage.getItem(key);
      const mode = ['light','dark','system'].includes(saved) ? saved : 'system';
      const resolveSystem = () => {
        const mq = window.matchMedia;
        if(mq) {
          if(mq('(prefers-color-scheme: dark)').matches) return 'dark';
          if(mq('(prefers-color-scheme: light)').matches) return 'light';
        }
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'light' : 'dark';
      };
      document.documentElement.dataset.themeMode = mode;
      document.documentElement.dataset.theme = mode === 'system' ? resolveSystem() : mode;
    })();
