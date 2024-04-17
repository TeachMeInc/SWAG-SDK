using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Shockwave;

namespace Shockwave
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
            var htmlValue = SWAGConstants.ShockwavePrimaryColor;

            if (ColorUtility.TryParseHtmlString(htmlValue, out color)) {
                var objects = this.GetComponentsInChildren<ThemeHint>(true);

                foreach (var obj in objects) {
                    obj.SetColor(color);
                }
            }

            this.ResizeLogos();
        }

        void Update ()
        {
            if (SWAGConfig.Instance.ViewMode != ViewMode.Responsive) {
                return;
            }

            var activeDialog = this.ActiveDialog();

            var isLandscape = this.IsLandscape();
            var isNarrowDevice = this.IsNarrowDevice();

            if (isLandscape && activeDialog != this.landscapeDialog) {
                this.OnLayout(this.landscapeDialog);
                this.landscapeDialog.SetVisible(true);
                this.portraitDialog.SetVisible(false);
            } else if (!isLandscape && activeDialog != this.portraitDialog) {
                this.OnLayout(this.portraitDialog);
                this.landscapeDialog.SetVisible(false);
                this.portraitDialog.SetVisible(true);
            }

            if (isLandscape) {
                if (isNarrowDevice) {
                    this.ResizeDialog(
                        480f, 320f,
                        800f, 600f
                    );
                } else {
                    this.ResizeDialog(
                        640f, 480f, 
                        800f, 600f
                    );
                }
            } else {
                this.ResizeDialog(
                    320f, 480f, 
                    600f, 800f
                );
            }
        }

        void ResizeDialog (float minWidth, float minHeight, float maxWidth, float maxHeight)
        {
            var isLandscape = this.IsLandscape();
            var isNarrowDevice = this.IsNarrowDevice();

            var screenWidth = 0f;
            var screenHeight = 0f;

            // Landscape
            if (isLandscape) {
                if (isNarrowDevice) {
                    screenWidth = Screen.width + 44f; // 32px padding on each side - 10px padding between edges
                    screenHeight = Screen.height + 34f; // 5px adjustment on top/bottom
                } else {
                    screenWidth = Screen.width * .75f;
                    screenHeight = Screen.height * .75f;
                }
            }
            
            // Portrait
            else {
                screenWidth = Screen.width + 44f; // 32px padding on each side - 10px padding between edges
                screenHeight = Screen.height + 44f;
            }

            var width = Mathf.Clamp(screenWidth, minWidth, maxWidth);
            var height = Mathf.Clamp(screenHeight, minHeight, maxHeight);

            var rectTransform = this.GetComponent<RectTransform>();
            rectTransform.sizeDelta = new Vector2(width, height);

            this.ResizeTableItems();
            this.ResizeLogos();
        }

        void ResizeTableItems ()
        {
            var isLandscape = this.IsLandscape();

            var tableCells = this.GetComponentsInChildren<TableCell>(true);

            foreach (var tableCell in tableCells) {
                tableCell.Resize(isLandscape);
            }
        }

        void ResizeLogos ()
        {
            var isLandscape = this.IsLandscape();
            var isNarrowDevice = this.IsNarrowDevice();

            var logos = this.GetComponentsInChildren<Logo>(true);

            foreach (var logo in logos) {
                logo.SetLogoSize(
                    (isNarrowDevice && !isLandscape)
                        ? LogoSize.Compact 
                        : LogoSize.FullWidth
                );
            }
        }

        protected bool IsLandscape ()
        {
            return SWAGConfig.Instance.ViewMode != ViewMode.Responsive
                ? SWAGConfig.Instance.ViewMode == ViewMode.ForceLandscape
                : Screen.width > Screen.height;
        }

        protected bool IsNarrowDevice ()
        {
            return Screen.width <= 768f;
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
