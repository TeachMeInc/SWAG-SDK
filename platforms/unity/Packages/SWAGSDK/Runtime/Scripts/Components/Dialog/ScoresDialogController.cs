using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using AddictingGames;

namespace AddictingGames
{
    public class ScoresDialogController : DialogController
    {
        List<LevelKey> levelKeys;
        List<Score> scores;
        DailyBest? dailyBest;

        int curLevelKeyIndex = 0;
        int curPeriodIndex = 0;
        bool onlyMyScores = false;

        protected override void OnBeforeShow (Dialog dialog)
        {
            this.curLevelKeyIndex = 0;
            this.curPeriodIndex = 0;
            this.onlyMyScores = false;

            dialog
                .SetHeaderText("");

            dialog.gameObject
                .GetComponentInChildren<PlayerBest>(true)
                .SetText("", "");

            dialog.gameObject
                .GetComponentInChildren<ScoreDropdowns>(true)
                .Reset()
                .gameObject.SetActive(false);

            dialog.gameObject
                .GetComponentInChildren<ScoreTable>(true)
                .gameObject.SetActive(false);

            dialog.gameObject
                .GetComponentInChildren<MyScoresToggle>(true)
                .Reset()
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
                        levels[this.curLevelKeyIndex].key,
                        ScorePeriod.Daily,
                        (List<Score> scores) => {
                            this.scores = scores;

                            if (swag.User.IsLoggedIn()) {
                                swag.Scores.currentUser.GetDailyBest(
                                    levels[this.curLevelKeyIndex].key,
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

        protected override void OnLayout (Dialog dialog, bool isRerender = false)
        {
            // Header
            dialog
                .SetHeaderText(this.levelKeys[this.curLevelKeyIndex].valueLabel);

            // Player Best
            if (!isRerender) {
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
            }

            // Dropdown Items
            if (!isRerender) {
                var dropdownItems = new List<string>();
                foreach (var level in this.levelKeys) {
                    dropdownItems.Add(level.displayName);
                }

                dialog.gameObject
                    .GetComponentInChildren<ScoreDropdowns>(true)
                    .SetItems(dropdownItems)
                    .gameObject.SetActive(true);
            }

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
                .SetValueColumnLabel(this.levelKeys[this.curLevelKeyIndex].valueLabel)
                .SetContent(tableItems)
                .gameObject.SetActive(true);

            // My Scores Toggle
            dialog.gameObject
                .GetComponentInChildren<MyScoresToggle>(true)
                .gameObject.SetActive(true);
        }

        public void OnDropdownsChanged (int selectedLevelKey, int selectedPeriod)
        {
            this.curLevelKeyIndex = selectedLevelKey;
            this.curPeriodIndex = selectedPeriod;

            this.FetchScores();
        }

        public void OnMyScoresToggleChanged (bool onlyMyScores)
        {
            this.onlyMyScores = onlyMyScores;

            this.FetchScores();
        }

        void FetchScores ()
        {
            this.ActiveDialog().SetLoading(true);

            var swag = SWAG.Instance;

            if (this.onlyMyScores) {
                swag.Scores.currentUser.GetScores(
                    this.levelKeys[this.curLevelKeyIndex].key,
                    (ScorePeriod)this.curPeriodIndex,
                    (List<Score> scores) => {
                        this.scores = scores;
                        this.ActiveDialog().SetLoading(false);
                        this.OnLayout(this.ActiveDialog(), true);
                    },
                    (string error) => {
                        this.ActiveDialog().SetLoading(false);
                    }
                );
            } else {
                swag.Scores.GetScores(
                    this.levelKeys[this.curLevelKeyIndex].key,
                    (ScorePeriod)this.curPeriodIndex,
                    (List<Score> scores) => {
                        this.scores = scores;
                        this.ActiveDialog().SetLoading(false);
                        this.OnLayout(this.ActiveDialog(), true);
                    },
                    (string error) => {
                        this.ActiveDialog().SetLoading(false);
                    }
                );
            }
        }
    }
}
