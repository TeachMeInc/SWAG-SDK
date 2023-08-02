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
        ForceMobile,
        ForceDesktop,
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
        public Provider Provider = Provider.AddictingGames;

        [SerializeField]
        public string DefaultValueFormatter = "";

        [SerializeField]
        public List<string> AllowedDomains = new List<string>();

        [SerializeField]
        public bool RestrictToAllowedDomains  = false;

        [SerializeField]
        public ViewMode ViewMode = ViewMode.Responsive;



        [Header ("Addicting Games")]

        [SerializeField]
        public string GameName;
        
        [SerializeField]
        public string APIKey = "5c6c3c056917a692f96f9651"; 



        [Header ("Shockwave")]

        [SerializeField]
        public string ShockwaveKeyword;
    }
}
