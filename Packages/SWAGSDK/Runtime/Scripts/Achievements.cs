using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
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

        public void GetAchievements (
            System.Action<List<Achievement>> onSuccess, 
            System.Action<string> onError
        ) 
        {
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                SWAGConstants.SWAGServicesURL + "/achievement/user?game=" + SWAGConfig.Instance.APIKey,
                true,
                (string response) => {
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
            throw new System.NotImplementedException();
        }

        public void RecordAchievement (
            string key,
            System.Action onSuccess, 
            System.Action<string> onError
        ) 
        {
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

        public void GetAll (
            System.Action<List<Achievement>> onSuccess, 
            System.Action<string> onError
        )
        {
            SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                SWAGConstants.SWAGServicesURL + "/achievement/categories?game=" + SWAGConfig.Instance.APIKey,
                true,
                (string response) => {
                    var data = JsonListHelper.FromJson<Achievement>(response);
                    // var achievements = data.ConvertAll<Achievement>((AchievementWebResponse item) => {
                    //     return new Achievement {
                    //         id = item._id,
                    //         name = item.name,
                    //         achievementKey = item.achievement_key,
                    //         description = item.description,
                    //         userAchieved = null
                    //     };
                    // });
                    onSuccess(data);
                },
                (string error) => {
                    onError(error);
                }
            ));
        }
    }
}
