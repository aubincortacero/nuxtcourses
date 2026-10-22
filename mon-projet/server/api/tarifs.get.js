import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseSecretKey, {
    auth: { persistSession: false }
  })

  const { data, error } = await supabase
    .from('tarifs')
    .select('nom, prix')
    .order('id')

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de lire les tarifs' })
  }

  return data
})