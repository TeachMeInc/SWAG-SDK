using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Shockwave
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
                SWAG.Instance.GetServicesURL() + "/achievement",
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
                SWAG.Instance.GetServicesURL() + "/achievement/user?game=" + SWAGConfig.Instance.APIKey,
                true,
                (string response) => {
                    if (response.Trim() == "{}") {
                        onSuccess(new List<Achievement>());
                        return;
                    }

                    var data = JsonListHelper.FromJson<AchievementWebResponse>(response);
                    var achievements = data.ConvertAll<Achievement>((AchievementWebResponse item) => {
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
                SWAG.Instance.GetServicesURL() + "/achievement/categories?game=" + SWAGConfig.Instance.APIKey,
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
