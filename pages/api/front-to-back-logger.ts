// pages/api/log.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const body = req.body

  // Aqui já está no servidor. console.error vai para o log do processo
  console.error('FRONTEND_ERROR', body)

  res.status(200).json({ ok: true })
}
