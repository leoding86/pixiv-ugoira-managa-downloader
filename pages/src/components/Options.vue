<template>
    <v-container style="max-width: 640px;">
        <span class="card-title">Ugoira</span>
        <v-card>
            <v-list two-line>
                <v-list-tile @click="showUgoiraSaveDialog()">
                    <v-list-tile-content>
                        <v-list-tile-title>{{ _i('saved_file_title') }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ _i('saved_file_title_desc') }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn icon ripple>
                            <v-icon>keyboard_arrow_right</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ _i('quanlity') }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-select :items="quanlityItems"
                                  v-model="ugoiraQuanlity"
                                  type="value" @change="onUgoiraQuanlityChangeHandler"></v-select>
                    </v-list-tile-action>
                </v-list-tile>
                <v-list-tile @click="showUgoiraExtendDialog()">
                    <v-list-tile-content>
                        <v-list-tile-title>{{ _i('extend_duration') }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ _i('extend_duration_desc') }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn icon ripple>
                            <v-icon>keyboard_arrow_right</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-card>
        <router-view />
    </v-container>
</template>

<script>
import cr from '@/modules/cr'

export default {
    name: 'Options',
    data () {
        return {
            quanlityItems: [
                {
                    text: cr._e('ugoira_normal'),
                    value: 10
                }, {
                    text: cr._e('ugoira_good'),
                    value: 5
                }, {
                    text: cr._e('ugoira_best'),
                    value: 1
                }
            ],
            ugoiraQuanlity: 10
        }
    },
    mounted () {
        this.ugoiraQuanlity = window.cr.storage.items.ugoiraQuanlity ? window.cr.storage.items.ugoiraQuanlity : this.ugoiraQuanlity - 0;
    },

    methods: {
        tileClickHandler: function (evt) {
            console.log(1);
        },

        showUgoiraSaveDialog: function (evt) {
            this.$router.push('ugoira-save-title')
        },

        showUgoiraExtendDialog: function (evt) {
            this.$router.push('ugoira-extend')
        },

        onUgoiraQuanlityChangeHandler: function () {
            let _this = this
            cr._s.set({ 'ugoiraQuanlity': _this.ugoiraQuanlity } )
        },

        _i (string) {
            return cr._e(string);
        }
    }
}
</script>

<style lang="scss" scoped>
#app {
    .card-title {
        display: block;
        font-size: 18px;
        margin-bottom: 10px;
    }
}
</style>