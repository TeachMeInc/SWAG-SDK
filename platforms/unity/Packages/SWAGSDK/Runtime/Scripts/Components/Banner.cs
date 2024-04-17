using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace Shockwave
{
    public enum BannerSize
    {
        Leaderboard,
        Medium,
        Mobile,
    }

    [ExecuteInEditMode]
    public class Banner : MonoBehaviour
    {
        /* #region Configuration */

        [SerializeField]
        public BannerSize bannerSize = BannerSize.Leaderboard;

        /* #endregion */



        string id;

        void Start ()
        {
            this.ToggleVisible();
        }

        void OnEnable ()
        {
            this.ToggleVisible();

            if (SWAG.Instance) {
                if (this.id == null) this.id = System.Guid.NewGuid().ToString();

                SWAG.Instance.ShowBanner(
                    this.id,
                    this.GetPosition(),
                    this.GetPivot(),
                    this.bannerSize
                );
            }
        }

        void OnDisable ()
        {
            if (this.id != null && SWAG.Instance) {
                SWAG.Instance.HideBanner(this.id);
            }
        }

        void Update ()
        {
            this.GetComponent<RectTransform>().sizeDelta = this.GetDimensions();

            if (this.id != null && SWAG.Instance) {
                SWAG.Instance.PositionBanner(
                    this.id,
                    this.GetPosition()
                );
            }
        }

        void ToggleVisible ()
        {
            #if UNITY_WEBGL && !UNITY_EDITOR
                this.GetComponent<Image>().enabled = false;
            #else
                this.GetComponent<Image>().enabled = true;
            #endif
        }

        public Vector2 GetDimensions ()
        {
            var dimensions = new Vector3();

            switch (this.bannerSize)
            {
                case BannerSize.Leaderboard:
                    dimensions.x = 728;
                    dimensions.y = 90;
                    break;
                case BannerSize.Medium:
                    dimensions.x = 300;
                    dimensions.y = 250;
                    break;
                case BannerSize.Mobile:
                    dimensions.x = 320;
                    dimensions.y = 50;
                    break;  
            }

            return dimensions;
        }

        public Vector2 GetPosition ()
        {
            return this.GetComponent<RectTransform>().transform.position;
        }

        public string GetPivot ()
        {
            var pivot = this.GetComponent<RectTransform>().pivot;

            if (pivot.x == 0 && pivot.y == 1) return "topLeft";
            if (pivot.x == 0.5f && pivot.y == 1) return "topCenter";
            if (pivot.x == 1 && pivot.y == 1) return "topRight";
            if (pivot.x == 0 && pivot.y == 0.5f) return "middleLeft";
            if (pivot.x == 0.5f && pivot.y == 0.5f) return "middleCenter";
            if (pivot.x == 1 && pivot.y == 0.5f) return "middleRight";
            if (pivot.x == 0 && pivot.y == 0) return "bottomLeft";
            if (pivot.x == 0.5f && pivot.y == 0) return "bottomCenter";
            if (pivot.x == 1 && pivot.y == 0) return "bottomRight";

            return "topLeft";
        }
    }
}
