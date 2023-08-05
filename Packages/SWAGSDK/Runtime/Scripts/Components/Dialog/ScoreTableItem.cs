using System.Collections;
using System.Collections.Generic;
using UnityEngine;

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
            fields[3].text = score.date.ToString("MMMM dd, yyyy");

            this.SetZebraStripe();
        }

        void SetZebraStripe ()
        {
            var images = new List<UnityEngine.UI.Image>(this.transform.parent.GetComponentsInChildren<UnityEngine.UI.Image>(true));
            var thisImage = this.GetComponent<UnityEngine.UI.Image>();
            
            var index = images.IndexOf(thisImage);
            if (index % 2 == 0) {
                thisImage.color = new Color(1f, 1f, 1f, 0f);
            }
        }
    }
}
