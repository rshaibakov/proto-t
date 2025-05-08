<script setup lang="ts">
import { api } from '../api/client'

api.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: location.origin,
  },
})
</script>

<template>
  <h1>Вход</h1>
</template>
