import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
    auth: { persistSession: false }
  })

  // lire le body (nom, prix)
  const body = await readBody(event)
  const nom = body?.nom

  // vérifier que nom est un texte non vide → sinon erreur 400
  
  if (typeof nom !== 'string' || nom.trim() === '') {
    throw createError({ statusCode: 400, statusMessage: 'Nom invalide' })
  }
  const nomPropre = nom.trim()

  // lire le tarifs existants dans la base
  const { data: tarifs, error: erreurTarifs } = await supabase
    .from('tarifs')
    .select('nom, id')
    .eq('nom', nomPropre)

  if (erreurTarifs) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de lire les tarifs' })
  }

  if(!tarifs.length) {
    throw createError({ statusCode: 404, statusMessage: 'Billet non existant' })
  }


  // supprimer le nouveau tarif (nom, prix)
  const { data, error } = await supabase
    .from('tarifs')
    .delete()
    .eq('id', tarifs[0].id)
    .select()
    .single()

  // si erreur → erreur 500
  if (error) {
    throw createError({ statusCode: 500, statusMessage: "Impossible d'ajouter le tarif" })
  }

  // renvoyer le tarif créé
  return data
})