import { createVuetify } from 'vuetify'
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
    directives,
    components,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
    theme: {
        defaultTheme: 'myCustomTheme',
        themes: {
            myCustomTheme: {
                dark: false,
                colors: {
                    primary: '#14BAE3',
                    'primary-light': '#40DDFF',
                    black: '#4A4A4A',
                    normal: 'rgba(0, 0, 0, 0.2)',
                }
            }
        }
    }
})