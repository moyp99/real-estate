import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'

type Message = Database['public']['Tables']['messages']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface MessageWithProfiles extends Message {
  sender?: Profile
  recipient?: Profile
}

export const messagesService = {
  async getMessages(userId: string): Promise<MessageWithProfiles[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (
          id,
          name,
          email,
          photo_url
        ),
        recipient:profiles!messages_recipient_id_fkey (
          id,
          name,
          email,
          photo_url
        )
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    subject?: string,
    propertyId?: number
  ) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        subject,
        property_id: propertyId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async markAsRead(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)

    if (error) throw error
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return count || 0
  },

  async getConversation(userId: string, otherUserId: string): Promise<MessageWithProfiles[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (
          id,
          name,
          email,
          photo_url
        ),
        recipient:profiles!messages_recipient_id_fkey (
          id,
          name,
          email,
          photo_url
        )
      `)
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }
}