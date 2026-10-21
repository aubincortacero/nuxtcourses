<script setup>
const props = defineProps({
  titre: String,
  prix: Number
})
</script>

<template>
  <div class="card">
    <h3>{{ titre }}</h3>
    <p>{{ prix }} €</p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
}
</style>