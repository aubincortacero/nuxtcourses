<script setup>
const emit = defineEmits(['clique'])
</script>

<template>
  <button @click="emit('clique')"><slot></slot></button>
</template>