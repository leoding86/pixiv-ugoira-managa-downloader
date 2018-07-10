<template>
    <v-dialog v-model="showDialog" max-width="560">
        <v-card>
            <v-list two-line>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>
                        Enable repeat when ugoira duration under {{ enableWhenUnderSeconds }} second(s)
                        </v-list-tile-title>
                        <v-list-tile-sub-title>Repeat disabled when 0 is selected</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-select :items="secondsItems"
                                  v-model="enableWhenUnderSeconds"
                                  style="max-width: 100px"></v-select>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Extend ugoira duration to {{ extendDuration }} second(s) at least
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-select :items="extendDurationItems"
                                  v-model="extendDuration"
                                  style="max-width: 100px"></v-select>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-card>
    </v-dialog>
</template>

<script>
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
  watch:  {
      showDialog: function (val) {
          if (!!val === false) {
              this.$router.go(-1);
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
