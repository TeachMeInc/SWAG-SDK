using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;
using UnityEngine.Video;

namespace AddictingGames
{
    public class BrandingAnimation : MonoBehaviour
    {
        [SerializeField]
        public bool hideOnComplete = true;

        [HideInInspector]
        public VideoPlayer videoPlayer;
        AsyncHandler<object> videoCompleteHandler;

        void Start ()
        {
            var provider = SWAGConfig.Instance.Provider;
            
            if (provider == Provider.AddictingGames) {
                this.videoPlayer.url = SWAGConstants.AddictingGamesPreloaderURL;
            } else if (provider == Provider.Shockwave) {
                this.videoPlayer.url = SWAGConstants.ShockwavePreloaderURL;
            }
        }

        void Update ()
        {
            if (this.videoCompleteHandler != null) {
                if (this.videoPlayer.time >= this.videoPlayer.length) {
                    this.videoCompleteHandler.Resolve(null);
                }
            }
        }

        public void Play (System.Action onComplete)
        {
            this.Play(onComplete, (string error) => {});
        }

        public void Play (
            System.Action onComplete, 
            System.Action<string> onError
        )
        {   
            if (this.videoCompleteHandler != null) {
                throw new System.Exception("Branding video is already playing.");
            }

            this.videoCompleteHandler = new AsyncHandler<object>(
                (object result) => { 
                    this.videoCompleteHandler = null;

                    onComplete();

                    if (this.hideOnComplete) {
                        this.gameObject.SetActive(false);
                    }
                },
                (string error) => { onError(error); }
            );

            this.videoPlayer.time = 0;
            this.videoPlayer.Play();
        }
    }
}
