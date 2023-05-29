mergeInto(
	LibraryManager.library, 
	{
		WebInterface_GetToken: function () 
		{
			return document.cookie;
		},

		WebInterface_ShowAd: function () 
		{
			return;
		}
	}
);
