export default defineEventHandler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return [
    { nom: 'Adulte', prix: 12 },
    { nom: 'Enfant', prix: 6 },
    { nom: 'Étudiant', prix: 8 }
  ]
})