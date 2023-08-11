using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;
using UnityEngine.UI;

public class AchievementTableItem : MonoBehaviour
{
    [SerializeField]
    public Image AchievedImage;
    [SerializeField]
    public Image NotAchievedImage;

    public void SetFields (Achievement achievement)
    {
        var fields = this.GetComponentsInChildren<TMPro.TextMeshProUGUI>(true);

        fields[0].text = achievement.name;
        fields[1].text = achievement.description;

        this.SetZebraStripe();
        this.SetAchieved(achievement.userAchieved);
    }

    void SetAchieved (bool? isAchieved) 
    {
        var fields = this.GetComponentsInChildren<TMPro.TextMeshProUGUI>(true);

        Color textColor;
        foreach (var field in fields) {
            textColor = field.color;
            textColor.a = isAchieved == true ? 1f : 0.5f;
            field.color = textColor;
        }
        
        this.AchievedImage.gameObject.SetActive(isAchieved == true);
        this.NotAchievedImage.gameObject.SetActive(isAchieved == false || isAchieved == null);
    }

    void SetZebraStripe ()
    {
        var items = new List<AchievementTableItem>(this.transform.parent.GetComponentsInChildren<AchievementTableItem>(true));
        var thisItem = this.GetComponent<AchievementTableItem>();
        var thisImage = this.GetComponent<Image>();
        
        var index = items.IndexOf(thisItem);
        if (index % 2 == 1) {
            thisImage.color = new Color(1f, 1f, 1f, 0f);
        }
    }
}
