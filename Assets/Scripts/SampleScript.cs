using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;

public class SampleScript : MonoBehaviour
{
    void Start ()
    {
        var swag = SWAG.Instance;

        // swag.OnReady(() => {
        //     Debug.Log("Login: Success");
        // });
    }

    void OnMouseDown ()
    {
        // SWAG.Instance.OpenURL("https://www.addictinggames.com/");
    }
}
