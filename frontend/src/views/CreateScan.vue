<template>
    <v-card class="sg-card" color="primary" dark>
        <v-card-title>
            <v-layout wrap>
                <v-flex xs10 class="headline">
                    Crées ton Scan&Go
                </v-flex>
                <v-flex xs2 class="d-flex justify-end">
                    <v-btn
                        color="red"
                        @click="() => {this.$emit('close')}"
                        rounded
                        icon
                    >
                        <v-icon>fa-times</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-card-text>
            <v-layout wrap>
                <v-flex xs12 class="title">
                    Donnes un nom a ton Scan&Go
                </v-flex>
                <v-flex xs12 mt-3>
                    <v-text-field
                        v-model="name"
                        label="Nom *"
                        :rules="[rules.name]"
                        filled
                        rounded
                        dark
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                        v-model="description"
                        label="Description"
                        :rules="[rules.description]"
                        filled
                        rounded
                        dark
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 class="d-flex justify-end">
                    <v-btn
                        color="orange"
                        @click="createScan()"
                        rounded
                        outlined
                    >Créer<v-icon small right>fa-plus</v-icon></v-btn>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Apollo } from '../decorators'

import CREATE_SCAN from '../graphql/CreateScan.gql'

@Component
export default class CreateScan extends Vue {
    name = ""
    description = ""

    get rules(){
        return {
            name:(this.name.length <= 20 || this.name.length === 0) || "Max 20 characters",
            description: (this.name.length <= 100 || this.name.length === 0) || "Max 100 characters"
        }
    }

    get user(){
        console.log(this.$store.state.user)
        return this.$store.state.user
    }

    async createScan(){
        if(this.name){
            let scan = await this.$apollo.mutate({
                mutation: CREATE_SCAN,
                variables: {
                    name: this.name,
                    desc: this.description,
                    id: this.user.id
                }
            })
            this.$router.push({
                name: "scan-creation",
                params: {
                    id: scan.data.createScan.id,
                }
            })
            this.name = ""
            this.description = ""
            this.$emit('close')
        }
    }

}
</script>

