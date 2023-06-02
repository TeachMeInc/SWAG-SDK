mergeInto(
	LibraryManager.library, 
	{
		/* #region Authentication */

		WebInterface_GetToken: function () 
		{
			const SWAG = window.SWAGSDK;
			return SWAG.GetToken();
		},

		/* #endregion */



		/* #region Ads */

		WebInterface_ShowAd: async function () 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.ShowAd();
				SWAG.UnityInstance.SendMessage('SWAG', 'OnAdCompleted');
			} catch (err) {
				SWAG.UnityInstance.SendMessage('SWAG', 'OnAdError', err.message);
			}
		},

		/* #endregion */



		/* #region Banners */

		WebInterface_ShowBanner: async function (id, x, y, bannerSize) 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.ShowBanner(id, x, y, bannerSize);
				return true;
			} catch (err) {
				SWAG.UnityInstance.SendMessage('SWAG', 'OnBannerError', err.message);
				return false;
			}
		},

		WebInterface_PositionBanner: async function (id, x, y) 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.PositionBanner(id, x, y);
				return true;
			} catch (err) {
				SWAG.UnityInstance.SendMessage('SWAG', 'OnBannerError', err.message);
				return false;
			}
		},

		WebInterface_HideBanner: async function (id) 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.HideBanner(id);
				return true;
			} catch (err) {
				SWAG.UnityInstance.SendMessage('SWAG', 'OnBannerError', err.message);
				return false;
			}
		},

		/* #endregion */
	}
);
