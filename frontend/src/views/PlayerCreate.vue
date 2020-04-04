<template>
    <v-container fluid class="d-flex justify-center fill-height" primary>
        <v-card
            elevation="0"
            width="100%"
            class="align-self-center"
            color="primary"
        >
            <v-layout xs6  wrap pa-5>
                <v-flex xs12 class="headline white--text d-flex justify-center">
                    Choisis ton avatar
                </v-flex>
                <v-flex xs12 height="100%">
                    <v-carousel hide-delimiters v-model="player.avatar" height="200">
                        <v-carousel-item
                            v-for="(item,i) in items"
                            :key="i"
                            :src="item.src"
                            height="100%"
                        ></v-carousel-item>
                    </v-carousel>
                </v-flex>
                <v-flex xs12 mt-3 class="headline white--text d-flex justify-center">
                    Choisis ton nickname
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="player.name"
                        label="Nom du joueur / de l'équipe"
                        filled
                        rounded
                        dark
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 class="d-flex justify-end">
                    <v-btn
                        elevation="0"
                        color="orange"
                        rounded
                        outlined
                        @click="join()"
                    >
                        Rejoindre
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card>
        <v-dialog v-model="noPseudo">
            <v-card class="shake">
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 mt-3 class="d-flex justify-end">
                            <v-btn
                                color="red"
                                @click="noPseudo = false"
                                rounded
                                icon
                            ><v-icon>fa-times</v-icon></v-btn>
                        </v-flex>
                        <v-flex xs12 class='d-flex justify-center title'>
                            Entrez votre Pseudo
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Apollo } from '../decorators'
import { icons } from '../assets/img/icons/icons'

import CREATE_PLAYER from '../graphql/CreatePlayer.gql'
import UPSERT_PLAYER from '../graphql/UpsertPlayer.gql'

@Component
export default class PlayerCreate extends Vue {

    noPseudo: boolean = false

    flickityOptions: any = {
        prevNextButtons: true,
        pageDots: false,
        wrapAround: true
    }

    player: any = {
        avatar: 0,
        name: "",
        id: ""
    }

    get items () {
        return icons
    }

    get gameId() {
        return this.$route.params.gameId
    }

    async join() {
        if(this.player.name !== ''){
            const player = await this.$apollo.mutate({
                mutation: UPSERT_PLAYER,
                variables: {
                    id: this.player.id,
                    name: this.player.name,
                    avatar: this.player.avatar,
                    gameID: this.gameId
                }
            })

            this.player.id = player.data.upsertPlayer.id
            this.$router.push({
                name: "play",
                params: {
                    gameId: this.gameId,
                    playerId: this.player.id
                }
            })
        } else {
            this.noPseudo = true
        }
    }

}
</script>
