using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;
using UnityEngine.Video;

namespace AddictingGames
{
    public class BrandingAnimation : MonoBehaviour
    {
        VideoPlayer videoPlayer;
        bool isPlaying = true;

        void Start ()
        {
            this.videoPlayer = this.GetComponent<VideoPlayer>();

            if (!SWAGConfig.Instance.PlayBrandingAnimation) {
                this.gameObject.SetActive(false);
                return;
            }

            if (SWAGConfig.Instance.Provider == Provider.AddictingGames) {
                this.videoPlayer.url = SWAGConstants.AddictingGamesPreloaderURL;
            } else if (SWAGConfig.Instance.Provider == Provider.Shockwave) {
                this.videoPlayer.url = SWAGConstants.ShockwavePreloaderURL;
            }
        }

        void Update () 
        {
            var isPlaying = this.videoPlayer.time == 0f || 
                this.videoPlayer.isPlaying;

            if (!isPlaying) {
                this.isPlaying = false;
            }
        }

        public bool IsPlaying () 
        {
            return this.isPlaying;
        }
    }
}
