<template>
  <div class="d-flex flex-column align-center justify-center main-container flex-grow-1">
    <StartGame @click="gameRunning = true" v-if="!gameRunning" />
    <GameContainer v-else />
  </div>
</template>

<script>
import StartGame from './StartGame';
import GameContainer from './GameContainer';

export default {
    name: 'Main',
    components: {
        StartGame,
        GameContainer
    },

    data: () => ({
        gameRunning: false
    }),
}
</script>

<style scoped>
.main-container {
  height: 100%;
}
</style>