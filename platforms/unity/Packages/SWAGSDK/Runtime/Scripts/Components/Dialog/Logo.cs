using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Shockwave
{
    [SerializeField]
    public enum LogoSize {
        FullWidth,
        Compact
    }

    public class Logo : MonoBehaviour
    {
        HashSet<Transform> children;

        void Start () 
        {
            var children = new HashSet<Transform>(this.GetComponentsInChildren<Transform>(true));
            children.Remove(this.transform);
            
            this.children = children;

            this.SetLogoSize(LogoSize.FullWidth);
        }

        public void SetLogoSize (LogoSize size)
        {
            if (this.children == null) {
                return;
            }

            var logoName = 
                SWAGConfig.Instance.Provider.ToString() +
                (
                    size == LogoSize.Compact
                        ? "_Compact"
                        : "_FullWidth"
                );

            foreach (var child in this.children) {
                child.gameObject.SetActive(child.name == logoName);
            }
        }
    }
}
