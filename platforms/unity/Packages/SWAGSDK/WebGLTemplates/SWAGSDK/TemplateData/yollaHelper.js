class AdHelper 
{
    static makeBannerMarkup (bannerSize)
    {
        let type;
        switch (bannerSize)
        {
            case '728x90':
                type = 'desktop-leaderboard-template';
                break;
            case '300x250':
                type = 'desktop-medrec-template';
                break;
            case '320x50':
                type = 'mobile-leaderboard-template';
                break;
            case '468x60':
                type = '';
                break;
            case '320x100':
                type = '';
                break;
        }

        let template = document.getElementById('swag-banner-template').innerHTML;
        template.replace('{type}', type);
        template.replace('{subtype}', bannerSize);

        return template;
    }

    static showAd (containerId, _duration) 
    {
        return new Promise ((resolve, reject) => {
            const YMPB = window.YMPB;
            
            if (YMPB !== undefined) {
                try {
                    YMPB.preroll(containerId, resolve);
                } catch (err) {
                    reject(err.message);
                }
            } else {
                reject('Yolla library was not found.');
            }
        });
    }
}