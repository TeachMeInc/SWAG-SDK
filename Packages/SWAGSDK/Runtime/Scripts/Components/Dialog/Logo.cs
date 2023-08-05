using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AddictingGames
{
    public class Logo : MonoBehaviour
    {
        void Start () 
        {
            var children = new HashSet<Transform>(this.GetComponentsInChildren<Transform>(true));
            children.Remove(this.transform);
            
            var logoName = SWAGConfig.Instance.Provider.ToString();

            foreach (var child in children) {
                child.gameObject.SetActive(child.name == logoName);
            }
        }
    }
}
