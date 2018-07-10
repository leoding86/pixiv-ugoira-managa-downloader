<template>
    <v-dialog v-model="showDialog" max-width="560">
        <v-card>
            <v-card-title primary-title>
                <div>
                    <h2>Ugoira save title</h2>
                    <div style="font-size: 12px">Drag to sort, click to enable/disable meta</div>
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

export default {
  name: 'UgoiraSaveTitleDialog',
  components: {
      draggable,
  },
  data () {
    return {
      showDialog: true,
      metas: [ 'id', 'title', 'author', 'author_id' ],
      metasConfig: [
          {
              title: 'ID',
              value: 'id',
              enable: false
          }, {
              title: 'Title',
              value: 'title',
              enable: false
          }, {
              title: 'Author',
              value: 'author',
              enable: false
          }, {
              title: 'Author ID',
              value: 'author_id',
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
      if (null === this.migrateConfig(window.cr.storage.items.titleMetas)) {
          //
      }
  },
  methods: {
      toggleMeta: function (meta) {
          meta.enable = !meta.enable;
          console.log(this.metasConfig);
      },
      onSortEndHandler: function (evt) {
          console.log(this.metasConfig);
      },
      migrateConfig: function (metas) {
          if (undefined === metas) {
              return;
          }

          try {
              let newMetasConfig = [];
              let metasNotUsed = [];

              this.metasConfig.forEach(function (meta, i) {
                  if (metas.indexOf(meta.value) > -1) {
                      meta.enable = true;
                      newMetasConfig.push(meta);
                  } else {
                      metasNotUsed.push(meta);
                  }
              });

              metasNotUsed.forEach(function (meta) {
                  newMetasConfig.push(meta);
              });

              this.metasConfig = newMetasConfig;
          } catch (e) {
              console.log(e);
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
