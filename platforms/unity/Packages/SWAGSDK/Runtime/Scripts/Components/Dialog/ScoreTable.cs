using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

namespace AddictingGames 
{
    public class ScoreTable : Table
    {
        TextMeshProUGUI columnLabel;

        void Awake ()
        {
            this.columnLabel = this
                .GetComponentInChildren<TableColumnLabelHint>(true)
                .GetComponent<TextMeshProUGUI>();
        }

        public ScoreTable SetValueColumnLabel (string text)
        {
            if (this.columnLabel == null) {
                this.Awake();
            }

            this.columnLabel.text = text;
            return this;
        }
    }
}
