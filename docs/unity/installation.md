1. download latest unity sdk release and unzip the archive
2. copy the webgl template into your project
   1. configure your project to use the webgl template
3. drag the SWAG prefab into your scene
4. configure the SWAG prefab
5. add an onready callback to your game
6. press play in the editor to make sure there are no errors

# Installation

## Download the SDK

1. Download the latest SDK
2. Unzip the archive

https://github.com/TeachMeInc/SWAG-SDK/releases

## Install the WebGL Template

1. Copy the WebGLTemplates folder in to your Assets
2. Adjust your Player Settings to use the SWAG template

https://docs.unity3d.com/Manual/webgl-templates.html

## Install the SWAG package

1. Open the Package Manager
2. Add package from disk
3. Add Packages/SWAGSDK from the extracted zip

https://docs.unity3d.com/Manual/upm-ui-local.html

## Add the SWAG prefab to your scene

1. Find SWAGSDK/Runetime/Prefabs in your Packages folder
2. Drag out the SWAG prefab into your scene
3. Configure the SWAG prefab

## Add an OnReady callback to your game

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using AddictingGames;

public class MyGameController : MonoBehaviour
{
    void Start ()
    {
        var swag = SWAG.Instance;

        swag.OnReady(() => {
            Debug.Log("Ready!");
        });
    }
}
```

## Press play!
