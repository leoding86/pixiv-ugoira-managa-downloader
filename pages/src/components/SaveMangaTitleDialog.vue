<template>
    <v-dialog v-model="showDialog" max-width="560">
        <v-card>
            <v-card-title primary-title>
                <div>
                    <h2>{{ _i('saved_manga_images_file_title') }}</h2>
                    <div style="font-size: 12px">{{ _i('drag_click_metas') }}</div>
                </div>
            </v-card-title>
            <v-card-text>
                <draggable v-model="metasConfig" :options="{ animation: 150}"
                           @end="onSortEndHandler">
                    <v-btn v-for="meta in metasConfig" :key="meta.value"
                           :ripple="false"
                           :color="meta.enable ? 'info' : ''"
                           @click="toggleMeta(meta)">{{ meta.title }}</v-btn>
                </draggable>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import draggable from 'vuedraggable'
import cr from '@/modules/cr'

export default {
  name: 'SaveMangaTitleDialog',
  components: {
      draggable,
  },
  data () {
    return {
      showDialog: true,
      metas: [ 'id', 'title', 'author', 'author_id' ],
      metasConfig: [
          {
              title: cr._e('id'),
              value: 'id',
              enable: false
          }, {
              title: cr._e('author_id'),
              value: 'authorId',
              enable: false
          }
      ],
    }
  },
  watch: {
      showDialog: function (val) {
          if (!!val === false) {
              this.$router.go(-1);
          }
      }
  },
  mounted () {
      let self = this;

      // Filter invalid metas
      if (window.cr.storage.items.mangaMetasConfig) {
        let metas = [];

        window.cr.storage.items.mangaMetasConfig.forEach((meta) => {
          self.metasConfig.forEach((_meta) => {
            if (meta.value == _meta.value) {
              metas.push(meta);
            }
          })
        });

        this.metasConfig = metas;
      } else {
        this.metasConfig = window.cr.storage.items.mangaMetasConfig;
      }
  },
  methods: {
      toggleMeta: function (meta) {
          meta.enable = !meta.enable;
          this.saveMetas(this.metasConfig);
      },

      onSortEndHandler: function (evt) {
          this.saveMetas(this.metasConfig);
      },

      saveMetas: function (metas) {
          cr._s.set({
              mangaMetasConfig: metas
          }).then(function () {
              window.cr.storage.items.mangaMetasConfig = metas;
          });
      },
      
      _i (string) {
        return cr._e(string);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
