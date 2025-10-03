# Installation

This guide will help you install and configure the SWAG SDK for HTML5.

## Include the Following Files

To get started with the HTML5 SDK, insert these tags somewhere in your index.html. These tags should be added somewhere above your main game script tag, ideally in the `<head>` tag.

```html
<script type="text/javascript" src="https://swagapi.shockwave.com/v5/staging/dist/swag-api.js">
<link rel="stylesheet" type="text/css" href="https://swagapi.shockwave.com/v5/staging/dist/swag-api.css">
```

## Building Your Game

Once you've installed the SDK and verified that it works, you're ready to build your game. 

SWAG API calls are secured via [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and as such will only work properly when coming from `local.shockwave.com` domains on port `8888`. 

In order to test SWAG API integration in your built game locally, you will need to add these domains to your **HOSTS file** and run your game using an external web server. Each entry needs to be on its own line.

**Entries to add to your hosts file**

```
127.0.0.1 local.shockwave.com
```

::: info
You can find the HOSTS file at the following locations. You will need to be an administrator to edit the HOSTS file.

Windows: `C:\Windows\System32\Drivers\etc\hosts`

MacOS & Linux: `/etc/hosts`
:::

Now that you've added the HOSTS entries, try running your game. Run an HTTP server in the folder where you built your game. The root of your HTTP server should be the the folder that contains your game's `index.html` file.

If you have [NodeJS](https://nodejs.org/en) installed, you can do this in one command using the [http-server](https://www.npmjs.com/package/http-server) node package:

**Run a local web server**
```sh
npx http-server ./ -p 8888
```

## Next Steps

Now that you've installed the SDK you're ready to start using it. 

For a quick overview of the available features (with examples), check out our [Usage & Examples](/html5/version-5/usage-and-examples) guide.
