window.onload = async () => {
  // Style other pages
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    lightMode = false;
    document.body.setAttribute('data-lit-theme', 'dark');
  }
};
