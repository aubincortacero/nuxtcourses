import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
    auth: { persistSession: false }
  })

  const body = await readBody(event)

  // 1. Vérifier que les données ont la bonne forme
  if (!Array.isArray(body?.billets)) {
    throw createError({ statusCode: 400, statusMessage: 'Données invalides' })
  }

  // 2. Lire les VRAIS tarifs dans la base
  const { data: tarifs, error: erreurTarifs } = await supabase
    .from('tarifs')
    .select('nom, prix')

  if (erreurTarifs) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de lire les tarifs' })
  }

  // 3. Tout recalculer côté serveur
  let totalBillets = 0
  let prixTotal = 0
  const billets = []

  for (const demande of body.billets) {
    const tarif = tarifs.find((t) => t.nom === demande.nom)
    const quantite = Number(demande.quantite)

    if (!tarif || !Number.isInteger(quantite) || quantite < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Billet invalide' })
    }

    if (quantite === 0) continue

    totalBillets += quantite
    prixTotal += tarif.prix * quantite
    billets.push({ nom: tarif.nom, quantite })
  }

  if (totalBillets === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun billet sélectionné' })
  }

  if (totalBillets >= 5) {
    prixTotal = prixTotal * 0.9
  }

  prixTotal = Math.round(prixTotal * 100) / 100

  // 4. Enregistrer les valeurs CALCULÉES par le serveur
  const { data, error } = await supabase
    .from('reservations')
    .insert({ billets, total_billets: totalBillets, prix_total: prixTotal })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Impossible d'enregistrer la réservation" })
  }

  return data
})