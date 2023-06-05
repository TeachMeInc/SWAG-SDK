/* #region Constants */

const AD_DISPLAY_DURATION = 5000;

/* #endregion */



class SWAGSDK 
{
  unityInstance = null;

  constructor ()
  {
    window.addEventListener('message', (event) => {
      if (
        event.origin.startsWith('http://localhost') ||
        event.origin.startsWith('https://localhost') ||
        event.origin.startsWith('https://local.addictinggames.com') ||
        event.origin.startsWith('https://new.addictinggames.com') ||
        event.origin.startsWith('https://www.addictinggames.com') ||
        event.origin.startsWith('https://local.shockwave.com') || 
        event.origin.startsWith('https://new.shockwave.com') || 
        event.origin.startsWith('https://www.shockwave.com') 
      ) {
        this.ReceiveMessage(event.data);
      };
    });
  }



  /* #region Authentication */

  GetToken () 
  {
    return document.cookie;
  }

  /* #endregion */



  /* #region Website Interop */

  OpenURL (url)
  {
    document.onmouseup = () => {
      window.open(url);
      document.onmouseup = null;
    };
  }

  SendMessage (eventName, message)
  {
    window.parent.postMessage(JSON.stringify({ eventName, message }), '*');
  }

  ReceiveMessage (payload) 
  {
    const { eventName, message } = JSON.parse(payload);

    switch (eventName) {
      // case 'XXX': {
      //   this.unityInstance.SendMessage('SWAG', 'OnXXX', message);
      //   return;
      // }
    }

    throw new Error('Unknown event name: ' + eventName);
  }

  /* #endregion */

  

  /* #region Ads */

  isAdCurrentlyShowing = false;

  async ShowAd () 
  {
    return new Promise((resolve, reject) => {
      if (this.isAdCurrentlyShowing) return reject('Ad is already being displayed.');
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



  /* #region Banners */

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
