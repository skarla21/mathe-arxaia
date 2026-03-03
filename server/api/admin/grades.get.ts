import { serverSupabaseService } from '../../utils/supabaseServer'

export default defineEventHandler(async () => {
  // TODO: require admin session
  const supabase = serverSupabaseService()
  const { data, error } = await supabase.from('grades').select('*').order('order', { ascending: true })
  if (error) throw createError({ statusCode: 500, message: error.message })
  return data ?? []
})
