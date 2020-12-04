// index.js

import Vue from 'vue';
import App from './App.vue';
import './styles.scss'

new Vue({ render: createElement => createElement(App) }).$mount('#app');
