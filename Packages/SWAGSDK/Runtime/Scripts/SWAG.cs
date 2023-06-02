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

    public enum BannerSize
    {
        Leaderboard,
        Medium,
        Mobile,
        Main,
        LargeMobile
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
        public string UserToken;

        /* #endregion */



        /* #region General Utilities */

        protected string ProviderValue() 
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

        void Reset()
        {
            // this.User = null;
            this.UserToken = "";

            if (SWAGConfig.Instance.Provider == Provider.Shockwave) 
            {
                SWAGConfig.Instance.GameName = "";
                SWAGConfig.Instance.APIKey = "";
            }
        }

        /* #endregion */



        /* #region API Call Utilities */

        void SetupWebRequest(UnityWebRequest webRequest, bool useToken)
        {
            webRequest.certificateHandler = new BypassCertificateHandler();

            if (useToken) {
                var tokenBytes = System.Convert.FromBase64String(this.UserToken);
                var cookie = System.Text.Encoding.UTF8.GetString(tokenBytes);
                webRequest.SetRequestHeader("Cookie", cookie);
            }
        }

        void HandleResponse(
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

        IEnumerator GetRequest<Success>(
            string path, 
            bool useToken, 
            System.Action<string> onSuccess, 
            System.Action<string> onError
        ) 
        {
            var url = SWAGConstants.SWAGServicesURL + path;

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
        IEnumerator PostRequest<Success>(
            string path, 
            string postData,
            bool useToken, 
            System.Action<string> onSuccess, 
            System.Action<string> onError
        ) 
        {
            var url = SWAGConstants.SWAGServicesURL + path;

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



        /* #region Authentication */

        void GetAPIKeyFromKeyword(
            System.Action onSuccess, 
            System.Action<string> onError
        )
        {
            var url = SWAGConstants.SWAGServicesURL + "/game"
                + "?keyword=" + SWAGConfig.Instance.ShockwaveKeyword 
                + "&keywordtype=shockwave";

            StartCoroutine(this.GetRequest<UserWebResponse>(
                url,
                false,
                (string response) => {
                    var data = JsonUtility.FromJson<GameWebResponse>(response);
                    SWAGConfig.Instance.APIKey = data.game;
                    SWAGConfig.Instance.GameName = data.name;
                    onSuccess();
                },
                (string error) => {
                    onError(error);
                }
            ));
        }

        public void LoginAsGuest(
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            var baseUrl = SWAGConfig.Instance.Provider == Provider.AddictingGames 
                ? SWAGConstants.AddictingGamesAuthURL
                : SWAGConstants.ShockwaveAuthURL;

            var url = baseUrl + "/login/guest";
            
            StartCoroutine(this.GetRequest<UserWebResponse>(
                url,
                false,
                (string response) => {
                    var data = JsonUtility.FromJson<UserWebResponse>(response);

                    var userData = data.user;
                    this.User.ID = userData._id;

                    this.UserToken = data.token;

                    if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                        this.GetAPIKeyFromKeyword(
                            () => { 
                                onSuccess();
                            },
                            (string error) => {
                                this.Reset();
                                onError(error);
                            }
                        );
                    } else {
                        onSuccess();
                    }
                },
                (string error) => {
                    this.Reset();
                    onError(error);
                }
            ));
        }

        public void LoginAsUser(
            string username, 
            string password, 
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            var baseUrl = SWAGConfig.Instance.Provider == Provider.AddictingGames 
                ? SWAGConstants.AddictingGamesAuthURL
                : SWAGConstants.ShockwaveAuthURL;

            var url = baseUrl + "/login" 
                + "?username=" + username 
                + "&password=" + password;
            
            StartCoroutine(this.GetRequest<UserWebResponse>(
                url,
                false,
                (string response) => {
                    var data = JsonUtility.FromJson<UserWebResponse>(response);

                    var userData = data.user;
                    this.User.ID = userData._id;

                    this.UserToken = data.token;

                    if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                        this.GetAPIKeyFromKeyword(
                            () => { 
                                onSuccess();
                            },
                            (string error) => {
                                this.Reset();
                                onError(error);
                            }
                        );
                    } else {
                        onSuccess();
                    }
                },
                (string error) => {
                    this.Reset();
                    onError(error);
                }
            ));
        }

        [DllImport("__Internal")]
        static extern string WebInterface_GetToken();

        public void LoginFromWeb(
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            this.UserToken = SWAG.WebInterface_GetToken();

            var url = SWAGConstants.SWAGServicesURL + "/user";
            
            StartCoroutine(this.GetRequest<UserWebResponseUser>(
                url,
                true,
                (string response) => {
                    var userData = JsonUtility.FromJson<UserWebResponseUser>(response);
                    this.User.ID = userData._id;
                    this.User.MemberName = userData.memberName;

                    if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                        this.GetAPIKeyFromKeyword(
                            () => { 
                                onSuccess();
                            },
                            (string error) => {
                                this.Reset();
                                onError(error);
                            }
                        );
                    } else {
                        onSuccess();
                    }
                },
                (string error) => {
                    this.Reset();
                    onError(error);
                }
            ));
        }

        /* #endregion */
    


        /* #region Branding */

        public void ShowBrandingAnimation (System.Action onSuccess)
        {
            throw new System.NotImplementedException();
        }

        /* #endregion */

    

        /* #region Ads */

        ExternAsyncHandler<object> ShowAdAsyncHandler;

        [DllImport("__Internal")]
        static extern void WebInterface_ShowAd();

        public void ShowAd (System.Action onSuccess, System.Action<string> onError)
        {
            this.ShowAdAsyncHandler = new ExternAsyncHandler<object>(
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
            this.ShowAdAsyncHandler.Resolve(null);
        }

        public void OnAdError (string error)
        {
            this.ShowAdAsyncHandler.Reject(error);
        }

        /* #endregion */



        /* #region Banners */

        [DllImport("__Internal")]
        static extern bool WebInterface_ShowBanner (string id, float x, float y, string bannerSize);

        [DllImport("__Internal")]
        static extern bool WebInterface_PositionBanner (string id, float x, float y);

        [DllImport("__Internal")]
        static extern bool WebInterface_HideBanner (string id);

        public bool ShowBanner (string id, float x, float y, BannerSize bannerSize)
        {
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

            #if UNITY_WEBGL && !UNITY_EDITOR
                return SWAG.WebInterface_ShowBanner(id, x, y, bannerSizeString);
            #else
                Debug.Log("SWAG.ShowBanner() is not implemented for this platform.");
                return true;
            #endif
        }

        public bool PositionBanner (string id, float x, float y)
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                return SWAG.WebInterface_PositionBanner(id, x, y);
            #else
                Debug.Log("SWAG.PositionBanner() is not implemented for this platform.");
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
