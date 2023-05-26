using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Runtime.InteropServices;

namespace AddictingGames
{
    [System.Serializable]
    public struct User 
    {
        public string ID;
        public string MemberName;
    }

    class BypassCertificate : CertificateHandler
    {
        protected override bool ValidateCertificate(byte[] certificateData)
        {
            return true;
        }
    } 

    public class SWAG : MonoBehaviour
    {
        public static SWAG Instance { get; private set; }
        
        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(this);
                return;
            }
            Instance = this;
            
        }

        string UserToken;

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
            webRequest.certificateHandler = new BypassCertificate();

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
            System.Action<User> successCallback, 
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
                    User user = new User()
                    {
                        ID = userData._id,
                        MemberName = userData.memberName,
                    };

                    // this.User = user;
                    this.UserToken = data.token;

                    if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                        this.GetAPIKeyFromKeyword(
                            () => { 
                                successCallback(user);
                            },
                            (string error) => {
                                this.Reset();
                                errorCallback(error);
                            }
                        );
                    } else {
                        successCallback(user);
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
            System.Action<User> successCallback, 
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
                    User user = new User()
                    {
                        ID = userData._id,
                        MemberName = userData.memberName,
                    };

                    // this.User = user;
                    this.UserToken = data.token;

                    if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                        this.GetAPIKeyFromKeyword(
                            () => { 
                                successCallback(user);
                            },
                            (string error) => {
                                this.Reset();
                                errorCallback(error);
                            }
                        );
                    } else {
                        successCallback(user);
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
            System.Action<User> successCallback, 
            System.Action<string> errorCallback
        ) 
        {
            this.UserToken = SWAG.WebInterface_GetToken();

            var url = SWAGConstants.SWAGServicesURL + "/user";
            
            StartCoroutine(this.GetRequest<User>(
                url,
                true,
                (string response) => {
                    var userData = JsonUtility.FromJson<UserWebResponseUser>(response);
                    User user = new User()
                    {
                        ID = userData._id,
                        MemberName = userData.memberName,
                    };

                    if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                        this.GetAPIKeyFromKeyword(
                            () => { 
                                successCallback(user);
                            },
                            (string error) => {
                                this.Reset();
                                errorCallback(error);
                            }
                        );
                    } else {
                        successCallback(user);
                    }
                },
                (string error) => {
                    this.Reset();
                    errorCallback(error);
                }
            ));
        }

        /* #endregion */
    }
}
