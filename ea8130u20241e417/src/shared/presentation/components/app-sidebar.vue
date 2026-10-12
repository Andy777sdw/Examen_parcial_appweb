<script setup>
/**
 * Application Sidebar Navigation Component. Implements accessible semantic navigation links for Home and New Telemetry views, along with the bottom-pinned internationalization language selector.
 *
 * @summary Sidebar navigation and language switcher container.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './language-switcher.vue';

defineEmits(['navigate']);

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const navItems = [
  {
    path: '/home',
    nameKey: 'nav-home',
    icon: 'pi pi-home'
  },
  {
    path: '/telemetry/items/new',
    nameKey: 'nav-new-telemetry',
    icon: 'pi pi-plus-circle'
  }
];

function isCurrent(path) {
  return route.path === path;
}
</script>

<template>
  <nav class="flex flex-column justify-content-between h-full p-3" aria-label="Main Navigation">
    <div class="flex flex-column gap-2">
      <div class="px-2 py-2 text-xs font-bold text-500 uppercase tracking-wider">
        Operations Menu
      </div>

      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        custom
        v-slot="{ navigate, href }"
      >
        <a
          :href="href"
          class="flex align-items-center gap-3 px-3 py-3 border-round text-decoration-none transition-duration-150 cursor-pointer font-medium"
          :class="isCurrent(item.path)
            ? 'surface-primary text-primary-contrast font-bold shadow-1'
            : 'text-700 hover:surface-hover hover:text-900'"
          :aria-current="isCurrent(item.path) ? 'page' : undefined"
          @click="(e) => { navigate(e); $emit('navigate'); }"
        >
          <i :class="[item.icon, 'text-lg']" aria-hidden="true"></i>
          <span class="text-base">{{ t(item.nameKey) }}</span>
        </a>
      </router-link>
    </div>

    <!-- Bottom Language Switcher -->
    <div class="pt-3 border-top-1 surface-border flex flex-column gap-2">
      <div class="px-2 text-xs font-semibold text-500 uppercase">
        Language / Idioma
      </div>
      <div class="px-2">
        <language-switcher />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.tracking-wider {
  letter-spacing: 0.08em;
}
.surface-primary {
  background-color: var(--p-primary-color, #10b981);
}
.text-primary-contrast {
  color: var(--p-primary-contrast-color, #ffffff);
}
</style>
