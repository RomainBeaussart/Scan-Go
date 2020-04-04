<template>
    <v-container fluid class="d-flex justify-center fill-height" primary>
        <v-card
            elevation="0"
            width="100%"
            class="align-self-center"
            color="primary"
        >
            <v-layout xs6  wrap pa-5>
                <v-flex xs12 class="d-flex justify-center" mb-5>
                    <img src="../assets/img/ScanAndGo.png" width="50%"/>
                </v-flex>
                <v-flex xs12 class="headline white--text">
                    Bienvenue sur Scan&Go!
                </v-flex>
                <v-flex xs12 class="subtitle-2 white--text">
                    Entre l'ID du Scan&Go
                </v-flex>
                <v-flex xs12 class="d-flex justify-end">
                    <v-btn
                        text
                        rounded
                        dark
                        @click="showCamera = !showCamera"
                    >
                        <v-icon small left>fa-video</v-icon>
                        <v-icon
                            v-if="showCamera"
                            color="green"
                            small
                            right
                        >
                            fa-check
                        </v-icon>
                        <v-icon
                            v-else
                            color="red"
                            small
                            right
                        >
                            fa-times
                        </v-icon>
                    </v-btn>
                </v-flex>
                <v-flex xs12 my-3 v-if="showCamera">
                    <qrcode-stream @decode="onDecode"/>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="gameID"
                        label="Scan&Go ID"
                        filled
                        rounded
                        dark
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 class="d-flex justify-end">
                    <v-btn
                        elevation="0"
                        @click="join()"
                        color="orange"
                        rounded
                        outlined
                    >
                        Rejoindre
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card>
        <v-dialog v-model="unknowID">
            <v-card class="shake">
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 mt-3 class="d-flex justify-end">
                            <v-btn
                                color="red"
                                @click="unknowID = false"
                                rounded
                                icon
                            ><v-icon>fa-times</v-icon></v-btn>
                        </v-flex>
                        <v-flex xs12 class="d-flex justify-center title">
                            Nous n'avons pas trouvé de ScanAndGo avec cet ID
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { QrcodeStream } from 'vue-qrcode-reader'

import GAME_ID_VERIFICATION from '../graphql/Game.gql'
@Component({
    components: {
        QrcodeStream
    }
})
export default class GameConnect extends Vue {

    gameID = ""

    showCamera = true

    unknowID = false

    onDecode(code) {
        this.gameID = code
        this.join()
    }

    async join() {
        const result = await this.$apollo.query({
            query: GAME_ID_VERIFICATION,
            variables: {
                id: this.gameID
            }
        })
        if(result && result.data && result.data.game && result.data.game.id !== "") {
            this.$router.push({
                name: "player-create",
                params: {
                    gameId: this.gameID,
                }
            })
        }
        this.unknowID = true
    }

}
</script>

