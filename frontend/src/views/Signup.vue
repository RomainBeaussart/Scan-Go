<template>
<v-container>
    <v-card elevation="0">
        <v-stepper v-model="steps">
            <v-stepper-header class="elevation-0">
                <v-stepper-step :complete="steps > 1" step="1">Vos Identifiants</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-card
                        class="mb-12"
                        height="200px"
                        elevation="0"
                    >
                        <v-layout xs10 ma-5>
                            <v-flex xs8>
                                <v-text-field
                                    v-model="firstname"
                                    label="Prénom"
                                    outlined
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field
                                    v-model="lastname"
                                    label="Nom"
                                    outlined
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field
                                    v-model="email"
                                    :rules="[rules.email]"
                                    label="Email"
                                    outlined
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field
                                    v-model="password"
                                    label="Mot de passe"
                                    :rules="[rules.password]"
                                    :append-icon="passwordShow ? 'visibility' : 'visibility_off'"
                                    :type="passwordShow ? 'text' : 'password'"
                                    @click:append="passwordShow = !passwordShow"
                                    outlined
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field
                                    v-model="rePassword"
                                    label="Confirmez votre mot de passe"
                                    :rules="[rules.rePassword]"
                                    :append-icon="rePasswordShow ? 'visibility' : 'visibility_off'"
                                    :type="rePasswordShow ? 'text' : 'password'"
                                    @click:append="rePasswordShow = !rePasswordShow"
                                    outlined
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-card>
                    <v-btn
                        @click="steps = 2"
                        elevation="0"
                        style="float: right"
                        :disabled="stepsIsValid.step1"
                    >
                        Continue
                    </v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-card>
</v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Apollo } from '../decorators'
import { sha256 } from 'js-sha256'

import EMAIL_VERIF from '../graphql/EmailVerif.gql'
import CREATE_USER from '../graphql/CreateUser.gql'


@Component
export default class Signup extends Vue {

    password: string = ""
    passwordShow: boolean = false
    rePassword: string = ""
    rePasswordShow: boolean = false

    firstname: string = ""
    lastname: string = ""
    email: string = ""

    get rules() {
        return {
            password: (this.password.length >= 4 || this.password.length === 0) || "Min 4 characters",
            rePassword: (this.rePassword === this.password || this.rePassword.length === 0) || "Les mots de passes ne correspondents pas",
            email: !this.emailIsset || this.email + " est déjà utilisé"
        }
    }

    get stepsIsValid() {
        let step1 = false
        if (this.rules.password !== true) step1 = true
        if (this.rules.rePassword !== true) step1 = true
        return {
            step1: step1
        }
    }

    @Apollo({
        query: EMAIL_VERIF,
        variables() {
            return {
                email: this.email
            }
        },
        result({ data, loading, networkStatus }: any) {
            if (!loading) {
                if (data && data.email && data.email.aggregate.count === 0) {
                    this.emailIsset = false
                } else {
                    this.emailIsset = true
                }
            }
        }
    })
    emailIsset: boolean = false

    async signup() {
        await this.$apollo.mutate({
            mutation: CREATE_USER,
            variables: {
                password: sha256(this.password),
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
            }
        })
        this.$router.push({name: "login"})
    }
}
</script>
