using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

namespace AddictingGames
{
    [System.Serializable]
    public struct UserData
    {
        public string id;
        public string key;
        public string value;
        public string entity;
        public string source;
        public System.DateTime dateCreated;
    }

    public class User
    {
        public string id;
        public string memberName;

        public bool? isSubscriber;

        public User () 
        {}

        void Reset ()
        {
            SWAG.Instance.userToken = "";

            if (SWAGConfig.Instance.Provider == Provider.Shockwave) 
            {
                SWAGConfig.Instance.GameName = "";
                SWAGConfig.Instance.APIKey = "";
            }
        }

        void GetAPIKeyFromKeyword (
            System.Action onSuccess, 
            System.Action<string> onError
        )
        {
            var url = SWAGConstants.SWAGServicesURL + "/game"
                + "?keyword=" + SWAGConfig.Instance.ShockwaveKeyword 
                + "&keywordtype=shockwave";

            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
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

        public void LoginAsGuest (
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            var baseUrl = SWAGConfig.Instance.Provider == Provider.AddictingGames 
                ? SWAGConstants.AddictingGamesAuthURL
                : SWAGConstants.ShockwaveAuthURL;

            var url = baseUrl + "/login/guest";
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                url,
                false,
                (string response) => {
                    var data = JsonUtility.FromJson<UserWebResponse>(response);

                    var userData = data.user;
                    SWAG.Instance.User.id = userData._id;
                    SWAG.Instance.userToken = data.token;

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

        public void LoginAsUser (
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
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                url,
                false,
                (string response) => {
                    var data = JsonUtility.FromJson<UserWebResponse>(response);

                    var userData = data.user;
                    SWAG.Instance.User.id = userData._id;
                    SWAG.Instance.userToken = data.token;

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
        static extern string WebInterface_GetToken ();

        public void LoginFromWeb (
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            SWAG.Instance.userToken = User.WebInterface_GetToken();

            var url = SWAGConstants.SWAGServicesURL + "/user";
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                url,
                true,
                (string response) => {
                    var userData = JsonUtility.FromJson<UserWebResponseUser>(response);
                    SWAG.Instance.User.id = userData._id;
                    SWAG.Instance.User.memberName = userData.memberName;

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

        public void IsSubscriber (
            System.Action<bool> onSuccess, 
            System.Action<string> onError
        )
        {
            if (SWAG.Instance.userToken == "") {
                throw new System.Exception("User is not logged in.");
            }

            if (this.isSubscriber != null) {
                onSuccess((bool)this.isSubscriber);
                return;
            }
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                SWAGConstants.SWAGServicesURL + "/subscriber",
                true,
                (string response) => {
                    var data = JsonUtility.FromJson<UserIsSubscriberWebResponse>(response);
                    this.isSubscriber = data.subscriber;
                    onSuccess(data.subscriber);
                },
                (string error) => {
                    onError(error);
                }
            ));
        }

        public bool IsGuest () 
        {
            if (SWAG.Instance.userToken == "") {
                throw new System.Exception("User is not logged in.");
            }

            return SWAG.Instance.User.memberName.ToLower() == "guest";
        }

        public void SetData (
            string key, 
            string value,
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            if (SWAG.Instance.userToken == "") {
                throw new System.Exception("User is not logged in.");
            }

            var postData = JsonUtility.ToJson(new SetUserDataWebRequest {
                game = SWAGConfig.Instance.APIKey,
                key = key,
                value = value
            });
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.PostRequest(
                SWAGConstants.SWAGServicesURL + "/datastore",
                postData,
                true,
                (string response) => {
                    onSuccess();
                },
                (string error) => {
                    onError(error);
                }
            ));
        }

        public void GetData (
            System.Action<List<UserData>> onSuccess, 
            System.Action<string> onError
        ) 
        {
            if (SWAG.Instance.userToken == "") {
                throw new System.Exception("User is not logged in.");
            }
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                SWAGConstants.SWAGServicesURL + "/datastore/user?game=" + SWAGConfig.Instance.APIKey,
                true,
                (string response) => {
                    var data = JsonListHelper.FromJson<UserDataWebResponse>(response);
                    var achievements = data.ConvertAll<UserData>((UserDataWebResponse item) => {
                        return new UserData {
                            id = item._id,
                            key = item.key,
                            value = item.value,
                            entity = item.entity,
                            source = item.source,
                            dateCreated = System.DateTime.Parse(item.date_created, null, System.Globalization.DateTimeStyles.RoundtripKind)
                        };
                    });
                    onSuccess(achievements);
                },
                (string error) => {
                    onError(error);
                }
            ));
        }
    }
}
