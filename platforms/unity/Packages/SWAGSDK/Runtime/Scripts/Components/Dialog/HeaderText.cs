using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

namespace Shockwave
{
    public class HeaderText : MonoBehaviour
    {
        TextMeshProUGUI text;

        void Awake ()
        {
            this.text = this.GetComponentsInChildren<TextMeshProUGUI>(true)[0];
        }

        public void SetText (string text)
        {
            if (this.text == null) {
                this.Awake();
            }

            this.text.text = text;
        }
    }
}
