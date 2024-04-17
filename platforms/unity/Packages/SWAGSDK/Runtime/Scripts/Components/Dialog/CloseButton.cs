using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using Shockwave;

namespace Shockwave
{
    public class CloseButton : MonoBehaviour, IPointerClickHandler
    {
        public void OnPointerClick (PointerEventData eventData)
        {
            var dialog = this.GetComponentInParent<DialogController>(true);
            dialog?.Hide();
        }
    }
}
