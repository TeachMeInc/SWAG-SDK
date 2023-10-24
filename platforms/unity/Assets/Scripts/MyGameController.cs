using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using AddictingGames;

public class MyGameController : MonoBehaviour
{
    void Start ()
    {
        var swag = SWAG.Instance;

        swag.OnReady(() => {
            Debug.Log("Ready!");
            swag.Scores.ShowDialog();
        });
    }
}
