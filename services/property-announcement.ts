import ENDPOINTS from "@/lib/endpoints"
import PropertyAnnouncement from "@/types/property-announcement"

export async function Register(data: Partial<PropertyAnnouncement>) {
  const response = await fetch(ENDPOINTS.registerPropertyAnnouncement, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return response
}