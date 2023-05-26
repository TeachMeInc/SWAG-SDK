namespace AddictingGames {
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
}
