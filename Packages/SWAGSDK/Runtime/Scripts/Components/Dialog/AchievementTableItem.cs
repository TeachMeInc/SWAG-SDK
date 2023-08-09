using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;

public class AchievementTableItem : MonoBehaviour
{
    public void SetFields (Achievement achievement)
    {
        var fields = this.GetComponentsInChildren<TMPro.TextMeshProUGUI>(true);

        fields[0].text = achievement.name;
        fields[1].text = achievement.description;

        this.SetAchieved(achievement.userAchieved);
    }

    void SetAchieved (bool? isAchieved) 
    {
        // TODO
    }
}
