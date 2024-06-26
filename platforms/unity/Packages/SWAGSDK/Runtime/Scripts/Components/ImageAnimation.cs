using UnityEngine;
using System.Collections;
using UnityEngine.UI;

namespace Shockwave
{
    public class ImageAnimation : MonoBehaviour 
    {
        public Sprite[] sprites;
        public int framesPerSprite = 6;
        public bool loop = true;
        public bool destroyOnEnd = false;

        int index = 0;
        Image image;
        int frame = 0;

        void Awake () 
        {
            image = GetComponent<Image> ();
        }

        void Update () 
        {
            if (!loop && index == sprites.Length) return;
            frame ++;
            if (frame < framesPerSprite) return;
            image.sprite = sprites [index];
            frame = 0;
            index ++;
            if (index >= sprites.Length) {
                if (loop) index = 0;
                if (destroyOnEnd) Destroy (gameObject);
            }
        }
    }
}