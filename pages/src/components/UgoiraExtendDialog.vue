<template>
    <v-dialog v-model="showDialog" max-width="560">
        <v-card>
            <v-list two-line>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ _i('extend_duration_desc') }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ _i('enable_extend_desc') }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-select :items="secondsItems"
                                  v-model="enableWhenUnderSeconds"
                                  @change="onEnableWhenUnderSecondsChangeHandler()"
                                  style="max-width: 100px"></v-select>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ _i('extend_duration_seconds_title') }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-select :items="extendDurationItems"
                                  v-model="extendDuration"
                                  @change="onExtendDurationChangeHandler()"
                                  style="max-width: 100px"></v-select>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-card>
    </v-dialog>
</template>

<script>
import cr from '@/modules/cr'

export default {
  name: 'UgoiraExtendDialog',
  data () {
    return {
      showDialog: true,
      secondsItems: [
          '0', 1, 2, 3, 4, 5
      ],
      extendDurationItems: [
          5, 10, 15
      ],
      enableWhenUnderSeconds: 3,
      extendDuration: 10
    }
  },
  mounted () {
      if (window.cr.storage.items.enableWhenUnderSeconds) {
          this.enableWhenUnderSeconds = window.cr.storage.items.enableWhenUnderSeconds
      }

      if (window.cr.storage.items.extendDuration) {
          this.extendDuration = window.cr.storage.items.extendDuration
      }
  },
  watch:  {
      showDialog: function (val) {
          if (!!val === false) {
              this.$router.go(-1)
          }
      }
  },
  methods: {
      onEnableWhenUnderSecondsChangeHandler (evt) {
          var _this = this
          cr._s.set({
              enableWhenUnderSeconds: _this.enableWhenUnderSeconds
          }).then(() => {
              window.cr.storage.items.enableWhenUnderSeconds = _this.enableWhenUnderSeconds
          })
      },

      onExtendDurationChangeHandler (evt) {
          var _this = this
          cr._s.set({
              extendDuration: _this.extendDuration
          }).then(() => {
              window.cr.storage.items.extendDuration = _this.extendDuration
          })
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
