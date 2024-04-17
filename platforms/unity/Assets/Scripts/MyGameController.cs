using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Shockwave;

public class MyGameController : MonoBehaviour
{
    void Start ()
    {
        var swag = SWAG.Instance;

        swag.OnReady(() => {
            Debug.Log("Ready!");
        });
    }
}
