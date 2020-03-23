
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

//imports
require('./bootstrap');

window.Vue = require('vue');

//Passport token components
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);


import { Form, HasError, AlertError } from 'vform'
import VueRouter from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import Profile from './components/Profile.vue';
import Users from './components/Users.vue';
import Dev from './components/Dev.vue';

//Passport imports
// import AuthorizedClients from './components/passport/AuthorizedClients.vue';
// import Clients from './components/passport/Clients.vue';
// import PersonalAccessTokens from './components/passport/PersonalAccessTokens.vue'


//MomentJs 
import moment from 'moment';
//ProgressBar
import VueProgressBar from 'vue-progressbar'
//sweetAlert
import Swal from 'sweetalert2'
//animate.css(not working, yet)
import animate from 'animate.css'

import Gate from './Gate'

//Prototyping in Vue: accessing the instance anywhere
Vue.prototype.$gate = new Gate(window.user);


//VForm object is made global
window.Form = Form;

//sweetAlert object
window.Swal = Swal;

//new Vue instance
window.Fire = new Vue();

//use sweetAlert toast(globally)
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
window.Toast = Toast;

//use vue router
Vue.use(VueRouter);

// use ProgressBar
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
})

//Routes
let routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/profile', component: Profile },
    { path: '/users', component: Users },
    { path: '/dev', component: Dev }

]

//Registering routes
const router = new VueRouter({
    //HTML5 history
    mode: 'history',
    routes // short for `routes: routes`
})

//Globally declared(registered)
Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

Vue.component('not-found',require('./components/NotFound.vue').default);

//laravel-vue-pagination
Vue.component('pagination', require('laravel-vue-pagination'));


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
    components:{ Dashboard, Profile, Dev, Users} 
});
