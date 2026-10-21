<script setup>
    const props = defineProps({
    nom: String,
    prix: Number,
    quantite: Number
    })
    const emit = defineEmits(['ajouter', 'retirer'])
</script>

<template>
    <div class="billet">
        <h3>{{ nom }}</h3>
        <p>{{ prix }} €</p>
        <p>Quantité : {{ quantite }}</p>

        <Bouton @clique="emit('ajouter')">Ajouter des billets</Bouton>
        <Bouton @clique="emit('retirer')">Retirer des billets</Bouton>
    </div>
</template>

<style scoped>
    .billet {
        border: 2px dotted #C9C9C9;
        padding: 16px;
        border-radius: 12px;
        background-color: #f9f9f9;
    }
</style>