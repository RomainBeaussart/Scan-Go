<template>
    <v-container fluid v-if="scan.name" style="overflow: scroll; max-height: 100%">
        <v-layout wrap>
            <v-flex xs12 pa-3>
                <v-card
                    color="orange"
                    dark
                    width="100%"
                    elevation="0"
                    class="sg-card pa-3"
                >
                    <v-card-title class="headline d-flex justify-center align-center">
                        {{ scan.name }}
                    </v-card-title>
                    <v-card-text class="title white--text">
                        <v-layout wrap>
                            <v-flex xs12>
                                {{ scan.description}}
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs6 pa-3 v-for="(question, item) in scan.questions" :key="item">
                <v-card
                    height="256"
                    class="sg-card"
                    elevation="0"
                    color="primary"
                    dark
                >
                    <v-layout wrap pa-3>
                        <v-flex xs12 class="d-flex justify-end">
                            <v-btn
                                icon
                                @click="() => { selectedQuestion = item; dialogCreateQuestion = true}"
                            >
                                <v-icon>fa-pencil-alt</v-icon>
                            </v-btn>
                            <v-btn
                                icon
                            >
                                <v-icon>fa-arrow-up</v-icon>
                            </v-btn>
                            <v-btn
                                icon
                            >
                                <v-icon>fa-arrow-down</v-icon>
                            </v-btn>
                            <v-btn
                                icon
                                color="red"
                                @click="deleteQuestion(question.id)"
                            >
                                <v-icon>fa-times</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs9 class="d-flex justify-center title">
                            {{ question.question }}
                        </v-flex>
                        <v-flex xs3 mt-3 class="d-flex justify-end">
                            <v-container class="sg-qrcode d-flex justify-end">
                                <qr-code :text="question.id" :size="150" color="#1f2353" bg-color="#FFF"></qr-code>
                            </v-container>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>

            <!-- CREATE QUESTION -->

            <v-flex xs6 pa-3>
                <v-card
                    class="d-flex justify-center align-center sg-card-question"
                    height="256"
                    elevation="0"
                >
                <v-layout wrap ma-3>
                        <v-flex xs12 class="d-flex justify-center">
                            <v-btn
                                color="primary"
                                rounded
                                large
                                @click="newQuestion()"
                            > 
                                Nouvelle question <v-icon small right>fa-plus</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog
            v-model="dialogCreateQuestion"
            width="80%"
        >
            <CreateQuestion
                :question="scan.questions[selectedQuestion]"
                v-on:close="() => { this.dialogCreateQuestion = false }"
            ></CreateQuestion>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Apollo } from '../decorators'

import CreateQuestion from './CreateQuestion.vue'

import SCAN from '../graphql/Scan.gql'
import UPDATE_SCAN from '../graphql/UpdateScan.gql'

@Component({
    components: {
        CreateQuestion
    }
})
export default class ScanCreation extends Vue {
    dialogCreateQuestion = false

    selectedQuestion = 0

    get scanId() {
        return this.$route.params.id;
    }

    get userId() {
        return this.$store.state.user.id
    }

    @Apollo({
        query: SCAN,
        variables () {
            return {
                id: this.scanId,
                userId: this.userId
            }
        },
        result({ data, loading, networkStatus }: any) {
            if (!loading) {
                if (data) {
                    if(data.scan.user.id === this.$store.state.user.id){
                        this.scan = data.scan
                    } else {
                        this.$router.push({name: 'dashboard'})
                    }
                }
            }
        }
    })
    scan: any = {
        name : "",
        questions: []
    }

    newQuestion() {
        this.selectedQuestion = this.scan.questions.length
        this.scan.questions.push({
            id: "",
            question: "",
            type: "",
            proposals: [""],
            answer: 0
        })
        this.dialogCreateQuestion = true
    }

    async deleteQuestion(id) {
        this.scan.questions = this.scan.questions.filter(obj => obj.id !== id)
    }
}
</script>
