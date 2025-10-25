export const runtime = 'nodejs'

// Keep the latest uploaded image in memory (lifetime of this server process)
let latest: { data: Uint8Array; contentType: string } | null = null

export async function GET() {
  if (!latest) {
    return new Response('No image uploaded yet', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
  // Copy into a standard ArrayBuffer to satisfy BodyInit typing
  const ab = new ArrayBuffer(latest.data.byteLength)
  new Uint8Array(ab).set(latest.data)
  return new Response(ab, {
    status: 200,
    headers: {
      'Content-Type': latest.contentType || 'image/jpeg',
      'Cache-Control': 'no-store',
    },
  })
}

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.startsWith('multipart/form-data')) {
    return new Response(JSON.stringify({ error: 'Content-Type must be multipart/form-data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid multipart body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const image = form.get('image')
  if (!(image instanceof File)) {
    return new Response(JSON.stringify({ error: "Missing file field 'image'" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const arrayBuffer = await image.arrayBuffer()
  latest = {
    data: new Uint8Array(arrayBuffer),
    contentType: image.type || 'image/jpeg',
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
