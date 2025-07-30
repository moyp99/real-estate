import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'

type Tour = Database['public']['Tables']['tours']['Row']

export const toursService = {
  async scheduleTour(
    propertyId: number,
    userId: string,
    agentId: string,
    date: string,
    time: string,
    notes?: string
  ) {
    const { data, error } = await supabase
      .from('tours')
      .insert({
        property_id: propertyId,
        user_id: userId,
        agent_id: agentId,
        scheduled_date: date,
        scheduled_time: time,
        notes,
        status: 'scheduled'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserTours(userId: string): Promise<Tour[]> {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getAgentTours(agentId: string): Promise<Tour[]> {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('agent_id', agentId)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })

    if (error) throw error
    return data || []
  },

  async updateTourStatus(tourId: string, status: string) {
    const { error } = await supabase
      .from('tours')
      .update({ status })
      .eq('id', tourId)

    if (error) throw error
  },

  async cancelTour(tourId: string) {
    await this.updateTourStatus(tourId, 'cancelled')
  }
}