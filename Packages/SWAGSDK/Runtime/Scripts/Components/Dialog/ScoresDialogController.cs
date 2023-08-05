using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class ScoresDialogController : DialogController
    {
        List<LevelKey> levelKeys;
        List<Score> scores;
        DailyBest? dailyBest;

        protected override void OnBeforeShow (Dialog dialog)
        {
            dialog
                .SetHeaderText("");

            dialog.gameObject
                .GetComponentInChildren<PlayerBest>(true)
                .SetText("", "");

            dialog.gameObject
                .GetComponentInChildren<ScoreDropdowns>(true)
                .gameObject.SetActive(false);

            dialog.gameObject
                .GetComponentInChildren<ScoreTable>(true)
                .gameObject.SetActive(false);

            dialog.gameObject
                .GetComponentInChildren<MyScoresToggle>(true)
                .gameObject.SetActive(false);
        }

        protected override void OnShow (
            Dialog dialog, 
            System.Action ready,
            System.Action<string> error)
        {
            var swag = SWAG.Instance;

            swag.Scores.GetLevelKeys(
                (List<LevelKey> levels) => {
                    this.levelKeys = levels;

                    swag.Scores.GetScores(
                        levels[0].key,
                        ScorePeriod.Daily,
                        (List<Score> scores) => {
                            this.scores = scores;

                            if (swag.User.IsLoggedIn()) {
                                swag.Scores.currentUser.GetDailyBest(
                                    levels[0].key,
                                    (DailyBest dailyBest) => {
                                        this.dailyBest = dailyBest;
                                        ready();
                                    },
                                    error
                                );
                            } else {
                                ready();
                            }
                        },
                        error
                    );
                },
                error
            );
        }

        protected override void OnLayout (Dialog dialog)
        {
            // Header
            dialog
                .SetHeaderText("SCORES HEADER");

            // Player Best
            if (
                this.dailyBest != null && 
                this.dailyBest?.dailyBest != "" &&
                this.dailyBest?.position != -1
            ) {
                dialog.gameObject
                    .GetComponentInChildren<PlayerBest>(true)
                    .SetText(
                        $"Today's Best Score: {this.dailyBest?.dailyBest}",
                        $"You placed #{this.dailyBest?.position} out of {this.dailyBest?.totalScores} scores today." 
                    );
            }

            // Dropdown Items
            var dropdownItems = new List<string>();
            foreach (var level in this.levelKeys) {
                dropdownItems.Add(level.displayName);
            }

            dialog.gameObject
                .GetComponentInChildren<ScoreDropdowns>(true)
                .SetItems(dropdownItems)
                .gameObject.SetActive(true);

            // Table Items
            var table = dialog.gameObject.GetComponentInChildren<ScoreTable>(true);
            var tableItems = new List<Transform>();

            foreach (var score in this.scores) {
                var scoreTableItem = Instantiate(
                    table.itemPrefab,
                    Vector3.zero,
                    Quaternion.identity,
                    dialog.gameObject.transform
                );

                scoreTableItem
                    .GetComponent<ScoreTableItem>()
                    .SetFields(score);

                tableItems.Add(scoreTableItem);
            }

            table
                .SetValueColumnLabel("LABEL")
                .SetContent(tableItems)
                .gameObject.SetActive(true);

            // My Scores Toggle
            dialog.gameObject
                .GetComponentInChildren<MyScoresToggle>(true)
                .gameObject.SetActive(true);
        }
    }
}
