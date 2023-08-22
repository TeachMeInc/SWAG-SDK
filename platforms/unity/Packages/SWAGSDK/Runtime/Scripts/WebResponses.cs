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
        public bool user_achieved;
    }

    [System.Serializable]
    public struct UserDataWebResponse
    {
        public string _id;
        public string key;
        public string value;
        public string entity;
        public string source;
        public string date_created;
    }

    [System.Serializable]
    public struct UserIsSubscriberWebResponse
    {
        public bool subscriber;
    }

    [System.Serializable]
    public struct ScoresWebResponse
    {
        public string level_key;
        public string value;
        public string date_created;
        public string screen_name;
        public string avatarUrl;
        public int position;
    }

    [System.Serializable]
    public struct LevelKeysWebResponse
    {
        public string game;
        public string name;
        public string level_key;
        public string value_name;
        public string value_type;
        public int order;
        public bool reverse;
        public string mode;
    }

    [System.Serializable]
    public struct DailyBestWebResponse
    {
        public DailyBestWebResponseValue dailyBest;
        public DailyBestWebResponseValue scorePosition;
        public DailyBestWebResponseValue? totalScores;
    }

    [System.Serializable]
    public struct DailyBestWebResponseValue
    {
        public string value;
    }

    /* #endregion */



    /* #region Requests */

    [System.Serializable]
    public struct RecordAchievementWebRequest
    {
        public string game;
        public string achievement_key;
    }


    [System.Serializable]
    public struct SetUserDataWebRequest
    {
        public string game;
        public string key;
        public string value;
    }

    [System.Serializable]
    public struct RecordScoreWebRequest
    {
        public string game;
        public string level_key;
        public float value;
    }
    
    /* #endregion */
}
