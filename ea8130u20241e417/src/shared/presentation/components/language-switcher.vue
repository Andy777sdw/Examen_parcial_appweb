<script setup>
/**
 * Language Switcher Component. Provides toggle buttons for switching between En and ES internationalization locales in real time without page reload.
 *
 * @summary Real time language switcher component.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();

/**
 * Changes active locale and stores preference.
 *
 * @param {string} lang
 */
function setLocale(lang) {
  locale.value = lang;
}
</script>

<template>
  <div class="flex align-items-center gap-1" role="group" aria-label="Language selection">
    <pv-button
      type="button"
      :label="t('lang-en')"
      :class="locale === 'en' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'"
      class="p-button-sm font-bold border-round px-3"
      :aria-pressed="locale === 'en'"
      aria-label="Switch to English"
      @click="setLocale('en')"
    />
    <pv-button
      type="button"
      :label="t('lang-es')"
      :class="locale === 'es' ? 'p-button-primary' : 'p-button-outlined p-button-secondary'"
      class="p-button-sm font-bold border-round px-3"
      :aria-pressed="locale === 'es'"
      aria-label="Cambiar a Español"
      @click="setLocale('es')"
    />
  </div>
</template>
