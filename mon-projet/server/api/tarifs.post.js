import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
    auth: { persistSession: false }
  })

  // lire le body (nom, prix)
  const body = await readBody(event)
  const nom = body?.nom
  const prix = Number(body?.prix)

  // vérifier que nom est un texte non vide → sinon erreur 400
  
  if (typeof nom !== 'string' || nom.trim() === '') {
    throw createError({ statusCode: 400, statusMessage: 'Nom invalide' })
  }
  const nomPropre = nom.trim()

  // vérifier que prix est un nombre positif → sinon erreur 400
  if (prix <= 0 || !Number.isFinite(prix)) {
    throw createError({ statusCode: 400, statusMessage: 'Prix invalide' })
  }

  // lire les tarifs existants dans la base
  const { data: tarifs, error: erreurTarifs } = await supabase
    .from('tarifs')
    .select('nom')

  if (erreurTarifs) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de lire les tarifs' })
  }

  // chercher un tarif existant avec le même nom
  const doublon = tarifs.find((t) => t.nom === nomPropre)

  // s'il existe → erreur 400 « Billet déjà existant »
  if (doublon) {
    throw createError({ statusCode: 400, statusMessage: 'Billet déjà existant' })
  }

  // insérer le nouveau tarif (nom, prix)
  const { data, error } = await supabase
    .from('tarifs')
    .insert({ nom: nomPropre, prix })
    .select()
    .single()

  // si erreur → erreur 500
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Impossible d'ajouter le tarif" })
  }

  // renvoyer le tarif créé
  return data
})