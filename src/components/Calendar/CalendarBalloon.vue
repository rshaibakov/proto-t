
<template>
  <div
    class="balloon"
    :data-type="type"
    aria-hidden="true"
  >
    <StartIcon v-if="type === 'start'" class="icon" />
    <FinishIcon v-if="type === 'finish'" class="icon" />
  </div>
</template>

<script setup lang="ts">
import StartIcon from '../../assets/icons/rocket_launch.svg?component'
import FinishIcon from '../../assets/icons/sports_score.svg?component'

type TBalloonProps = {
  type?: 'start' | 'finish'
}

defineProps<TBalloonProps>()
</script>

<style scoped>
.balloon {
  container: balloon / inline-size;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  aspect-ratio: 1 / 1;
  background-color: var(--pico-color-slate-700);
  color: var(--pico-color-slate-100);
  border-radius: var(--border-radius-round);
}

.balloon:is([data-type="start"]) {
  width: 100%;
  background: linear-gradient(45deg, #1656c7,#994ee0,#fd18dc);
}

.balloon:is([data-type="finish"]) {
  width: 100%;
  background: linear-gradient(45deg, #caa24b,#d8586e,#6950ae);
}

.icon {
  width: 60cqw;
}
</style>