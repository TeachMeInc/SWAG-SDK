using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Runtime.InteropServices;

namespace AddictingGames
{
    class BypassCertificateHandler : CertificateHandler
    {
        protected override bool ValidateCertificate(byte[] certificateData)
        {
            return true;
        }
    }

    class ExternAsyncHandler <T>
    {
        System.Action<T> onSuccess;
        System.Action<string> onError;

        public ExternAsyncHandler (
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
            if (this.onSuccess == null) throw new System.Exception("onSuccess is null.");

            this.onSuccess(result);
            this.Reset();
        }

        public void Reject (string error)
        {
            if (this.onError == null) throw new System.Exception("onError is null.");

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

        // public static string ToJson<T>(T[] array)
        // {
        //     Wrapper<T> wrapper = new Wrapper<T>();
        //     wrapper.Items = array;
        //     return JsonUtility.ToJson(wrapper);
        // }

        // public static string ToJson<T>(T[] array, bool prettyPrint)
        // {
        //     Wrapper<T> wrapper = new Wrapper<T>();
        //     wrapper.Items = array;
        //     return JsonUtility.ToJson(wrapper, prettyPrint);
        // }

        [System.Serializable]
        private class Wrapper<T>
        {
            public T[] Items;
        }
    }

    public enum NotificationType
    {
        None,
        Success,
        Error,
        Warning,
    }

    public enum CurrentView
    {
        Desktop,
        Mobile,
    }

    public class SWAG : MonoBehaviour
    {
        /* #region Singleton */
        
        public Achievements Achievements = new Achievements();
        public Metrics Metrics = new Metrics();
        public Scores Scores = new Scores();
        public User User = new User();

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

        /* #endregion */



        /* #region General Properties */

        [HideInInspector]
        public string userToken;

        [HideInInspector]
        public CurrentView currentView = CurrentView.Desktop;

        /* #endregion */



        /* #region General Utilities */

        string ProviderValue () 
        {
            switch (SWAGConfig.Instance.Provider) 
            {
                case Provider.AddictingGames:
                    return "default";
                case Provider.Shockwave:
                    return "shockwave";
                default:
                    return "";
            }
        }

        /* #endregion */



        /* #region API Call Utilities */

        void SetupWebRequest (UnityWebRequest webRequest, bool useToken)
        {
            webRequest.certificateHandler = new BypassCertificateHandler();

            if (useToken) {
                var tokenBytes = System.Convert.FromBase64String(this.userToken);
                var cookie = System.Text.Encoding.UTF8.GetString(tokenBytes);
                webRequest.SetRequestHeader("Cookie", cookie);
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

            switch (webRequest.result)
            {
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
            using (var webRequest = UnityWebRequest.Get(url))
            { 
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
            using (var webRequest = UnityWebRequest.Post(url, postData))
            { 
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

        [DllImport("__Internal")]
        static extern void WebInterface_OpenURL (string url);

        public void OpenURL (string url)
        {
           #if UNITY_WEBGL && !UNITY_EDITOR
               SWAG.WebInterface_OpenURL(url);
           #else
               Debug.Log("SWAG.OpenURL() is not implemented for this platform.");
           #endif
        }

        [DllImport("__Internal")]
        static extern void WebInterface_SendMessage (string eventName, string message);

        public void ToggleFullscreen (bool fullscreen)
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

        public void ShowLoginDialog ()
        {
              #if UNITY_WEBGL && !UNITY_EDITOR
                SWAG.WebInterface_SendMessage("showLoginDialog", "");
              #else
                Debug.Log("SWAG.ShowLoginDialog() is not implemented for this platform.");
              #endif
        }

        public void OnCurrentViewChanged (string currentView)
        {
            switch (SWAGConfig.Instance.ViewMode)
            {
                case ViewMode.ForceDesktop:
                    this.currentView = CurrentView.Desktop;
                    return;
                case ViewMode.ForceMobile:
                    this.currentView = CurrentView.Mobile;
                    return;
            }

            switch (currentView)
            {
                case "desktop":
                    this.currentView = CurrentView.Desktop;
                    break;
                case "mobile":
                    this.currentView = CurrentView.Mobile;
                    break;
            }
        }

        /* #endregion */



        /* #region Branding */

        public void ShowBrandingAnimation (System.Action onSuccess)
        {
            throw new System.NotImplementedException();
        }

        /* #endregion */

    

        /* #region Ads */

        ExternAsyncHandler<object> showAdAsyncHandler;

        [DllImport("__Internal")]
        static extern void WebInterface_ShowAd ();

        public void ShowAd (System.Action onSuccess, System.Action<string> onError)
        {
            this.showAdAsyncHandler = new ExternAsyncHandler<object>(
                (object result) => { onSuccess(); },
                (string error) => { onError(error); }
            );

            #if UNITY_WEBGL && !UNITY_EDITOR
                SWAG.WebInterface_ShowAd();
            #else
                Debug.Log("SWAG.ShowAd() is not implemented for this platform.");
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

                switch (bannerSize)
                {
                    case BannerSize.Leaderboard:
                        bannerSizeString = "728x90";
                        break;
                    case BannerSize.Medium:
                        bannerSizeString = "300x250";
                        break;
                    case BannerSize.Mobile:
                        bannerSizeString = "320x50";
                        break;  
                    case BannerSize.Main:
                        bannerSizeString = "468x60";
                        break;
                    case BannerSize.LargeMobile:
                        bannerSizeString = "320x100";
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
