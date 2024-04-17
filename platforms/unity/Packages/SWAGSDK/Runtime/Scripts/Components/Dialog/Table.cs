using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace Shockwave
{
    public class Table : MonoBehaviour
    {
        public Transform itemPrefab;
        
        public Table SetContent (List<Transform> transforms)
        {
            var content = this.GetComponentInChildren<TableContentHint>(true).transform;

            foreach (Transform child in content) {
                Destroy(child.gameObject);
            }

            foreach (Transform transform in transforms) {
                transform.SetParent(content, false);
                transform.gameObject.SetActive(true);
            }

            return this;
        }
    }
}
