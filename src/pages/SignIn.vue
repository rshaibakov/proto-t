<script setup lang="ts">
import { db } from '../db'

db.auth.signInWithOAuth({
  provider: 'google'
})
</script>

<template>
  <h1>Вход</h1>
</template>
