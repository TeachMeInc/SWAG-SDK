using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class Dialog : MonoBehaviour
    {
        LoaderAnimation loader;
        HeaderText headerText;

        void Awake ()
        {
            this.loader = this.GetComponentInChildren<LoaderAnimation>(true);
            this.headerText = this.GetComponentInChildren<HeaderText>(true);
        }

        public void Show ()
        {
            this.gameObject.SetActive(true);
            this.loader.Show();
        }

        public void Ready ()
        {
            this.loader.Hide();
        }

        public void Hide (System.Action onComplete)
        {
            this.gameObject.SetActive(false);
            onComplete();
        }

        public void SetVisible (bool isVisible)
        {
            this.gameObject.SetActive(isVisible);
            this.loader.SetVisible(false);
        }

        public void SetHeaderText (string text)
        {
            if (this.headerText == null) {
                this.Awake();
            }
            
            this.headerText.SetText(text);
        }

        public void SetLoading (bool isLoading)
        {
            if (this.loader == null) {
                this.Awake();
            }

            if (isLoading) {
                this.loader.Show();
            } else {
                this.loader.Hide();
            }
        }
    }
}
