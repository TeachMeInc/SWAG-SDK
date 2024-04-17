using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace Shockwave
{
    public class ScoreDropdowns : MonoBehaviour
    {
        public Transform scoresDialogController;

        List<TMP_Dropdown> dropdowns;

        int selectedLevelKey = 0;
        int selectedPeriod = 0;

        void Awake ()
        {
            this.dropdowns = new List<TMP_Dropdown>(
                this.GetComponentsInChildren<TMP_Dropdown>(true)
            );
        }

        void Update ()
        {
            if (this.dropdowns == null) {
                return;
            }
            
            var curLevelKeyIndex = this.dropdowns[0].value;
            var curPeriodIndex = this.dropdowns[1].value;
            
            if (
                curLevelKeyIndex != this.selectedLevelKey ||
                curPeriodIndex != this.selectedPeriod
            ) {
                this.selectedLevelKey = curLevelKeyIndex;
                this.selectedPeriod = curPeriodIndex;

                this.scoresDialogController
                    .GetComponent<ScoresDialogController>()
                    .OnDropdownsChanged(
                        selectedLevelKey,
                        selectedPeriod
                    );
            }
        }

        public ScoreDropdowns SetItems (List<string> items)
        {
            if (this.dropdowns == null) {
                this.Awake();
            }

            this.selectedLevelKey = 0;

            var dropdown = this.dropdowns[0];
            dropdown.ClearOptions();
            dropdown.AddOptions(items);

            return this;
        }

        public ScoreDropdowns Reset ()
        {
            if (this.dropdowns == null) {
                this.Awake();
            }

            this.selectedLevelKey = 0;
            this.selectedPeriod = 0;

            this.dropdowns[0].value = 0;
            this.dropdowns[1].value = 0;

            return this;
        }
    }
}
