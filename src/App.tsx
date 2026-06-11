import { type FocusEvent, type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import Lenis from 'lenis'
import {
  ArrowRight,
  Code2,
  Facebook,
  Instagram,
  Menu,
  MonitorSmartphone,
  SearchCheck,
  Twitter,
} from 'lucide-react'
import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

import { Button } from '@/components/ui/button'

const heroVideo =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4'
const ctaStream =
  'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'

let smoothScrollInstance: Lenis | null = null

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
})

const playMutedVideo = (video: HTMLVideoElement) => {
  video.muted = true
  void video.play().catch(() => undefined)
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#work' },
  { label: 'Contact', href: '#contact-us' },
]

const services = [
  {
    name: 'Websites',
    description: 'Responsive marketing sites built to load quickly, communicate clearly, and convert visitors.',
    icon: MonitorSmartphone,
  },
  {
    name: 'Web Apps',
    description: 'Custom portals, dashboards, and product interfaces with clean React architecture.',
    icon: Code2,
  },
  {
    name: 'Growth Systems',
    description: 'SEO foundations, analytics, landing pages, and performance tuning for measurable growth.',
    icon: SearchCheck,
  },
]

const features = [
  {
    title: 'Strategy First',
    description: 'We clarify the offer, audience, user journeys, and technical scope before a line of code ships.',
  },
  {
    title: 'Polished Interfaces',
    description: 'Every layout is designed for scanning, trust, accessibility, and smooth responsive behavior.',
  },
  {
    title: 'Modern Builds',
    description: 'React, TypeScript, CMS integrations, automation, and maintainable components under the hood.',
  },
  {
    title: 'Launch Support',
    description: 'Performance checks, deployment, tracking, and iteration support after your site goes live.',
  },
]

const workItems = [
  {
    title: 'SaaS Dashboard',
    type: 'Web App',
    image:
      'https://images.pexels.com/photos/7190944/pexels-photo-7190944.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Commerce Redesign',
    type: 'Ecommerce',
    image:
      'https://images.pexels.com/photos/8472488/pexels-photo-8472488.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Startup Launch',
    type: 'Marketing Site',
    image:
      'https://images.pexels.com/photos/7439127/pexels-photo-7439127.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Product System',
    type: 'UX Engineering',
    image:
      'https://images.pexels.com/photos/8472482/pexels-photo-8472482.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

function Logo({ className = 'h-7 w-7', innerClassName = 'h-3 w-3' }) {
  return (
    <span
      className={`${className} inline-flex items-center justify-center rounded-full border-2 border-white`}
      aria-hidden="true"
    >
      <span className={`${innerClassName} rounded-full bg-white`} />
    </span>
  )
}

function Navbar() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [shouldPlaceNavPill, setShouldPlaceNavPill] = useState(true)
  const [navPill, setNavPill] = useState({
    height: 0,
    left: 0,
    opacity: 0,
    top: 0,
    width: 0,
  })
  const isNavPillActive = useRef(false)

  const scrollHome = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)

    if (smoothScrollInstance) {
      smoothScrollInstance.scrollTo(0, {
        duration: 1.05,
        force: true,
        lock: true,
        onComplete: () => window.scrollTo(0, 0),
      })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const moveNavPill = (label: string, event: FocusEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
    const item = event.currentTarget
    const shouldPlaceInstantly = !isNavPillActive.current

    isNavPillActive.current = true
    setHoveredNav(label)
    setShouldPlaceNavPill(shouldPlaceInstantly)
    setNavPill({
      height: item.offsetHeight,
      left: item.offsetLeft,
      opacity: 1,
      top: item.offsetTop,
      width: item.offsetWidth,
    })
  }

  return (
    <header
      className="fixed top-0 z-50 w-full px-8 py-4 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-32 before:bg-gradient-to-b before:from-black/90 before:via-black/45 before:to-transparent before:content-[''] sm:px-10 lg:px-14"
    >
      <nav className="flex w-full items-center justify-between gap-6">
        <a href="#home" className="flex items-center" aria-label="WebDev Studio home" onClick={scrollHome}>
          <span className="text-lg font-semibold uppercase tracking-[0.08em] text-white md:text-xl">WebDev Studio</span>
        </a>

        <div
          className="relative hidden items-center gap-3 rounded-full px-2 py-2 text-base lg:flex"
          onMouseLeave={() => {
            isNavPillActive.current = false
            setHoveredNav(null)
            setNavPill((pill) => ({ ...pill, opacity: 0 }))
          }}
        >
          <motion.span
            className="pointer-events-none absolute z-0 rounded-full bg-white"
            animate={navPill}
            onAnimationComplete={() => setShouldPlaceNavPill(false)}
            transition={
              shouldPlaceNavPill
                ? { duration: 0 }
                : { type: 'spring', stiffness: 460, damping: 36, mass: 0.7 }
            }
          />
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative z-10 rounded-full px-5 py-2.5 transition duration-300 ${
                hoveredNav === link.label ? 'text-black' : 'text-white'
              }`}
              onFocus={(event) => moveNavPill(link.label, event)}
              onMouseEnter={(event) => moveNavPill(link.label, event)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact-us"
            className={`group/nav-cta relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition duration-300 ${
              hoveredNav === 'Start a project' ? 'text-black' : 'text-white'
            }`}
            onFocus={(event) => moveNavPill('Start a project', event)}
            onMouseEnter={(event) => moveNavPill('Start a project', event)}
          >
            <span>Start a project</span>
            <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
              <ArrowRight className="h-3.5 w-3.5 transition duration-200 group-hover/nav-cta:translate-x-5 group-hover/nav-cta:opacity-0" strokeWidth={1.8} />
              <ArrowRight className="absolute h-3.5 w-3.5 -translate-x-5 opacity-0 transition duration-200 group-hover/nav-cta:translate-x-0 group-hover/nav-cta:opacity-100" strokeWidth={1.8} />
            </span>
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-white/80 transition hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <section
      id="home"
      className="sticky-hero sticky top-0 z-0 h-screen overflow-hidden bg-black px-4 text-white sm:px-6 lg:px-8"
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={(event) => playMutedVideo(event.currentTarget)}
      />
      <div className="absolute inset-0 z-[1] bg-black/45" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col pb-10 pt-28 sm:pt-32 lg:pb-14">
        <div className="flex flex-1 items-center justify-center py-12 text-center">
          <div className="flex flex-col items-center">
            <h1
              className="text-5xl font-medium leading-[0.85] tracking-tighter text-white sm:text-6xl md:text-8xl xl:text-9xl"
            >
              <TiltFlipRevealLine delay={0.15} viewportAmount={0.2}>
                Build
              </TiltFlipRevealLine>
              <TiltFlipRevealLine delay={0.38} viewportAmount={0.2} className="text-white">
                Websites That Work.
              </TiltFlipRevealLine>
            </h1>

            <motion.button
              type="button"
              {...fadeUp(0.4)}
              className="group/hero-cta mt-10 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-white hover:text-black md:px-8 md:py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Website
              <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
                <ArrowRight className="h-4 w-4 transition duration-200 group-hover/hero-cta:translate-x-5 group-hover/hero-cta:opacity-0" />
                <ArrowRight className="absolute h-4 w-4 -translate-x-5 opacity-0 transition duration-200 group-hover/hero-cta:translate-x-0 group-hover/hero-cta:opacity-100" />
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ScrollCoverSection({ children }: { children: ReactNode }) {
  return (
    <section
      id="intro"
      className="scroll-cover-section relative z-20 min-h-[140svh] bg-background px-6 pb-6 pt-[12vh] text-center md:pb-9 md:pt-[10vh]"
    >
      {children}
    </section>
  )
}

function TiltFlipRevealLine({
  children,
  className,
  delay = 0,
  viewportAmount = 0.94,
  x,
}: {
  children: string
  className?: string
  delay?: number
  viewportAmount?: number
  x?: MotionValue<number>
}) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{
        amount: viewportAmount,
        margin: '0px 0px -8% 0px',
        once: true,
      }}
      className={`block perspective-[1400px] ${className ?? ''}`}
      style={{
        perspective: 1400,
        perspectiveOrigin: '50% 60%',
        x,
      }}
    >
      <motion.span
        variants={{
          hidden: { opacity: 0, rotateX: -72, rotateY: 4, rotateZ: 0.6 },
          show: { opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
        }}
        transition={{
          duration: 2.05,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          backfaceVisibility: 'hidden',
          transformOrigin: '88% 100%',
          transformStyle: 'preserve-3d',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="inline-block transform-gpu will-change-transform"
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

function FlipRevealWord({
  children,
  className,
  x,
}: {
  children: string
  className?: string
  x?: MotionValue<number>
}) {
  return (
    <TiltFlipRevealLine
      className={`whitespace-nowrap text-left text-[clamp(4rem,12vw,200px)] font-medium uppercase leading-[0.88] tracking-[-0.075em] text-white ${className ?? ''}`}
      x={x}
    >
      {children}
    </TiltFlipRevealLine>
  )
}

function CoverStatementSection() {
  const statementRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ['start 78%', 'end 22%'],
  })
  const yourX = useTransform(scrollYProgress, [0, 1], [0, 42])
  const businessX = useTransform(scrollYProgress, [0, 1], [0, -38])
  const elevatedX = useTransform(scrollYProgress, [0, 1], [0, 8])
  const standOutX = useTransform(scrollYProgress, [0, 1], [0, 68])
  const growFastX = useTransform(scrollYProgress, [0, 1], [0, -64])

  return (
    <ScrollCoverSection>
      <div ref={statementRef} className="mx-auto flex min-h-[105svh] max-w-[92rem] flex-col justify-start">
        <h2 className="sr-only">Your Business, Elevated, Stand Out, Grow Fast</h2>
        <div aria-hidden="true" className="space-y-2 md:space-y-3">
          <FlipRevealWord x={yourX}>YOUR</FlipRevealWord>
          <FlipRevealWord x={businessX} className="md:pl-[3vw]">BUSINESS,</FlipRevealWord>
          <FlipRevealWord x={elevatedX} className="md:-ml-[2vw]">ELEVATED</FlipRevealWord>
          <FlipRevealWord x={standOutX}>STAND OUT,</FlipRevealWord>
          <FlipRevealWord x={growFastX}>GROW FAST</FlipRevealWord>
        </div>
      </div>
    </ScrollCoverSection>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="px-6 py-32 text-center md:py-44">
      <motion.h2
        {...fadeUp(0)}
        className="mx-auto max-w-5xl text-5xl font-medium leading-[1.02] tracking-[-2px] md:text-7xl lg:text-8xl"
      >
        Websites should look sharp and <span className="font-serif italic">perform.</span>
      </motion.h2>
      <motion.p
        {...fadeUp(0.12)}
        className="mx-auto mb-24 mt-8 max-w-2xl text-lg leading-8 text-muted-foreground"
      >
        We turn brand, product, and business goals into digital experiences that
        are clear, fast, scalable, and easy for your team to manage.
      </motion.p>

      <div className="mx-auto mb-20 grid max-w-5xl gap-12 md:grid-cols-3 md:gap-8">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
          <motion.article
            key={service.name}
            {...fadeUp(index * 0.12)}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border border-white/35 bg-black">
              <Icon className="h-16 w-16 text-foreground" strokeWidth={1.4} />
            </div>
            <h3 className="mt-7 text-base font-semibold">{service.name}</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>
          </motion.article>
          )
        })}
      </div>

      <motion.p {...fadeUp(0.24)} className="text-center text-sm text-muted-foreground">
        Built for launches, redesigns, and digital products that need to feel premium from day one.
      </motion.p>
    </section>
  )
}

function HeroScrollScene() {
  return (
    // The hero remains sticky inside this normal document flow, while the
    // following section has a higher stacking layer and scrolls over it.
    <div className="sticky-hero-reveal relative bg-background">
      <HeroSection />
      <CoverStatementSection />
    </div>
  )
}

function FeaturedWorkSection() {
  return (
    <section id="work" className="px-6 py-32 md:px-12 md:py-44">
      <div className="mx-auto w-full">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-6xl text-center text-4xl font-medium leading-[1.02] tracking-[-1px] md:text-6xl lg:text-7xl"
        >
          <AnimatedLetterText letterStep={0.022} letterDuration={0.22}>
            We're a digital-first design agency where creativity meets technology.
          </AnimatedLetterText>
        </motion.h2>

        <motion.p
          {...fadeUp(0.04)}
          className="mt-24 text-left text-xs font-medium uppercase tracking-[2.5px] text-muted-foreground md:mt-32 md:text-sm"
        >
          Recent Work
        </motion.p>

        <div className="work-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workItems.map((work, index) => (
            <motion.a
              key={work.title}
              href="#work"
              {...fadeUp(index * 0.1)}
              className="work-card group block transition duration-300"
              aria-label={`${work.title} project placeholder`}
            >
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-card">
                <img
                  src={work.image}
                  alt=""
                  className="h-full w-full scale-105 object-cover transition duration-500 group-hover:scale-100"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white md:text-lg">{work.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-[2px] text-muted-foreground">{work.type}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

function AnimatedLetterText({
  children,
  letterDuration = 0.32,
  letterStep = 0.055,
}: {
  children: string
  letterDuration?: number
  letterStep?: number
}) {
  const words = children.split(' ')
  const letterVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (letterDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: letterDuration,
        delay: letterDelay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  }

  let letterIndex = 0

  return (
    <span aria-label={children}>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((letter, index) => {
              const delay = letterIndex * letterStep
              letterIndex += 1

              return (
                <motion.span
                  key={`${word}-${letter}-${index}`}
                  className="inline-block"
                  custom={delay}
                  variants={letterVariants}
                >
                  {letter}
                </motion.span>
              )
            })}
            {wordIndex < words.length - 1 ? <span> </span> : null}
          </span>
        ))}
      </span>
    </span>
  )
}

function AnimatedLetterLine({
  children,
  delay,
  className,
}: {
  children: string
  delay: number
  className: string
}) {
  const letters = Array.from(children)
  const letterVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (letterDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.32,
        delay: letterDelay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  }

  return (
    <span className={`block overflow-visible ${className}`} aria-label={children}>
      <span aria-hidden="true" className="inline-block whitespace-nowrap">
        {letters.map((letter, index) => (
          <motion.span
            key={`${children}-${letter}-${index}`}
            className="inline-block"
            custom={delay + index * 0.055}
            variants={letterVariants}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </span>
    </span>
  )
}

function MissionSection() {
  return (
    <section
      id="about"
      className="relative min-h-[105svh] overflow-hidden px-6 py-32 md:min-h-[150svh] md:px-12 md:py-44"
    >
      <h2 className="sr-only">Shape A Better Future</h2>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.28 }}
      >
        <AnimatedLetterLine
          delay={0}
          className="absolute right-12 top-8 text-right font-serif text-[clamp(9rem,31vw,25.625rem)] leading-[0.78] tracking-normal md:right-[18vw] md:top-16"
        >
          Shape
        </AnimatedLetterLine>
        <AnimatedLetterLine
          delay={0.38}
          className="absolute left-6 top-[40%] -translate-y-1/2 text-left text-[clamp(5rem,18vw,16rem)] font-semibold leading-[0.85] tracking-normal md:left-12"
        >
          A better
        </AnimatedLetterLine>
        <AnimatedLetterLine
          delay={0.9}
          className="absolute right-12 top-[68%] -translate-y-1/2 text-right font-serif text-[clamp(9rem,30vw,25rem)] italic leading-[0.78] tracking-normal md:right-[14vw]"
        >
          Future.
        </AnimatedLetterLine>
      </motion.div>
    </section>
  )
}

function SolutionSection() {
  return (
    <section
      id="process"
      className="px-6 py-32 md:py-44"
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          {...fadeUp(0)}
          className="text-xs font-medium uppercase tracking-[3px] text-muted-foreground"
        >
          APPROACH
        </motion.p>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-5 max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-1px] md:text-6xl"
        >
          Web development built around <span className="font-serif italic">outcomes</span>
        </motion.h2>

        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {features.map((feature, index) => (
            <motion.article key={feature.title} {...fadeUp(index * 0.1)}>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HlsBackgroundVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    let hls: Hls | null = null

    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }

    return () => {
      hls?.destroy()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      onCanPlay={(event) => playMutedVideo(event.currentTarget)}
    />
  )
}

function CtaSection() {
  return (
    <section
      id="contact-us"
      className="relative z-10 flex min-h-screen items-center overflow-hidden bg-background px-6 py-32 md:py-44"
    >
      <HlsBackgroundVideo src={ctaStream} />
      <div className="absolute inset-0 z-[1] bg-background/45" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div {...fadeUp(0)}>
          <Logo className="h-10 w-10" innerClassName="h-5 w-5" />
        </motion.div>
        <motion.h2
          {...fadeUp(0.12)}
          className="mt-8 text-5xl font-medium tracking-[-1px] md:text-7xl"
        >
          <span className="font-serif italic">Launch Something Better</span>
        </motion.h2>
        <motion.p
          {...fadeUp(0.22)}
          className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
        >
          Bring us your goals, messy notes, or half-built site. We will turn them
          into a clear plan and a web experience ready to ship.
        </motion.p>
        <motion.div
          {...fadeUp(0.32)}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <motion.button
            type="button"
            className="rounded-lg bg-foreground px-8 py-3.5 text-sm font-semibold text-background"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Book a Call
          </motion.button>
          <Button type="button" variant="glass" size="lg" className="rounded-lg px-8 py-3.5">
            View Services
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function Footer({ revealProgress }: { revealProgress: MotionValue<number> }) {
  const footerContentOpacity = useTransform(revealProgress, [0.5, 1], [0, 1])
  const footerContentY = useTransform(revealProgress, [0.5, 1], [64, 0])
  const socialLinks = [
    { label: 'Instagram', href: '#home', icon: Instagram },
    { label: 'Facebook', href: '#home', icon: Facebook },
    { label: 'Twitter', href: '#home', icon: Twitter },
    { label: 'TikTok', href: '#home' },
  ]

  return (
    <footer
      className="sticky bottom-0 z-0 mt-24 min-h-screen bg-background px-6 pb-16 pt-28 md:mt-32 md:px-12 md:pb-24 md:pt-40"
    >
      <motion.div
        style={{ opacity: footerContentOpacity, y: footerContentY }}
        className="mx-auto flex min-h-[calc(100svh-11rem)] w-full max-w-6xl flex-col justify-between"
      >
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] md:items-end">
          <div>
            <h2 className="max-w-3xl text-6xl font-medium leading-[0.9] tracking-[-1px] md:text-8xl lg:text-9xl">
              Let&rsquo;s work
              <span className="block font-serif italic">Together</span>
            </h2>
            <a
              href="mailto:hello@webdevstudio.co"
              className="group mt-10 inline-flex items-center gap-4 text-base font-medium transition-transform duration-300 hover:translate-x-2"
            >
              Get in touch
              <span className="circle-reveal relative inline-flex h-[55px] w-[55px] items-center justify-center overflow-hidden rounded-full border border-white/40 bg-black transition duration-300">
                <ArrowRight className="h-5 w-5 transition duration-200 group-hover:translate-x-5 group-hover:opacity-0" />
                <ArrowRight className="absolute h-5 w-5 -translate-x-5 text-background opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </a>

            <div className="mt-16 space-y-3 text-lg text-foreground md:text-xl">
              <a href="mailto:hello@webdevstudio.co" className="group/contact relative block w-fit">
                hello@webdevstudio.co
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/contact:scale-x-100" />
              </a>
              <a href="tel:+14155501984" className="group/contact relative block w-fit">
                +1 (415) 550-1984
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/contact:scale-x-100" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="circle-reveal social-button inline-flex h-[55px] w-[55px] items-center justify-center rounded-full border border-white/40 bg-black text-foreground transition duration-300"
                  >
                    {Icon ? (
                      <Icon className="social-button-icon h-5 w-5" />
                    ) : (
                      <span className="social-button-icon text-sm font-semibold">TT</span>
                    )}
                  </a>
                )
              })}
            </div>
          </div>

          <div className="text-sm md:justify-self-end">
            <p className="text-xs uppercase tracking-[2px] text-muted-foreground">
              Studio
            </p>
            <p className="mt-3 leading-6 text-foreground">
              <span className="block">428 Market Street</span>
              <span className="block">Suite 1200</span>
              <span className="block">San Francisco, CA 94111</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-border/30 pt-8 text-sm text-muted-foreground md:flex-row md:items-end md:justify-between">
          <p>&copy; 2026 WebDev Studio. All rights reserved.</p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy', href: '#home' },
              { label: 'Terms', href: '#home' },
              { label: 'Contact', href: '#contact-us' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

function HashScroller() {
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const scrollToHash = () => {
      const id = window.location.hash.slice(1)
      if (!id) {
        window.setTimeout(() => window.scrollTo(0, 0), 80)
        return
      }

      window.setTimeout(() => {
        document
          .getElementById(decodeURIComponent(id))
          ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }, 80)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    return () => {
      window.removeEventListener('hashchange', scrollToHash)

      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = previousScrollRestoration
      }
    }
  }, [])

  return null
}

function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return undefined
    }

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      lerp: 0.08,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    })
    smoothScrollInstance = lenis

    return () => {
      if (smoothScrollInstance === lenis) {
        smoothScrollInstance = null
      }

      lenis.destroy()
    }
  }, [])

  return null
}

function App() {
  const pageContentRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: footerRevealProgress } = useScroll({
    target: pageContentRef,
    offset: ['end end', 'end start'],
  })

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SmoothScroll />
      <HashScroller />
      {/* Keep page content above the sticky footer until the footer reveal zone. */}
      <div ref={pageContentRef} className="relative z-10 bg-background">
        <Navbar />
        <HeroScrollScene />
        <FeaturedWorkSection />
        <MissionSection />
        <SolutionSection />
        <ServicesSection />
        <CtaSection />
      </div>
      <Footer revealProgress={footerRevealProgress} />
    </main>
  )
}

export default App
