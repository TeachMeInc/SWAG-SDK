using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;

public class SampleScript : MonoBehaviour
{
    void Start ()
    {
        SWAG.Instance.LoginAsGuest(
            () => {
                Debug.Log("LoginAsGuest: Success");

                SWAG.Instance.ShowAd(
                    () => { 
                        Debug.Log("ShowAd: Success");
                    },
                    (string error) => { 
                        Debug.Log("ShowAd Error: " + error);
                    }
                );

                SWAG.Instance.Achievements.GetAll(
                    (List<Achievement> achievements) => {
                        Debug.Log("GetAll: " + achievements.Count);
                    },
                    (string error) => {
                        Debug.Log("GetAll Error: " + error);
                    }
                );

                SWAG.Instance.Achievements.currentUser.GetAchievements(
                    (List<Achievement> achievements) => {
                        Debug.Log("GetAchievements: " + achievements.Count);
                    },
                    (string error) => {
                        Debug.Log("GetAchievements Error: " + error);
                    }
                );
            },
            (string error) => {
                Debug.Log("LoginAsGuest Error: " + error);
            }
        );
    }

    void OnMouseDown ()
    {
        SWAG.Instance.OpenURL("https://www.addictinggames.com/");
    }
}
