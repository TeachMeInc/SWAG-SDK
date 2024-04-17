using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace Shockwave
{
    public class ThemeHint : MonoBehaviour
    {
        public void SetColor (Color color)
        {
            this.GetComponent<Image>().color = color;
        }
    }
}
