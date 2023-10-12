mergeInto(
	LibraryManager.library, 
	{
		/* #region Authentication */

		WebInterface_HasParentWindow: function ()
		{
			return window.self !== window.top;
		},

		WebInterface_GetToken: function () 
		{
			const SWAG = window.SWAGSDK;
			return SWAG.GetToken();
		},

		/* #endregion */



		/* #region Website Interop */

		WebInterface_OpenURL: function (url) 
		{
			const SWAG = window.SWAGSDK;
			SWAG.OpenURL(UTF8ToString(url));
		},

		WebInterface_SendMessage: function (eventName, message) 
		{
			const SWAG = window.SWAGSDK;
			SWAG.SendMessage(UTF8ToString(eventName), UTF8ToString(message));
		},

		WebInterface_ShowBrandingAnimation: function (videoUrl)
		{
				const SWAG = window.SWAGSDK;
				SWAG.ShowBrandingAnimation(UTF8ToString(videoUrl));
		},

		/* #endregion */



		/* #region Ads */

		WebInterface_BeginAd: async function () 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.BeginAd();
				SWAG.unityInstance.SendMessage('SWAG', 'OnAdComplete');
			} catch (err) {
				SWAG.unityInstance.SendMessage('SWAG', 'OnAdError', err);
			}
		},

		/* #endregion */



		/* #region Banners */

		WebInterface_ShowBanner: async function (id, x, y, pivot, bannerSize) 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.ShowBanner(UTF8ToString(id), x, y, UTF8ToString(pivot), UTF8ToString(bannerSize));
				return true;
			} catch (err) {
				SWAG.unityInstance.SendMessage('SWAG', 'OnBannerError', err);
				return false;
			}
		},

		WebInterface_PositionBanner: async function (id, x, y) 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.PositionBanner(UTF8ToString(id), x, y);
				return true;
			} catch (err) {
				SWAG.unityInstance.SendMessage('SWAG', 'OnBannerError', err);
				return false;
			}
		},

		WebInterface_HideBanner: async function (id) 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.HideBanner(UTF8ToString(id));
				return true;
			} catch (err) {
				SWAG.unityInstance.SendMessage('SWAG', 'OnBannerError', err);
				return false;
			}
		},

		/* #endregion */
	}
);
