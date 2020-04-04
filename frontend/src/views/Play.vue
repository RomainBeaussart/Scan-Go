<template>
    <v-container fluid class="d-flex justify-center fill-height" primary v-if="!!player.id">
        <v-layout wrap>
            <v-flex xs2>
                <v-img
                    :src="avatar[player.avatar].src"
                    width="100%"
                ></v-img>
            </v-flex>
            <v-flex xs10 class="d-flex justify-end display-1 white--text">
                {{ player.name }}
            </v-flex>
            <v-flex xs12>
                <qrcode-stream @decode="onDecode"/>
            </v-flex>
            <v-flex xs6 my-3 class="d-flex justify-start title white--text">
                Timer {{ timer }}
            </v-flex>
            <v-flex xs6 my-3 class="d-flex justify-end title white--text">
                Points {{ player.points }}
            </v-flex>
        </v-layout>
        <v-dialog v-model="questionPanel" fullscreen hide-overlay transition="dialog-bottom-transition" style="border-radius: 0px !important;">
            <v-card color="primary">
                <v-toolbar dark color="primary" elevation="0">
                    <v-toolbar-title>Question</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red"
                        @click="questionPanel = false"
                        rounded
                        icon
                    >
                        <v-icon>fa-times</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-layout wrap>
                    <v-flex xs12 px-3 class="white--text">
                        <p class="title">
                        {{ question.question }}
                        </p>
                    </v-flex>
                    <v-flex xs12 v-if="question.type === 'PROPOSALS'">
                        <v-layout wrap>
                            <v-flex xs12 px-3 class="white--text">
                                Choisi ta réponse
                            </v-flex>
                            <v-flex xs6
                                class="d-flex justify-center"
                                v-for="(proposal, index) in question.proposals"
                                :key="proposal"
                                py-4
                            >
                                <v-btn
                                    color="orange"
                                    rounded
                                    @click="sendResponse(index)"
                                >
                                    {{ proposal }}
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
        <v-dialog v-model="alreadyAnswered">
            <v-card class="shake">
                <v-card-text>
                    <v-layout wrap>
                        <v-flex xs12 mt-3 class="d-flex justify-end">
                            <v-btn
                                color="red"
                                @click="alreadyAnswered = false"
                                rounded
                                icon
                            >
                                <v-icon>fa-times</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs12 class='d-flex justify-center title'>
                            Vous avez déjà répondu à cette question
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="correction" width="140px" persistent hide-overlay>
                <v-layout wrap>
                    <v-flex xs12 pa-3 class="d-flex justify-center">
                        <v-icon
                            v-if="goodAnswer"
                            color="green"
                            style="font-size: 120px"
                        >fa-thumbs-up</v-icon>
                        <v-icon
                            v-else
                            color="red"
                            style="font-size: 120px"
                        >fa-thumbs-down</v-icon>
                    </v-flex>
                </v-layout>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { QrcodeStream } from 'vue-qrcode-reader'
import moment from 'moment'

import { Apollo } from '../decorators'
import { icons } from '../assets/img/icons/icons'


import GET_QUESTION from '../graphql/Question.gql'
import SEND_QUESTION from '../graphql/SendQuestion.gql'
import PLAYER from '../graphql/Player.gql'

@Component({
    components: {
        QrcodeStream
    }
})
export default class Play extends Vue {

    questionPanel: boolean = false

    alreadyAnswered: boolean = false

    goodAnswer: boolean = true

    correction: boolean = false

    question: any = {}

    get avatar () {
        return icons
    }

    get gameId() {
        return this.$route.params.gameId
    }

    get playerId() {
        return this.$route.params.playerId
    }

    timer: any = ""

    @Apollo({
        query: PLAYER,
        variables () {
            return {
                id: this.playerId
            }
        }
    })
    player: any = {}

    mounted() {
        this.timer = setInterval(() => {
            this.updateTimer();
        },1000);
    
        this.updateTimer();
    }

    updateTimer(){
        if(this.timer !== '00:00'){
            /**
             * TODO:
             * Revoir algo (cas de deconnection lors du Times Up)
             */

            const createdAt = moment(this.player.createdAt).add(1, 'hours')
            const now = moment()
            //@ts-ignore
            const interval = new Date(createdAt - now)
            this.timer = moment(interval).format('mm:ss')
        } else {
            this.endGame()
        }
    }

    async onDecode(data) {
        if(!this.questionPanel && data.length === 25){
            const questionsAnswered = this.player.questionsAnswered.map( x => x.id)
            if(!questionsAnswered.includes(data)){
                this.questionPanel = true
                const question = await this.$apollo.query({
                    query: GET_QUESTION,
                    variables: {
                        id: data,
                    }
                })
                console.log(question)
                this.question = question.data.question
            } else {
                this.alreadyAnswered = true
            }
        }
    }

    endGame() {
    }

    async sendResponse(index) {
        this.player.questionsAnswered.push({id: this.question.id})
        const answer = await this.$apollo.query({
            query: SEND_QUESTION,
            variables: {
                questionId: this.question.id,
                playerId: this.playerId,
                answerIndex: index,
            }
        })
        console.log(answer)
        if (answer.data.sendResponse.answer) {
            this.player.points += 10
            this.goodAnswer = true
        } else {
            this.goodAnswer = false
        }
        this.questionPanel = false
        this.correction = true
        setTimeout(() => (this.correction = false), 2000)
    }

}
</script>

