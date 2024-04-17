using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

namespace Shockwave
{
    public class PlayerBest : MonoBehaviour
    {
        TextMeshProUGUI line0;
        TextMeshProUGUI line1;

        void Awake ()
        {
            this.line0 = this.GetComponentsInChildren<TextMeshProUGUI>()[0];
            this.line1 = this.GetComponentsInChildren<TextMeshProUGUI>()[1];
        }

        public void SetText (string line0, string line1)
        {
            if (this.line0 == null || this.line1 == null) {
                this.Awake();
            }

            this.line0.text = line0;
            this.line1.text = line1;
        }
    }
}
