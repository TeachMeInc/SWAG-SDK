using System.Collections;
using System.Collections.Generic;
using AddictingGames;
using UnityEngine;
using UnityEngine.Video;

public class Branding : MonoBehaviour
{
    public VideoPlayer videoPlayer;

    // Start is called before the first frame update
    void Start()
    {
        var provider = SWAGConfig.Instance.Provider;

        if (provider == Provider.AddictingGames) 
        {
            this.videoPlayer.url = SWAGConstants.AddictingGamesPreloaderURL;
        } 
        else if (provider == Provider.Shockwave) 
        {
            this.videoPlayer.url = SWAGConstants.ShockwavePreloaderURL;
        }

        this.Play(() => Debug.Log("Video complete"));
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public IEnumerator Play (System.Action onComplete)
    {   
        this.videoPlayer.time = 0;
        this.videoPlayer.Play();

        while (this.videoPlayer.isPlaying)
        {
            yield return null;
        }

        onComplete();
    }
}
