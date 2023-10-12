using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TableCell : MonoBehaviour
{
    public RectTransform rectTransform;
    public float landscapeWidth;
    public float portraitWidth;
    
    public void Resize (bool isLandscape)
    {
        var width = isLandscape 
            ? this.landscapeWidth 
            : this.portraitWidth;

        this.rectTransform.SetSizeWithCurrentAnchors(
            RectTransform.Axis.Horizontal, 
            width
        );
    }
}
