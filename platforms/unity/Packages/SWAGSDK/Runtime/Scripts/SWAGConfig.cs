using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System.Runtime.InteropServices;

namespace AddictingGames
{
    [System.Serializable]
    public enum Provider 
    {
        AddictingGames,
        Shockwave,
    }

    [System.Serializable]
    public enum ViewMode
    {
        Responsive,
        ForcePortrait,
        ForceLandscape,
    }

    public class SWAGConfig : MonoBehaviour
    {
        /* #region Singleton */

        public static SWAGConfig Instance { get; private set; }
        
        private void Awake ()
        {
            if (Instance != null && Instance != this) {
                Destroy(this);
                return;
            }
            Instance = this;
            
        }

        /* #endregion */



        [Header ("SDK")]
        
        [SerializeField]
        public string APIKey = ""; 

        [SerializeField]
        public Provider Provider = Provider.AddictingGames;

        [SerializeField]
        public string DefaultValueFormatter = "";

        [SerializeField]
        public ViewMode ViewMode = ViewMode.Responsive;

        [SerializeField]
        public bool PlayBrandingAnimation = true;



        [Header ("Shockwave")]

        [SerializeField]
        public string ShockwaveKeyword;
    }
}
