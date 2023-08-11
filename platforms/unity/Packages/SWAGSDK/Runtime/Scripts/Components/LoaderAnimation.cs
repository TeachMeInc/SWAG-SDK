using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LoaderAnimation : MonoBehaviour
{
    public void Show ()
    {
        this.SetVisible(true);
    }

    public void Hide ()
    {
        this.SetVisible(false);
    }

    public void SetVisible (bool isVisible)
    {
        this.gameObject.SetActive(isVisible);
    }
}
