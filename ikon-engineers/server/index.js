import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist')
const app = express()
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'self'"], scriptSrc: ["'self'"], connectSrc: ["'self'"], imgSrc: ["'self'", 'data:'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], fontSrc: ['https://fonts.gstatic.com'],
  upgradeInsecureRequests: null } } }))
const clientOrigins = (process.env.CLIENT_ORIGIN || 'https://ikon-engineers-7li5.vercel.app')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)
app.use(cors({ origin: clientOrigins }))
app.use(express.json({ limit: '20kb' }))

const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  phone: { type: String, trim: true, maxlength: 20 },
  company: { type: String, trim: true, maxlength: 120 },
  service: { type: String, trim: true, maxlength: 80 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true }))

const str = (v) => (typeof v === 'string' ? v.trim() : '')
function validate(b = {}) {
  const d = { name: str(b.name), email: str(b.email), phone: str(b.phone), company: str(b.company), service: str(b.service), message: str(b.message) }
  if (d.name.length < 2 || d.name.length > 80) return { error: 'Enter your name (2-80 characters).' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || d.email.length > 120) return { error: 'Enter a valid email address.' }
  if (d.phone && !/^[0-9+\-\s()]{7,20}$/.test(d.phone)) return { error: 'Enter a valid phone number.' }
  if (d.message.length < 10 || d.message.length > 2000) return { error: 'Message must be 10-2000 characters.' }
  if (d.company.length > 120 || d.service.length > 80) return { error: 'Company or service text is too long.' }
  return { d }
}

app.get('/api/health', (_q, r) => r.json({ ok: true }))
app.post('/api/enquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many enquiries. Please try again in a few minutes.' } }), async (req, res) => {
  if (req.body && req.body.website) return res.status(201).json({ ok: true }) // honeypot
  const { d, error } = validate(req.body)
  if (error) return res.status(400).json({ error })
  try { await Enquiry.create(d); res.status(201).json({ ok: true }) }
  catch (e) { console.error(e); res.status(500).json({ error: 'Server error. Please call us instead.' }) }
})
const sha = (s) => crypto.createHash('sha256').update(s).digest()
app.get('/api/enquiries', async (req, res) => {
  if (!process.env.ADMIN_KEY) return res.status(503).json({ error: 'ADMIN_KEY not configured.' })
  if (!crypto.timingSafeEqual(sha(str(req.get('x-admin-key'))), sha(process.env.ADMIN_KEY))) return res.status(401).json({ error: 'Unauthorized' })
  res.json(await Enquiry.find().sort({ createdAt: -1 }).limit(500).lean())
})
app.use('/api', (_q, r) => r.status(404).json({ error: 'Not found' }))

if (fs.existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '7d', index: false }))
  app.get('*', (_q, r) => r.sendFile(path.join(dist, 'index.html')))
}
app.use((e, _q, r, _n) => { console.error(e); r.status(e.status || 500).json({ error: 'Server error' }) })

const port = process.env.PORT || 5000
try {
  const mongoUri = process.env.MONGO_URI
  const mongoUrl = new URL(mongoUri)
  const mongoOptions = mongoUrl.hostname.endsWith('.mongodb.net') && !mongoUrl.searchParams.has('authSource')
    ? { authSource: 'admin' }
    : undefined
  await mongoose.connect(mongoUri, mongoOptions)
  app.listen(port, () => console.log(`IKON server on http://localhost:${port}`))
} catch (e) { console.error('MongoDB connection failed:', e.message); process.exit(1) }
