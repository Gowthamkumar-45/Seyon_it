import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import {
  seedProjects,
  seedServices,
  seedTestimonials,
  seedStats,
  seedCompany,
  ADMIN_DEFAULT,
} from '@/lib/siteData'

let client
let db
let connecting

async function connectToMongo() {
  if (db) return db
  if (!connecting) {
    connecting = (async () => {
      client = new MongoClient(process.env.MONGO_URL)
      await client.connect()
      const database = client.db(process.env.DB_NAME)
      await seedIfEmpty(database)
      db = database
      return db
    })()
  }
  return connecting
}

async function seedIfEmpty(db) {
  try {
    if ((await db.collection('projects').countDocuments()) === 0) {
      await db.collection('projects').insertMany(
        seedProjects.map((p) => ({ id: uuidv4(), ...p, createdAt: new Date() }))
      )
    }
    if ((await db.collection('services').countDocuments()) === 0) {
      await db.collection('services').insertMany(
        seedServices.map((s) => ({ id: uuidv4(), ...s }))
      )
    }
    if ((await db.collection('testimonials').countDocuments()) === 0) {
      await db.collection('testimonials').insertMany(
        seedTestimonials.map((t) => ({ id: uuidv4(), ...t }))
      )
    }
    if ((await db.collection('settings').countDocuments({ key: 'stats' })) === 0) {
      await db.collection('settings').insertOne({ key: 'stats', value: seedStats })
    }
    if ((await db.collection('settings').countDocuments({ key: 'company' })) === 0) {
      await db.collection('settings').insertOne({ key: 'company', value: seedCompany })
    }
    if ((await db.collection('admins').countDocuments()) === 0) {
      const hash = await bcrypt.hash(ADMIN_DEFAULT.password, 10)
      await db.collection('admins').insertOne({
        id: uuidv4(),
        email: ADMIN_DEFAULT.email.toLowerCase(),
        passwordHash: hash,
        createdAt: new Date(),
      })
    }
  } catch (e) {
    console.error('Seed error', e)
  }
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

const clean = (docs) => docs.map(({ _id, ...rest }) => rest)
const cleanOne = (doc) => {
  if (!doc) return doc
  const { _id, ...rest } = doc
  return rest
}

async function requireAuth(db, request) {
  const header = request.headers.get('authorization') || ''
  const token = header.replace('Bearer ', '').trim()
  if (!token) return null
  const session = await db.collection('sessions').findOne({ token })
  if (!session) return null
  return session
}

async function callClaude(system, messages, maxTokens = 1024) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { error: 'AI is not configured. Add ANTHROPIC_API_KEY.', status: 503 }
  }
  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic({ apiKey })
    const model = process.env.CLAUDE_MODEL || 'claude-sonnet-5'
    const result = await anthropic.messages.create({ model, max_tokens: maxTokens, system, messages })
    const reply = result.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n')
    return { reply }
  } catch (e) {
    console.error('Claude error', e?.message || e)
    return { error: 'AI request failed. Check the API key/model.', status: 502 }
  }
}

async function siteContext(db) {
  const projects = clean(await db.collection('projects').find({}).toArray())
  const services = clean(await db.collection('services').find({}).toArray())
  const company = (await db.collection('settings').findOne({ key: 'company' }))?.value || {}
  const projText = projects
    .map((p) => `- ${p.name} (${p.category}${p.client ? ', ' + p.client : ''}): ${p.tagline} Features: ${(p.features || []).join('; ')}.`)
    .join('\n')
  const svcText = services.map((s) => `- ${s.title}: ${s.description}`).join('\n')
  return `Company: ${company.name} (${company.address}). ${company.tagline}\n\nSERVICES:\n${svcText}\n\nPROJECTS:\n${projText}`
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Seyon IT API' }))
    }

    // ---------- PUBLIC ----------
    if (route === '/projects' && method === 'GET') {
      const docs = await db.collection('projects').find({}).sort({ order: 1 }).toArray()
      return handleCORS(NextResponse.json(clean(docs)))
    }
    if (route.startsWith('/projects/') && method === 'GET') {
      const slug = path[1]
      const doc = await db.collection('projects').findOne({ slug })
      if (!doc) return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
      return handleCORS(NextResponse.json(cleanOne(doc)))
    }
    if (route === '/services' && method === 'GET') {
      const docs = await db.collection('services').find({}).sort({ order: 1 }).toArray()
      return handleCORS(NextResponse.json(clean(docs)))
    }
    if (route === '/testimonials' && method === 'GET') {
      const docs = await db.collection('testimonials').find({}).sort({ order: 1 }).toArray()
      return handleCORS(NextResponse.json(clean(docs)))
    }
    if (route === '/stats' && method === 'GET') {
      const doc = await db.collection('settings').findOne({ key: 'stats' })
      return handleCORS(NextResponse.json(doc?.value || []))
    }
    if (route === '/company' && method === 'GET') {
      const doc = await db.collection('settings').findOne({ key: 'company' })
      return handleCORS(NextResponse.json(doc?.value || {}))
    }

    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.email || !body.message) {
        return handleCORS(NextResponse.json({ error: 'name, email, message required' }, { status: 400 }))
      }
      const msg = {
        id: uuidv4(),
        name: body.name,
        organisation: body.organisation || '',
        phone: body.phone || '',
        email: body.email,
        message: body.message,
        read: false,
        createdAt: new Date(),
      }
      await db.collection('messages').insertOne(msg)
      return handleCORS(NextResponse.json(cleanOne(msg)))
    }

    if (route === '/newsletter' && method === 'POST') {
      const body = await request.json()
      if (!body.email) return handleCORS(NextResponse.json({ error: 'email required' }, { status: 400 }))
      await db.collection('newsletter').updateOne(
        { email: body.email },
        { $set: { email: body.email, createdAt: new Date() } },
        { upsert: true }
      )
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ---------- AI ----------
    if (route === '/ai/chat' && method === 'POST') {
      const body = await request.json()
      const messages = Array.isArray(body.messages) ? body.messages : []
      if (messages.length === 0) return handleCORS(NextResponse.json({ error: 'messages required' }, { status: 400 }))
      const ctx = await siteContext(db)
      const system = `You are "Seyon AI", the friendly assistant for the website of Seyon IT Solutions Pvt Ltd. Answer visitor questions about the company, its services and projects using ONLY the context below. Be concise, warm and professional. If asked something outside the context, invite them to use the contact form. Do not invent external website links.\n\nCONTEXT:\n${ctx}`
      const r = await callClaude(system, messages, 700)
      if (r.error) return handleCORS(NextResponse.json({ error: r.error }, { status: r.status || 500 }))
      return handleCORS(NextResponse.json({ reply: r.reply }))
    }

    if (route === '/ai/polish' && method === 'POST') {
      const body = await request.json()
      const text = (body.text || '').toString().slice(0, 5000)
      if (!text) return handleCORS(NextResponse.json({ error: 'text required' }, { status: 400 }))
      const system = 'You help a visitor polish a project enquiry message to an IT company. Rewrite the message to be clear, professional and concise while keeping their intent and details. Return only the improved message, no preamble.'
      const r = await callClaude(system, [{ role: 'user', content: text }], 600)
      if (r.error) return handleCORS(NextResponse.json({ error: r.error }, { status: r.status || 500 }))
      return handleCORS(NextResponse.json({ reply: r.reply }))
    }

    // ---------- ADMIN AUTH ----------
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      const email = (body.email || '').toLowerCase().trim()
      const admin = await db.collection('admins').findOne({ email })
      if (!admin || !(await bcrypt.compare(body.password || '', admin.passwordHash))) {
        return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
      }
      const token = uuidv4() + uuidv4()
      await db.collection('sessions').insertOne({ token, email, createdAt: new Date() })
      return handleCORS(NextResponse.json({ token, email }))
    }

    if (route === '/admin/logout' && method === 'POST') {
      const header = request.headers.get('authorization') || ''
      const token = header.replace('Bearer ', '').trim()
      if (token) await db.collection('sessions').deleteOne({ token })
      return handleCORS(NextResponse.json({ ok: true }))
    }

    if (route.startsWith('/admin/')) {
      const session = await requireAuth(db, request)
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      if (route === '/admin/me' && method === 'GET') {
        return handleCORS(NextResponse.json({ email: session.email }))
      }

      if (route === '/admin/password' && method === 'POST') {
        const body = await request.json()
        const admin = await db.collection('admins').findOne({ email: session.email })
        if (!admin || !(await bcrypt.compare(body.current || '', admin.passwordHash))) {
          return handleCORS(NextResponse.json({ error: 'Current password is wrong' }, { status: 400 }))
        }
        if (!body.next || body.next.length < 6) {
          return handleCORS(NextResponse.json({ error: 'New password too short' }, { status: 400 }))
        }
        const hash = await bcrypt.hash(body.next, 10)
        await db.collection('admins').updateOne({ email: session.email }, { $set: { passwordHash: hash } })
        return handleCORS(NextResponse.json({ ok: true }))
      }

      if (route === '/admin/overview' && method === 'GET') {
        const projects = await db.collection('projects').find({}).toArray()
        const messages = await db.collection('messages').find({}).sort({ createdAt: -1 }).toArray()
        const byCategory = {}
        projects.forEach((p) => { byCategory[p.category] = (byCategory[p.category] || 0) + 1 })
        const unread = messages.filter((m) => !m.read).length
        return handleCORS(NextResponse.json({
          counts: {
            projects: projects.length,
            services: await db.collection('services').countDocuments(),
            testimonials: await db.collection('testimonials').countDocuments(),
            messages: messages.length,
            unread,
            subscribers: await db.collection('newsletter').countDocuments(),
          },
          byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
          recentMessages: clean(messages.slice(0, 5)),
        }))
      }

      if (route === '/admin/projects' && method === 'POST') {
        const body = await request.json()
        const doc = {
          id: uuidv4(),
          slug: (body.slug || body.name || uuidv4()).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: body.name || 'Untitled',
          category: body.category || 'Government',
          client: body.client || '',
          industry: body.industry || '',
          tagline: body.tagline || '',
          description: body.description || '',
          features: Array.isArray(body.features) ? body.features : [],
          featured: !!body.featured,
          order: body.order ?? 99,
          createdAt: new Date(),
        }
        await db.collection('projects').insertOne(doc)
        return handleCORS(NextResponse.json(cleanOne(doc)))
      }
      if (route.startsWith('/admin/projects/') && method === 'PUT') {
        const id = path[2]
        const body = await request.json()
        delete body._id; delete body.id
        await db.collection('projects').updateOne({ id }, { $set: body })
        return handleCORS(NextResponse.json(cleanOne(await db.collection('projects').findOne({ id }))))
      }
      if (route.startsWith('/admin/projects/') && method === 'DELETE') {
        await db.collection('projects').deleteOne({ id: path[2] })
        return handleCORS(NextResponse.json({ ok: true }))
      }

      if (route === '/admin/services' && method === 'POST') {
        const body = await request.json()
        const doc = { id: uuidv4(), title: body.title || '', icon: body.icon || 'Globe', description: body.description || '', order: body.order ?? 99 }
        await db.collection('services').insertOne(doc)
        return handleCORS(NextResponse.json(cleanOne(doc)))
      }
      if (route.startsWith('/admin/services/') && method === 'PUT') {
        const id = path[2]; const body = await request.json(); delete body._id; delete body.id
        await db.collection('services').updateOne({ id }, { $set: body })
        return handleCORS(NextResponse.json(cleanOne(await db.collection('services').findOne({ id }))))
      }
      if (route.startsWith('/admin/services/') && method === 'DELETE') {
        await db.collection('services').deleteOne({ id: path[2] })
        return handleCORS(NextResponse.json({ ok: true }))
      }

      if (route === '/admin/testimonials' && method === 'POST') {
        const body = await request.json()
        const doc = { id: uuidv4(), quote: body.quote || '', author: body.author || '', role: body.role || '', order: body.order ?? 99 }
        await db.collection('testimonials').insertOne(doc)
        return handleCORS(NextResponse.json(cleanOne(doc)))
      }
      if (route.startsWith('/admin/testimonials/') && method === 'PUT') {
        const id = path[2]; const body = await request.json(); delete body._id; delete body.id
        await db.collection('testimonials').updateOne({ id }, { $set: body })
        return handleCORS(NextResponse.json(cleanOne(await db.collection('testimonials').findOne({ id }))))
      }
      if (route.startsWith('/admin/testimonials/') && method === 'DELETE') {
        await db.collection('testimonials').deleteOne({ id: path[2] })
        return handleCORS(NextResponse.json({ ok: true }))
      }

      if (route === '/admin/stats' && method === 'PUT') {
        const body = await request.json()
        await db.collection('settings').updateOne({ key: 'stats' }, { $set: { value: body.value } }, { upsert: true })
        return handleCORS(NextResponse.json({ ok: true }))
      }
      if (route === '/admin/company' && method === 'PUT') {
        const body = await request.json()
        await db.collection('settings').updateOne({ key: 'company' }, { $set: { value: body.value } }, { upsert: true })
        return handleCORS(NextResponse.json({ ok: true }))
      }

      if (route === '/admin/messages' && method === 'GET') {
        const docs = await db.collection('messages').find({}).sort({ createdAt: -1 }).toArray()
        return handleCORS(NextResponse.json(clean(docs)))
      }
      if (route.startsWith('/admin/messages/') && method === 'PUT') {
        const id = path[2]; const body = await request.json()
        await db.collection('messages').updateOne({ id }, { $set: { read: !!body.read } })
        return handleCORS(NextResponse.json({ ok: true }))
      }
      if (route.startsWith('/admin/messages/') && method === 'DELETE') {
        await db.collection('messages').deleteOne({ id: path[2] })
        return handleCORS(NextResponse.json({ ok: true }))
      }

      if (route === '/admin/ai/project' && method === 'POST') {
        const body = await request.json()
        const system = 'You are a copywriter for an IT company that builds government, healthcare, e-commerce and mobile projects. Given a project name, category and rough notes, return a compact JSON object with keys: tagline (one sentence), description (2-3 sentences), features (array of 5-6 short strings). Return ONLY valid JSON, no markdown.'
        const prompt = `Name: ${body.name}\nCategory: ${body.category}\nClient/Industry: ${body.client || body.industry || ''}\nNotes: ${body.notes || body.description || ''}`
        const r = await callClaude(system, [{ role: 'user', content: prompt }], 800)
        if (r.error) return handleCORS(NextResponse.json({ error: r.error }, { status: r.status || 500 }))
        let parsed = null
        try { parsed = JSON.parse(r.reply.replace(/```json|```/g, '').trim()) } catch (e) {}
        return handleCORS(NextResponse.json({ raw: r.reply, parsed }))
      }

      if (route === '/admin/ai/reply' && method === 'POST') {
        const body = await request.json()
        const system = 'You help an IT company support person. Given a customer enquiry, return a short summary line and a warm, professional draft reply. Format as: SUMMARY: ...\n\nREPLY:\n...'
        const prompt = `From: ${body.name} (${body.organisation || ''})\nMessage: ${body.message}`
        const r = await callClaude(system, [{ role: 'user', content: prompt }], 700)
        if (r.error) return handleCORS(NextResponse.json({ error: r.error }, { status: r.status || 500 }))
        return handleCORS(NextResponse.json({ reply: r.reply }))
      }

      return handleCORS(NextResponse.json({ error: `Admin route ${route} not found` }, { status: 404 }))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
