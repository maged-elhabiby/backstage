'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const SHOWCASE_CHARACTERS = [
  { src: '/characters/firefighter/Firefighter_breathing-idle_south.gif', name: 'The Firefighter', line: '"The client email has to go out NOW."', color: '#f87171' },
  { src: '/characters/wizard/wizard_breathing-idle_south.gif', name: 'The Wizard', line: '"There\'s a spell for this pattern."', color: '#a78bfa' },
  { src: '/characters/doctor/Doctor_breathing-idle_south.gif', name: 'The Doctor', line: '"You haven\'t eaten in 8 hours."', color: '#86efac' },
  { src: '/characters/superhero/Superhero_breathing-idle_south.gif', name: 'The Superhero', line: '"People are counting on us."', color: '#fbbf24' },
  { src: '/characters/astronaut/Astronaut_breathing-idle_south.gif', name: 'The Astronaut', line: '"From orbit, this is one pixel."', color: '#7dd3fc' },
]

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center top, rgba(192,132,252,0.1) 0%, #0c0b14 60%)' }}>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-8"
        >
          <h1
            className="text-6xl md:text-7xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--accent-warm)' }}
          >
            Your brain isn&apos;t broken.
            <br />
            <span style={{ color: 'var(--primary)' }}>It&apos;s in conflict.</span>
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            When you&apos;re overwhelmed, it&apos;s not a sorting problem — it&apos;s a conflict problem.
            Different parts of you are fighting for control. This app lets them argue it out.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 rounded-2xl font-bold text-lg cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                  color: '#0c0b14',
                  boxShadow: '0 0 40px rgba(192,132,252,0.3)',
                }}
              >
                My brain is loud
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Animated characters walking in */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 flex items-end gap-4 md:gap-8"
        >
          {SHOWCASE_CHARACTERS.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Image
                src={char.src}
                alt={char.name}
                width={100}
                height={100}
                unoptimized
                className="md:w-[120px] md:h-[120px]"
                style={{ imageRendering: 'pixelated' }}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            How it works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Brain dump',
                desc: 'Hit "My brain is loud" and dump everything: tasks, worries, the messy honest version.',
                color: 'var(--primary)',
              },
              {
                step: '02',
                title: 'Characters argue',
                desc: 'Your inner voices become characters on a stage. They each say their piece — urgency, exhaustion, perfectionism.',
                color: 'var(--accent-warm)',
              },
              {
                step: '03',
                title: 'Moderator resolves',
                desc: 'An AI moderator steps in: what each voice is protecting, who\'s overreacting, and what one next move respects reality.',
                color: 'var(--success)',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl p-6 space-y-3"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: item.color }}>
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Cast */}
      <section className="py-24 px-4" style={{ background: 'rgba(192,132,252,0.03)' }}>
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            Meet the cast
          </motion.h2>
          <p className="text-center text-base max-w-xl mx-auto" style={{ color: 'var(--text-dim)' }}>
            Your inner voices become animated characters. Over time, the app learns your recurring cast and spots patterns.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {SHOWCASE_CHARACTERS.map((char, i) => (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-3"
                style={{ maxWidth: 160 }}
              >
                <div
                  className="relative rounded-2xl p-3 mb-1"
                  style={{ background: `${char.color}11`, border: `2px solid ${char.color}44` }}
                >
                  <p className="text-xs italic leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {char.line}
                  </p>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `6px solid ${char.color}44`,
                    }}
                  />
                </div>
                <Image
                  src={char.src}
                  alt={char.name}
                  width={100}
                  height={100}
                  unoptimized
                  style={{ imageRendering: 'pixelated' }}
                />
                <p className="text-sm font-semibold" style={{ color: char.color, fontFamily: 'var(--font-playfair)' }}>
                  {char.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example scene */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text)' }}
          >
            What it feels like
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 space-y-5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              You say: &ldquo;My brain is loud&rdquo;
            </p>

            <div className="space-y-3">
              {[
                { name: 'Firefighter', line: '"The client email must happen now."', color: '#f87171' },
                { name: 'Wizard', line: '"Not without reviewing the deck first. There\'s a better way."', color: '#a78bfa' },
                { name: 'Doctor', line: '"You slept 4 hours. Nobody is doing quality work right now."', color: '#86efac' },
                { name: 'Astronaut', line: '"Send a short holding reply now. Deck later. From up here, that\'s obviously the right call."', color: '#7dd3fc' },
              ].map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: item.color }} />
                  <div>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.name}:</span>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.line}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px" style={{ background: 'var(--border)' }} />

            <div className="rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-warm)' }}>
                The Moderator says
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                <strong>Main conflict:</strong> You&apos;re treating two tasks as one.
                <br />
                <strong>Best move:</strong> Send a 2-sentence holding reply. <strong>Time needed:</strong> 4 minutes.
                <br />
                <strong>Protected outcome:</strong> preserves trust without forcing deep work.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto space-y-6"
        >
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: 'var(--accent-warm)' }}
          >
            Ready to quiet the noise?
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Not another task manager. A conflict-resolution interface for your brain.
          </p>
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block px-10 py-4 rounded-2xl font-bold text-lg cursor-pointer mt-4"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                color: '#0c0b14',
                boxShadow: '0 0 40px rgba(192,132,252,0.3)',
              }}
            >
              Get started
            </motion.div>
          </Link>
        </motion.div>
      </section>

      <footer className="py-8 text-center">
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          Second Brain Theatre — built for the overwhelmed.
        </p>
      </footer>
    </div>
  )
}
