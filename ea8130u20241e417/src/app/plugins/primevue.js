/**
 * PrimeVue Plugin Setup. Configures PrimeVue with the Material Design preset, installs services and registers UI components with the required "pv-" prefix.
 *
 * @summary PrimeVue application plugin with Material theme preset.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import PrimeVue from 'primevue/config';
import Material from '@primevue/themes/material';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import ProgressSpinner from 'primevue/progressspinner';
import Drawer from 'primevue/drawer';
import ToggleSwitch from 'primevue/toggleswitch';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';

/**
 * Installs PrimeVue, services, and registers pv-* components.
 *
 * @param {import('vue').App} app
 */
export function setupPrimeVue(app) {
  app.use(PrimeVue, {
    theme: {
      preset: Material,
      options: {
        darkModeSelector: false || '.app-dark'
      }
    },
    ripple: true
  });

  app.use(ToastService);
  app.use(ConfirmationService);

  app.component('pv-toolbar', Toolbar);
  app.component('pv-button', Button);
  app.component('pv-card', Card);
  app.component('pv-input-text', InputText);
  app.component('pv-input-number', InputNumber);
  app.component('pv-select', Select);
  app.component('pv-textarea', Textarea);
  app.component('pv-message', Message);
  app.component('pv-toast', Toast);
  app.component('pv-confirm-dialog', ConfirmDialog);
  app.component('pv-progress-spinner', ProgressSpinner);
  app.component('pv-drawer', Drawer);
  app.component('pv-toggle-switch', ToggleSwitch);
  app.component('pv-toggleswitch', ToggleSwitch);
  app.component('pv-tag', Tag);
  app.component('pv-divider', Divider);
}

export default setupPrimeVue;
