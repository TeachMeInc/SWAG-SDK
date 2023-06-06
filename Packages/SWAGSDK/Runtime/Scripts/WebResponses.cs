using System.Collections;
using System.Collections.Generic;

namespace AddictingGames {
    /* #region Responses */

    [System.Serializable]
    public struct ErrorWebResponse
    {
        public int error;
        public List<string> message;
    }

    [System.Serializable]
    public struct UserWebResponseUser
    {
        public string _id;
        public string memberName;
    }

    [System.Serializable]
    public struct UserWebResponse 
    {
        public UserWebResponseUser user;
        public string token;
    }

    [System.Serializable]
    public struct GameWebResponse
    {
        public string game;
        public string name;
    }

    [System.Serializable]
    public struct AchievementWebResponse
    {
        public string _id;
        public string name;
        public string achievement_key;
        public string description;
        public bool? user_achieved;
    }

    /* #endregion */



    /* #region Requests */

    [System.Serializable]
    public struct RecordAchievementWebRequest
    {
        public string game;
        public string achievement_key;
    }

    /* #endregion */
}
