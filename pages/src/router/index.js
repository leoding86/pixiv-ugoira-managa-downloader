import Vue from 'vue'
import Router from 'vue-router'
import Options from '@/components/Options'
import UgoriaSaveTitleDialog from '@/components/UgoiraSaveTitleDialog'
import UgoriaExtendDialog from '@/components/UgoiraExtendDialog'
import SaveMangaTitleDialog from '@/components/SaveMangaTitleDialog'
import SaveMangaImagesTitleDialog from '@/components/SaveMangaImagesTitleDialog'

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
          }, {
              path: 'save-manga-title',
              name: 'SaveMangaTitle',
              component: SaveMangaTitleDialog,
          }, {
              path: 'save-manga-images-title',
              name: 'SaveMangaImagesTitle',
              component: SaveMangaImagesTitleDialog,
          }
      ]
    }
  ]
})
