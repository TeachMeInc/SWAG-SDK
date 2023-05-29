const AD_DISPLAY_DURATION = 1000;

class SWAGSDK 
{
  UnityInstance = null;

  GetToken () 
  {
    return document.cookie;
  }

  IsAdCurrentlyShowing = false;

  async ShowAd () 
  {
    return new Promise((resolve, reject) => {
      if (this.IsAdCurrentlyShowing) reject('Ad is already being displayed.');
      this.IsAdCurrentlyShowing = true;

      const adEl = document.createElement('div');
      adEl.innerHTML = 'ADVERTISEMENT'; // TODO: inject ad

      const containerEl = document.getElementById('#swag-ad-container');
      containerEl.innerHTML = '';
      containerEl.appendChild(adEl);
      containerEl.style.display = 'block';

      setTimeout(() => {
        this.IsAdCurrentlyShowing = false;
        containerEl.style.display = 'hidden';
        resolve();
      }, AD_DISPLAY_DURATION);
    })
  }
}

window.SWAGSDK = new SWAGSDK();
