using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Loader : MonoBehaviour
{
    public void SetVisible (bool visible)
    {
        this.gameObject.SetActive(visible);
    }
}
