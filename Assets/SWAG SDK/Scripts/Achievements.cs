using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class AchievementsCurrentUser
    {
        public AchievementsCurrentUser () 
        {}

        public void GetAchievements () 
        {
            throw new System.NotImplementedException();
        }
    }

    public class Achievements
    {
        public AchievementsCurrentUser CurrentUser = new AchievementsCurrentUser();

        public Achievements () 
        {}

        public void ShowDialog () 
        {
            throw new System.NotImplementedException();
        }

        public void RecordAchievement (string key) 
        {
            throw new System.NotImplementedException();
        }

        public void GetCategories () 
        {
            throw new System.NotImplementedException();
        }
    }
}
