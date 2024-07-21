export const openMetaMaskApp = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      const deepLink = 'https://metamask.app.link/dapp/YOUR_DAPP_URL';
      window.open(deepLink, '_self');
    }
  };
  