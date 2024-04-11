import{_ as e,o as s,c as a,U as o}from"./chunks/framework.314b2323.js";const g=JSON.parse('{"title":"Installation","description":"","frontmatter":{},"headers":[],"relativePath":"html5/installation.md","filePath":"html5/installation.md"}'),t={name:"html5/installation.md"},l=o(`<h1 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h1><p>This guide will help you install and configure the SWAG SDK for HTML5.</p><h2 id="include-the-following-files" tabindex="-1">Include the Following Files <a class="header-anchor" href="#include-the-following-files" aria-label="Permalink to &quot;Include the Following Files&quot;">​</a></h2><p>To get started with the HTML5 SDK, insert these tags somewhere in your index.html. These tags should be added somewhere above your main game script tag, ideally in the <code>&lt;head&gt;</code> tag.</p><div class="language-html"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">script</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">text/javascript</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">src</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https://swagapi.shockwave.com/dist/swag-api.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">link</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">rel</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">stylesheet</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">text/css</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">href</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https://swagapi.shockwave.com/dist/swag-api.css</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;</span></span></code></pre></div><h2 id="building-your-game" tabindex="-1">Building Your Game <a class="header-anchor" href="#building-your-game" aria-label="Permalink to &quot;Building Your Game&quot;">​</a></h2><p>Once you&#39;ve installed the SDK and verified that it works, you&#39;re ready to build your game.</p><p>SWAG API calls are secured via <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank" rel="noreferrer">CORS</a> and as such will only work properly when coming from <code>local.addictinggames.com</code> or <code>local.shockwave.com</code> domains on port <code>8888</code>.</p><p>In order to test SWAG API integration in your built game locally, you will need to add these domains to your <strong>HOSTS file</strong> and run your game using an external web server. Each entry needs to be on its own line.</p><p><strong>Entries to add to your hosts file</strong></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">127.0.0.1 local.addictinggames.com</span></span>
<span class="line"><span style="color:#A6ACCD;">127.0.0.1 local.shockwave.com</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>You can find the HOSTS file at the following locations. You will need to be an administrator to edit the HOSTS file.</p><p>Windows: <code>C:\\Windows\\System32\\Drivers\\etc\\hosts</code></p><p>MacOS &amp; Linux: <code>/etc/hosts</code></p></div><p>Now that you&#39;ve added the HOSTS entries, try running your game. Run an HTTP server in the folder where you built your game. The root of your HTTP server should be the the folder that contains your game&#39;s <code>index.html</code> file.</p><p>If you have <a href="https://nodejs.org/en" target="_blank" rel="noreferrer">NodeJS</a> installed, you can do this in one command using the <a href="https://www.npmjs.com/package/http-server" target="_blank" rel="noreferrer">http-server</a> node package:</p><p><strong>Run a local web server</strong></p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">http-server</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">./</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">8888</span></span></code></pre></div><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><p>Now that you&#39;ve installed the SDK you&#39;re ready to start using it.</p><p>For a quick overview of the available features (with examples), check out our <a href="/html5/usage-and-examples.html">Usage &amp; Examples</a> guide.</p>`,19),n=[l];function r(p,i,c,d,h,u){return s(),a("div",null,n)}const D=e(t,[["render",r]]);export{g as __pageData,D as default};