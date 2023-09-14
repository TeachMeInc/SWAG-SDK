import{_ as s,o as a,c as e,U as o}from"./chunks/framework.314b2323.js";const n="/assets/download-sdk.80f95c35.png",l="/assets/build-settings.482cedb4.png",t="/assets/player-settings.6fd859f9.png",p="/assets/package-manager.a56f254b.png",r="/assets/select-package-json.df883874.png",c="/assets/swag-prefab.15c8a755.png",f=JSON.parse('{"title":"Installation","description":"","frontmatter":{},"headers":[],"relativePath":"unity/installation.md","filePath":"unity/installation.md"}'),i={name:"unity/installation.md"},d=o('<h1 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h1><p>This guide will help you install and configure the SWAG SDK for Unity.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>If you&#39;re upgrading to the latest version of the SDK, please remove the existing WebGL Template and SWAG SDK package from your project first to avoid conflicts.</p></div><h2 id="download-the-sdk" tabindex="-1">Download the SDK <a class="header-anchor" href="#download-the-sdk" aria-label="Permalink to &quot;Download the SDK&quot;">​</a></h2><p><a href="https://github.com/TeachMeInc/SWAG-SDK/releases/latest" target="_blank" rel="noreferrer">Download Unity SDK</a></p><p>Download the latest version of the SDK and unzip the folder somewhere outside of your project. The archive should contain three folders: <code>WebGLTemplates</code>, <code>SWAGSDK</code>, and <code>Example Project</code>.</p><p><img src="'+n+'" alt="Download SDK Screenshot"></p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>If you&#39;re starting a new project from scratch using the <code>Example Project</code> you can skip to <a href="/unity/installation.html#configuring-swag">here</a>.</p></div><h2 id="install-the-webgl-template" tabindex="-1">Install the WebGL Template <a class="header-anchor" href="#install-the-webgl-template" aria-label="Permalink to &quot;Install the WebGL Template&quot;">​</a></h2><ol><li>Copy the <code>WebGLTemplates</code> folder into your project&#39;s <code>Assets</code> folder.</li><li>Open your projects <strong>Build Settings</strong> (File -&gt; Build Settings). With the <strong>WebGL</strong> platform selected, open the <strong>Player Settings</strong> dialog.</li><li>Under the <strong>Settings for WebGL</strong> panel, select the <strong>SWAGSDK</strong> template.</li></ol><p><img src="'+l+'" alt="Build Settings Screenshot"></p><p><img src="'+t+'" alt="Player Settings Screenshot"></p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>You can learn more about WebGL Templates, what they are, and how they work, <a href="https://docs.unity3d.com/Manual/webgl-templates.html" target="_blank" rel="noreferrer">here</a>.</p></div><h2 id="install-the-swag-package" tabindex="-1">Install the SWAG package <a class="header-anchor" href="#install-the-swag-package" aria-label="Permalink to &quot;Install the SWAG package&quot;">​</a></h2><ol><li>Open the <strong>Package Manager</strong> (Window -&gt; Package Manager) and from the <strong>+</strong> icon dropdown, choose to <strong>Add package from disk</strong>.</li><li>Navigate to the <code>SWAGSDK</code> folder inside the folder you unzipped.</li><li>Select and open <code>package.json</code> from inside the <code>SWAGSDK</code> folder.</li></ol><p><img src="'+p+'" alt="Package Manager Screenshot"></p><p><img src="'+r+'" alt="Select Package JSON Screenshot"></p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>You can learn more about installing local packages <a href="https://docs.unity3d.com/Manual/upm-ui-local.html" target="_blank" rel="noreferrer">here</a>.</p></div><h2 id="add-the-swag-prefab-to-your-scene" tabindex="-1">Add the SWAG prefab to your scene <a class="header-anchor" href="#add-the-swag-prefab-to-your-scene" aria-label="Permalink to &quot;Add the SWAG prefab to your scene&quot;">​</a></h2><ol><li>In your <code>Packages</code> folder, navigate to <code>SWAG SDK/Runtime/Prefabs</code>.</li><li>Drop the <code>SWAG</code> prefab into your scene.</li></ol><p><img src="'+c+`" alt="SWAG Prefab Screenshot"></p><h2 id="configuring-swag" tabindex="-1">Configuring SWAG <a class="header-anchor" href="#configuring-swag" aria-label="Permalink to &quot;Configuring SWAG&quot;">​</a></h2><p>Once the <code>SWAG</code> prefab is added to your scene, click on the game object to configure the <code>SWAG</code> component in the editor panel.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>You can view a full list of the configuration options available <a href="/unity/script-reference/AddictingGames/SWAGConfig.html">here</a></p></div><h3 id="for-addictinggames-com" tabindex="-1">For AddictingGames.com <a class="header-anchor" href="#for-addictinggames-com" aria-label="Permalink to &quot;For AddictingGames.com&quot;">​</a></h3><p>If your game is for <a href="https://www.addictinggames.com" target="_blank" rel="noreferrer">AddictingGames.com</a>:</p><ol><li>Choose the <code>Addicting Games</code> provider under the <strong>SDK</strong> header.</li><li>Enter your game&#39;s API Key under the <strong>Addicting Games</strong> header.</li></ol><h3 id="for-shockwave-com" tabindex="-1">For Shockwave.com<sup>*</sup> <a class="header-anchor" href="#for-shockwave-com" aria-label="Permalink to &quot;For Shockwave.com&lt;sup&gt;*&lt;/sup&gt;&quot;">​</a></h3><p>If your game is for <a href="https://www.shockwave.com" target="_blank" rel="noreferrer">Shockwave.com</a>:</p><ol><li>Choose the <code>Shockwave</code> provider under the <strong>SDK</strong> header.</li><li>Enter your game&#39;s Shockwave Keyword under the <strong>Shockwave</strong> header.</li></ol><p><sup>*</sup> <small><strong>Please note that at this time, the Shockwave provider is unsupported, but will be available in a future update.</strong></small></p><h2 id="basic-usage" tabindex="-1">Basic Usage <a class="header-anchor" href="#basic-usage" aria-label="Permalink to &quot;Basic Usage&quot;">​</a></h2><p>The SDK automatically handles initialization and authentication when the scene is loaded. In order to use many of the features of the SDK, you will need to first ensure that the SDK has finished loading and is in a ready state.</p><p>There are two ways you can accomplish this:</p><ol><li>By checking the <code>isReady</code> public field of the <code>SWAG</code> instance:</li></ol><div class="language-C#"><button title="Copy Code" class="copy"></button><span class="lang">C#</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">using</span><span style="color:#A6ACCD;"> UnityEngine</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F78C6C;">using</span><span style="color:#A6ACCD;"> UnityEngine.EventSystems</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F78C6C;">using</span><span style="color:#A6ACCD;"> AddictingGames</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">OpenDialogButton</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MonoBehaviour</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">IPointerClickHandler</span></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">OnPointerClick</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">PointerEventData</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">eventData</span><span style="color:#89DDFF;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">var</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">swag</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> SWAG</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Instance</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(!</span><span style="color:#A6ACCD;">swag</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">isReady</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        swag</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Scores</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">ShowDialog</span><span style="color:#89DDFF;">(</span></span>
<span class="line"><span style="color:#A6ACCD;">          </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> Debug</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Log</span><span style="color:#89DDFF;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">Dialog has closed</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">);</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><ol start="2"><li>By using the <code>OnReady</code> callback:</li></ol><div class="language-C#"><button title="Copy Code" class="copy"></button><span class="lang">C#</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F78C6C;">using</span><span style="color:#A6ACCD;"> UnityEngine</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F78C6C;">using</span><span style="color:#A6ACCD;"> AddictingGames</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">public</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MyGameController</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MonoBehaviour</span></span>
<span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Start</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F78C6C;">var</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">swag</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> SWAG</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">Instance</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">        swag</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">OnReady</span><span style="color:#89DDFF;">(()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">            </span><span style="color:#676E95;font-style:italic;">// Initialize the rest of your game</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">});</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="building-your-game" tabindex="-1">Building Your Game <a class="header-anchor" href="#building-your-game" aria-label="Permalink to &quot;Building Your Game&quot;">​</a></h2><p>Once you&#39;ve installed the SDK and verified that it works in Play Mode, you&#39;re ready to build your game.</p><p>SWAG API calls are secured via <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank" rel="noreferrer">CORS</a> and as such will only work properly when coming from <code>local.addictinggames.com</code> or <code>local.shockwave.com</code> domains on port <code>8888</code>.</p><p>In order to test SWAG API integration in your built game locally, you will need to add these domains to your <strong>HOSTS file</strong> and run your game using an external web server. Each entry needs to be on its own line.</p><p><strong>Entries to add to your hosts file</strong></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">127.0.0.1 local.addictinggames.com</span></span>
<span class="line"><span style="color:#A6ACCD;">127.0.0.1 local.shockwave.com</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>You can find the HOSTS file at the following locations. You will need to be an administrator to edit the HOSTS file.</p><p>Windows: <code>C:\\Windows\\System32\\Drivers\\etc\\hosts</code></p><p>MacOS &amp; Linux: <code>/etc/hosts</code></p></div><p>Now that you&#39;ve added the HOSTS entries, you can build your game. From the <strong>Build Settings</strong> menu, making sure you have the <strong>WebGL</strong> platform selected, click the <strong>Build</strong> button and choose a folder.</p><p>Next, run an HTTP server in the folder where you built your game. The root of your HTTP server should be the the folder that contains your game&#39;s <code>index.html</code> file.</p><p>If you have <a href="https://nodejs.org/en" target="_blank" rel="noreferrer">NodeJS</a> installed, you can do this in one command using the <a href="https://www.npmjs.com/package/http-server" target="_blank" rel="noreferrer">http-server</a> node package:</p><p><strong>Run a local web server</strong></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">npx http-server ./ -p 8888</span></span></code></pre></div><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><p>Now that you&#39;ve installed the SDK you&#39;re ready to start using it.</p><ul><li>For a quick overview of the available features (with examples), check out our <a href="/unity/usage-and-examples.html">Usage and Examples</a> guide.</li><li>For a more comprehensive look at the features available, take a look at the <a href="/unity/script-reference/AddictingGames/SWAG.html">Script Reference guide for the SWAG C#</a> class.</li></ul>`,53),h=[d];function y(g,u,D,A,C,m){return a(),e("div",null,h)}const b=s(i,[["render",y]]);export{f as __pageData,b as default};