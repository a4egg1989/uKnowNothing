import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
import VueAxios from 'vue-axios'

// Vuetify
import 'vuetify/styles'
import vuetify from './plugins/vuetify'

// sweeetalert
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(vuetify)
app.use(VueAxios, axios)
app.use(VueSweetalert2)
app.use(createPinia())
app.use(router)
app.component('VueDatePicker', VueDatePicker);

app.mount('#app')
