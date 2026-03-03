import { serverSupabaseService } from '../../utils/supabaseServer'

export default defineEventHandler(async () => {
  const supabase = serverSupabaseService()
  const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
  if (error) throw createError({ statusCode: 500, message: error.message })
  return data ?? []
})
