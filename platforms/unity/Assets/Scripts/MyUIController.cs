using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Shockwave;

public class MyUIController : MonoBehaviour
{
    public GameObject
        RootGameObject;

    public Button 
        ShowScoreDialogBtn,
        ShowAchievementDialogBtn,
        RecordScoreBtn,
        RecordAchievementBtn,
        PlayAdBtn,
        ShowLoginDialogBtn,
        ShowShareDialogBtn,
        ToggleFullscreenBtn,
        OpenURLBtn,
        IsUserSubscribedBtn,
        SaveCloudDataBtn,
        RestoreCloudDataBtn,
        NavigateToArchiveBtn;
    
    public TMPro.TMP_Text 
        UserLabel;
    
    void Start ()
    {
        this.HideAds();
        var swag = SWAG.Instance;

        swag.OnReady(() => {
            ShowScoreDialogBtn.onClick.AddListener(() => {
                this.HideAds();
                swag.Scores.ShowDialog();
            });

            ShowAchievementDialogBtn.onClick.AddListener(() => {
                this.HideAds();
                swag.Achievements.ShowDialog();
            });

            RecordScoreBtn.onClick.AddListener(() => {
                swag.Scores.currentUser.RecordScore(
                    "score1",
                    100f,
                    () => { 
                        Debug.Log("Score recorded!");
                        swag.Scores.ShowDialog();
                    },
                    (string error) => { Debug.Log("Error recording score: " + error); }
                );
            });

            RecordAchievementBtn.onClick.AddListener(() => {
                swag.Achievements.currentUser.RecordAchievement(
                    "achievement1",
                    () => { 
                        Debug.Log("Achievement recorded!");
                        swag.Achievements.ShowDialog();
                    },
                    (string error) => { Debug.Log("Error recording achievement: " + error); }
                );
            });

            PlayAdBtn.onClick.AddListener(() => {
                swag.BeginAd(
                    () => { Debug.Log("Ad complete!"); },
                    (string error) => { Debug.Log("Error playing ad: " + error); }
                );
            });

            ShowLoginDialogBtn.onClick.AddListener(() => {
                swag.User.ShowLoginDialog(
                    () => { Debug.Log("User logged in."); }
                );
            });

            ShowShareDialogBtn.onClick.AddListener(() => {
                swag.ShowShareDialog();
            });

            ToggleFullscreenBtn.onClick.AddListener(() => {
                swag.ToggleFullscreen();
            });

            OpenURLBtn.onClick.AddListener(() => {
                swag.OpenURL("https://www.addictinggames.com");
            });

            IsUserSubscribedBtn.onClick.AddListener(() => {
               swag.User.IsSubscriber(
                    (bool isSubscriber) => { Debug.Log(isSubscriber); },
                    (string error) => { Debug.Log(error); }
                );
            });

            NavigateToArchiveBtn.onClick.AddListener(() => {
                swag.NavigateToArchive();
            });

            var key = "any_key";
            var value = "any_value";

            SaveCloudDataBtn.onClick.AddListener(() => {
                swag.User.SetData(
                    key,
                    value,
                    () => { Debug.Log("User data saved."); },
                    (string error) => { Debug.Log(error); }
                );
            });

            RestoreCloudDataBtn.onClick.AddListener(() => {
                swag.User.GetData(
                    (List<UserData> data) => { Debug.Log("User data retrieved."); },
                    (string error) => { Debug.Log(error); }
                );
            });
        });
    }

    void Update ()
    {
        var swag = SWAG.Instance;

        if (swag.isReady) {
            this.UserLabel.text = "Logged in as " + swag.User.memberName;
        }
    }

    void HideAds ()
    {
        var ads = this.RootGameObject.GetComponentsInChildren<Banner>(true);
        foreach (var ad in ads) {
            ad.gameObject.SetActive(false);
        }
    }

    void ShowAds ()
    {
        var ads = this.RootGameObject.GetComponentsInChildren<Banner>(true);
        foreach (var ad in ads) {
            ad.gameObject.SetActive(true);
        }
    }
}
