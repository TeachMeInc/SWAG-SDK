using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class ScoresCurrentUser
    {
        public ScoresCurrentUser () 
        {}

        public void HasDailyScore () 
        {
            throw new System.NotImplementedException();
        }

        public void GetTopScores () 
        {
            throw new System.NotImplementedException();
        }

        public void GetWeeklyScores () 
        {
            throw new System.NotImplementedException();
        }
    }

    public class Scores
    {
        public ScoresCurrentUser currentUser = new ScoresCurrentUser();

        public Scores () 
        {}

        public void GetCurrentDay () 
        {
            throw new System.NotImplementedException();
        }

        public void ShowDialog () 
        {
            throw new System.NotImplementedException();
        }

        public void RecordScore (string level, int score) 
        {
            throw new System.NotImplementedException();
        }

        public void RecordDailyScore (int day, string level, int score) 
        {
            throw new System.NotImplementedException();
        }

        public void GetDailyScores (string level) 
        {
            throw new System.NotImplementedException();
        }

        public void GetWeeklyScores (string level) 
        {
            throw new System.NotImplementedException();
        }

        public void GetMonthlyScores (string level) 
        {
            throw new System.NotImplementedException();
        }

        public void GetAllTimeScores (string level) 
        {
            throw new System.NotImplementedException();
        }

        public void GetCategories () 
        {
            throw new System.NotImplementedException();
        }
    }
}
