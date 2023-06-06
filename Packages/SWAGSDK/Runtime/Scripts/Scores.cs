using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class ScoresCurrentUser
    {
        public ScoresCurrentUser () 
        {}

        public void HasDailyGameScore (int day, string gameMode) 
        {
            if (SWAG.Instance.userToken == "")
            {
                throw new System.Exception("User is not logged in.");
            }

            if (SWAGConfig.Instance.Provider != Provider.Shockwave)
            {
                throw new System.Exception("User.RecordDailyGameScore() is not implemented for this provider.");
            }

            throw new System.NotImplementedException();
        }

        public void RecordDailyGameScore (int day, string gameMode, float score) 
        {
            if (SWAG.Instance.userToken == "")
            {
                throw new System.Exception("User is not logged in.");
            }

            if (SWAGConfig.Instance.Provider != Provider.Shockwave)
            {
                throw new System.Exception("User.RecordDailyGameScore() is not implemented for this provider.");
            }

            throw new System.NotImplementedException();
        }

        public void RecordScore (string gameMode, float score) 
        {
            if (SWAG.Instance.userToken == "")
            {
                throw new System.Exception("User is not logged in.");
            }
            
            throw new System.NotImplementedException();
        }

        public void GetBestScores (string gameMode, string period) 
        {
            if (SWAG.Instance.userToken == "")
            {
                throw new System.Exception("User is not logged in.");
            }

            throw new System.NotImplementedException();
        }

        public void GetScores (string gameMode, string period) 
        {
            if (SWAG.Instance.userToken == "")
            {
                throw new System.Exception("User is not logged in.");
            }

            throw new System.NotImplementedException();
        }
    }

    public class Scores
    {
        public ScoresCurrentUser currentUser = new ScoresCurrentUser();

        public Scores () 
        {}

        public void ShowDialog () 
        {
            throw new System.NotImplementedException();
        }

        public void GetCurrentDay () 
        {
            throw new System.NotImplementedException();
        }

        public void GetGameModes () 
        {
            throw new System.NotImplementedException();
        }

        public void GetScores (string gameMode, string period) 
        {
            throw new System.NotImplementedException();
        }
    }
}
