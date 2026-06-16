import ENDPOINTS from "@/lib/endpoints"
import Lead from "@/types/lead"

export async function Register(data: Partial<Lead>) {
  const response = await fetch(ENDPOINTS.insertLead, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return response
}