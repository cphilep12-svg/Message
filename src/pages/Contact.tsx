import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Instagram } from 'lucide-react'
import { trpc } from '@/providers/trpc'

export default function Contact() {
  const submitContact = trpc.contact.submit.useMutation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) return
    submitContact.mutate(form, {
      onSuccess: () => {
        setSent(true)
        setForm({ name: '', email: '', subject: '', message: '' })
      },
    })
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="py-20 sm:py-28 bg-gradient-to-b from-[#1A1A1A] to-black">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">Get in Touch</p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider">CONTACT</h1>
          <p className="mt-4 text-sm text-white/50 max-w-lg mx-auto">
            Have a question, prayer request, or collaboration idea? We would love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl tracking-wider mb-6">LET&apos;S CONNECT</h2>
              <div className="space-y-4">
                <a href="mailto:hello@messagebrand.com" className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-sm hover:bg-[#222] transition-colors">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-xs text-white/40">Email</p>
                    <p className="text-sm">hello@messagebrand.com</p>
                  </div>
                </a>
                <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-sm hover:bg-[#222] transition-colors">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-xs text-white/40">WhatsApp</p>
                    <p className="text-sm">+27 00 000 0000</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-sm">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <p className="text-xs text-white/40">Location</p>
                    <p className="text-sm">South Africa</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg tracking-wider mb-4">FOLLOW US</h3>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center hover:bg-[#D4AF37]/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="bg-[#1A1A1A] rounded p-8 text-center">
                <Send className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="font-display text-xl tracking-wider mb-2">MESSAGE SENT</h3>
                <p className="text-sm text-white/50">Thank you for reaching out. We will get back to you soon.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm text-[#D4AF37] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name *"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject *"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
                <textarea
                  placeholder="Message *"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="w-full py-3.5 bg-[#D4AF37] text-black text-sm font-bold tracking-wider hover:bg-[#C4A030] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitContact.isPending ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
