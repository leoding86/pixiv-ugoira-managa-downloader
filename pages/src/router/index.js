import Vue from 'vue'
import Router from 'vue-router'
import Options from '@/components/Options'
import UgoriaSaveTitleDialog from '@/components/UgoiraSaveTitleDialog'
import UgoriaExtendDialog from '@/components/UgoiraExtendDialog'
import SaveMangaTitleDialog from '@/components/SaveMangaTitleDialog'
import SaveMangaImagesTitleDialog from '@/components/SaveMangaImagesTitleDialog'
import RenameUgoiraDialog from '@/components/RenameUgoiraDialog';
import RenameMangaDialog from '@/components/RenameMangaDialog';
import RenameMangaImageDialog from '@/components/RenameMangaImageDialog';

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
          }, {
              path: 'rename-ugoira',
              name: 'RenameUgoira',
              component: RenameUgoiraDialog
          }, {
              path: 'rename-manga',
              name: 'RenameManga',
              component: RenameMangaDialog
          }, {
              path: 'rename-manga-image',
              name: 'RenameMangaImage',
              component: RenameMangaImageDialog
          }
      ]
    }
  ]
})
