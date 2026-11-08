try {
  const theme = localStorage.getItem('weiding-theme');
  if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
} catch {}
