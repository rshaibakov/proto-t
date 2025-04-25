<script setup lang="ts">
import { db } from '../db'

db.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: location.origin,
  },
})
</script>

<template>
  <h1>Вход</h1>
</template>
