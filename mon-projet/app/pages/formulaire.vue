<script setup>
const prenom = ref('')
const age = ref(null)


const statut = computed(() => {
    if (age.value < 0) {
  return 'invalide'
}
  if (age.value < 18) {
    return 'mineur'
  } else {
    return 'majeur'
  }

})
</script>

<template>
  <section>
     <input v-model="prenom" placeholder="Votre prénom" />
    <input type="number" v-model="age" placeholder="Votre âge" />
    <p v-if="prenom">Bonjour {{ prenom }}, vous avez {{ age }} ans</p>
    <p v-else>Veuillez entrer votre prénom et votre âge</p>
    <p v-if="prenom">Vous êtes {{ statut }}</p>
    <button @click="prenom = ''; age = 0">Effacer</button>
  </section>
 
</template>