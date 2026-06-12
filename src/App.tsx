import { type FocusEvent, type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import Lenis from 'lenis'
import {
  ArrowRight,
  CircleCheck,
  Code2,
  Facebook,
  Instagram,
  MonitorSmartphone,
  SearchCheck,
  Twitter,
} from 'lucide-react'
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

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

const mobileNavLinks = [
  { label: 'WORKS', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact-us' },
]

const socialLinks = [
  { label: 'Instagram', href: '#home', icon: Instagram },
  { label: 'Facebook', href: '#home', icon: Facebook },
  { label: 'Twitter', href: '#home', icon: Twitter },
  { label: 'TikTok', href: '#home' },
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

type PlanTier = 'Basic' | 'Standard' | 'Pro'

type PricingPlan = {
  title: PlanTier
  price: string
  description: string
  features: string[]
  cta: string
  href: string
  featured?: boolean
}

const pricingData: PricingPlan[] = [
  {
    title: 'Basic',
    price: '$29/month',
    description: 'Perfect for small businesses and individuals.',
    features: ['3 Pages', 'Basic SEO', 'Email Support', 'Responsive Design'],
    cta: 'Choose Basic',
    href: 'https://stripe.com/',
  },
  {
    title: 'Standard',
    price: '$59/month',
    description: 'Best for growing businesses with more needs.',
    features: ['10 Pages', 'Advanced SEO', 'CMS Integration', '24/7 Chat Support'],
    cta: 'Choose Standard',
    href: 'https://stripe.com/',
    featured: true,
  },
  {
    title: 'Pro',
    price: '$99/month',
    description: 'Ideal for larger businesses that need scalability.',
    features: ['Unlimited Pages', 'E-commerce Integration', 'Priority Support', 'Custom API Integration'],
    cta: 'Choose Pro',
    href: 'https://stripe.com/',
  },
]

function MobileMenuIcon({ isInverted, isOpen }: { isInverted: boolean; isOpen: boolean }) {
  const lineEase = [0.22, 1, 0.36, 1] as const
  const lineColor = isInverted ? 'bg-black' : 'bg-white'
  const topLine = {
    closed: {
      rotate: 0,
      y: -4,
      transition: {
        rotate: { duration: 0.34, ease: lineEase },
        y: { delay: 0.32, duration: 0.42, ease: lineEase },
      },
    },
    open: {
      rotate: 45,
      y: 0,
      transition: {
        y: { duration: 0.38, ease: lineEase },
        rotate: { delay: 0.32, duration: 0.42, ease: lineEase },
      },
    },
  }
  const bottomLine = {
    closed: {
      rotate: 0,
      y: 4,
      transition: {
        rotate: { duration: 0.34, ease: lineEase },
        y: { delay: 0.32, duration: 0.42, ease: lineEase },
      },
    },
    open: {
      rotate: -45,
      y: 0,
      transition: {
        y: { duration: 0.38, ease: lineEase },
        rotate: { delay: 0.32, duration: 0.42, ease: lineEase },
      },
    },
  }

  return (
    <span className="relative flex h-6 w-7 items-center justify-center" aria-hidden="true">
      <motion.span
        className={`absolute h-[2px] w-7 origin-center rounded-full ${lineColor}`}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={topLine}
      />
      <motion.span
        className={`absolute h-[2px] w-7 origin-center rounded-full ${lineColor}`}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={bottomLine}
      />
    </span>
  )
}

function useIsDesktopBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateIsDesktop = () => setIsDesktop(mediaQuery.matches)

    updateIsDesktop()
    mediaQuery.addEventListener('change', updateIsDesktop)

    return () => mediaQuery.removeEventListener('change', updateIsDesktop)
  }, [])

  return isDesktop
}

function Navbar() {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileMenuExiting, setIsMobileMenuExiting] = useState(false)
  const [shouldPlaceNavPill, setShouldPlaceNavPill] = useState(true)
  const [navPill, setNavPill] = useState({
    height: 0,
    left: 0,
    opacity: 0,
    top: 0,
    width: 0,
  })
  const isNavPillActive = useRef(false)
  const isMobileMenuVisible = isMobileMenuOpen || isMobileMenuExiting

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuExiting(false)
    setIsMobileMenuOpen(true)
  }, [])

  const closeMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuExiting(true)
    }

    setIsMobileMenuOpen(false)
  }, [isMobileMenuOpen])

  const scrollHome = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    closeMobileMenu()
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

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu()
      }
    }

    window.addEventListener('keydown', closeOnEscape)

    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [closeMobileMenu])

  useEffect(() => {
    if (!isMobileMenuVisible) {
      return undefined
    }

    const lockedScrollY = window.scrollY
    const scrollKeys = new Set([' ', 'ArrowDown', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp'])
    const previousHtmlOverflowY = document.documentElement.style.overflowY
    const lenis = smoothScrollInstance

    const preventScroll = (event: Event) => event.preventDefault()
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key)) {
        event.preventDefault()
      }
    }
    const holdScrollPosition = () => {
      if (window.scrollY !== lockedScrollY) {
        window.scrollTo(0, lockedScrollY)
      }
    }

    lenis?.stop()
    document.documentElement.style.overflowY = 'scroll'

    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventScrollKeys)
    window.addEventListener('scroll', holdScrollPosition)

    return () => {
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventScrollKeys)
      window.removeEventListener('scroll', holdScrollPosition)
      document.documentElement.style.overflowY = previousHtmlOverflowY
      window.scrollTo(0, lockedScrollY)
      lenis?.start()
    }
  }, [isMobileMenuVisible])

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
      className="fixed top-0 z-50 w-full px-6 py-4 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-32 before:bg-gradient-to-b before:from-black/90 before:via-black/45 before:to-transparent before:content-[''] sm:px-10 lg:px-14"
    >
      <nav className="relative z-20 flex w-full items-center justify-between gap-6">
        <a href="#home" className="flex items-center" aria-label="WebDev Studio home" onClick={scrollHome}>
          <span
            className={`text-lg font-semibold uppercase tracking-[0.08em] transition-colors md:text-xl ${
              isMobileMenuVisible ? 'text-black lg:text-white' : 'text-white'
            }`}
          >
            WebDev Studio
          </span>
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
              <ArrowRight className="h-3.5 w-3.5 transition duration-200 md:group-hover/nav-cta:translate-x-5 md:group-hover/nav-cta:opacity-0" strokeWidth={1.8} />
              <ArrowRight className="absolute h-3.5 w-3.5 -translate-x-5 opacity-0 transition duration-200 md:group-hover/nav-cta:translate-x-0 md:group-hover/nav-cta:opacity-100" strokeWidth={1.8} />
            </span>
          </a>
        </div>

        <button
          type="button"
          className="relative z-20 -mr-2 inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 lg:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
        >
          <MobileMenuIcon isInverted={isMobileMenuVisible} isOpen={isMobileMenuOpen} />
        </button>
      </nav>

      <AnimatePresence onExitComplete={() => setIsMobileMenuExiting(false)}>
        {isMobileMenuOpen ? (
          <motion.div
            key="mobile-menu-drawer"
            className="fixed inset-x-0 top-0 z-10 h-[calc(100svh+16px)] overflow-visible lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              closed: {
                y: '-102svh',
                transition: { duration: 0.9, ease: [0.45, 0, 0.55, 1] },
              },
              open: {
                y: '0rem',
                transition: {
                  duration: 0.9,
                  ease: [0.45, 0, 0.55, 1],
                },
              },
            }}
          >
            <div className="relative h-[100svh] bg-white pt-24">
              {mobileNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex h-[90px] items-center justify-center border-b border-black/20 px-6 text-center text-[50px] font-medium leading-none tracking-normal text-black"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-10 flex items-center justify-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-black/25 text-black"
                      onClick={closeMobileMenu}
                    >
                      {Icon ? (
                        <Icon className="h-6 w-6" strokeWidth={1.8} />
                      ) : (
                        <span className="text-base font-semibold">TT</span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
            <svg
              className="pointer-events-none absolute left-0 top-[calc(100svh-1px)] h-11 w-full"
              viewBox="0 0 100 44"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                initial={{ d: 'M0 0 H100 V44 Q50 -20 0 44 Z' }}
                animate={{
                  d: [
                    'M0 0 H100 V44 Q50 -20 0 44 Z',
                    'M0 0 H100 V44 Q50 -20 0 44 Z',
                    'M0 0 H100 V22 Q50 -8 0 22 Z',
                    'M0 0 H100 V0 Q50 0 0 0 Z',
                  ],
                  transition: {
                    duration: 0.9,
                    ease: [0.45, 0, 0.55, 1],
                    times: [0, 0.68, 0.86, 1],
                  },
                }}
                exit={{
                  d: [
                    'M0 0 H100 V0 Q50 0 0 0 Z',
                    'M0 0 H100 V44 Q50 -20 0 44 Z',
                    'M0 0 H100 V22 Q50 -8 0 22 Z',
                    'M0 0 H100 V0 Q50 0 0 0 Z',
                  ],
                  transition: {
                    duration: 0.9,
                    ease: [0.45, 0, 0.55, 1],
                    times: [0, 0.14, 0.38, 1],
                  },
                }}
                fill="white"
              />
            </svg>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktopBreakpoint()
  const { scrollY } = useScroll()
  const mobileHeroOffsets = { first: 34, fourth: 46, second: -34, third: -54 }
  const desktopHeroOffsets = { first: 92, fourth: 122, second: -88, third: -138 }
  const heroOffsets = isDesktop ? desktopHeroOffsets : mobileHeroOffsets
  const heroScrollDistance = isDesktop ? 900 : 520
  const heroFirstX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.first])
  const heroSecondX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.second])
  const heroThirdX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.third])
  const heroFourthX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.fourth])

  return (
    <section
      ref={heroRef}
      id="home"
      className="sticky-hero sticky top-0 z-0 h-screen overflow-hidden bg-black px-6 text-white sm:px-10 lg:px-20"
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

      <div className="relative z-10 flex h-full w-full flex-col pb-10 pt-28 sm:pt-32 lg:pb-14">
        <div className="flex flex-1 items-center justify-start py-12 text-left">
          <div className="w-full">
            <h1
              className="text-[clamp(2.65rem,11vw,5rem)] font-medium uppercase leading-[0.82] tracking-[-0.075em] text-white md:text-[clamp(4rem,12vw,12.5rem)] md:leading-[0.78]"
            >
              <TiltFlipRevealLine x={heroFirstX} delay={0.12} viewportAmount={0.2} className="whitespace-nowrap">
                Creative
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroSecondX} delay={0.28} viewportAmount={0.2} className="whitespace-nowrap">
                Web Design &
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroThirdX} delay={0.44} viewportAmount={0.2} className="whitespace-nowrap">
                Marketing
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroFourthX} delay={0.6} viewportAmount={0.2} className="whitespace-nowrap">
                Studio
              </TiltFlipRevealLine>
            </h1>
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
      className="scroll-cover-section relative z-20 min-h-[92svh] bg-background px-6 pb-4 pt-[8vh] text-center md:min-h-[140svh] md:pb-9 md:pt-[10vh]"
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
          hidden: { opacity: 0, rotateX: -58, rotateY: -3, rotateZ: 0.35 },
          show: { opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
        }}
        transition={{
          duration: 2.25,
          delay,
          ease: [0.2, 0.86, 0.2, 1],
        }}
        style={{
          backfaceVisibility: 'hidden',
          transformOrigin: '88% 100%',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
          WebkitBackfaceVisibility: 'hidden',
        }}
        className="inline-block transform-gpu"
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
      className={`whitespace-nowrap text-left text-[clamp(2.8rem,13vw,3.25rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em] text-white md:text-[clamp(4rem,12vw,200px)] md:leading-[0.88] md:tracking-[-0.075em] ${className ?? ''}`}
      x={x}
    >
      {children}
    </TiltFlipRevealLine>
  )
}

function StatementVideoRibbon() {
  return (
    <motion.div
      {...fadeUp(0.08)}
      className="relative my-5 h-[200px] max-w-none overflow-hidden bg-black md:my-8"
      style={{ marginLeft: 'calc(50% - 50vw)', width: '100vw' }}
    >
      <HlsBackgroundVideo src={ctaStream} className="absolute inset-0 z-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 z-[1] bg-background/15" />
    </motion.div>
  )
}

function CoverStatementSection() {
  const statementRef = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktopBreakpoint()
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ['start 78%', 'end 22%'],
  })
  const mobileStatementOffsets = { business: -34, elevated: 4, growFast: -58, standOut: 56, your: 34 }
  const desktopStatementOffsets = { business: -92, elevated: 10, growFast: -140, standOut: 132, your: 88 }
  const statementOffsets = isDesktop ? desktopStatementOffsets : mobileStatementOffsets
  const yourX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.your])
  const businessX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.business])
  const elevatedX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.elevated])
  const standOutX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.standOut])
  const growFastX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.growFast])

  return (
    <ScrollCoverSection>
      <div ref={statementRef} className="mx-auto flex min-h-[86svh] max-w-[92rem] flex-col justify-start pt-4 md:min-h-[115svh] md:pt-0">
        <h2 className="sr-only">Your Business, Elevated, Stand Out, Grow Fast</h2>
        <div aria-hidden="true" className="space-y-2 md:space-y-3">
          <FlipRevealWord x={yourX}>YOUR</FlipRevealWord>
          <FlipRevealWord x={businessX} className="md:pl-[3vw]">BUSINESS,</FlipRevealWord>
          <FlipRevealWord x={elevatedX} className="md:-ml-[2vw]">ELEVATED</FlipRevealWord>
          <StatementVideoRibbon />
          <FlipRevealWord x={standOutX}>STAND OUT,</FlipRevealWord>
          <FlipRevealWord x={growFastX}>GROW FAST</FlipRevealWord>
        </div>
      </div>
    </ScrollCoverSection>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="px-6 py-20 text-center md:py-44">
      <motion.h2
        {...fadeUp(0)}
        className="mx-auto max-w-5xl text-4xl font-medium leading-[1.04] tracking-[-1px] md:text-7xl md:leading-[1.02] md:tracking-[-2px] lg:text-8xl"
      >
        Websites should look sharp and <span className="font-serif italic">perform.</span>
      </motion.h2>
      <motion.p
        {...fadeUp(0.12)}
        className="mx-auto mb-14 mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:mb-24 md:mt-8 md:text-lg md:leading-8"
      >
        We turn brand, product, and business goals into digital experiences that
        are clear, fast, scalable, and easy for your team to manage.
      </motion.p>

      <div className="mx-auto mb-14 grid max-w-5xl gap-10 md:mb-20 md:grid-cols-3 md:gap-8">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
          <motion.article
            key={service.name}
            {...fadeUp(index * 0.12)}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/35 bg-black md:h-[160px] md:w-[160px]">
              <Icon className="h-12 w-12 text-foreground md:h-16 md:w-16" strokeWidth={1.4} />
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
    <section id="work" className="px-6 py-24 md:px-12 md:py-44">
      <div className="mx-auto w-full">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-6xl text-center text-[2rem] font-medium leading-[1.08] tracking-[-1px] md:text-6xl md:leading-[1.02] lg:text-7xl"
        >
          <span className="md:hidden">We&apos;re a digital-first design agency where creativity meets technology.</span>
          <span className="hidden md:inline">
            <AnimatedLetterText letterStep={0.022} letterDuration={0.22}>
              We're a digital-first design agency where creativity meets technology.
            </AnimatedLetterText>
          </span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.04)}
          className="mt-16 text-left text-xs font-medium uppercase tracking-[2.5px] text-muted-foreground md:mt-32 md:text-sm"
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
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-card md:rounded-3xl">
                <img
                  src={work.image}
                  alt=""
                  className="h-full w-full scale-105 object-cover transition duration-500 md:group-hover:scale-100"
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
          <span
            key={`${word}-${wordIndex}`}
            className="mr-[0.22em] inline-block whitespace-nowrap last:mr-0"
          >
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
      className="relative min-h-[82svh] overflow-hidden px-6 py-20 md:min-h-[150svh] md:px-12 md:py-44"
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
          className="absolute right-2 top-[18%] text-right font-serif text-[7.6rem] leading-[0.78] tracking-normal md:right-[18vw] md:top-16 md:text-[clamp(9rem,31vw,25.625rem)]"
        >
          Shape
        </AnimatedLetterLine>
        <AnimatedLetterLine
          delay={0.38}
          className="absolute left-6 top-[44%] -translate-y-1/2 text-left text-[4.55rem] font-semibold leading-[0.88] tracking-normal md:left-12 md:top-[40%] md:text-[clamp(5rem,18vw,16rem)] md:leading-[0.85]"
        >
          A better
        </AnimatedLetterLine>
        <AnimatedLetterLine
          delay={0.9}
          className="absolute right-2 top-[63%] -translate-y-1/2 text-right font-serif text-[7.6rem] italic leading-[0.78] tracking-normal md:right-[14vw] md:top-[68%] md:text-[clamp(9rem,30vw,25rem)]"
        >
          Future.
        </AnimatedLetterLine>
      </motion.div>
    </section>
  )
}

function SolutionSection() {
  const accordionItems = [
    {
      id: 'added-value',
      title: 'Added Value',
      text: 'Today, nothing works on a website without good content. Your content should not only attract search engines but, most importantly, provide added value to your visitors. We shape a content strategy that presents your message clearly, creatively, and in a way your audience can actually use.',
    },
    {
      id: 'user-centric-design',
      title: 'User-Centric Design',
      text: 'A good website focuses on providing a seamless user experience. It incorporates intuitive navigation, clear calls-to-action, and a visually appealing layout to engage visitors and guide them towards their goals.',
    },
    {
      id: 'fast-loading-speed',
      title: 'Fast Loading Speed',
      text: 'Website performance is crucial for user satisfaction and search engine rankings. A good website is optimized for speed, ensuring quick page loading times. This not only improves the user experience but also reduces bounce rates and increases the likelihood of conversions.',
    },
    {
      id: 'responsive-design',
      title: 'Responsive Design',
      text: "In today's mobile-driven world, a good website is optimized for various devices and screen sizes. It adapts seamlessly to mobile phones, tablets, and desktop computers, ensuring that users can access and navigate your site easily, regardless of the device they use.",
    },
  ]
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | null>(null)

  return (
    <section
      id="process"
      className="px-6 py-20 md:py-44"
    >
      <div className="mx-auto max-w-6xl text-left">
        <motion.h2
          {...fadeUp(0)}
          className="mb-12 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:mb-16 md:text-[2.65rem]"
        >
          Key elements of a successful website
        </motion.h2>
        <div>
          <motion.p
            {...fadeUp(0.08)}
            className="max-w-5xl text-2xl font-light leading-[1.45] tracking-[-0.04em] text-white/80 md:text-[2rem] md:leading-[1.48]"
          >
            A good website is characterized by its high-quality design, informative
            content, optimal performance, and its ability to authentically
            represent your company's identity.
          </motion.p>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-14 max-w-4xl text-2xl font-light leading-[1.45] tracking-[-0.04em] text-white/80 md:mt-16 md:text-[2rem] md:leading-[1.48]"
          >
            It serves as a crucial platform for engaging potential customers while
            also providing a digital manifestation of your brand.
          </motion.p>
        </div>

        <motion.div
          {...fadeUp(0.26)}
          className="mt-16 border-t border-white/35 md:mt-20"
        >
          {accordionItems.map((item) => {
            const isOpen = activeAccordionItem === item.id

            return (
              <div key={item.id} className="border-b border-white/20 py-10 md:py-12">
                <button
                  type="button"
                  className="group grid w-full grid-cols-[minmax(0,1fr)_96px] items-center gap-6 text-left md:grid-cols-[minmax(0,1fr)_190px] md:gap-8"
                  aria-expanded={isOpen}
                  onClick={() => setActiveAccordionItem((activeItem) => (activeItem === item.id ? null : item.id))}
                >
                  <span className="font-serif text-5xl uppercase leading-none tracking-[-0.04em] text-white md:text-[4.7rem]">
                    {item.title}
                  </span>
                  <span
                    className={`flex h-24 w-32 items-center justify-center justify-self-end text-white transition duration-500 md:h-40 md:w-52 ${
                      isOpen ? 'rotate-45' : '-rotate-45'
                    }`}
                    aria-hidden="true"
                  >
                    <ArrowRight className="h-full w-full" strokeWidth={1.8} strokeLinecap="butt" strokeLinejoin="miter" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key={`${item.id}-content`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="mt-10 max-w-4xl text-base leading-8 text-white md:text-xl md:leading-9">
                        {item.text}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function HlsBackgroundVideo({
  className = 'absolute inset-0 z-0 h-full w-full object-cover',
  src,
}: {
  className?: string
  src: string
}) {
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
      className={className}
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
      className="relative z-10 bg-background px-6 py-24 md:py-44"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.h2
          {...fadeUp(0)}
          className="text-5xl font-medium leading-none tracking-[-0.06em] md:text-8xl"
        >
          Pricing
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-2xl md:leading-9"
        >
          Select the plan that best suits your needs.
        </motion.p>

        <div className="mt-12 grid w-full grid-cols-1 gap-5 text-left min-[900px]:grid-cols-3 md:mt-16 md:gap-6">
          {pricingData.map((plan, index) => (
            <PricingCard key={plan.title} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingCard({ index, plan }: { index: number; plan: PricingPlan }) {
  return (
    <motion.article
      {...fadeUp(0.16 + index * 0.08)}
      className="flex min-h-[520px] flex-col rounded-lg border border-white/20 bg-white/[0.03] p-6 text-white"
      aria-label={`${plan.title} plan`}
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            {plan.title}
          </span>
          {plan.featured ? (
            <span className="rounded-full border border-white/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-black">
              Most popular
            </span>
          ) : null}
        </div>
        <h3 className="mb-3 mt-6 text-3xl font-medium tracking-[-0.04em] md:text-4xl">
          {plan.price}
        </h3>
        <p className="text-sm leading-6 text-white/60">
          {plan.description}
        </p>
      </div>

      <div className="my-6 border-t border-white/15" />

      <ul className="space-y-4">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center text-sm text-white/70"
          >
            <CircleCheck className="mr-3 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <a
          href={plan.href}
          target="_blank"
          rel="noreferrer noopener"
          className="circle-reveal pricing-button group/price inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-black text-sm font-semibold text-white transition duration-300"
        >
          <span>{plan.cta}</span>
          <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
            <ArrowRight className="h-4 w-4 transition duration-200 md:group-hover/price:translate-x-5 md:group-hover/price:opacity-0" aria-hidden="true" />
            <ArrowRight className="absolute h-4 w-4 -translate-x-5 text-background opacity-0 transition duration-200 md:group-hover/price:translate-x-0 md:group-hover/price:opacity-100" aria-hidden="true" />
          </span>
        </a>
      </div>
    </motion.article>
  )
}

function Footer({ revealProgress }: { revealProgress: MotionValue<number> }) {
  const footerContentOpacity = useTransform(revealProgress, [0.5, 1], [0, 1])
  const footerContentY = useTransform(revealProgress, [0.5, 1], [64, 0])

  return (
    <footer
      className="sticky bottom-0 z-0 mt-16 min-h-[92svh] bg-background px-6 pb-12 pt-20 md:mt-32 md:min-h-screen md:px-12 md:pb-24 md:pt-40"
    >
      <motion.div
        style={{ opacity: footerContentOpacity, y: footerContentY }}
        className="mx-auto flex min-h-[calc(92svh-8rem)] w-full max-w-6xl flex-col justify-between md:min-h-[calc(100svh-11rem)]"
      >
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] md:items-end">
          <div>
            <h2 className="max-w-3xl text-5xl font-medium leading-[0.92] tracking-[-1px] md:text-8xl md:leading-[0.9] lg:text-9xl">
              Let&rsquo;s work
              <span className="block font-serif italic">Together</span>
            </h2>
            <a
              href="mailto:hello@webdevstudio.co"
              className="group mt-10 inline-flex items-center gap-4 text-base font-medium transition-transform duration-300 md:hover:translate-x-2"
            >
              Get in touch
              <span className="circle-reveal relative inline-flex h-[55px] w-[55px] items-center justify-center overflow-hidden rounded-full border border-white/40 bg-black transition duration-300">
                <ArrowRight className="h-5 w-5 transition duration-200 md:group-hover:translate-x-5 md:group-hover:opacity-0" />
                <ArrowRight className="absolute h-5 w-5 -translate-x-5 text-background opacity-0 transition duration-200 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
              </span>
            </a>

            <div className="mt-12 space-y-3 text-lg text-foreground md:mt-16 md:text-xl">
              <a href="mailto:hello@webdevstudio.co" className="group/contact relative block w-fit">
                hello@webdevstudio.co
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 md:group-hover/contact:scale-x-100" />
              </a>
              <a href="tel:+14155501984" className="group/contact relative block w-fit">
                +1 (415) 550-1984
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 md:group-hover/contact:scale-x-100" />
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
                className="transition md:hover:text-foreground"
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
