using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.Networking;
using AddictingGames;

namespace AddictingGames
{
    class BypassCertificateHandler : CertificateHandler
    {
        protected override bool ValidateCertificate(byte[] certificateData)
        {
            return true;
        }
    }

    public class AsyncHandler <T>
    {
        System.Action<T> onSuccess;
        System.Action<string> onError;

        public AsyncHandler (
            System.Action<T> onSuccess,
            System.Action<string> onError
        )
        {
            this.onSuccess = onSuccess;
            this.onError = onError;
        }

        void Reset ()
        {
            this.onSuccess = null;
            this.onError = null;
        }

        public void Resolve (T result)
        {
            if (this.onSuccess == null) {
                throw new System.Exception("onSuccess is null.");
            }

            this.onSuccess(result);
            this.Reset();
        }

        public void Reject (string error)
        {
            if (this.onError == null) {
                throw new System.Exception("onError is null.");
            }

            this.onError(error);
            this.Reset();
        }
    }

    public static class JsonListHelper
    {
        public static List<T> FromJson<T>(string json)
        {
            Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>("{\"Items\":" + json + "}");
            return new List<T>(wrapper.Items);
        }

        [System.Serializable]
        private class Wrapper<T>
        {
            public T[] Items;
        }
    }

    public class SWAG : MonoBehaviour
    {
        /* #region Singleton */
        
        public Achievements Achievements = new Achievements();
        public Metrics Metrics = new Metrics();
        public Scores Scores = new Scores();
        public User User = new User();

        public bool isReady = false;
        BrandingAnimation brandingAnimation;

        public static SWAG Instance { get; private set; }
        
        private void Awake ()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(this);
                return;
            }
            Instance = this;
        }

        void Start ()
        {
            this.brandingAnimation = this.transform
                .Find("BrandingAnimation")
                .GetComponent<BrandingAnimation>();

            if (!SWAGConfig.Instance.PlayBrandingAnimation) {
                this.brandingAnimation.gameObject.SetActive(false);
            }

            this.User.Login(
                () => {
                    if (!SWAGConfig.Instance.PlayBrandingAnimation) {
                        this.Ready();
                    }
                },
                (string error) => {
                    if (this.readyAsyncHandler != null) {
                        this.readyAsyncHandler.Reject(error);
                    }
                }
            );
        }

        void Update ()
        {
            if (
                !this.isReady && 
                !brandingAnimation.IsPlaying() && 
                this.User.IsLoggedIn()
            ) {
                this.Ready();
            }
        }

        void Ready ()
        {
            this.isReady = true;

            if (this.readyAsyncHandler != null) {
                this.readyAsyncHandler.Resolve(null);
            }

            if (SWAGConfig.Instance.PlayBrandingAnimation) {
                this.brandingAnimation.gameObject.SetActive(false);
            }
        }

        AsyncHandler<object> readyAsyncHandler;

        public void OnReady (
            System.Action onSuccess
        )
        {
            this.OnReady(onSuccess, null);
        }

        public void OnReady (
            System.Action onSuccess, 
            System.Action<string> onError
        )
        {
            if (this.isReady) {
                onSuccess();
            } else {
                readyAsyncHandler = new AsyncHandler<object>(
                    (object result) => { onSuccess(); },
                    (string error) => { onError(error); }
                );
            }
        }

        /* #endregion */



        /* #region General Utilities */

        string ProviderValue () 
        {
            switch (SWAGConfig.Instance.Provider) {
                case Provider.AddictingGames:
                    return "default";
                case Provider.Shockwave:
                    return "shockwave";
                default:
                    return "";
            }
        }

        public string GetServicesURL () 
        {
            switch (SWAGConfig.Instance.Provider) {
                case Provider.AddictingGames:
                    return SWAGConstants.AddictingGamesServicesURL;
                case Provider.Shockwave:
                    return SWAGConstants.ShockwaveServicesURL;
                default:
                    return "";
            }
        }

        [DllImport("__Internal")]
        public static extern bool WebInterface_HasParentWindow ();

        /* #endregion */



        /* #region API Call Utilities */

        void SetupWebRequest (UnityWebRequest webRequest, bool useToken)
        {
            webRequest.certificateHandler = new BypassCertificateHandler();

            if (useToken) {
                webRequest.SetRequestHeader("x-member-token", this.User.token);
            }
        }

        void HandleResponse (
            UnityWebRequest webRequest,
            System.Action<string> onSuccess,
            System.Action<string> onError
        )
        {
            var pages = webRequest.url.Split('/');
            var page = pages.Length - 1;

            switch (webRequest.result) {
                case UnityWebRequest.Result.ConnectionError:
                case UnityWebRequest.Result.DataProcessingError:
                    Debug.LogError(pages[page] + ": Error: " + webRequest.error);
                    onError(webRequest.error);
                    break;
                case UnityWebRequest.Result.ProtocolError:
                    Debug.LogError(pages[page] + ": HTTP Error: " + webRequest.error);
                    onError(webRequest.error);
                    break;
                case UnityWebRequest.Result.Success:
                    Debug.Log(pages[page] + ":\nReceived: " + webRequest.downloadHandler.text);
                    onSuccess(webRequest.downloadHandler.text);
                    break;
            }
        }

        public IEnumerator GetRequest (
            string url, 
            bool useToken, 
            System.Action<string> onSuccess, 
            System.Action<string> onError
        ) 
        {
            using (var webRequest = UnityWebRequest.Get(url)) { 
                this.SetupWebRequest(
                    webRequest, 
                    useToken
                );

                yield return webRequest.SendWebRequest();

                this.HandleResponse(
                    webRequest, 
                    onSuccess, 
                    onError
                );
            }
        }
        
        public IEnumerator PostRequest (
            string url, 
            string postData,
            bool useToken, 
            System.Action<string> onSuccess, 
            System.Action<string> onError
        ) 
        {
            using (var webRequest = new UnityWebRequest(url, "POST")) { 
                byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(postData);
                webRequest.uploadHandler = (UploadHandler) new UploadHandlerRaw(bodyRaw);
                webRequest.downloadHandler = (DownloadHandler) new DownloadHandlerBuffer();
                webRequest.SetRequestHeader("Content-Type", "application/json");
                
                this.SetupWebRequest(
                    webRequest, 
                    useToken
                );

                yield return webRequest.SendWebRequest();

                this.HandleResponse(
                    webRequest, 
                    onSuccess, 
                    onError
                );
            }
        }

        /* #endregion */



        /* #region Website Interop */

        public void OpenURL (string url)
        {
           Application.OpenURL(url);
        }

        [DllImport("__Internal")]
        public static extern void WebInterface_SendMessage (string eventName, string message);

        public void ToggleFullscreen ()
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                SWAG.WebInterface_SendMessage("toggleFullscreen", "");
            #else
                Debug.Log("SWAG.ToggleFullscreen() is not implemented for this platform.");
            #endif
        }

        public void ShowShareDialog ()
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                SWAG.WebInterface_SendMessage("showShareDialog", "");
            #else
                Debug.Log("SWAG.ShowShareDialog() is not implemented for this platform.");
            #endif
        }

        public void OnTokenReceived (string token)
        {
            this.User.CompleteLogin(token);
        }

        public void OnTokenError (string reason)
        {
            this.User.LoginError(reason);
        }

        /* #endregion */

    

        /* #region Ads */

        AsyncHandler<object> showAdAsyncHandler;

        [DllImport("__Internal")]
        static extern void WebInterface_BeginAd ();

        public void BeginAd (
            System.Action onSuccess, 
            System.Action<string> onError
        )
        {
            this.showAdAsyncHandler = new AsyncHandler<object>(
                (object result) => { onSuccess(); },
                (string error) => { onError(error); }
            );

            #if UNITY_WEBGL && !UNITY_EDITOR
                SWAG.WebInterface_BeginAd();
            #else
                Debug.Log("SWAG.BeginAd() is not implemented for this platform.");
                this.OnAdComplete();
            #endif
        }

        public void OnAdComplete ()
        {
            this.showAdAsyncHandler.Resolve(null);
        }

        public void OnAdError (string error)
        {
            this.showAdAsyncHandler.Reject(error);
        }

        /* #endregion */



        /* #region Banners */

        [DllImport("__Internal")]
        static extern bool WebInterface_ShowBanner (string id, float x, float y, string pivot, string bannerSize);

        [DllImport("__Internal")]
        static extern bool WebInterface_PositionBanner (string id, float x, float y);

        [DllImport("__Internal")]
        static extern bool WebInterface_HideBanner (string id);

        public bool ShowBanner (string id, Vector3 position, string pivot, BannerSize bannerSize)
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                var bannerSizeString = "";

                switch (bannerSize) {
                    case BannerSize.Leaderboard:
                        bannerSizeString = "728x90";
                        break;
                    case BannerSize.Medium:
                        bannerSizeString = "300x250";
                        break;
                    case BannerSize.Mobile:
                        bannerSizeString = "320x50";
                        break;
                }
                
                return SWAG.WebInterface_ShowBanner(id, position.x, position.y, pivot, bannerSizeString);
            #else
                Debug.Log("SWAG.ShowBanner() is not implemented for this platform.");
                return true;
            #endif
        }

        public bool PositionBanner (string id, Vector3 position)
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                return SWAG.WebInterface_PositionBanner(id, position.x, position.y);
            #else
                return true;
            #endif
        }

        public bool HideBanner (string id)
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                return SWAG.WebInterface_HideBanner(id);
            #else
                Debug.Log("SWAG.HideBanner() is not implemented for this platform.");
                return true;
            #endif
        }

        public void OnBannerError (string error)
        {
            Debug.Log(error);
        }

        /* #endregion */
    }
}
