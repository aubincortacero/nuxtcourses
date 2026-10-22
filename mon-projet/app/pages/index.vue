<script setup>
    const { data: tarifs, status, error } = await useFetch('/api/tarifs', {
      lazy: true,
      deep: true,
      transform: (tarifs) => tarifs.map((tarif) => ({ ...tarif, quantite: 0 }))
    })

    const nouveauBillet = ref({ nom: '', prix: 0 })

  
  const total = computed(() =>{
    let somme = 0
    for (const billet of tarifs.value ?? []) {
      somme += billet.quantite
    }

  return somme
  })

  const estGroupe = computed(() => total.value >= 5)

  const totalPrix = computed(() =>{
    let somme = 0
    for (const billet of tarifs.value ?? []) {
      somme += billet.quantite * billet.prix
    }
    if(estGroupe.value){
      somme = somme * 0.9
    }

  return somme.toFixed(2)
  })


  function ajouter(billet) {
    billet.quantite++
  }

  function retirer(billet) {
    if (billet.quantite > 0) {
      billet.quantite--
    }
  }

  const confirmation = ref(null)
  async function valider() {
    const reservation = await $fetch('/api/reservations', {
      method: 'POST',
      body: {
          billets: tarifs.value.map((billet) => ({
            nom: billet.nom,
            quantite: billet.quantite
          }))
      }
    })

    confirmation.value = reservation
  }

  const insertedBillet = ref(null)
  async function insererNouveauBillet() {
    const insertionBillet = await $fetch('/api/tarifs', {
      method: 'POST',
      body: { nom: nouveauBillet.value.nom, prix: nouveauBillet.value.prix }
    })

    insertedBillet.value = insertionBillet
  }

  const deleteBillet = ref({ nom: '' })
  const deletedBillet = ref(null)
  async function supprimerBillet() {
    const suppressionBillet = await $fetch('/api/suppression', {
      method: 'POST',
      body: { nom: deleteBillet.value.nom }
    })

    deletedBillet.value = suppressionBillet
  }

</script>

<template>
  <section class="grid">
    <h2>Billets de cinéma</h2>
    <template v-if="status === 'pending'">
      <CinemaBilletSkeleton v-for="n in 3" :key="n" />
    </template>
    <p v-else-if="error">Impossible de charger les tarifs.</p>
    <template v-else>
      <CinemaBillet v-for="Billet in tarifs" 
          :key="Billet.nom" 
          :nom="Billet.nom" 
          :prix="Billet.prix" 
          :quantite="Billet.quantite" 
          @ajouter="ajouter(Billet)"
          @retirer="retirer(Billet)"
      /> 
    </template>
    
    <p>Total : {{ total }}</p>
    <p>Total prix : {{ totalPrix }} € <span v-if="estGroupe">(-10%)</span></p>
    <p v-if="estGroupe">Tarif de groupe appliqué</p>
    <p v-else>Pas de tarif de groupe</p>  
    <Bouton @clique="valider" :disabled="total === 0">Valider la réservation</Bouton>

    <p v-if="confirmation">
      ✅ Réservation n°{{ confirmation.id }} enregistrée !
    </p>
    <div class="grid">
      <h2>Ajouter un nouveau billet</h2>
      <input v-model="nouveauBillet.nom" placeholder="Nom du billet" />
      <input v-model.number="nouveauBillet.prix" type="number" placeholder="Prix du billet" />
      <Bouton @clique="insererNouveauBillet">Insérer le nouveau billet</Bouton>
      <input v-model="deleteBillet.nom" placeholder="Nom du billet" />
      <Bouton @clique="supprimerBillet">Supprimer le billet</Bouton>
      <p v-if="insertedBillet">
        ✅ Nouveau billet inséré : {{ insertedBillet.nom }} à {{ insertedBillet.prix }} €
      </p>
            <p v-if="deletedBillet">
        ✅ Billet supprimé : {{ deletedBillet.nom }}
      </p>
    </div>
  </section>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
</style>