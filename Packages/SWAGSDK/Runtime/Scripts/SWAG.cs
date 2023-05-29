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
            System.Action<string> successCallback,
            System.Action<string> errorCallback
        )
        {
            var pages = webRequest.url.Split('/');
            var page = pages.Length - 1;

            switch (webRequest.result)
            {
                case UnityWebRequest.Result.ConnectionError:
                case UnityWebRequest.Result.DataProcessingError:
                    Debug.LogError(pages[page] + ": Error: " + webRequest.error);
                    errorCallback(webRequest.error);
                    break;
                case UnityWebRequest.Result.ProtocolError:
                    Debug.LogError(pages[page] + ": HTTP Error: " + webRequest.error);
                    errorCallback(webRequest.error);
                    break;
                case UnityWebRequest.Result.Success:
                    Debug.Log(pages[page] + ":\nReceived: " + webRequest.downloadHandler.text);
                    successCallback(webRequest.downloadHandler.text);
                    break;
            }
        }

        IEnumerator GetRequest<Success>(
            string path, 
            bool useToken, 
            System.Action<string> successCallback, 
            System.Action<string> errorCallback
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
                    successCallback, 
                    errorCallback
                );
            }
        }
        IEnumerator PostRequest<Success>(
            string path, 
            string postData,
            bool useToken, 
            System.Action<string> successCallback, 
            System.Action<string> errorCallback
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
                    successCallback, 
                    errorCallback
                );
            }
        }

        /* #endregion */



        /* #region Authentication */

        void GetAPIKeyFromKeyword(
            System.Action successCallback, 
            System.Action<string> errorCallback
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
                    successCallback();
                },
                (string error) => {
                    errorCallback(error);
                }
            ));
        }

        public void LoginAsGuest(
            System.Action successCallback, 
            System.Action<string> errorCallback
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
                                successCallback();
                            },
                            (string error) => {
                                this.Reset();
                                errorCallback(error);
                            }
                        );
                    } else {
                        successCallback();
                    }
                },
                (string error) => {
                    this.Reset();
                    errorCallback(error);
                }
            ));
        }

        public void LoginAsUser(
            string username, 
            string password, 
            System.Action successCallback, 
            System.Action<string> errorCallback
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
                                successCallback();
                            },
                            (string error) => {
                                this.Reset();
                                errorCallback(error);
                            }
                        );
                    } else {
                        successCallback();
                    }
                },
                (string error) => {
                    this.Reset();
                    errorCallback(error);
                }
            ));
        }

        [DllImport("__Internal")]
        static extern string WebInterface_GetToken();

        public void LoginFromWeb(
            System.Action successCallback, 
            System.Action<string> errorCallback
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
                                successCallback();
                            },
                            (string error) => {
                                this.Reset();
                                errorCallback(error);
                            }
                        );
                    } else {
                        successCallback();
                    }
                },
                (string error) => {
                    this.Reset();
                    errorCallback(error);
                }
            ));
        }

        /* #endregion */
    
    

        /* #region Branding & Advertising */

        public void ShowBranding ()
        {
            throw new System.NotImplementedException();
        }

        public void ShowBrandingAnimation ()
        {
            throw new System.NotImplementedException();
        }

        [DllImport("__Internal")]
        static extern string WebInterface_ShowAd();

        public void ShowAd ()
        {
            #if UNITY_WEBGL
                SWAG.WebInterface_ShowAd();
            #else
                Debug.Log("SWAG.ShowAd() is not implemented for this platform.");
            #endif
        }

        public void OnAdComplete ()
        {
            throw new System.NotImplementedException();
        }

        public void OnAdError (string error)
        {
            throw new System.Exception(error);
        }

        /* #endregion */
    }
}
