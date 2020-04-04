<template>
    <v-container fluid class="fill-height">
        <v-carousel hide-delimiters cycle>
            <v-carousel-item
                v-for="(item,i) in items"
                :key="i"
                :src="item.src"
            ></v-carousel-item>
  </v-carousel>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Apollo } from '../decorators'

import { carouselHome } from '../assets/img/img'

@Component
export default class Home extends Vue {

    get background() {
        return carouselHome
    }

}
</script>

