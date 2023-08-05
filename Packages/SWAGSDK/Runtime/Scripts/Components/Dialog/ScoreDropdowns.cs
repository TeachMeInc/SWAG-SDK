using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

namespace AddictingGames
{
    public class ScoreDropdowns : MonoBehaviour
    {
        public ScoreDropdowns SetItems (List<string> items)
        {
            var dropdown = this.GetComponentsInChildren<TMP_Dropdown>(true)[0];
            dropdown.ClearOptions();
            dropdown.AddOptions(items);

            return this;
        }
    }
}
