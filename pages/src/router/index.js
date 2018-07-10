import Vue from 'vue'
import Router from 'vue-router'
import Options from '@/components/Options'
import UgoriaSaveTitleDialog from '@/components/UgoiraSaveTitleDialog'
import UgoriaExtendDialog from '@/components/UgoiraExtendDialog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Options',
      component: Options,
      children: [
          {
              path: 'ugoira-save-title',
              name: 'UgoiraSaveTitle',
              component: UgoriaSaveTitleDialog,
          }, {
              path: 'ugoira-extend',
              name: 'UgoiraExtend',
              component: UgoriaExtendDialog,
          }
      ]
    }
  ]
})
