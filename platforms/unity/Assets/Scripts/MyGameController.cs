using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using AddictingGames;

public class MyGameController : MonoBehaviour
{
    Camera mainCamera;
    Canvas mainCanvas;

    void Start ()
    {
        this.mainCamera = this.gameObject.GetComponentInChildren<Camera>(true);
        this.mainCanvas = this.gameObject.GetComponentInChildren<Canvas>(true);

        var swag = SWAG.Instance;

        swag.OnReady(() => {
            this.Ready();
        });
    }

    void Ready () 
    {
        this.mainCamera.gameObject.SetActive(true);
        this.mainCanvas.gameObject.SetActive(true);

        Debug.Log("Ready!");

        var swag = SWAG.Instance;

        // Achievements
        // swag.Achievements.ShowDialog();
        // swag.Achievements.currentUser.RecordAchievement(
        //     "achievement1",
        //     () => { 
        //         Debug.Log("Achievement recorded!");
        //         swag.Achievements.ShowDialog();
        //     },
        //     (string error) => { Debug.Log("Error recording achievement: " + error); }
        // );

        // Scores
        // swag.Scores.ShowDialog();
        // swag.Scores.currentUser.RecordScore(
        //     "level1",
        //     100,
        //     () => { 
        //         Debug.Log("Score recorded!");
        //         swag.Scores.ShowDialog();
        //     },
        //     (string error) => { Debug.Log("Error recording score: " + error); }
        // );

        // Ads
        // swag.BeginAd(
        //     () => { Debug.Log("Ad complete!"); },
        //     (string error) => { Debug.Log("Error playing ad: " + error); }
        // );
    }
}
