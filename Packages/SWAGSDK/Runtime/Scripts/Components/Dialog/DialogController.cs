using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using AddictingGames;

namespace AddictingGames
{
    public class DialogController : MonoBehaviour
    {
        [SerializeField]
        public bool UseSingleDialog = false;

        Dialog landscapeDialog;
        Dialog portraitDialog;
        AsyncHandler<object> dialogLifecycleHandler;
        
        void Awake ()
        {
            this.landscapeDialog = this.GetComponentsInChildren<Dialog>(true)[0];
            this.portraitDialog = this.UseSingleDialog ? this.landscapeDialog : this.GetComponentsInChildren<Dialog>(true)[1];
        }

        void Start ()
        {
            Color color;
            var htmlValue = SWAGConfig.Instance.Provider == Provider.AddictingGames
                ? SWAGConstants.AddictingGamesPrimaryColor
                : SWAGConstants.ShockwavePrimaryColor;

            if (ColorUtility.TryParseHtmlString(htmlValue, out color)) {
                var objects = this.GetComponentsInChildren<ThemeHint>(true);

                foreach (var obj in objects) {
                    obj.SetColor(color);
                }
            }
        }

        void Update ()
        {
            if (SWAGConfig.Instance.ViewMode != ViewMode.Responsive) {
                return;
            }

            var activeDialog = this.ActiveDialog();

            if (this.IsLandscape() && activeDialog != this.landscapeDialog) {
                this.OnLayout(this.landscapeDialog);
                this.landscapeDialog.SetVisible(true);
                this.portraitDialog.SetVisible(false);
            } else if (!this.IsLandscape() && activeDialog != this.portraitDialog) {
                this.OnLayout(this.portraitDialog);
                this.landscapeDialog.SetVisible(false);
                this.portraitDialog.SetVisible(true);
            }
        }

        protected bool IsLandscape ()
        {
            return SWAGConfig.Instance.ViewMode != ViewMode.Responsive
                ? SWAGConfig.Instance.ViewMode == ViewMode.ForceLandscape
                : Screen.width > Screen.height;
        }

        protected Dialog CurrentDialog ()
        {
            if (this.UseSingleDialog || this.IsLandscape()) {
                return this.landscapeDialog;
            } else {
                return this.portraitDialog;
            }
        }

        protected Dialog ActiveDialog ()
        {
            if (this.landscapeDialog.gameObject.activeSelf) {
                return this.landscapeDialog;
            } else if (this.portraitDialog.gameObject.activeSelf) {
                return this.portraitDialog;
            }
            return null;
        }
        
        public void Show (
            System.Action onClosed,
            System.Action<string> onError
        )
        {
            if (this.gameObject.activeSelf) {
                throw new System.Exception("Dialog already active.");
            }

            this.dialogLifecycleHandler = new AsyncHandler<object>(
                (object result) => { onClosed(); }, 
                onError
            );
            
            this.gameObject.SetActive(true);
            
            var dialog = this.CurrentDialog();
            this.OnBeforeShow(dialog);
            dialog.Show();
            this.OnShow(
                dialog, 
                () => { 
                    dialog.Ready();
                    this.OnLayout(dialog);
                },
                (string error) => {
                    this.dialogLifecycleHandler.Reject(error);
                    this.dialogLifecycleHandler = null;
                    this.gameObject.SetActive(false);
                }
            );
        }

        public void Hide ()
        {
            if (!this.gameObject.activeSelf) {
                throw new System.Exception("Dialog not active.");
            }

            var dialog = this.ActiveDialog();
            if (dialog == null) {
                throw new System.Exception("Dialog not active.");
            }

            dialog.Hide(() => {
                this.dialogLifecycleHandler.Resolve(null);
                this.dialogLifecycleHandler = null;
                this.gameObject.SetActive(false);
            });
        }

        protected virtual void OnBeforeShow (Dialog dialog)
        {
            return;
        }

        protected virtual void OnShow (
            Dialog dialog, 
            System.Action ready, 
            System.Action<string> error
        )
        {
            ready();
        }

        protected virtual void OnLayout (Dialog dialog, bool isRerender = false)
        {
            return;
        }
    }
}
