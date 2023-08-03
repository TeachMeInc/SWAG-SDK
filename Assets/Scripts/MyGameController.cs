using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;

public class MyGameController : MonoBehaviour
{
    Camera mainCamera;
    Canvas mainCanvas;

    void Start ()
    {
        this.mainCamera = this.transform
            .Find("MainCamera")
            .GetComponent<Camera>();

        this.mainCanvas = this.transform
            .Find("MainCanvas")
            .GetComponent<Canvas>();

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
    }
}
