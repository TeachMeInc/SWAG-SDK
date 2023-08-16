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

        // swag.Achievements.ShowDialog();
        swag.Scores.ShowDialog();
        // swag.BeginAd(() => {});
    }
}
