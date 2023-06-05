using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class User
    {
        public string id;
        public string memberName;

        public User () 
        {}

        public bool IsSubscriber () 
        {
            throw new System.NotImplementedException();
        }

        public bool IsGuest () 
        {
            throw new System.NotImplementedException();
        }

        public void LoginFromWeb () 
        {
            throw new System.NotImplementedException();
        }

        public void LoginAsGuest () 
        {
            throw new System.NotImplementedException();
        }

        public void SetData (string key, string value) 
        {
            throw new System.NotImplementedException();
        }

        public void GetData (string key) 
        {
            throw new System.NotImplementedException();
        }
    }
}
