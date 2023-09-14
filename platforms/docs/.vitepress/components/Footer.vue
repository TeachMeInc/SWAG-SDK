<script setup lang="ts">
import { useData } from 'vitepress/dist/client/app/data'
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'
import VPImage from 'vitepress/dist/client/theme-default/components/VPImage.vue'

const { theme, frontmatter } = useData()
const { hasSidebar } = useSidebar()
</script>

<template>
  <footer v-if="theme.footer && frontmatter.footer !== false" class="VPFooter" :class="{ 'has-sidebar': hasSidebar }">
    <div class="container">
      <img :src="theme.logo" :alt="theme.message" class="logo" />
      <VPSocialLinks class="social-links-list" :links="theme.socialLinks" />
      <p v-if="theme.footer.copyright" class="copyright" v-html="theme.footer.copyright"></p>
    </div>
  </footer>
</template>

<style scoped>
.VPFooter {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.VPFooter.has-sidebar {
  display: none;
}

@media (min-width: 768px) {
  .VPFooter {
    padding: 32px;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
  display: flex;
  flex-direction: column;
}

.container > * {
  margin: 4px 0;
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.logo {
  height: 24px;
}
</style>