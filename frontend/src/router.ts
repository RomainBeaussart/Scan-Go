import Vue from 'vue'
import Router, { Route } from 'vue-router'
import gql from 'graphql-tag';
import { createProvider } from './vue-apollo'

import store from './store/store'

import Index from './views/Index.vue'

import Home from './views/Home.vue'

import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import Dashboard from './views/Dashboard.vue'
import ScanCreation from './views/ScanCreation.vue'
import GameDashboard from './views/GameDashboard.vue'

import Play from './views/Play.vue'
import GameConnect from './views/GameConnect.vue'
import PlayerCreate from './views/PlayerCreate.vue'

import USER_DETAILS from './graphql/auth/UserDetails.gql'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Index,
            children: [
                { path: '/signup', name: 'signup', component: Signup },
                { path: '/dashboard', name: 'dashboard', component: Dashboard },
                { path: '/scan-creation/:id', name: 'scan-creation', component: ScanCreation },
                { path: '/game/:id', name: 'game-dashboard', component: GameDashboard },
            ]
        },
        { path: '/login', name: 'login', component: Login },
        { path: '/play', name: 'game-connect', component: GameConnect },
        { path: '/play/:gameId', name: 'player-create', component: PlayerCreate, props: true },
        { path: '/play/:gameId/:playerId', name: 'play', component: Play, props: true }
    ]
});

router.beforeEach(async (to: Route, from: Route, next: any) => {
    if (to.fullPath.startsWith('/login')) {
        return next()
    }
    if (to.fullPath.startsWith('/play')) {
        return next()
    }

    const apolloClient = createProvider().defaultClient

    
    if (to.fullPath.startsWith('/')) {
        try {
            const res = await apolloClient.query({
                query: gql`{
                    loggedInUser {
                        id
                    }
                }`
            })

            if (!res.data.loggedInUser) {
                return next({ name: 'login', query: { from: to.path } })
            }
            const userDetails = await apolloClient.query({
                query: USER_DETAILS,
                variables: {
                    id: res.data.loggedInUser.id
                }
            })
            // user
            store.commit('setUser', userDetails.data.user);

            return next()
        } catch (e) {
            // localStorage.removeItem('apollo-token')
            return next({ name: 'login', query: { from: to.path } })
        }
    }
    return next()
})

export default router
