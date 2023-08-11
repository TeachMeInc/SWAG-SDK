using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    namespace Scores
    {
        public struct Score
        {
            public string value;
            public System.DateTime date;
            public string memberName;
            public string memberAvatarUrl;
            public int position;
        }

        public struct LevelKey
        {
            public string key;
            public string displayName;
            public string valueLabel;
            public string valueType;
            public int dropdownOrder;
            public bool isReversed;
        }

        public struct DailyBest
        {
            public string dailyBest;
            public int position;
            public int totalScores;
        }

        public enum ScorePeriod 
        {
            Daily,
            Weekly,
            AllTime,
        }

        public class ScoresCurrentUser
        {
            public ScoresCurrentUser () 
            {}

            public void RecordScore (
                string levelKey, 
                string score,
                System.Action onSuccess,
                System.Action<string> onError
            ) 
            {
                if (!SWAG.Instance.User.IsLoggedIn()) {
                    throw new System.Exception("User is not logged in.");
                }
                
                var postData = JsonUtility.ToJson(new RecordScoreWebRequest {
                    game = SWAGConfig.Instance.APIKey,
                    level_key = levelKey,
                    value = score
                });
                
                SWAG.Instance.StartCoroutine(SWAG.Instance.PostRequest(
                    SWAGConstants.SWAGServicesURL + "/score",
                    postData,
                    true,
                    (string response) => {
                        onSuccess();
                    },
                    (string error) => {
                        onError(error);
                    }
                ));
            }

            public void GetDailyBest (
                string levelKey, 
                System.Action<DailyBest> onSuccess,
                System.Action<string> onError
            ) 
            {
                var valueFormatter = SWAGConfig.Instance.DefaultValueFormatter;
                this.GetDailyBest(levelKey, valueFormatter, onSuccess, onError);
            }

            public void GetDailyBest (
                string levelKey,
                string valueFormatter,
                System.Action<DailyBest> onSuccess,
                System.Action<string> onError
            ) 
            {
                if (!SWAG.Instance.User.IsLoggedIn()) {
                    throw new System.Exception("User is not logged in.");
                }

                SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                    SWAGConstants.SWAGServicesURL + "/scores/context" +
                        $"?game={SWAGConfig.Instance.APIKey}" + 
                        $"&level_key={levelKey}" + 
                        $"&value_formatter={valueFormatter}",
                    true,
                    (string response) => {
                        var data = JsonUtility.FromJson<DailyBestWebResponse>(response);

                        var dailyBest = data.dailyBest.value == "-"
                            ? ""
                            : data.dailyBest.value;
                        var position = data.scorePosition.value == "-"
                            ? -1
                            : int.Parse(data.scorePosition.value);
                        var totalScores = data.totalScores == null
                            ? -1
                            : data.totalScores?.value == "-"
                                ? -1
                                : int.Parse(data.totalScores?.value);

                        onSuccess(new DailyBest {
                            dailyBest = dailyBest,
                            position = position,
                            totalScores = totalScores
                        });
                    },
                    (string error) => {
                        onError(error);
                    }
                ));
            }

            public void GetScores (
                string levelKey, 
                ScorePeriod period,
                System.Action<List<Score>> onSuccess,
                System.Action<string> onError
            ) 
            {
                var valueFormatter = SWAGConfig.Instance.DefaultValueFormatter;
                this.GetScores(levelKey, period, valueFormatter, onSuccess, onError);
            }

            public void GetScores (
                string levelKey, 
                ScorePeriod period, 
                string valueFormatter,
                System.Action<List<Score>> onSuccess,
                System.Action<string> onError
            )
            {
                if (!SWAG.Instance.User.IsLoggedIn()) {
                    throw new System.Exception("User is not logged in.");
                }

                SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                    SWAGConstants.SWAGServicesURL + "/userbest" + Scores.GetScoresURI(levelKey, period, valueFormatter),
                    true,
                    (string response) => {
                        var data = JsonListHelper.FromJson<ScoresWebResponse>(response);
                        var scores = data.ConvertAll<Score>((ScoresWebResponse item) => {
                            return new Score {
                                value = item.value,
                                date = System.DateTime.Parse(item.date_created),
                                memberName = item.screen_name,
                                memberAvatarUrl = item.avatarUrl,
                                position = item.position
                            };
                        });
                        onSuccess(scores);
                    },
                    (string error) => {
                        onError(error);
                    }
                ));
            }
        }

        public class Scores
        {
            public ScoresCurrentUser currentUser = new ScoresCurrentUser();
            List<LevelKey> levelKeys;

            public Scores () 
            {}

            public static string GetPeriodString (ScorePeriod period) 
            {
                return period switch
                {
                    ScorePeriod.Daily => "daily",
                    ScorePeriod.Weekly => "weekly",
                    ScorePeriod.AllTime => "all_time",
                    _ => throw new System.Exception("Invalid ScorePeriod"),
                };
            }

            public static string GetScoresURI (string levelKey, ScorePeriod period, string valueFormatter)
            {
                return 
                    $"?game={SWAGConfig.Instance.APIKey}" +
                    $"&level_key={levelKey}" + 
                    $"&period={Scores.GetPeriodString(period)}" + 
                    $"&value_formatter={valueFormatter}"; 
            }

            public void ShowDialog ()
            {
                this.ShowDialog(
                    () => {}, 
                    (string error) => {}
                );
            }

            public void ShowDialog (System.Action onClosed)
            {
                this.ShowDialog(
                    onClosed, 
                    (string error) => {}
                );
            }

            public void ShowDialog (System.Action<string> onError)
            {
                this.ShowDialog(
                    () => {},
                    onError
                );
            }

            public void ShowDialog (
                System.Action onClosed,
                System.Action<string> onError
            ) 
            {
                var dialogController = SWAG.Instance.gameObject.GetComponentInChildren<ScoresDialogController>(true);
                dialogController.Show(onClosed, onError);
            }

            public void GetLevelKeys (
                System.Action<List<LevelKey>> onSuccess, 
                System.Action<string> onError
            )
            {
                if (this.levelKeys != null) {
                    onSuccess(this.levelKeys);
                    return;
                }

                SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                    SWAGConstants.SWAGServicesURL + "/score/categories?game=" + SWAGConfig.Instance.APIKey,
                    false,
                    (string response) => {
                        var data = JsonListHelper.FromJson<LevelKeysWebResponse>(response);
                        var levelKeys = data.ConvertAll<LevelKey>((LevelKeysWebResponse item) => {
                            return new LevelKey {
                                key = item.level_key,
                                displayName = item.name,
                                valueLabel = item.value_name,
                                valueType = item.value_type,
                                dropdownOrder = item.order,
                                isReversed = item.reverse,
                            };
                        });
                        this.levelKeys = levelKeys;
                        onSuccess(levelKeys);
                    },
                    (string error) => {
                        onError(error);
                    }
                ));
            }

            public void GetScores (
                string levelKey, 
                ScorePeriod period,
                System.Action<List<Score>> onSuccess, 
                System.Action<string> onError
            )
            {
                var valueFormatter = SWAGConfig.Instance.DefaultValueFormatter;
                this.GetScores(levelKey, period, valueFormatter, onSuccess, onError);
            }

            public void GetScores (
                string levelKey, 
                ScorePeriod period,
                string valueFormatter,
                System.Action<List<Score>> onSuccess, 
                System.Action<string> onError
            )
            {
                SWAG.Instance.StartCoroutine(SWAG.Instance.GetRequest(
                    SWAGConstants.SWAGServicesURL + "/scores" + Scores.GetScoresURI(levelKey, period, valueFormatter),
                    false,
                    (string response) => {
                        var data = JsonListHelper.FromJson<ScoresWebResponse>(response);
                        var scores = data.ConvertAll<Score>((ScoresWebResponse item) => {
                            return new Score {
                                value = item.value,
                                date = System.DateTime.Parse(item.date_created),
                                memberName = item.screen_name,
                                memberAvatarUrl = item.avatarUrl,
                                position = item.position
                            };
                        });
                        onSuccess(scores);
                    },
                    (string error) => {
                        onError(error);
                    }
                ));
            }
        }
    }
}
