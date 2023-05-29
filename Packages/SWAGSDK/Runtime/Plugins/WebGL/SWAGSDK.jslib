mergeInto(
	LibraryManager.library, 
	{
		WebInterface_GetToken: function () 
		{
			const SWAG = window.SWAGSDK;
			return SWAG.GetToken();
		},

		WebInterface_ShowAd: async function () 
		{
			const SWAG = window.SWAGSDK;

			try {
				await SWAG.ShowAd();
				SWAG.UnityInstance.SendMessage('SWAG', 'OnAdCompleted');
			} catch (err) {
				SWAG.UnityInstance.SendMessage('SWAG', 'OnAdError', err.message);
			}
		}
	}
);
