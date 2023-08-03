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

        public bool IsPlaying () 
        {
            return (this.videoPlayer.time < (this.videoPlayer.length - 0.09f)) || this.videoPlayer.isPlaying;
        }
    }
}
