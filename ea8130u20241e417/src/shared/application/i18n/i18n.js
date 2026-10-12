/**
 * Vue I18n Configuration. Configures English and Spanish internationalization resources.
 *
 * @summary Vue I18n plugin configuration.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
});

export default i18n;
