using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;

public class SampleSqaureScript : MonoBehaviour
{
    void OnMouseDown ()
    {
        if (SWAG.Instance) {
            SWAG.Instance.OpenURL("https://www.addictinggames.com/");
        }
    }
}
