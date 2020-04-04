<template>
    <v-container fluid class="d-flex">
        <v-layout wrap>
            <v-flex xs6 pa-3>
                <v-card
                    color="#424242"
                    dark
                    width="100%"
                    elevation="0"
                    class="sg-card pa-5"
                >
                    <!-- <v-layout wrap>
                        <v-flex xs12 v-for="player in players" :key="player.id">
                            {{ player.name }}
                        </v-flex>
                    </v-layout> -->
                    <v-data-table
                        :headers="headers"
                        :items="players"
                        max-height="500px"
                        :items-per-page="-1"
                        dark
                        fixed-header
                        hide-default-footer
                        v-if="game.id"
                    >
                        <template slot="item" slot-scope="props">
                            <tr>
                                <td>
                                    {{ props.item.name }}
                                </td>
                                <td>
                                    {{ props.item.points }}
                                </td>
                                <td>
                                    {{ props.item.questionsAnswered.length }} / {{ game.scan.questions.length }}
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
            <v-flex xs6 pa-3>
                <v-card
                    color="orange"
                    dark
                    width="100%"
                    elevation="0"
                    class="sg-card pa-5"
                >
                <v-layout wrap>
                    <v-flex class="title">
                        Questions à valider
                    </v-flex>
                </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Apollo } from '../decorators'

import GAME_PLAYERS_SUBSCRIPTION from '../graphql/GamePlayersSubscription.gql'
import GAME_PLAYERS from '../graphql/GamePlayers.gql'
import GAME from '../graphql/Game.gql'

@Component
export default class GameDashboard extends Vue {

    headers: Array<any>=[{
        text: "Player"
    },{
        text: "Nbr de points"
    },{
        text: "QRCode Trouvés"
    }]

    players: Array<any> = []
    game: any = {}

    @Apollo({
        query: GAME,
        variables(){
            return {
                id: this.gameId
            }
        },
        result({ data, loading, networkStatus }: any) {
            if (!loading) {
                if (data && data.game) {
                    this.game = data.game
                }
            }
        }
    })

    get gameId() {
        return this.$route.params.id
    }

    async mounted() {
        this.$apollo.addSmartSubscription("chatUserSubcription", {
            query: GAME_PLAYERS_SUBSCRIPTION,
            variables() {
                return {
                    gameId: this.gameId
                };
            },
            result({ data, loading, networkStatus }: any) {
                if (data && data.player && data.player.node) {
                    console.log("Subscribe --- ", data.player.node)
                    let playerIndex = this.players.findIndex(x => x.id === data.player.node.id)
                    if(playerIndex >= 0) this.players[playerIndex] = data.player.node
                    else this.players.push(data.player.node)
                    console.log(this.players)
                }
            },
            skip() {
                return !this.gameId;
            }
        })

        const players = await this.$apollo.query({
            query: GAME_PLAYERS,
            variables() {
                return {
                    gameId: this.gameId
                }
            }
        })
        this.players = players.data.players
    }
}
</script>

