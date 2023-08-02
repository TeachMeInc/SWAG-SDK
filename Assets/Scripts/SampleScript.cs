using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;

public class SampleScript : MonoBehaviour
{
    void Start ()
    {
        var swag = SWAG.Instance;

        swag.OnReady(
            () => {
                Debug.Log("Login: Success");

                swag.ShowAd(
                    () => { 
                        Debug.Log("ShowAd: Success");
                    },
                    (string error) => { 
                        Debug.LogError("ShowAd Error: " + error);
                    }
                );

                swag.Achievements.GetAll(
                    (List<Achievement> achievements) => {
                        Debug.Log("GetAll: " + achievements.Count);
                    },
                    (string error) => {
                        Debug.LogError("GetAll Error: " + error);
                    }
                );

                swag.Achievements.currentUser.GetAchievements(
                    (List<Achievement> achievements) => {
                        Debug.Log("GetAchievements: " + achievements.Count);
                    },
                    (string error) => {
                        Debug.LogError("GetAchievements Error: " + error);
                    }
                );
            },
            (string error) => {
                Debug.LogError("Login Error: " + error);
            }
        );
    }

    void OnMouseDown ()
    {
        SWAG.Instance.OpenURL("https://www.addictinggames.com/");
    }
}
