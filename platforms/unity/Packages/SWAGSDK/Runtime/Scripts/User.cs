using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

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
        bool? isSubscriber;

        [HideInInspector]
        public string token = "";

        public User () 
        {}



        /* #region Utilities */

        void Reset ()
        {
            this.token = "";
        }

        void GetAPIKeyFromKeyword (
            System.Action onSuccess, 
            System.Action<string> onError
        )
        {
            var url = SWAG.Instance.GetServicesURL() + "/game"
                + "?keyword=" + SWAGConfig.Instance.ShockwaveKeyword 
                + "&keywordtype=shockwave";

            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                url,
                false,
                (string response) => {
                    var data = JsonUtility.FromJson<GameWebResponse>(response);
                    SWAGConfig.Instance.APIKey = data.game;
                    onSuccess();
                },
                (string error) => {
                    onError(error);
                }
            ));
        }

        /* #endregion */



        /* #region Login */

        public AsyncHandler<object> loginAsyncHandler;

        void LoginAsGuest (
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            var url = SWAG.Instance.GetServicesURL() + "/user";
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                url,
                false,
                (string response) => {
                    var data = JsonUtility.FromJson<UserWebResponse>(response);
                    
                    this.id = data._id;
                    this.memberName = data.memberName == "" 
                        ? "guest" 
                        : data.memberName;
                    this.token = data.token;

                    if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                        if (SWAGConfig.Instance.ShockwaveKeyword != "") {
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

        void LoginUsingToken (
            System.Action onSuccess, 
            System.Action<string> onError
        )
        {
            this.loginAsyncHandler = new AsyncHandler<object>(
                (object result) => { onSuccess(); },
                (string reason) => { onError(reason); }
            );

            if (!SWAG.WebInterface_HasParentWindow()) {
                this.LoginAsGuest(
                    () => { this.loginAsyncHandler.Resolve(null); }, 
                    (string reason) => { this.loginAsyncHandler.Reject(reason); }
                );
                return;
            }

            SWAG.WebInterface_SendMessage("requestToken", "");
        }

        public void CompleteLogin (string loginToken) 
        {
            var payload = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(loginToken));
            var data = JsonUtility.FromJson<UserWebResponse>(payload);
                    
            this.id = data._id;
            this.memberName = data.memberName == "" 
                ? "guest" 
                : data.memberName;
            this.token = data.token;

            if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                if (SWAGConfig.Instance.ShockwaveKeyword != "") {
                    this.GetAPIKeyFromKeyword(
                        () => { 
                            this.loginAsyncHandler.Resolve(null);
                        },
                        (string error) => {
                            this.Reset();
                            this.loginAsyncHandler.Reject(error);
                        }
                    );
                } else {
                    this.loginAsyncHandler.Resolve(null);
                }
            } else {
                this.loginAsyncHandler.Resolve(null);
            }
        }

        public void LoginError (string reason)
        {
            this.Reset();
            this.loginAsyncHandler.Reject(reason);
        }

        public void Login (
            System.Action onSuccess, 
            System.Action<string> onError
        )
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                this.LoginUsingToken(
                    () => { onSuccess(); },
                    (string error) => { onError(error); }
                );
            #else
                Debug.Log("Token login is not implemented for this platform. Logging in as guest instead.");

                this.LoginAsGuest(
                    () => { onSuccess(); },
                    (string error) => { onError(error); }
                );
            #endif
        }

        /* #endregion */



        /* #region Login Dialog */

        public void ShowLoginDialog (
            System.Action onSuccess
        )
        {
            this.loginAsyncHandler = new AsyncHandler<object>(
                (object result) => { onSuccess(); },
                (string reason) => {}
            );

            if (!this.IsGuest()) {
                this.loginAsyncHandler.Resolve(null);
                return;
            }

            #if UNITY_WEBGL && !UNITY_EDITOR
                SWAG.WebInterface_SendMessage("showLoginDialog", "");
            #else
                Debug.Log("SWAG.ShowLoginDialog() is not implemented for this platform.");
            #endif
        }

        /* #endregion */



        /* #region Helpers */

        public void IsSubscriber (
            System.Action<bool> onSuccess, 
            System.Action<string> onError
        )
        {
            if (!this.IsLoggedIn()) {
                throw new System.Exception("User is not logged in.");
            }

            if (this.isSubscriber != null) {
                onSuccess((bool)this.isSubscriber);
                return;
            }
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                SWAG.Instance.GetServicesURL() + "/subscriber",
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
            if (!this.IsLoggedIn()) {
                throw new System.Exception("User is not logged in.");
            }

            return this.memberName.ToLower() == "guest";
        }

        public bool IsLoggedIn () 
        {
            return this.token != "";
        }

        /* #endregion */



        /* #region Datastore */

        public void SetData (
            string key, 
            string value,
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
            if (!this.IsLoggedIn()) {
                throw new System.Exception("User is not logged in.");
            }

            var postData = JsonUtility.ToJson(new SetUserDataWebRequest {
                game = SWAGConfig.Instance.APIKey,
                key = key,
                value = value
            });
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.PostRequest(
                SWAG.Instance.GetServicesURL() + "/datastore",
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
            if (!this.IsLoggedIn()) {
                throw new System.Exception("User is not logged in.");
            }
            
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                SWAG.Instance.GetServicesURL() + "/datastore/user?game=" + SWAGConfig.Instance.APIKey,
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

        /* #endregion */
    }
}
