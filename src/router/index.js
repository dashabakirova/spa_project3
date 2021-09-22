import Vue from 'vue'
import Router from 'vue-router'
import Fail from '../components/Fail'
import NewFail from '../components/NewFail'
import SiknFailures from '../components/SiknFailures'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/fail/:id', name: 'Fail', component: Fail,
    },
    {
      path: '/newfail/:id', 
      name: 'NewFail', 
      component: NewFail,
      props: true,
    },
    {
      path: '', name: 'Home', component: SiknFailures,
    },
  ],
  mode: 'history'
})
