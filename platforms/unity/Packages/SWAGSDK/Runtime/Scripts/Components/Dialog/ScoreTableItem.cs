using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI; 

namespace AddictingGames
{
    public class ScoreTableItem : MonoBehaviour
    {
        public void SetFields (Score score)
        {
            var fields = this.GetComponentsInChildren<TMPro.TextMeshProUGUI>(true);

            fields[0].text = score.position.ToString();
            fields[1].text = score.memberName;
            fields[2].text = score.value.ToString();
            fields[3].text = score.date.ToString("MMM dd, yyyy");

            this.SetZebraStripe();
        }

        void SetZebraStripe ()
        {
            var items = new List<ScoreTableItem>(this.transform.parent.GetComponentsInChildren<ScoreTableItem>(true));
            var thisItem = this.GetComponent<ScoreTableItem>();
            var thisImage = this.GetComponent<Image>();
            
            var index = items.IndexOf(thisItem);
            if (index % 2 == 1) {
                thisImage.color = new Color(1f, 1f, 1f, 0f);
            }
        }
    }
}
