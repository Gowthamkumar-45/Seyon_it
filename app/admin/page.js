'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import {
  LayoutDashboard, FolderKanban, Wrench, MessageSquareQuote, BarChart3, Inbox, Settings,
  LogOut, Plus, Trash2, Pencil, X, Sparkles, Loader2, Download, Mail, Check, Shield,
} from 'lucide-react'
import { toast } from 'sonner'
import { apiSend, catColor } from '@/lib/api'

const TOKEN_KEY = 'seyon_admin_token'
const CATS = ['Government', 'Healthcare', 'E-commerce', 'Mobile Apps']
const CHART = ['#38bdf8', '#34d399', '#fb7185', '#a78bfa', '#818cf8']

export default function AdminPage() {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState('dashboard')

  useEffect(() => { setToken(localStorage.getItem(TOKEN_KEY)); setReady(true) }, [])
  const logout = async () => {
    try { await apiSend('/admin/logout', 'POST', {}, token) } catch {}
    localStorage.removeItem(TOKEN_KEY); setToken(null)
  }
  const onLogin = (t) => { localStorage.setItem(TOKEN_KEY, t); setToken(t) }

  if (!ready) return null
  if (!token) return <Login onLogin={onLogin} />

  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'stats', label: 'Stats & Company', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: Inbox },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="dark min-h-screen bg-background text-foreground flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border/60 p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-display font-bold">S</span>
          <span className="font-display font-semibold">Seyon Admin</span>
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${tab === n.id ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10"><LogOut size={18} /> Logout</button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-20 glass-strong border-b border-border/60 p-3 flex gap-2 overflow-x-auto noise-hide">
          {nav.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${tab === n.id ? 'bg-white/10' : 'text-muted-foreground'}`}>{n.label}</button>
          ))}
          <button onClick={logout} className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-destructive">Logout</button>
        </header>
        <main className="p-5 md:p-8 max-w-6xl">
          {tab === 'dashboard' && <Dashboard token={token} />}
          {tab === 'projects' && <Projects token={token} />}
          {tab === 'services' && <Services token={token} />}
          {tab === 'testimonials' && <Testimonials token={token} />}
          {tab === 'stats' && <StatsCompany token={token} />}
          {tab === 'messages' && <Messages token={token} />}
          {tab === 'settings' && <SettingsView token={token} />}
        </main>
      </div>
    </div>
  )
}

// ---------- Login ----------
function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@seyonit.com')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true)
    try { const d = await apiSend('/admin/login', 'POST', { email, password }); onLogin(d.token); toast.success('Welcome back') }
    catch { toast.error('Invalid credentials') }
    finally { setBusy(false) }
  }
  return (
    <div className="dark min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_40%,rgba(56,189,248,0.18),transparent_70%)]" />
      <div className="absolute inset-0 grid-fade opacity-40" />
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="relative glass-strong rounded-3xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-display font-bold">S</span><span className="font-display text-lg font-semibold">Seyon Admin</span></div>
        <h1 className="font-display text-2xl font-bold">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your website content.</p>
        <label className="block mb-3"><span className="text-xs text-muted-foreground">Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} className="ainp" /></label>
        <label className="block mb-5"><span className="text-xs text-muted-foreground">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ainp" placeholder="Seyon@2025" /></label>
        <button disabled={busy} className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-medium text-primary-foreground inline-flex items-center justify-center gap-2">{busy && <Loader2 size={16} className="animate-spin" />} Sign in</button>
        <p className="mt-4 text-center text-xs text-muted-foreground">Default: admin@seyonit.com / Seyon@2025</p>
      </motion.form>
      <style jsx global>{`.ainp{width:100%;margin-top:0.35rem;border-radius:0.75rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);padding:0.65rem 0.9rem;font-size:0.9rem;outline:none;color:#fff}.ainp:focus{border-color:hsl(var(--accent))}`}</style>
    </div>
  )
}

function useFetch(path, token, deps = []) {
  const [data, setData] = useState(null)
  const reload = useCallback(() => { apiSend(path, 'GET', null, token).then(setData).catch(() => setData(null)) }, [path, token])
  useEffect(() => { reload() }, deps)
  return [data, reload, setData]
}

// ---------- Dashboard ----------
function Dashboard({ token }) {
  const [ov, reload] = useFetch('/admin/overview', token, [])
  if (!ov) return <Loader />
  const c = ov.counts
  const cards = [
    { label: 'Projects', value: c.projects }, { label: 'Services', value: c.services },
    { label: 'Testimonials', value: c.testimonials }, { label: 'Messages', value: c.messages },
    { label: 'Unread', value: c.unread }, { label: 'Subscribers', value: c.subscribers },
  ]
  return (
    <div>
      <H title="Dashboard" sub="Overview of your website" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((x) => (
          <div key={x.label} className="glass rounded-2xl p-5"><p className="text-3xl font-display font-bold gradient-text">{x.value}</p><p className="text-sm text-muted-foreground mt-1">{x.label}</p></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-5"><h3 className="font-display font-semibold mb-4">Projects by category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={ov.byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{ov.byCategory.map((e, i) => <Cell key={i} fill={CHART[i % CHART.length]} />)}</Pie><Tooltip contentStyle={{ background: '#0b1224', border: '1px solid #22334d', borderRadius: 12 }} /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5"><h3 className="font-display font-semibold mb-4">Recent messages</h3>
          <div className="space-y-3">
            {ov.recentMessages?.length ? ov.recentMessages.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-2"><span className="truncate">{m.name} \u2014 {m.organisation || 'N/A'}</span>{!m.read && <span className="text-xs text-accent">new</span>}</div>
            )) : <p className="text-sm text-muted-foreground">No messages yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Projects ----------
function Projects({ token }) {
  const [items, setItems] = useState(null)
  const [editing, setEditing] = useState(null)
  useEffect(() => { apiSend('/projects', 'GET').then(setItems).catch(() => {}) }, [])
  const refresh = () => apiSend('/projects', 'GET').then(setItems)
  const del = async (id) => { if (!confirm('Delete this project?')) return; await apiSend(`/admin/projects/${id}`, 'DELETE', {}, token); toast.success('Deleted'); refresh() }
  if (!items) return <Loader />
  return (
    <div>
      <H title="Projects" sub="Add, edit and remove portfolio projects" action={<button onClick={() => setEditing({})} className="btn-p"><Plus size={16} /> New project</button>} />
      <div className="grid gap-3">
        {items.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <span className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center font-display font-bold" style={{ background: `${catColor(p.category)}22`, color: catColor(p.category) }}>{p.name?.charAt(0)}</span>
            <div className="min-w-0 flex-1"><p className="font-medium truncate">{p.name} {p.featured && <span className="text-xs text-accent">\u2605</span>}</p><p className="text-xs text-muted-foreground truncate">{p.category} \u00b7 {p.client || p.industry}</p></div>
            <button onClick={() => setEditing(p)} className="icon-btn"><Pencil size={16} /></button>
            <button onClick={() => del(p.id)} className="icon-btn hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <AnimatePresence>{editing && <ProjectModal token={token} project={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh() }} />}</AnimatePresence>
      <Styles />
    </div>
  )
}

function ProjectModal({ token, project, onClose, onSaved }) {
  const [f, setF] = useState({ name: '', category: 'Government', client: '', industry: '', tagline: '', description: '', features: [], featured: false, order: 99, ...project })
  const [featuresText, setFeaturesText] = useState((project.features || []).join('\n'))
  const [busy, setBusy] = useState(false)
  const [ai, setAi] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const save = async () => {
    setBusy(true)
    const payload = { ...f, features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean), order: Number(f.order) || 99 }
    try {
      if (project.id) await apiSend(`/admin/projects/${project.id}`, 'PUT', payload, token)
      else await apiSend('/admin/projects', 'POST', payload, token)
      toast.success('Saved'); onSaved()
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  const generate = async () => {
    if (!f.name) { toast.error('Enter a project name first'); return }
    setAi(true)
    try {
      const d = await apiSend('/admin/ai/project', 'POST', { name: f.name, category: f.category, client: f.client, industry: f.industry, notes: f.description }, token)
      if (d.parsed) { setF((x) => ({ ...x, tagline: d.parsed.tagline || x.tagline, description: d.parsed.description || x.description })); setFeaturesText((d.parsed.features || []).join('\n')); toast.success('Generated with AI') }
      else toast.error('AI returned unexpected format')
    } catch (e) { toast.error(e.message?.includes('not configured') ? 'AI is not switched on yet' : 'AI failed') } finally { setAi(false) }
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="glass-strong rounded-3xl p-6 w-full max-w-2xl my-8">
        <div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl font-bold">{project.id ? 'Edit' : 'New'} project</h3><button onClick={onClose} className="icon-btn"><X size={18} /></button></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <L label="Name"><input value={f.name} onChange={set('name')} className="ainp" /></L>
          <L label="Category"><select value={f.category} onChange={set('category')} className="ainp">{CATS.map((c) => <option key={c} value={c}>{c}</option>)}</select></L>
          <L label="Client"><input value={f.client} onChange={set('client')} className="ainp" /></L>
          <L label="Industry"><input value={f.industry} onChange={set('industry')} className="ainp" /></L>
        </div>
        <div className="flex items-center justify-end mt-3">
          <button onClick={generate} disabled={ai} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs hover:border-accent disabled:opacity-50">{ai ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-accent" />} AI: write copy</button>
        </div>
        <L label="Tagline" className="mt-2"><input value={f.tagline} onChange={set('tagline')} className="ainp" /></L>
        <L label="Description" className="mt-3"><textarea rows={3} value={f.description} onChange={set('description')} className="ainp resize-none" /></L>
        <L label="Features (one per line)" className="mt-3"><textarea rows={5} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className="ainp resize-none" /></L>
        <div className="grid grid-cols-2 gap-3 mt-3 items-end">
          <L label="Order"><input type="number" value={f.order} onChange={set('order')} className="ainp" /></L>
          <label className="flex items-center gap-2 text-sm pb-2"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Featured on home</label>
        </div>
        <div className="flex justify-end gap-2 mt-5"><button onClick={onClose} className="btn-s">Cancel</button><button onClick={save} disabled={busy} className="btn-p">{busy && <Loader2 size={15} className="animate-spin" />} Save</button></div>
        <Styles />
      </motion.div>
    </motion.div>
  )
}

// ---------- Services ----------
function Services({ token }) {
  const [items, setItems] = useState(null)
  const [editing, setEditing] = useState(null)
  const refresh = () => apiSend('/services', 'GET').then(setItems)
  useEffect(() => { refresh() }, [])
  const del = async (id) => { if (!confirm('Delete?')) return; await apiSend(`/admin/services/${id}`, 'DELETE', {}, token); toast.success('Deleted'); refresh() }
  if (!items) return <Loader />
  return (
    <div>
      <H title="Services" sub="Manage services shown on the site" action={<button onClick={() => setEditing({})} className="btn-p"><Plus size={16} /> New service</button>} />
      <div className="grid gap-3">
        {items.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-4 flex items-center gap-4">
            <div className="min-w-0 flex-1"><p className="font-medium">{s.title}</p><p className="text-xs text-muted-foreground truncate">{s.description}</p></div>
            <button onClick={() => setEditing(s)} className="icon-btn"><Pencil size={16} /></button>
            <button onClick={() => del(s.id)} className="icon-btn hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <AnimatePresence>{editing && <SimpleModal title="service" token={token} item={editing} fields={[['title', 'Title', 'text'], ['icon', 'Icon (lucide name e.g. Globe)', 'text'], ['description', 'Description', 'textarea'], ['order', 'Order', 'number']]} base="/admin/services" onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh() }} />}</AnimatePresence>
      <Styles />
    </div>
  )
}

// ---------- Testimonials ----------
function Testimonials({ token }) {
  const [items, setItems] = useState(null)
  const [editing, setEditing] = useState(null)
  const refresh = () => apiSend('/testimonials', 'GET').then(setItems)
  useEffect(() => { refresh() }, [])
  const del = async (id) => { if (!confirm('Delete?')) return; await apiSend(`/admin/testimonials/${id}`, 'DELETE', {}, token); toast.success('Deleted'); refresh() }
  if (!items) return <Loader />
  return (
    <div>
      <H title="Testimonials" sub="Client quotes shown on the home page" action={<button onClick={() => setEditing({})} className="btn-p"><Plus size={16} /> New testimonial</button>} />
      <div className="grid gap-3">
        {items.map((t) => (
          <div key={t.id} className="glass rounded-2xl p-4 flex items-start gap-4">
            <div className="min-w-0 flex-1"><p className="text-sm">{t.quote}</p><p className="text-xs text-muted-foreground mt-1">{t.author} \u2014 {t.role}</p></div>
            <button onClick={() => setEditing(t)} className="icon-btn"><Pencil size={16} /></button>
            <button onClick={() => del(t.id)} className="icon-btn hover:text-destructive"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <AnimatePresence>{editing && <SimpleModal title="testimonial" token={token} item={editing} fields={[['quote', 'Quote', 'textarea'], ['author', 'Author', 'text'], ['role', 'Role / org', 'text'], ['order', 'Order', 'number']]} base="/admin/testimonials" onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh() }} />}</AnimatePresence>
      <Styles />
    </div>
  )
}

function SimpleModal({ title, token, item, fields, base, onClose, onSaved }) {
  const [f, setF] = useState({ ...item })
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async () => {
    setBusy(true)
    const payload = { ...f }
    if (payload.order !== undefined) payload.order = Number(payload.order) || 99
    try { if (item.id) await apiSend(`${base}/${item.id}`, 'PUT', payload, token); else await apiSend(base, 'POST', payload, token); toast.success('Saved'); onSaved() }
    catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="glass-strong rounded-3xl p-6 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-4"><h3 className="font-display text-xl font-bold">{item.id ? 'Edit' : 'New'} {title}</h3><button onClick={onClose} className="icon-btn"><X size={18} /></button></div>
        {fields.map(([k, label, type]) => (
          <L key={k} label={label} className="mb-3">{type === 'textarea' ? <textarea rows={3} value={f[k] || ''} onChange={set(k)} className="ainp resize-none" /> : <input type={type} value={f[k] ?? ''} onChange={set(k)} className="ainp" />}</L>
        ))}
        <div className="flex justify-end gap-2 mt-4"><button onClick={onClose} className="btn-s">Cancel</button><button onClick={save} disabled={busy} className="btn-p">{busy && <Loader2 size={15} className="animate-spin" />} Save</button></div>
        <Styles />
      </motion.div>
    </motion.div>
  )
}

// ---------- Stats & Company ----------
function StatsCompany({ token }) {
  const [stats, setStats] = useState(null)
  const [company, setCompany] = useState(null)
  useEffect(() => { apiSend('/stats', 'GET').then(setStats); apiSend('/company', 'GET').then(setCompany) }, [])
  const saveStats = async () => { try { await apiSend('/admin/stats', 'PUT', { value: stats.map((s) => ({ ...s, value: Number(s.value) || 0 })) }, token); toast.success('Stats saved') } catch (e) { toast.error(e.message) } }
  const saveCompany = async () => { try { await apiSend('/admin/company', 'PUT', { value: company }, token); toast.success('Company info saved') } catch (e) { toast.error(e.message) } }
  if (!stats || !company) return <Loader />
  return (
    <div>
      <H title="Stats & Company" sub="Numbers and details shown across the site" />
      <div className="glass rounded-2xl p-5 mb-6">
        <h3 className="font-display font-semibold mb-4">Counters</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={s.label} onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className="ainp flex-1" />
              <input value={s.value} onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className="ainp w-20" />
              <input value={s.suffix} onChange={(e) => setStats(stats.map((x, j) => j === i ? { ...x, suffix: e.target.value } : x))} className="ainp w-14" placeholder="+" />
            </div>
          ))}
        </div>
        <button onClick={saveStats} className="btn-p mt-4">Save stats</button>
      </div>
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display font-semibold mb-4">Company info</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[['name', 'Name'], ['tagline', 'Tagline'], ['address', 'Short address'], ['addressLine', 'Full address'], ['email', 'Email'], ['phone', 'Phone']].map(([k, label]) => (
            <L key={k} label={label}><input value={company[k] || ''} onChange={(e) => setCompany({ ...company, [k]: e.target.value })} className="ainp" /></L>
          ))}
        </div>
        <button onClick={saveCompany} className="btn-p mt-4">Save company info</button>
      </div>
      <Styles />
    </div>
  )
}

// ---------- Messages ----------
function Messages({ token }) {
  const [items, setItems] = useState(null)
  const [replyFor, setReplyFor] = useState(null)
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)
  const refresh = () => apiSend('/admin/messages', 'GET', null, token).then(setItems)
  useEffect(() => { refresh() }, [])
  const toggle = async (m) => { await apiSend(`/admin/messages/${m.id}`, 'PUT', { read: !m.read }, token); refresh() }
  const del = async (id) => { if (!confirm('Delete message?')) return; await apiSend(`/admin/messages/${id}`, 'DELETE', {}, token); refresh() }
  const draft = async (m) => { setReplyFor(m.id); setReply(''); setBusy(true); try { const d = await apiSend('/admin/ai/reply', 'POST', { name: m.name, organisation: m.organisation, message: m.message }, token); setReply(d.reply) } catch (e) { setReply(e.message?.includes('not configured') ? 'AI is not switched on yet.' : 'AI failed') } finally { setBusy(false) } }
  const exportCsv = () => {
    const rows = [['Name', 'Organisation', 'Phone', 'Email', 'Message', 'Date']].concat((items || []).map((m) => [m.name, m.organisation, m.phone, m.email, (m.message || '').replace(/\n/g, ' '), new Date(m.createdAt).toLocaleString()]))
    const csv = rows.map((r) => r.map((c) => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url; a.download = 'seyon-messages.csv'; a.click()
  }
  if (!items) return <Loader />
  return (
    <div>
      <H title="Messages" sub="Contact form submissions" action={<button onClick={exportCsv} className="btn-s"><Download size={16} /> Export CSV</button>} />
      <div className="grid gap-3">
        {items.length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
        {items.map((m) => (
          <div key={m.id} className={`glass rounded-2xl p-4 ${!m.read ? 'border-accent/40' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{m.name} {!m.read && <span className="text-xs text-accent ml-1">new</span>}</p>
                <p className="text-xs text-muted-foreground">{m.organisation} \u00b7 {m.email} \u00b7 {m.phone}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => draft(m)} className="icon-btn" title="AI reply"><Sparkles size={16} className="text-accent" /></button>
                <button onClick={() => toggle(m)} className="icon-btn" title="Toggle read"><Check size={16} /></button>
                <a href={`mailto:${m.email}`} className="icon-btn"><Mail size={16} /></a>
                <button onClick={() => del(m.id)} className="icon-btn hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{m.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{new Date(m.createdAt).toLocaleString()}</p>
            {replyFor === m.id && (
              <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs text-accent mb-1 flex items-center gap-1"><Sparkles size={12} /> AI draft</p>
                {busy ? <p className="text-sm text-muted-foreground">Drafting\u2026</p> : <p className="text-sm whitespace-pre-wrap">{reply}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      <Styles />
    </div>
  )
}

// ---------- Settings ----------
function SettingsView({ token }) {
  const [f, setF] = useState({ current: '', next: '' })
  const [busy, setBusy] = useState(false)
  const save = async () => { setBusy(true); try { await apiSend('/admin/password', 'POST', f, token); toast.success('Password changed'); setF({ current: '', next: '' }) } catch (e) { toast.error(e.message) } finally { setBusy(false) } }
  return (
    <div>
      <H title="Settings" sub="Manage your admin account" />
      <div className="glass rounded-2xl p-6 max-w-md">
        <div className="flex items-center gap-2 mb-4 text-accent"><Shield size={18} /><span className="font-display font-semibold text-foreground">Change password</span></div>
        <L label="Current password" className="mb-3"><input type="password" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} className="ainp" /></L>
        <L label="New password (min 6 chars)" className="mb-4"><input type="password" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} className="ainp" /></L>
        <button onClick={save} disabled={busy} className="btn-p">{busy && <Loader2 size={15} className="animate-spin" />} Update password</button>
      </div>
      <Styles />
    </div>
  )
}

// ---------- shared ----------
function H({ title, sub, action }) {
  return (<div className="flex items-start justify-between gap-4 mb-6"><div><h1 className="font-display text-2xl md:text-3xl font-bold">{title}</h1><p className="text-sm text-muted-foreground mt-1">{sub}</p></div>{action}</div>)
}
function L({ label, children, className = '' }) { return (<label className={`block ${className}`}><span className="text-xs text-muted-foreground">{label}</span>{children}</label>) }
function Loader() { return <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="animate-spin" /></div> }
function Styles() {
  return <style jsx global>{`.ainp{width:100%;margin-top:0.35rem;border-radius:0.75rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);padding:0.6rem 0.85rem;font-size:0.9rem;outline:none;color:#fff}.ainp:focus{border-color:hsl(var(--accent))}.btn-p{display:inline-flex;align-items:center;gap:0.4rem;border-radius:9999px;background:linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)));color:hsl(var(--primary-foreground));padding:0.55rem 1.2rem;font-size:0.85rem;font-weight:500}.btn-s{display:inline-flex;align-items:center;gap:0.4rem;border-radius:9999px;border:1px solid rgba(255,255,255,0.15);padding:0.55rem 1.2rem;font-size:0.85rem;color:#fff}.icon-btn{display:inline-flex;height:2.2rem;width:2.2rem;align-items:center;justify-content:center;border-radius:0.6rem;color:#94a3b8}.icon-btn:hover{background:rgba(255,255,255,0.06);color:#fff}`}</style>
}
