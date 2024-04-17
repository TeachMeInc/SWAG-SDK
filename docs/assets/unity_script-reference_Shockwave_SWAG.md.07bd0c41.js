import{_ as t,o as e,c as a,U as r}from"./chunks/framework.314b2323.js";const S=JSON.parse('{"title":"SWAG (Class)","description":"","frontmatter":{},"headers":[],"relativePath":"unity/script-reference/Shockwave/SWAG.md","filePath":"unity/script-reference/Shockwave/SWAG.md"}'),o={name:"unity/script-reference/Shockwave/SWAG.md"},d=r('<h1 id="swag-class" tabindex="-1">SWAG (Class) <a class="header-anchor" href="#swag-class" aria-label="Permalink to &quot;SWAG (Class)&quot;">​</a></h1><p>The <code>SWAG</code> class manages the complete functionality for the SWAG API and is the main entry-point into the SDK. This class inherits from MonoBehavior and should be placed on a GameObject in your scene.</p><h2 id="fields" tabindex="-1">Fields <a class="header-anchor" href="#fields" aria-label="Permalink to &quot;Fields&quot;">​</a></h2><table><thead><tr><th>Field</th><th>Description</th></tr></thead><tbody><tr><td><code>Achievements Achievements</code></td><td>Instance of the Achievements class.</td></tr><tr><td><code>Scores Scores</code></td><td>Instance of the Scores class.</td></tr><tr><td><code>User User</code></td><td>Instance of the User class.</td></tr><tr><td><code>static SWAG Instance</code></td><td>A singleton instance of the SWAG class.</td></tr></tbody></table><h2 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods" aria-label="Permalink to &quot;Methods&quot;">​</a></h2><h3 id="onready-overloaded" tabindex="-1">OnReady (Overloaded) <a class="header-anchor" href="#onready-overloaded" aria-label="Permalink to &quot;OnReady (Overloaded)&quot;">​</a></h3><p>Executes the <code>onSuccess</code> action when SWAG is ready. If not ready, it prepares an async handler to execute once ready.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>System.Action&lt;string&gt; onSuccess</code></td><td>Executes the <code>onSuccess</code> action if SWAG is ready.</td></tr></tbody></table><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>System.Action&lt;string&gt; onSuccess</code></td><td>Executes the <code>onSuccess</code> action if SWAG is ready.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback for initialization errors.</td></tr></tbody></table><h3 id="getrequest" tabindex="-1">GetRequest <a class="header-anchor" href="#getrequest" aria-label="Permalink to &quot;GetRequest&quot;">​</a></h3><p>Sends a GET request and handles the response.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>string url</code></td><td>The endpoint URL.</td></tr><tr><td><code>bool useToken</code></td><td>If true, the request will include the user token.</td></tr><tr><td><code>System.Action&lt;string&gt; onSuccess</code></td><td>Callback upon a successful request.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback for request errors.</td></tr></tbody></table><h3 id="postrequest" tabindex="-1">PostRequest <a class="header-anchor" href="#postrequest" aria-label="Permalink to &quot;PostRequest&quot;">​</a></h3><p>Sends a POST request and handles the response.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>string url</code></td><td>The endpoint URL.</td></tr><tr><td><code>string postData</code></td><td>Data to post in the request.</td></tr><tr><td><code>bool useToken</code></td><td>If true, the request will include the user token.</td></tr><tr><td><code>System.Action&lt;string&gt; onSuccess</code></td><td>Callback upon a successful request.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback for request errors.</td></tr></tbody></table><h3 id="openurl" tabindex="-1">OpenURL <a class="header-anchor" href="#openurl" aria-label="Permalink to &quot;OpenURL&quot;">​</a></h3><p>Opens the provided URL in a new tab. WebGL only.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>string url</code></td><td>The URL to open.</td></tr></tbody></table><h3 id="togglefullscreen" tabindex="-1">ToggleFullscreen <a class="header-anchor" href="#togglefullscreen" aria-label="Permalink to &quot;ToggleFullscreen&quot;">​</a></h3><p>Toggles the fullscreen state of the application. WebGL only.</p><h3 id="showsharedialog" tabindex="-1">ShowShareDialog <a class="header-anchor" href="#showsharedialog" aria-label="Permalink to &quot;ShowShareDialog&quot;">​</a></h3><p>Opens the share dialog. WebGL only.</p><h3 id="beginad" tabindex="-1">BeginAd <a class="header-anchor" href="#beginad" aria-label="Permalink to &quot;BeginAd&quot;">​</a></h3><p>Displays an advertisement. WebGL only.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>System.Action onSuccess</code></td><td>Callback upon successful ad display.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback if an error occurs during ad display.</td></tr></tbody></table>',25),s=[d];function n(c,l,i,h,u,b){return e(),a("div",null,s)}const g=t(o,[["render",n]]);export{S as __pageData,g as default};
