import { useState } from 'react'
import Scene from './Scene.jsx'
import Navbar from './Navbar.jsx'
import { CO, SERVICES, CLIENTS } from './data.js'

const Grid = ({ c, className = '', children }) => (
  <div className={'grid ' + className} style={{ '--xs': c[0], '--sm': c[1], '--md': c[2], '--lg': c[3] }}>{children}</div>
)
const Title = ({ id, children }) => <div className="dim"><h2 id={id}>{children}</h2><i /></div>

function Contact() {
  const [s, setS] = useState({ status: 'idle', msg: '' })
  async function submit(e) {
    e.preventDefault()
    const f = e.currentTarget
    const data = Object.fromEntries(new FormData(f))
    setS({ status: 'sending', msg: '' })
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/enquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error || 'Could not send. Please call us instead.')
      f.reset(); setS({ status: 'ok', msg: 'Enquiry sent. We will contact you shortly.' })
    } catch (err) { setS({ status: 'err', msg: err.message || 'Could not send. Please call us instead.' }) }
  }
  return (
    <form onSubmit={submit} className="card form" noValidate>
      <Grid c={[1, 1, 2, 2]}>
        <label className="field">Name<input name="name" required maxLength={80} autoComplete="name" /></label>
        <label className="field">Email<input name="email" type="email" required maxLength={120} autoComplete="email" /></label>
        <label className="field">Phone<input name="phone" type="tel" maxLength={20} autoComplete="tel" /></label>
        <label className="field">Company<input name="company" maxLength={120} autoComplete="organization" /></label>
      </Grid>
      <label className="field">Service needed
        <select name="service" defaultValue=""><option value="">Select a service</option>
          {SERVICES.map((x) => <option key={x.t}>{x.t}</option>)}</select></label>
      <label className="field">Project details<textarea name="message" rows={5} required minLength={10} maxLength={2000} /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn p" disabled={s.status === 'sending'}>{s.status === 'sending' ? 'Sending...' : 'Send enquiry'}</button>
      <p role="status" aria-live="polite" className={'note ' + s.status}>{s.msg}</p>
    </form>
  )
}

export default function App() {
  return (
    <>
      <Scene />
      <Navbar />

      <main id="top">
        <section className="hero"><div className="wrap">
          <h1>Mechanical Fabrication  Installation & Commissioning</h1>
          <p>Customized solutions backed by high-level service and after-sale technical support. Serving industry since 2018 from Padappai, Chennai.</p>
          <div className="hero-actions">
            <a className="btn g" href="#services">Explore our services</a>
            <p className="spec">Paint shops, body shops, piping, conveyors, structural steel</p>
          </div>
        </div></section>

        <section className="sec" id="about"><div className="wrap">
          <Title>About us</Title>
          <Grid c={[1, 1, 2, 2]}>
            <div>
              <p>IKON Engineers commenced in 2018 at Padappai, Chennai, Tamil Nadu. We are a sole proprietorship firm providing customized solutions for our products and solutions.</p>
              <p style={{ marginTop: 14 }}>Our high level of service and after-sale technical support has helped us acquire a vast base of clients. In a short span of time, we have sharpened our skills in the relevant domain.</p>
            </div>
            <dl className="card facts">
              <div><dt>Established</dt><dd>2018</dd></div><div><dt>Firm type</dt><dd>Sole proprietorship</dd></div>
              <div><dt>Location</dt><dd>Padappai, Kanchipuram district</dd></div><div><dt>GST number</dt><dd>{CO.gst}</dd></div>
            </dl>
          </Grid>
        </div></section>

        <section className="sec" id="services"><div className="wrap">
          <Title>Our services</Title>
          <Grid c={[1, 1, 2, 3]}>
            {SERVICES.map((x) => (
              <article key={x.t} className={'card' + (x.wide ? ' wide' : '')}>
                {x.imgs && <div className={'pics n' + x.imgs.length}>{x.imgs.map((i) => <img key={i} src={`/img/${i}.jpg`} alt={x.t} loading="lazy" />)}</div>}
                <h3>{x.t}</h3><p>{x.d}</p>
              </article>))}
          </Grid>
        </div></section>

        <section className="sec" id="clients"><div className="wrap">
          <Title>Our clients</Title>
          <Grid c={[2, 3, 4, 5]}>
            {CLIENTS.map(([f, n]) => (
              <div key={f} className="tile">
                <img src={`/img/${f}.png`} alt={n} loading="lazy" />
              </div>
            ))}
          </Grid>
        </div></section>

        <section className="sec" id="contact"><div className="wrap">
          <Title>Contact us</Title>
          <Grid c={[1, 1, 1, 2]}>
            <address className="card facts">
              <div><dt>Address</dt><dd className="address">{CO.address}</dd></div>
              <div><dt>Phone</dt><dd><a href={'tel:+91' + CO.phone}>{CO.phone}</a></dd></div>
              <div><dt>Email</dt><dd><a href={'mailto:' + CO.email}>{CO.email}</a></dd></div>
            </address>
            <Contact />
          </Grid>
        </div></section>
      </main>
      <footer className="foot"><div className="wrap">© {new Date().getFullYear()} {CO.name}. GST {CO.gst}</div></footer>
    </>
  )
}
