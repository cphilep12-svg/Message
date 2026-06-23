import { Heart, Cross, Eye, TrendingUp } from 'lucide-react'

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative py-24 sm:py-32 bg-gradient-to-b from-[#1A1A1A] to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/hero-model.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-xs tracking-[0.2em] text-[#D4AF37] mb-2 uppercase">Our Story</p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider">BUILT BY FAITH</h1>
          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto font-serif italic">
            &ldquo;Now faith is the substance of things hoped for, the evidence of things not seen.&rdquo;
            <br />
            <span className="text-[#D4AF37] not-italic text-sm">— Hebrews 11:1</span>
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl tracking-wider mb-6">OUR MISSION</h2>
          <p className="text-white/60 leading-relaxed">
            MESSAGE was born from a simple prayer: &ldquo;Lord, let me wear my faith.&rdquo; What started as a personal
            desire to merge faith and fashion has grown into a movement. Every piece we create carries Scripture.
            Every design starts with prayer. We believe that what you wear can be a witness.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Cross,
              title: 'FAITH FIRST',
              desc: 'Every design begins with prayer and Scripture. We are not just a clothing brand; we are a ministry.',
            },
            {
              icon: Eye,
              title: 'BOLD WITNESS',
              desc: 'Our clothing is designed to start conversations. When someone asks about the verse on your hoodie, that is an open door.',
            },
            {
              icon: Heart,
              title: 'PREMIUM QUALITY',
              desc: 'We use only the finest materials: 450gsm heavyweight cotton, premium embroidery, and meticulous construction.',
            },
            {
              icon: TrendingUp,
              title: 'GROWING MOVEMENT',
              desc: 'From South Africa to the world, the MESSAGE family is growing. Join us in wearing faith boldly.',
            },
          ].map((value) => (
            <div key={value.title} className="bg-[#1A1A1A] p-8 rounded-sm">
              <value.icon className="w-8 h-8 text-[#D4AF37] mb-4" />
              <h3 className="font-display text-lg tracking-wider mb-3">{value.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Design */}
      <div className="bg-[#0A0A0A] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl tracking-wider">THE SIGNATURE HOODIE</h2>
            <p className="mt-2 text-sm text-white/50">Every detail has meaning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="aspect-square bg-[#1A1A1A] rounded-sm overflow-hidden">
              <img src="/images/product-hoodie-bbf.jpg" alt="Signature Hoodie" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              {[
                { label: 'FRONT', desc: 'Large MESSAGE logo in white embroidery with dark stitched border' },
                { label: 'BACK', desc: '"BUILT BY FAITH" in gothic lettering with Hebrews 11:1 in gold' },
                { label: 'LEFT SLEEVE', desc: '"OMMEMA" running vertically from shoulder to wrist in gold' },
                { label: 'RIGHT SLEEVE', desc: '"Never Give Up" from shoulder to wrist in white' },
                { label: 'HOOD TIP', desc: '"I Trust In God" embroidered in gold' },
                { label: 'INSIDE NECK', desc: 'Premium MESSAGE branding with "Find What God Is Saying"' },
              ].map((detail) => (
                <div key={detail.label} className="flex gap-4">
                  <div className="w-1 bg-[#D4AF37] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] tracking-wider text-[#D4AF37] font-semibold">{detail.label}</p>
                    <p className="text-sm text-white/60 mt-0.5">{detail.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
