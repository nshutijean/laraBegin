
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

//imports
require('./bootstrap');

window.Vue = require('vue');


import { Form, HasError, AlertError } from 'vform'
import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import Profile from './components/Profile.vue';
import Users from './components/Users.vue';
import moment from 'moment';

//Form is made global
window.Form = Form;

//use vue router
Vue.use(VueRouter);

//Routes
let routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/profile', component: Profile },
    { path: '/users', component: Users }

]

//Registering routes
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

//Globally declared
Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

//capitalize filter for first letter
Vue.filter('capitalize', function(text) {
    text = text.toString();
    return text.charAt(0).toUpperCase() + text.slice(1);
});

//capitalize filter for all letters
Vue.filter('upText', function(text) {
    text = text.toString();
    return text.toUpperCase();
});

//date formattin using moment.js
Vue.filter('dateFormat', function(newFormat){
    return moment(newFormat).format('MMMM Do YYYY');
}) 


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    components:{ Dashboard, Profile } 
});
