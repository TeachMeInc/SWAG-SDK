/* #region Constants */

const AD_DISPLAY_DURATION = 5000;

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

      const containerEl = document.getElementById('swag-ad-container');
      containerEl.innerHTML = '';
      containerEl.appendChild(adEl);
      containerEl.style.display = 'flex';

      const done = () => {
        this.IsAdCurrentlyShowing = false;
        containerEl.style.display = 'none';
        resolve();
      };

      const timeout = setTimeout(() => {
        done();
      }, AD_DISPLAY_DURATION);

      adEl.addEventListener('click', () => {
        clearTimeout(timeout);
        done();
      });
    })
  }

  /* #endregion */



  /* #region Banner */

  GetBannerID (id)
  {
    return `swag-banner-${id}`;
  }

  GetBannerElement (id)
  {
    return document.getElementById(this.GetBannerID(id));
  }

  SetBannerPosition (el, x, y)
  {
    el.style.left = x + 'px';
    el.style.bottom = y + 'px';
  } 

  async ShowBanner (id, x, y, pivot, bannerSize)
  {
    return new Promise((resolve, reject) => {
      if (this.GetBannerElement(id)) return reject('Banner with that ID already exists.');

      const bannerEl = document.createElement('div');
      bannerEl.setAttribute('id', this.GetBannerID(id));
      bannerEl.classList.add('SWAGBanner');
      bannerEl.classList.add(`--size-${bannerSize}`);
      bannerEl.classList.add(`--pivot-${pivot}`);
      this.SetBannerPosition(bannerEl, x, y);
      bannerEl.innerHTML = ""; // TODO: inject banner

      const containerEl = document.getElementById('swag-banner-container');
      containerEl.appendChild(bannerEl);

      resolve();
    })
  }

  async PositionBanner (id, x, y)
  {
    return new Promise((resolve, reject) => {
      if (!this.GetBannerElement(id)) return reject(`Banner with ID '${id}' does not exist.`);

      const bannerEl = this.GetBannerElement(id);
      this.SetBannerPosition(bannerEl, x, y);

      resolve();
    });
  }

  async HideBanner (id)
  {
    return new Promise((resolve, reject) => {
      if (!this.GetBannerElement(id)) return reject(`Banner with ID '${id}' does not exist.`);

      const bannerEl = this.GetBannerElement(id);
      bannerEl.remove();

      resolve();
    });
  }

  /* #endregion */
}

window.SWAGSDK = new SWAGSDK();
