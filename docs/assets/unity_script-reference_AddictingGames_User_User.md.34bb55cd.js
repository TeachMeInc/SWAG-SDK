import{_ as t,o as e,c as a,X as r}from"./chunks/framework.6909765d.js";const m=JSON.parse('{"title":"User (Class)","description":"","frontmatter":{},"headers":[],"relativePath":"unity/script-reference/AddictingGames/User/User.md","filePath":"unity/script-reference/AddictingGames/User/User.md"}'),d={name:"unity/script-reference/AddictingGames/User/User.md"},o=r('<h1 id="user-class" tabindex="-1">User (Class) <a class="header-anchor" href="#user-class" aria-label="Permalink to &quot;User (Class)&quot;">​</a></h1><p>Manages authentication and data for the currently logged-in user.</p><h2 id="fields" tabindex="-1">Fields <a class="header-anchor" href="#fields" aria-label="Permalink to &quot;Fields&quot;">​</a></h2><table><thead><tr><th>Field</th><th>Description</th></tr></thead><tbody><tr><td><code>string id</code></td><td>Unique identifier for the user.</td></tr><tr><td><code>string memberName</code></td><td>Name of the member.</td></tr><tr><td><code>bool? isSubscriber</code></td><td>Nullable boolean indicating if the user is a subscriber. <code>null</code> if unknown.</td></tr><tr><td><code>[HideInInspector] string token</code></td><td>Token associated with the user, hidden in the Unity Inspector.</td></tr></tbody></table><h2 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods" aria-label="Permalink to &quot;Methods&quot;">​</a></h2><h3 id="login" tabindex="-1">Login <a class="header-anchor" href="#login" aria-label="Permalink to &quot;Login&quot;">​</a></h3><p>Logs the user in either using a token (for WebGL builds) or as a guest.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>System.Action onSuccess</code></td><td>Callback executed upon successful login.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback executed on error.</td></tr></tbody></table><h3 id="showlogindialog" tabindex="-1">ShowLoginDialog <a class="header-anchor" href="#showlogindialog" aria-label="Permalink to &quot;ShowLoginDialog&quot;">​</a></h3><p>Displays the login dialog to the user.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>System.Action onSuccess</code></td><td>Callback executed upon successful display of the login dialog.</td></tr><tr><td><code>System.Action&lt;string&gt; onCancelled</code></td><td>Callback executed if the display of the login dialog is cancelled.</td></tr></tbody></table><h3 id="issubscriber" tabindex="-1">IsSubscriber <a class="header-anchor" href="#issubscriber" aria-label="Permalink to &quot;IsSubscriber&quot;">​</a></h3><p>Determines if the user is a subscriber.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>System.Action&lt;bool&gt; onSuccess</code></td><td>Callback executed upon determining the subscription status.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback executed on error.</td></tr></tbody></table><h3 id="isguest" tabindex="-1">IsGuest <a class="header-anchor" href="#isguest" aria-label="Permalink to &quot;IsGuest&quot;">​</a></h3><p>Checks if the user is logged in as a guest.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><strong>Return Type</strong></td><td><code>bool</code></td></tr></tbody></table><h3 id="setdata" tabindex="-1">SetData <a class="header-anchor" href="#setdata" aria-label="Permalink to &quot;SetData&quot;">​</a></h3><p>Sets data for the logged-in user.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>string key</code></td><td>The key to set data for.</td></tr><tr><td><code>string value</code></td><td>The value associated with the key.</td></tr><tr><td><code>System.Action onSuccess</code></td><td>Callback executed upon successful data set.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback executed on error.</td></tr></tbody></table><h3 id="getdata" tabindex="-1">GetData <a class="header-anchor" href="#getdata" aria-label="Permalink to &quot;GetData&quot;">​</a></h3><p>Retrieves data for the logged-in user.</p><table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>System.Action&lt;List&lt;UserData&gt;&gt; onSuccess</code></td><td>Callback executed upon successful data retrieval.</td></tr><tr><td><code>System.Action&lt;string&gt; onError</code></td><td>Callback executed on error.</td></tr></tbody></table>',23),s=[o];function i(c,n,l,h,u,b){return e(),a("div",null,s)}const p=t(d,[["render",i]]);export{m as __pageData,p as default};
