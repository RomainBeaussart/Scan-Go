<template>
    <v-card class="sg-card" color="primary" dark>
        <v-card-title>
            <v-layout wrap>
                <v-flex xs12 class="d-flex justify-end">
                    <v-btn
                        color="red"
                        @click="createQuestion()"
                        rounded
                        icon
                    ><v-icon>fa-times</v-icon></v-btn>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-card-text>
            <v-layout wrap>
                <v-flex xs6>
                    <v-select
                        v-model="question.type"
                        :items="questionTypes"
                        item-text="text"
                        item-value="abbr"
                        filled
                        rounded
                        label="Type de question"
                        dark
                    ></v-select>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="question.question"
                        label="Question"
                        filled
                        rounded
                        dark
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-layout v-if="question.type === 'PROPOSALS'" wrap>
                        <v-flex xs4 pa-5 v-for="(proposal, item) in question.proposals" :key="item">
                            <v-card
                                class="sg-card"
                                color="orange"
                                v-if="question.type === 'PROPOSALS'"
                            >
                                <v-layout wrap>
                                    <v-flex xs2 class="d-flex justify-center align-center">
                                        <v-radio-group v-model="question.answer">
                                            <v-radio color="red" :value="item"></v-radio>
                                        </v-radio-group>
                                    </v-flex>
                                    <v-flex xs8 pt-7>
                                        <v-text-field
                                             v-model="question.proposals[item]"
                                            :label="item === question.answer ? 'Bonne réponse' :'Proposition'"
                                            filled
                                            rounded
                                            dark
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs2 class="d-flex justify-center align-center">
                                        <v-btn
                                            icon
                                            color="red"
                                            @click="deleteProp(item)"
                                        >
                                            <v-icon>fa-times</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs4 pa-5>
                            <v-card
                                class="sg-card"
                                color="orange"
                                @click="newProp()"
                            >
                                <v-layout wrap pa-5>
                                    <v-flex xs3>
                                    </v-flex>
                                    <v-flex xs6 py-7>
                                        Nouvelle proposition <v-icon right small>fa-plus</v-icon>
                                    </v-flex>
                                    <v-flex xs3>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex xs12 class="d-flex justify-end">
                    <v-btn
                        color="orange"
                        rounded
                        outlined
                        @click="createQuestion()"
                    >Valider<v-icon small right>fa-plus</v-icon></v-btn>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Apollo } from '../decorators'

import UPSERT_QUESTION from '../graphql/UpsertQuestion.gql'

@Component
export default class CreateQuestion extends Vue {
    @Prop() question: any
    
    questionTypes = [
        { text: 'Question à choix multiple', abbr: 'PROPOSALS' },
        { text: 'Réponse libre', abbr: 'TEXT'}
    ]

    async createQuestion() {
        this.$emit('close')
        let question = await this.$apollo.mutate({
            mutation: UPSERT_QUESTION,
            variables: {
                id: this.question.id,
                question: this.question.question,
                answer: this.question.answer,
                proposals: this.question.proposals,
                type: this.question.type,
                scanId: this.$route.params.id
            }
        })
        this.question.id = question.data.upsertQuestion.id
    }

    newProp(){
        this.question.proposals.push("")
    }

    deleteProp(index) {
        this.question.proposals.splice(index, 1);
    }

}
</script>

