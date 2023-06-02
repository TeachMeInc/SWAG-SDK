using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using AddictingGames;

public class SampleScript : MonoBehaviour
{
    void Start ()
    {
        SWAG.Instance.ShowAd(
            () => { Debug.Log("Ad complete."); },
            (string error) => { Debug.Log(error); }
        );
    }

    void Update ()
    {
        
    }
}
