using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace AddictingGames
{
    public class MyScoresToggle : MonoBehaviour
    {
        public Transform scoresDialogController;

        Toggle toggle;

        bool onlyMyScores = false;

        void Awake ()
        {
            this.toggle = this.GetComponentInChildren<Toggle>(true);
        }

        void Update ()
        {
            if (this.toggle == null) {
                return;
            }

            var curOnlyMyScores = this.toggle.isOn;

            if (curOnlyMyScores != this.onlyMyScores) {
                this.onlyMyScores = curOnlyMyScores;

                this.scoresDialogController
                    .GetComponent<ScoresDialogController>()
                    .OnMyScoresToggleChanged(onlyMyScores);
            }
        }

        public MyScoresToggle Reset ()
        {
            if (this.toggle == null) {
                this.Awake();
            }

            this.onlyMyScores = false;
            this.toggle.isOn = false;

            return this;
        }
    }
}
