<template>
    <v-container fluid class="d-flex justify-center fill-height">
        <v-snackbar
            v-model="snackbar"
            color="primary"
        >
            {{ alert }} 
            <v-btn
                color="pink"
                text
                @click="() => { this.snackbar = false }"
            >
                <v-icon small right>fa-times</v-icon>
            </v-btn>
        </v-snackbar>
        <v-layout wrap>
            <v-flex xs7 pa-3>
                <v-card
                    color="red"
                    dark
                    width="100%"
                    elevation="0"
                    class="sg-card pa-5"
                >
                    <v-card-title class="headline">Liste de tes Scan&Go</v-card-title>
                    <v-card-text class="subtitle-1 white--text" v-if="scans.length">
                        <v-layout wrap>
                            <v-flex xs2>
                                Scan&Go
                            </v-flex>
                            <v-flex xs10>
                                
                            </v-flex>
                        </v-layout>
                        <v-layout wrap v-for="scan in scans" :key="scan.id" my-3>
                            <v-flex xs3>
                                {{ scan.name }}
                            </v-flex>
                            <v-flex xs2 class="d-flex justify-center">
                                <v-btn
                                    color="white"
                                    @click="editScan(scan.id)"
                                    rounded
                                    outlined
                                >
                                    Editer<v-icon small right>fa-pencil-alt</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs2 class="d-flex justify-center">
                                <v-btn
                                    color="white"
                                    @click="deleteScan(scan.id)"
                                    rounded
                                    outlined
                                >
                                    Supprimer<v-icon small right>fa-trash-alt</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs2 class="d-flex justify-center">
                                <v-btn
                                    color="white"
                                    @click="play(scan.id)"
                                    :disabled="(scan.id === gameRun.scan.id && gameRun.scan.id) ? true : false"
                                    rounded
                                    outlined
                                >
                                    Lancer<v-icon small right>fa-play</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-text class="title white--text" v-else>
                        <v-layout wrap>
                            <v-flex xs12>
                                Tu n'as pas encore de Scan&Go
                            </v-flex>
                            <v-flex xs12 class="d-flex justify-center">
                                <v-btn
                                    color="white"
                                    rounded
                                    outlined
                                    @click="dialogCreateScan = true"
                                >
                                    Créer <v-icon right small>fa-plus</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs5 class="d-flex justify-center" pa-3 v-if="gameRun.id">
                <v-card
                    color="primary"
                    dark
                    width="100%"
                    class="sg-card pa-5"
                    elevation="0"
                >
                    <v-card-title class="headline">Scan&Go en cour ...</v-card-title>
                    <v-card-text class="title">
                        Scan&Go: {{gameRun.scan.name}} <br />
                        ID: {{ gameRun.id }}
                        <v-container class="sg-qrcode" my-3>
                            <qr-code :text="gameRun.id" :size="200" color="#1f2353" bg-color="#FFF"></qr-code>
                        </v-container>
                        <v-layout wrap>
                            <v-flex xs2>
                                <v-btn
                                    rounded
                                    outlined
                                    @click="stopGame()"
                                >
                                    Stop<v-icon small right>fa-stop</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs3 mx-2>
                                <v-btn
                                    rounded
                                    outlined
                                    @click="gameDashboard(gameRun.id)"
                                >
                                    Manager<v-icon small right>fa-cogs</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs7 v-if="gameRun.id">
                
            </v-flex>
            <v-flex xs5 class="d-flex justify-center" pa-3>
                <v-card
                    color="orange"
                    dark
                    width="100%"
                    class="sg-card pa-5"
                    elevation="0"
                >
                    <v-card-title class="headline">Hello, {{ user.firstname }} !</v-card-title>
                    <v-card-text class="title">Bienvenue sur Scan&Go</v-card-text>
                </v-card>
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
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { Apollo } from '../decorators'

import SCANS from '../graphql/ScansUser.gql'
import DELETE_SCAN from '../graphql/DeleteScan.gql'
import CREATE_GAME from '../graphql/CreateGame.gql'
import DELETE_GAME from '../graphql/DeleteGame.gql'
import GAME_ADMIN from '../graphql/GameAdmin.gql'


import CreateScan from "./CreateScan.vue"

@Component({
    components: {
        CreateScan
    }
})
export default class Dashboard extends Vue {
    headers: [
        {
          text: 'Nom',
          value: 'name',
        },
        { text: 'Mit a jour le', value: 'updatedAt' },
        { text: 'Actions' }
    ]

    snackbar = false

    alert = ""

    dialogCreateScan = false

    get user(){
        console.log(this.$store.state.user)
        return this.$store.state.user
    }

    @Apollo({
        query: SCANS,
        variables() {
            return {
                id: this.user.id
            };
        },
    })
    scans: any = []

    @Apollo({
        query: GAME_ADMIN,
        variables() {
            return {
                id: this.user.id
            }
        },
        result({ data, loading, networkStatus }: any) {
            if (!loading) {
                if (data) {
                    console.log(data)
                    if(data.games[0]) {
                        this.gameRun = data.games[0]
                    }
                }
            }
        }
    })
    gameRun: any = {
        id: "",
        scan: {
            id: "",
            name: ""
        }
    }

    formatDate(date) {
        return moment(date).format("DD MMM YYYY");
    }

    gameDashboard(gameId){
        this.$router.push({
                name: "game-dashboard",
                params: {
                    id: gameId,
                }
            })
    }

    async deleteScan(id: string){
        if(this.gameRun.scan.id === "" || this.gameRun.scan.id !== id){
            await this.$apollo.mutate({
                mutation: DELETE_SCAN,
                variables: {
                    id: id
                }
            })
            this.scans = this.scans.filter(obj => obj.id !== id)
        } else {
            this.alert = "Ce Scan&Go est en cours d'execution, il est donc impossible de le supprimer."
            this.snackbar = true
        }
    }

    editScan(id) {
        if(this.gameRun.scan.id === "" || this.gameRun.scan.id !== id){
            this.$router.push({
                name: "scan-creation",
                params: {
                    id: id,
                }
            })
        } else {
            this.alert = "Impossible de modifier un sénario en cours d'execution"
            this.snackbar = true
        }
    }

    async play(id){
        if(this.gameRun.scan.id !== id) {
            if(this.gameRun.id){
                await this.$apollo.mutate({
                    mutation: DELETE_GAME,
                    variables: {
                        id: this.gameRun.id
                    }
                })
            }
            let game = await this.$apollo.mutate({
                mutation: CREATE_GAME,
                variables: {
                    scanId: id,
                    adminId: this.user.id
                }
            })
            this.gameRun = game.data.createGame
        }
    }

    async stopGame(){
        await this.$apollo.mutate({
            mutation: DELETE_GAME,
            variables: {
                id: this.gameRun.id
            }
        })
        this.gameRun = {
            id: "",
            scan: {
                id: "",
                name: ""
            }
        }
    }

}
</script>

