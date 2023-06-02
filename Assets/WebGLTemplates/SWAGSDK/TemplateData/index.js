/* #region Constants */

const AD_DISPLAY_DURATION = 1000;

/* #endregion */



class SWAGSDK 
{
  UnityInstance = null;



  /* #region Authentication */

  GetToken () 
  {
    return document.cookie;
  }

  /* #endregion */



  /* #region Ads */

  IsAdCurrentlyShowing = false;

  async ShowAd () 
  {
    return new Promise((resolve, reject) => {
      if (this.IsAdCurrentlyShowing) return reject('Ad is already being displayed.');
      this.IsAdCurrentlyShowing = true;

      const adEl = document.createElement('div');
      adEl.classList.add('SWAGAd');
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

  /* #endregion */



  /* #region Banner */

  async ShowBanner (id, x, y, bannerSize)
  {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return reject('Banner with that ID already exists.');

      const bannerEl = document.createElement('div');
      bannerEl.setAttribute('id', id);
      bannerEl.classList.add('SWAGBanner');
      bannerEl.classList.add(`--size-${bannerSize}`);
      bannerEl.style.left = x;
      bannerEl.style.top = y;
      bannerEl.innerHTML = 'BANNER'; // TODO: inject banner

      const containerEl = document.getElementById('#swag-banner-container');
      containerEl.appendChild(bannerEl);

      resolve();
    })
  }

  async PositionBanner (id, x, y)
  {
    return new Promise((resolve, reject) => {
      if (!document.getElementById(id)) return reject('Banner with that ID does not exist.');

      const bannerEl = document.getElementById(id);
      bannerEl.style.left = x;
      bannerEl.style.top = y;

      resolve();
    });
  }

  async HideBanner (id)
  {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return reject('Banner with that ID does not exist.');

      const bannerEl = document.getElementById(id);
      bannerEl.remove();

      resolve();
    });
  }

  /* #endregion */
}

window.SWAGSDK = new SWAGSDK();
