<template>
    <v-app style="background-color: #FFF">
        <v-layout class="fill-height" wrap>
            <v-flex xs1>
                <v-card
                    app
                    class="pa-3 fill-height"
                    elevation="0"
                    width="126"
                >
                    <v-navigation-drawer
                        floating
                        permanent
                        color="primary"
                        dark
                        style="border-radius: 20px"
                    >
                        <v-layout wrap class="fill-height">
                            <v-flex xs12 class="d-flex align-self-start justify-center">
                                <img src="../assets/img/ScanAndGo.png" width="85%">
                            </v-flex>
                            <v-flex xs12 class="d-flex align-self-center justify-center">
                                <v-list rounded>
                                    <v-list-item class="d-flex justify-center my-3" link @click="$router.push({name: 'dashboard'})">
                                        <v-icon>fa-qrcode</v-icon>
                                    </v-list-item>
                                    <v-list-item class="d-flex justify-center my-3" link @click="dialogCreateScan = true">
                                        <v-icon>fa-plus</v-icon>
                                    </v-list-item>
                                    <v-list-item class="d-flex justify-center my-3" link>
                                        <v-icon>fa-cog</v-icon>
                                    </v-list-item>
                                </v-list>
                            </v-flex>
                            <v-flex xs12 class="d-flex align-self-end justify-center">
                                <v-list rounded>
                                    <v-list-item class="d-flex justify-center" link @click="logout()">
                                        <v-icon>fa-sign-out-alt</v-icon>
                                    </v-list-item>
                                </v-list>
                            </v-flex>
                        </v-layout>
                    </v-navigation-drawer>
                </v-card>
            </v-flex>
            <v-flex xs11>
                <v-content style="overflow: scroll; max-height: 100vh">
                    <v-scroll-x-transition>
                        <router-view style="background-color: #FFF;"></router-view>
                    </v-scroll-x-transition>
                </v-content>
            </v-flex>
        </v-layout>
        <v-dialog
            v-model="dialogCreateScan"
            width="40%"
        >
            <CreateScan
                v-on:close="dialogCreateScan = false"
            ></CreateScan>
        </v-dialog>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import CreateScan from "./CreateScan.vue"

@Component({
    components: {
        CreateScan
    }
})
export default class Index extends Vue {

    dialogCreateScan = false

    logout() {
        localStorage.removeItem("apollo-token");
        this.$store.commit("logoutUser");
        location.reload();
    }
}
</script>
