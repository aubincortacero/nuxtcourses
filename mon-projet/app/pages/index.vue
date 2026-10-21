<script setup>
    const { data: tarifs, status, error } = await useFetch('/api/tarifs', {
      lazy: true,
      transform: (tarifs) => tarifs.map((tarif) => ({ ...tarif, quantite: 0 }))
    })
  
  const billetsCinema = ref([
    {
      nom: 'Adulte',
      prix: 10,
      quantite: 0
    },
    {
      nom: 'Enfant',
      prix: 6,
      quantite: 0
    },
    {
      nom: 'Etudiant',
      prix: 8,
      quantite: 0
    }
  ])
  const total = computed(() =>{
    let somme = 0
    for (const billet of billetsCinema.value) {
      somme += billet.quantite
    }

  return somme
  })

  const estGroupe = computed(() => total.value >= 5)

  const totalPrix = computed(() =>{
    let somme = 0
    for (const billet of billetsCinema.value) {
      somme += billet.quantite * billet.prix
    }
    if(estGroupe.value){
      somme = somme * 0.9
    }

  return somme.toFixed(2)
  })


  function retirer(billet) {
    if (billet.quantite > 0) {
      billet.quantite--
    }
  }

</script>

<template>
  <section class="grid">
    <h2>Billets de cinéma</h2>
    <CinemaBilletSkeleton v-if="status === 'pending'" v-for="n in 3" :key="n" />
    <p v-else-if="error">Impossible de charger les tarifs.</p>
    <CinemaBillet v-else v-for="Billet in tarifs" 
    :key="Billet.nom" 
    :nom="Billet.nom" 
    :prix="Billet.prix" 
    :quantite="Billet.quantite" 
    @ajouter="Billet.quantite++"
    @retirer="retirer(Billet)"
    /> 
    <p>Total : {{ total }}</p>
    <p>Total prix : {{ totalPrix }} € <span v-if="estGroupe">(-10%)</span></p>
    <p v-if="estGroupe">Tarif de groupe appliqué</p>
    <p v-else>Pas de tarif de groupe</p>  
  </section>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
</style>