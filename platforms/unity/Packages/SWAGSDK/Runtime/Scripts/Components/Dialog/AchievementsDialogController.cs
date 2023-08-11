using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class AchievementsDialogController : DialogController
    {
        List<Achievement> achievements;

        protected override void OnBeforeShow (Dialog dialog)
        {
            dialog
                .SetHeaderText("");

            dialog.gameObject
                .GetComponentInChildren<Table>(true)
                .gameObject.SetActive(false);
        }

        protected override void OnShow (
            Dialog dialog, 
            System.Action ready,
            System.Action<string> error)
        {
            var swag = SWAG.Instance;

            swag.Achievements.currentUser.GetAchievements(
                (List<Achievement> achievements) => {
                    this.achievements = achievements;
                    ready();
                },
                error
            );
        }

        protected override void OnLayout (Dialog dialog, bool isRerender = false)
        {
            // Header
            dialog
                .SetHeaderText("Achievements");

            // Table Items
            var table = dialog.gameObject.GetComponentInChildren<Table>(true);
            var tableItems = new List<Transform>();

            foreach (var achievement in this.achievements) {
                var scoreTableItem = Instantiate(
                    table.itemPrefab,
                    Vector3.zero,
                    Quaternion.identity,
                    dialog.gameObject.transform
                );

                scoreTableItem
                    .GetComponent<AchievementTableItem>()
                    .SetFields(achievement);

                tableItems.Add(scoreTableItem);
            }

            table
                .SetContent(tableItems)
                .gameObject.SetActive(true);
        }
    }
}
