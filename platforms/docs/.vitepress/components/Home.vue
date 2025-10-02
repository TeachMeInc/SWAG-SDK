<script setup lang="ts">
import { useData } from 'vitepress/dist/client/app/data'
const { frontmatter: fm } = useData()
</script>

<template>
  <div class="Home">
    <section class="Section --brand --pullBottom">
      <div>
        <div>
          <h1>
            {{ fm.hero.title }}
          </h1>
          <p>
            {{ fm.hero.text }}
          </p>
          <footer>
            <a 
              class="Button --medium"
              :href="fm.hero.action.href"
            >
                {{ fm.hero.action.text }}
            </a>
          </footer>
        </div>
        <aside>
          <figure>
            <img src="/home/mainImage.png" alt="hero image" />
          </figure>
        </aside>
      </div>
    </section>

    <section class="Section --contentRight">
      <div>
        <div>
          <h2>
            {{  fm.whySubmit.title }}
          </h2>
          <ul class="--hasIcons">
            <li v-for="item in fm.whySubmit.list">
              <img 
                :src="`/home/icons/${item.icon}.svg`"
                :alt="`${item.icon} icon`"
                aria-hidden
              />
              <h4>
                {{ item.title }}
              </h4>
              <small>
                {{ item.text }}
              </small>
            </li>
          </ul>
        </div>
        <aside>
          <div class="Grid --2x">
            <a 
              v-for="gameThumb in fm.whySubmit.gameThumbs"
              class="GamePod"
              :href="gameThumb.href"
              target="_blank"
            >
              <figure>
                <img 
                  :src="`/home/gameThumbs/${gameThumb.imageSrc}.png`" 
                  :alt="gameThumb.title"
                />
              </figure>
            </a>
          </div>
        </aside>
      </div>
    </section>

    <section class="Section --brand">
      <div>
        <div>
          <h2>
            {{ fm.mobile.title }}
          </h2>
          <ul>
            <li v-for="item in fm.mobile.list">
              <h4>
                {{ item.title }}
              </h4>
              <small>
                {{ item.text }}
              </small>
            </li>
          </ul>
        </div>
        <aside>
          <figure>
            <img src="/home/mobileHighlight.png" alt="mobile highlight" />
          </figure>
        </aside>
      </div>
    </section>

    <section class="Section">
      <div>
        <div>
          <h2>
            {{  fm.readyToSubmit.title }}
          </h2>
          <p>
            {{ fm.readyToSubmit.text }}
          </p>
          <footer>
            <a 
              class="Button --medium --brand" 
              :href="fm.readyToSubmit.action.href"
              target="_blank"
            >
              {{ fm.readyToSubmit.action.text }}
            </a>
          </footer>
        </div>
        <aside>
          <div class="Grid --3x">
            
            <a 
              href="/html5/version-5/installation" 
              class="LogoPod"
            >
              <figure>
                <img 
                  src="/home/html5Logo.svg" alt="HTML5"
                />
              </figure>
            </a>
            <a 
              href="https://github.com/TeachMeInc/swag-api-construct-3" 
              class="LogoPod"
              target="_blank"
            >
              <figure>
                <img 
                  src="/home/constructLogo.svg" alt="Construct 3"
                />
              </figure>
            </a>
            <a href="/unity/installation" class="LogoPod">
              <figure>
                <img 
                  src="/home/unityLogo.svg" alt="Unity"
                  class="--light"
                />
                <img 
                  src="/home/unityLogoDark.svg" alt="Unity (dark logo)"
                  class="--dark"
                />
              </figure>
            </a>
            <div class="LogoPod">
              <div>
                Using another engine you don't see here? Let us know!
                <br />
                <a 
                  class="Button --brand"
                  :href="fm.supportHref"
                  target="_blank"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>  
        </aside>
      </div>
    </section>

    <section class="Section --singleColumn --centerText --brand">
      <div>
        <div>
          <h2>
            {{ fm.faq.title }}
          </h2>
          <dl>
            <template v-for="item in fm.faq.questions">
              <dt>
                {{ item.question }}
              </dt>
              <dd>
                {{ item.answer }}
              </dd>
            </template>
          </dl>
        </div>
      </div>
    </section>

    <section class="Section --singleColumn --centerText">
      <div>
        <div>
          <h1>
            {{ fm.questions.title }}
          </h1>
          <p>
            {{ fm.questions.text }}
          </p>
          <footer>
            <a 
              class="Button --medium --brand" 
              :href="fm.supportHref"
              target="_blank"
            >
              {{ fm.questions.action.text }}
            </a>
          </footer>
        </div>
      </div>
    </section>

    <Content />
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .--hideMobile {
    display: none !important;
  }
}

/* Button */

.Button {
  display: inline-block;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition: color .25s, background-color .25s;
  color: var(--vp-button-brand-text);
  background-color: var(--vp-c-brand-black);
  border-radius: 6px;
  padding: 0 14px;
  line-height: 34px;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
}

.Button:hover {
  background-color: var(--vp-c-brand-black-lighter);
}

.Button.--brand {
  border-color: var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
}

.Button.--brand:hover {
  background-color: var(--vp-c-brand-light);
}

.Button.--medium {
  border-radius: 8px;
  padding: 0 24px;
  line-height: 42px;
  font-size: 16px;
}

/* Grid */

.Grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.Grid.--2x > * {
  flex: 1;
}

/* GamePod */

.GamePod {
  display: flex;
  background-color: var(--vp-c-brand-dimm);
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--vp-c-brand-dimm) inset;
  max-width: calc(165px + 16px);
}

a.GamePod:hover {
  box-shadow: 0 0 0 1px var(--vp-c-brand-light) inset;
}

.GamePod > * {
  margin: 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.GamePod > figure img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.GamePod > div > * {
  display: block;
  margin: 4px 0;
}

.GamePod > div img {
  height: 1em;
  width: auto;
}

.GamePod > div small {
  line-height: 1;
  font-weight: bold;
}

/* LogoPod */

.LogoPod {
  display: flex;
  background-color: var(--vp-c-brand-dimm);
  align-items: center;
  justify-content: center;
  padding: 8px;
  height: 180px;
  min-width: 220px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--vp-c-brand-dimm) inset;
}

a.LogoPod:hover {
  box-shadow: 0 0 0 1px var(--vp-c-brand-light) inset;
}

.LogoPod > * {
  margin: 8px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
}

.LogoPod > div .Button {
  margin-top: 8px;
}

.LogoPod > figure img {
  height: 60px;
  width: auto;
  border-radius: 4px;
}

.dark .LogoPod > figure img.--light {
  display: none;
}

.LogoPod > figure img.--dark {
  display: none;
}

.dark .LogoPod > figure img.--dark {
  display: inline-block;
}


/* Section */

.Section {
  padding: 32px 0;
}

.Section > div {
  margin: 0 auto;
  max-width: 1600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.Section > div > div,
.Section > div > aside {
  flex: 1;
  margin: 0 24px;
}

.Section > div > div {
  margin-bottom: 32px;
}

.Section > div > div > * {
  margin: 16px 0;
}

.Section > div > div > ul li {
  margin: 16px 0;
}

.Section > div > div > ul.--hasIcons li {
  padding-left: 48px;
  position: relative;
}

.Section > div > div > ul.--hasIcons li img {
  position: absolute;
  top: 4px;
  left: 0;
  width: 32px;
  height: auto;
  opacity: 0.85;
  filter: invert(1);
}

.dark .Section > div > div > ul.--hasIcons li img {
  filter: invert(0);
}

.Section > div > div > dl {
  text-align: left;
}

.Section > div > div > dl dt {
  font-weight: bold;
  margin-top: 16px;
}

.Section > div > div > dl dd {
  margin-inline-start: 0;
  margin: 8px 0 16px 0;
}

.Section > div > div > dl dd:not(:last-child) {
  border-bottom: solid 1px;
  padding-bottom: 16px;
}

.Section > div > div > h1, 
.Section > div > div > h2 {
  font-size: 28px;
  line-height: 1.2;
  font-weight: bold;
}

.Section > div > div h4 {
  font-weight: bold;
}

/* Branded */

.Section.--brand {
  background-color: var(--vp-c-brand);
  background-image: url('/home/bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  color: var(--vp-button-brand-text);
}

/* Single Column */

.Section.--singleColumn > div {
  max-width: 900px;
}

/* Center Text */

.Section.--centerText > div {
  text-align: center;
}

/* Pull Bottom */

.Section.--pullBottom {
  padding-bottom: 0;
}

.Section.--pullBottom > div {
  align-items: flex-end;
}

/* Small devices */

@media (min-width: 768px) {
  /* Grid */

  .Grid {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .Grid.--2x > * {
    flex: 0 0 calc(50% - 16px);
  }

  .Grid.--3x > * {
    flex: 0 0 calc(33% - 16px);
  }

  /* Section */

  .Section {
    padding: 64px 0;
  }

  .Section > div {
    flex-direction: row;
  }
  .Section > div > div,
  .Section > div > aside {
    margin: 0 32px;
    flex: 1;
    width: auto;
  }
  
  .Section > div > div {
    margin-bottom: 0;
  }

  .Section > div > div > * {
    margin: 24px 0;
  }

  .Section > div > div > ul li {
    margin: 24px 0;
  }

  .Section > div > div > dl dt {
    margin-top: 24px;
  }

  .Section > div > div > dl dd {
    margin: 16px 0 24px 0;
  }

  .Section > div > div > dl dd:not(:last-child) {
    padding-bottom: 24px;
  }

  .Section > div > div > h1, 
  .Section > div > div > h2 {
    font-size: 36px;
  }

  /* Content Right */

  .Section.--contentRight > div {
    flex-direction: row-reverse;
  }

  /* Pull Bottom */

  .Section.--pullBottom > div > div {
    padding-bottom: 64px;
  } 
}
</style>
