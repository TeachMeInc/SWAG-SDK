using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    namespace Achievements
    {
        [System.Serializable]
        public struct Achievement
        {
            public string id;
            public string name;
            public string achievementKey;
            public string description;
            public bool? userAchieved;
        }

        public class AchievementsCurrentUser
        {
            public AchievementsCurrentUser () 
            {}

            public void RecordAchievement (
                string key,
                System.Action onSuccess, 
                System.Action<string> onError
            ) 
            {
                if (!SWAG.Instance.User.IsLoggedIn()) {
                    throw new System.Exception("User is not logged in.");
                }

                var postData = JsonUtility.ToJson(new RecordAchievementWebRequest {
                    game = SWAGConfig.Instance.APIKey,
                    achievement_key = key
                });
                
                SWAG.Instance.StartCoroutine(SWAG.Instance.PostRequest(
                    SWAGConstants.SWAGServicesURL + "/achievement",
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

            public void GetAchievements (
                System.Action<List<Achievement>> onSuccess, 
                System.Action<string> onError
            ) 
            {
                if (!SWAG.Instance.User.IsLoggedIn()) {
                    throw new System.Exception("User is not logged in.");
                }
                
                SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                    SWAGConstants.SWAGServicesURL + "/achievement/user?game=" + SWAGConfig.Instance.APIKey,
                    true,
                    (string response) => {
                        var mockData = "[{\"_id\":\"5c7030d56917a692f96f9657\",\"game\":\"5c6c3c056917a692f96f9651\",\"name\":\"Achievement 1\",\"achievement_key\":\"achievement1\",\"description\":\"The description for this achievement 1\",\"user_achieved\":true},{\"_id\":\"5c7030d56917a692f96f9658\",\"game\":\"5c6c3c056917a692f96f9651\",\"name\":\"Achievement 2\",\"achievement_key\":\"achievement2\",\"description\":\"The description for this achievement 2\",\"user_achieved\":false},{\"_id\":\"5c7030d56917a692f96f9659\",\"game\":\"5c6c3c056917a692f96f9651\",\"name\":\"Achievement 3\",\"achievement_key\":\"achievement3\",\"description\":\"The description for this achievement 3\",\"user_achieved\":true},{\"_id\":\"5c7030d56917a692f96f965a\",\"game\":\"5c6c3c056917a692f96f9651\",\"name\":\"Achievement 4\",\"achievement_key\":\"achievement4\",\"description\":\"The description for this achievement 4\",\"user_achieved\":false},{\"_id\":\"5c7030d56917a692f96f965b\",\"game\":\"5c6c3c056917a692f96f9651\",\"name\":\"Achievement 5\",\"achievement_key\":\"zchievement5\",\"description\":\"The description for this achievement 5\",\"user_achieved\":false},{\"_id\":\"5c7edf366917a60ff525b162\",\"game\":\"5c6c3c056917a692f96f9651\",\"name\":\"Achievement 6\",\"achievement_key\":\"achievement6\",\"description\":\"The description for this achievement 6\",\"user_achieved\":true},{\"_id\":\"5c7edf416917a60ff525b163\",\"game\":\"5c6c3c056917a692f96f9651\",\"name\":\"Achievement 7\",\"achievement_key\":\"achievement7\",\"description\":\"The description for this achievement 7\",\"user_achieved\":false}]";
                        var data = JsonListHelper.FromJson<AchievementWebResponse>(mockData);
                        var achievements = data.ConvertAll<Achievement>((AchievementWebResponse item) => {
                            Debug.Log("ACHIEVED?");
                            Debug.Log(item.user_achieved);
                            
                            return new Achievement {
                                id = item._id,
                                name = item.name,
                                achievementKey = item.achievement_key,
                                description = item.description,
                                userAchieved = item.user_achieved
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

        public class Achievements
        {
            public AchievementsCurrentUser currentUser = new AchievementsCurrentUser();

            public Achievements () 
            {}

            public void ShowDialog ()
            {
                this.ShowDialog(
                    () => {}, 
                    (string error) => {}
                );
            }

            public void ShowDialog (System.Action onClosed)
            {
                this.ShowDialog(
                    onClosed, 
                    (string error) => {}
                );
            }

            public void ShowDialog (System.Action<string> onError)
            {
                this.ShowDialog(
                    () => {},
                    onError
                );
            }

            public void ShowDialog (
                System.Action onClosed,
                System.Action<string> onError
            ) 
            {
                var dialogController = SWAG.Instance.gameObject.GetComponentInChildren<AchievementsDialogController>(true);
                dialogController.Show(onClosed, onError);
            }

            public void GetAll (
                System.Action<List<Achievement>> onSuccess, 
                System.Action<string> onError
            )
            {
                SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                    SWAGConstants.SWAGServicesURL + "/achievement/categories?game=" + SWAGConfig.Instance.APIKey,
                    true,
                    (string response) => {
                        var data = JsonListHelper.FromJson<AchievementWebResponse>(response);
                        var achievements = data.ConvertAll<Achievement>((AchievementWebResponse item) => {
                            return new Achievement {
                                id = item._id,
                                name = item.name,
                                achievementKey = item.achievement_key,
                                description = item.description,
                                userAchieved = null
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
}
