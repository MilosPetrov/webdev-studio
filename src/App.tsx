import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
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
  { label: 'Works', href: '/works' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const mobileNavLinks = [
  { label: 'WORKS', href: '/works' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
]

const socialLinks = [
  { label: 'Instagram', href: '#home', icon: Instagram },
  { label: 'Facebook', href: '#home', icon: Facebook },
  { label: 'Twitter', href: '#home', icon: Twitter },
  { label: 'TikTok', href: '#home' },
]

function PhaseOneLogo({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`inline-flex items-center ${footer ? 'gap-4' : 'gap-3.5'}`} aria-hidden="true">
      <svg
        className={footer ? 'h-14 w-14 shrink-0' : 'h-10 w-10 shrink-0'}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 21.5 20.5 7H29c10.55 0 18 7.3 18 17.7 0 9.15-5.65 15.75-13.7 17.2v-8.05c4.15-1.25 6.7-4.55 6.7-9.15C40 18.45 35.7 14 29 14h-5.55L13.5 24.7H7v-3.2Z"
          fill="currentColor"
        />
        <path
          d="m16.5 28.1 13.8-9.35V45h-7.1V28.1h-6.7Z"
          fill="currentColor"
        />
      </svg>
      <span className={footer
        ? 'text-lg font-semibold uppercase leading-none tracking-[0.22em] md:text-xl'
        : 'text-[0.82rem] font-medium uppercase leading-none tracking-[0.22em] md:text-[0.95rem]'
      }>
        Phase One
      </span>
    </span>
  )
}

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

const workPills = [
  {
    title: 'SaaS Dashboard',
    type: 'Web App',
    image: workItems[0].image,
    hoverImage:
      'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1200',
    className: 'left-[6vw] top-[9%] md:left-[5%] md:top-[5%]',
  },
  {
    title: 'Commerce Redesign',
    type: 'Ecommerce',
    image: workItems[1].image,
    hoverImage:
      'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1200',
    className: 'left-[6vw] top-[31%] md:left-auto md:right-[5%] md:top-[24%]',
  },
  {
    title: 'Startup Launch',
    type: 'Marketing Site',
    image: workItems[2].image,
    hoverImage:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    className: 'left-[6vw] top-[56%] md:left-[9%] md:top-[50%]',
  },
  {
    title: 'Product System',
    type: 'UX Engineering',
    image: workItems[3].image,
    hoverImage:
      'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1200',
    className: 'left-[6vw] top-[82%] md:left-auto md:right-[7%] md:top-[75%]',
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

function Navbar({
  isLightPage = false,
  pathname,
}: {
  isLightPage?: boolean
  pathname: string
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileMenuExiting, setIsMobileMenuExiting] = useState(false)
  const [isOverDarkSection, setIsOverDarkSection] = useState(false)
  const isMobileMenuVisible = isMobileMenuOpen || isMobileMenuExiting
  const useLightNav = isLightPage && !isOverDarkSection

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

  const refreshToPath = (path: string) => {
    closeMobileMenu()
    window.location.href = path
  }

  const refreshCurrentNavPage = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault()
    refreshToPath(path)
  }

  const scrollContactToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    closeMobileMenu()

    if (smoothScrollInstance) {
      smoothScrollInstance.scrollTo(0, {
        duration: 1.1,
        force: true,
        lock: true,
      })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleActiveNavClick = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path === '/contact') {
      scrollContactToTop(event)
      return
    }

    refreshCurrentNavPage(event, path)
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

  useEffect(() => {
    if (!isLightPage) {
      setIsOverDarkSection(false)
      return undefined
    }

    const updateNavMode = () => {
      const coverSection = document.querySelector<HTMLElement>('.about-contact-cover, .contact-dark-start')

      if (!coverSection) {
        setIsOverDarkSection(false)
        return
      }

      const hasDomePseudo = coverSection.classList.contains('about-contact-cover')
      const domeEdgeTop = hasDomePseudo
        ? Number.parseFloat(window.getComputedStyle(coverSection, '::before').top) || 0
        : 0
      const domeTop = coverSection.getBoundingClientRect().top + domeEdgeTop

      setIsOverDarkSection(domeTop <= 92)
    }

    updateNavMode()
    window.addEventListener('scroll', updateNavMode, { passive: true })
    window.addEventListener('resize', updateNavMode)

    return () => {
      window.removeEventListener('scroll', updateNavMode)
      window.removeEventListener('resize', updateNavMode)
    }
  }, [isLightPage])

  return (
    <header
      className={`fixed top-0 z-50 w-full px-6 py-4 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-32 before:bg-gradient-to-b before:to-transparent before:content-[''] sm:px-10 lg:px-14 ${
        useLightNav ? 'before:from-white/90 before:via-white/45' : 'before:from-black/90 before:via-black/45'
      }`}
    >
      <nav className="relative z-20 flex w-full items-center justify-between gap-6">
        <a
          href="/"
          className={`flex items-center rounded-md transition-[color,opacity] duration-300 ${
            useLightNav
              ? 'text-black hover:opacity-[0.55]'
              : 'text-white hover:opacity-[0.65]'
          }`}
          aria-label="Phase One Digital home"
          onClick={(event) => refreshCurrentNavPage(event, '/')}
        >
          <span className={isMobileMenuVisible ? 'text-black lg:text-white' : 'text-current'}>
            <span className="text-[1.15rem] font-normal uppercase leading-none tracking-[-0.16px] md:text-[1.35rem]">
              Phase One
            </span>
          </span>
        </a>

        <div className="relative hidden items-center gap-3 rounded-full px-2 py-2 text-[18px] lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={isActive ? (event) => handleActiveNavClick(event, link.href) : undefined}
                className={`circle-reveal nav-button relative z-10 rounded-full px-5 py-2.5 font-medium transition duration-300 ${
                  useLightNav ? 'light-circle-reveal text-black' : 'text-white'
                } ${isActive ? 'nav-button-active' : ''}`}
              >
                <span>{link.label}</span>
              </a>
            )
          })}
        </div>

        <button
          type="button"
          className="relative z-20 -mr-2 inline-flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 lg:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
        >
          <MobileMenuIcon isInverted={isMobileMenuVisible || useLightNav} isOpen={isMobileMenuOpen} />
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
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex h-[90px] items-center justify-center border-b border-black/20 px-6 text-center text-[50px] font-medium leading-none tracking-normal transition-colors duration-300 ${
                      isActive ? 'bg-black text-white' : 'text-black'
                    }`}
                    onClick={(event) => {
                      if (isActive) {
                        handleActiveNavClick(event, link.href)
                        return
                      }

                      closeMobileMenu()
                    }}
                  >
                    {link.label}
                  </a>
                )
              })}
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
  const mobileHeroOffsets = { ampersand: 12, first: 18, fourth: 26, second: -18, third: -28 }
  const desktopHeroOffsets = { ampersand: 0, first: 92, fourth: 122, second: -88, third: -138 }
  const heroOffsets = isDesktop ? desktopHeroOffsets : mobileHeroOffsets
  const heroScrollDistance = isDesktop ? 900 : 520
  const heroFirstX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.first])
  const heroSecondX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.second])
  const heroAmpersandX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.ampersand])
  const heroThirdX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.third])
  const heroFourthX = useTransform(scrollY, [0, heroScrollDistance], [0, heroOffsets.fourth])

  return (
    <section
      ref={heroRef}
      id="home"
      className="sticky-hero sticky top-0 z-0 h-screen overflow-hidden bg-black px-5 text-white sm:px-10 lg:px-20"
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
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/20 via-transparent to-black/10" />

      <div className="relative z-10 flex h-full w-full flex-col pb-10 pt-28 sm:pt-32 lg:pb-14">
        <div className="flex flex-1 items-center justify-start py-12 text-left">
          <div className="w-full">
            <h1
              className="hero-text hero-text-mobile font-melodrama-display inline-block max-w-full text-[clamp(3.95rem,20.5vw,7.4rem)] font-normal uppercase leading-[0.78] md:hidden"
            >
              <TiltFlipRevealLine x={heroFirstX} delay={0.12} viewportAmount={0.2} className="whitespace-nowrap">
                Creative
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroSecondX} delay={0.28} viewportAmount={0.2} className="hero-text-tight whitespace-nowrap">
                Web <span className="accent-word">Design</span>
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroAmpersandX} delay={0.36} viewportAmount={0.2} className="hero-ampersand whitespace-nowrap">
                &
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroThirdX} delay={0.44} viewportAmount={0.2} className="whitespace-nowrap">
                Marketing
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroFourthX} delay={0.6} viewportAmount={0.2} className="whitespace-nowrap">
                Studio
              </TiltFlipRevealLine>
            </h1>
            <h1
              className="hero-text font-melodrama-display hidden max-w-full font-normal uppercase md:inline-block md:text-[clamp(4rem,12vw,12.5rem)] md:leading-[0.92]"
            >
              <TiltFlipRevealLine x={heroFirstX} delay={0.12} viewportAmount={0.2} className="whitespace-nowrap">
                Creative
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroSecondX} delay={0.28} viewportAmount={0.2} className="whitespace-nowrap">
                Web <span className="accent-word">Design</span> &
              </TiltFlipRevealLine>
              <TiltFlipRevealLine x={heroThirdX} delay={0.44} viewportAmount={0.2} className="whitespace-nowrap tracking-[-0.025em] md:tracking-[-0.03em]">
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

function ScrollCoverSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      id="intro"
      className={`scroll-cover-section relative z-20 min-h-[92svh] bg-background px-6 pb-4 pt-[8vh] text-center md:min-h-[140svh] md:pb-9 md:pt-[10vh] ${className}`}
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
  children: ReactNode
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
  colorClassName = 'text-white',
  x,
}: {
  children: ReactNode
  className?: string
  colorClassName?: string
  x?: MotionValue<number>
}) {
  return (
    <TiltFlipRevealLine
      className={`whitespace-nowrap text-left text-[clamp(2.8rem,13vw,3.25rem)] font-medium uppercase leading-[0.95] tracking-[-0.035em] md:text-[clamp(5rem,13.8vw,200px)] md:leading-[0.88] md:tracking-[-0.075em] ${colorClassName} ${className ?? ''}`}
      x={x}
    >
      {children}
    </TiltFlipRevealLine>
  )
}

function ContactFlipPair({ className = '', lines }: { className?: string; lines: [string, string] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{
        amount: 0.72,
        margin: '0px 0px -8% 0px',
        once: true,
      }}
      className="space-y-1.5 md:space-y-3"
    >
      {lines.map((line) => (
        <span
          key={line}
          className={`block perspective-[1400px] whitespace-nowrap text-left text-[clamp(3.35rem,15.5vw,4.15rem)] font-medium uppercase leading-[0.86] tracking-[-0.055em] text-white md:text-[clamp(4rem,12vw,200px)] md:leading-[0.88] md:tracking-[-0.075em] ${className}`}
          style={{
            perspective: 1400,
            perspectiveOrigin: '50% 60%',
          }}
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, rotateX: -58, rotateY: -3, rotateZ: 0.35 },
              show: { opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
            }}
            transition={{
              duration: 2.25,
              delay: 0,
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
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}

function AboutFlipRevealWord({
  children,
  className,
  x,
}: {
  children: ReactNode
  className?: string
  x?: MotionValue<number>
}) {
  return (
    <TiltFlipRevealLine
      className={`whitespace-nowrap py-[0.02em] text-left text-[clamp(3.9rem,18vw,5.2rem)] font-medium uppercase leading-[0.82] tracking-[-0.065em] text-black md:text-[200px] md:leading-[0.95] md:tracking-[-0.075em] ${className ?? ''}`}
      x={x}
    >
      {children}
    </TiltFlipRevealLine>
  )
}

function AboutFlipRevealPair({
  rows,
}: {
  rows: Array<{ className?: string; text: string; x?: MotionValue<number> }>
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.82, margin: '0px 0px -8% 0px' }}
      className="space-y-1 md:space-y-3"
    >
      {rows.map((row) => (
        <motion.span
          key={row.text}
          className={`block perspective-[1400px] whitespace-nowrap py-[0.02em] text-left text-[clamp(3.9rem,18vw,5.2rem)] font-medium uppercase leading-[0.82] tracking-[-0.065em] text-black md:text-[200px] md:leading-[0.95] md:tracking-[-0.075em] ${row.className ?? ''}`}
          style={{
            perspective: 1400,
            perspectiveOrigin: '50% 60%',
            x: row.x,
          }}
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, rotateX: -58, rotateY: -3, rotateZ: 0.35 },
              show: { opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
            }}
            transition={{
              duration: 2.25,
              delay: 0,
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
            {row.text}
          </motion.span>
        </motion.span>
      ))}
    </motion.div>
  )
}

function UnderlineField({
  className = '',
  id,
  multiline = false,
  name,
  placeholder,
  type = 'text',
}: {
  className?: string
  id: string
  multiline?: boolean
  name: string
  placeholder: string
  type?: 'email' | 'text'
}) {
  const inputClassName =
    'block w-full border-0 border-b border-white/35 bg-transparent px-0 text-left text-base text-white outline-none transition placeholder:text-white/45 focus:border-white/35'

  return (
    <div className={`group/field relative ${className}`}>
      <label className="sr-only" htmlFor={id}>
        {placeholder}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          rows={3}
          className={`${inputClassName} min-h-28 resize-y py-5`}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          className={`${inputClassName} h-14`}
        />
      )}
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 group-hover/field:scale-x-100 group-focus-within/field:scale-x-100" />
    </div>
  )
}

function CoverStatementSection() {
  const statementRef = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktopBreakpoint()
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ['start 78%', 'end 22%'],
  })
  const mobileStatementOffsets = { business: -18, elevated: 3, growFast: -30, standOut: 30, your: 18 }
  const desktopStatementOffsets = { business: -92, elevated: 10, growFast: -140, standOut: 132, your: 88 }
  const statementOffsets = isDesktop ? desktopStatementOffsets : mobileStatementOffsets
  const yourX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.your])
  const businessX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.business])
  const elevatedX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.elevated])
  const standOutX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.standOut])
  const growFastX = useTransform(scrollYProgress, [0, 1], [0, statementOffsets.growFast])

  return (
    <ScrollCoverSection>
      <div className="scroll-cover-background pointer-events-none absolute inset-0 overflow-hidden bg-black">
        <HlsBackgroundVideo
          src={ctaStream}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />
      </div>

      <div
        ref={statementRef}
        className="relative z-10 mx-auto flex min-h-[86svh] max-w-[92rem] flex-col justify-start pt-4 md:min-h-[115svh] md:pt-0"
      >
        <h2 className="sr-only">Your Business, Elevated, Stand Out, Grow Fast</h2>
        <div aria-hidden="true" className="space-y-2 md:space-y-3">
          <FlipRevealWord x={yourX} className="statement-display-row">YOUR</FlipRevealWord>
          <FlipRevealWord x={businessX} className="statement-display-row md:pl-[3vw]">BUSINESS</FlipRevealWord>
          <FlipRevealWord x={elevatedX} className="statement-display-row font-melodrama-display font-normal md:-ml-[2vw]">ELEVATED</FlipRevealWord>
          <FlipRevealWord x={standOutX} className="statement-display-row -ml-5 pt-16 md:ml-0 md:pt-32">STAND OUT</FlipRevealWord>
          <FlipRevealWord x={growFastX} className="statement-display-row font-melodrama-display font-normal">GROW FAST</FlipRevealWord>
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
        Websites should look sharp and <span>perform.</span>
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

function FeaturedWorkSection({ isLightActive = false }: { isLightActive?: boolean }) {
  return (
    <section id="work" className="px-6 py-24 md:px-12 md:py-44">
      <div className="mx-auto w-full">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-6xl text-center text-[2.55rem] font-medium leading-[0.98] tracking-[-0.045em] md:text-6xl md:leading-[1.02] md:tracking-[-1px] lg:text-7xl"
        >
          <span className="md:hidden">We&apos;re a digital-first design agency where creativity meets technology.</span>
          <span className="hidden md:inline">
            <AnimatedLetterText letterStep={0.012} letterDuration={0.16}>
              We're a digital-first design agency where creativity meets technology.
            </AnimatedLetterText>
          </span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.04)}
          className="accent-text mt-16 text-left text-xs font-medium uppercase tracking-[2.5px] md:mt-32 md:text-sm"
        >
          Recent Work
        </motion.p>

        <div className="work-grid mt-4 grid gap-x-3 gap-y-9 sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-4">
          {workItems.map((work, index) => (
            <RecentWorkCard
              key={work.title}
              index={index}
              isLightActive={isLightActive}
              work={work}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function RecentWorkCard({
  index,
  isLightActive,
  work,
}: {
  index: number
  isLightActive: boolean
  work: (typeof workItems)[number]
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <a
      href="#work"
      className="work-card group block transition duration-300"
      aria-label={`${work.title} project placeholder`}
    >
      <div className="accent-work-media relative aspect-square overflow-hidden rounded-2xl bg-transparent md:rounded-3xl">
        <img
          src={work.image}
          alt=""
          className={`h-full w-full scale-105 object-cover opacity-0 transition-[opacity,transform] duration-500 ease-out md:group-hover:scale-100 ${
            isImageLoaded ? 'opacity-100' : ''
          }`}
          style={{ transitionDelay: isImageLoaded ? `${index * 80}ms` : '0ms' }}
          decoding="async"
          loading="eager"
          onError={() => setIsImageLoaded(true)}
          onLoad={(event) => {
            const image = event.currentTarget
            void image.decode().then(
              () => setIsImageLoaded(true),
              () => setIsImageLoaded(true),
            )
          }}
        />
      </div>
      <h3 className={`mt-3 text-base font-semibold transition-colors duration-700 md:mt-4 md:text-lg ${
        isLightActive ? 'text-black' : 'text-white'
      }`}>{work.title}</h3>
      <p className={`mt-1 text-xs uppercase tracking-[2px] transition-colors duration-700 ${
        isLightActive ? 'text-black/55' : 'accent-text opacity-80'
      }`}>{work.type}</p>
    </a>
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
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.72, margin: '0px 0px -8% 0px' }}
      className={`block overflow-visible ${className}`}
      aria-label={children}
    >
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
    </motion.span>
  )
}

function MissionSection({ isLightActive = false }: { isLightActive?: boolean }) {
  return (
    <section
      id="about"
      className={`mission-light-section relative min-h-[82svh] overflow-hidden px-6 py-20 transition-colors duration-700 md:min-h-[150svh] md:px-12 md:py-44 ${
        isLightActive ? 'bg-white text-black' : 'bg-background text-white'
      }`}
    >
      <h2 className="sr-only">Shape A Better Future</h2>
      <motion.p
        {...fadeUp(0.02)}
        className="accent-text absolute left-6 top-20 z-10 text-left text-xs font-medium uppercase tracking-[2.5px] md:hidden"
      >
        Our Purpose
      </motion.p>
      <motion.p
        {...fadeUp(0.08)}
        className={`relative z-10 mt-[52svh] max-w-[23rem] text-lg font-medium leading-8 tracking-[-0.01em] transition-colors duration-700 md:absolute md:left-12 md:top-16 md:mt-0 md:max-w-[30rem] md:text-[1.35rem] md:leading-9 ${
          isLightActive ? 'text-black/85' : 'text-white/85'
        }`}
      >
        Since our inception, we&rsquo;ve been committed to using our creativity and
        resources to shape a better future for all. That means creating positive
        impact&mdash;for our business, our people, and our community.
      </motion.p>
      <motion.div
        {...fadeUp(0.18)}
        className="relative z-10 mt-8 max-w-[24rem] md:absolute md:left-12 md:top-[61%] md:mt-0 md:max-w-[34rem]"
      >
        <p className={`text-lg font-medium leading-8 tracking-[-0.01em] transition-colors duration-700 md:text-[1.35rem] md:leading-9 ${
          isLightActive ? 'text-black/85' : 'text-white/85'
        }`}>
          We are united by a strong set of values that drive us in all parts of our
          work. We put people first, we pursue excellence in all we do, we embrace
          a growth mindset, and we are dedicated to applying truth in action.
        </p>
        <a
          href="/about"
          className={`circle-reveal group/about mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-full px-8 text-base font-semibold transition duration-300 md:h-16 md:px-10 md:text-lg ${
            isLightActive
              ? 'light-circle-reveal border border-black/40 bg-white text-black'
              : 'border border-white/40 bg-black text-white'
          }`}
        >
          <span>Learn more about us</span>
          <span className="relative inline-flex h-5 w-5 items-center justify-center overflow-hidden">
            <ArrowRight className="h-5 w-5 transition duration-200 md:group-hover/about:translate-x-5 md:group-hover/about:opacity-0" aria-hidden="true" />
            <ArrowRight className={`absolute h-5 w-5 -translate-x-5 opacity-0 transition duration-200 md:group-hover/about:translate-x-0 md:group-hover/about:opacity-100 ${
              isLightActive ? 'text-foreground' : 'text-background'
            }`} aria-hidden="true" />
          </span>
        </a>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className={`absolute left-6 top-0 h-full w-[calc(100%_-_3rem)] max-w-[23rem] transition-colors duration-700 md:inset-0 md:h-auto md:w-auto md:max-w-none ${
          isLightActive ? 'text-neutral-400' : 'text-white'
        }`}
      >
        <AnimatedLetterLine
          delay={0}
          className="absolute right-0 top-[18%] text-right text-[6.95rem] font-light leading-[0.78] tracking-[-0.085em] md:right-[10vw] md:top-16 md:text-[clamp(9rem,31vw,25.625rem)] md:font-medium md:tracking-normal"
        >
          Shape
        </AnimatedLetterLine>
        <AnimatedLetterLine
          delay={0}
          className="absolute left-0 top-[29.75%] -translate-y-1/2 text-left text-[5.15rem] font-light leading-[0.88] tracking-[-0.075em] md:left-12 md:top-[40%] md:text-[clamp(5rem,18vw,16rem)] md:font-semibold md:leading-[0.85] md:tracking-normal"
        >
          A better
        </AnimatedLetterLine>
        <AnimatedLetterLine
          delay={0}
          className="purpose-future-word font-melodrama-display absolute right-0 top-[37.2%] -translate-y-1/2 text-right text-[6.95rem] font-normal leading-[0.78] tracking-[-0.11em] md:right-[7vw] md:top-[68%] md:text-[clamp(9rem,30vw,25rem)] md:tracking-normal"
        >
          Future.
        </AnimatedLetterLine>
      </motion.div>
    </section>
  )
}

function SolutionSection({ isLightActive = false }: { isLightActive?: boolean }) {
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
      className="px-6 py-20 transition-colors duration-700 md:py-44"
    >
      <div className="mx-auto max-w-6xl text-left">
        <motion.h2
          {...fadeUp(0)}
          className={`mb-12 text-4xl font-semibold leading-tight tracking-[-0.04em] transition-colors duration-700 md:mb-16 md:text-[2.65rem] ${
            isLightActive ? 'text-black' : 'text-white'
          }`}
        >
          Key elements of a successful website
        </motion.h2>
        <div>
          <motion.p
            {...fadeUp(0.08)}
            className={`max-w-5xl text-2xl font-light leading-[1.45] tracking-[-0.04em] transition-colors duration-700 md:text-[2rem] md:leading-[1.48] ${
              isLightActive ? 'text-black/80' : 'text-white/80'
            }`}
          >
            A good website is characterized by its high-quality design, informative
            content, optimal performance, and its ability to authentically
            represent your company's identity.
          </motion.p>
          <motion.p
            {...fadeUp(0.16)}
            className={`mt-14 max-w-4xl text-2xl font-light leading-[1.45] tracking-[-0.04em] transition-colors duration-700 md:mt-16 md:text-[2rem] md:leading-[1.48] ${
              isLightActive ? 'text-black/80' : 'text-white/80'
            }`}
          >
            It serves as a crucial platform for engaging potential customers while
            also providing a digital manifestation of your brand.
          </motion.p>
        </div>

        <div className={`mt-16 border-t transition-colors duration-700 md:mt-20 ${
          isLightActive ? 'border-black/25' : 'border-white/35'
        }`}>
          {accordionItems.map((item, index) => {
            const isOpen = activeAccordionItem === item.id

            return (
              <motion.div
                key={item.id}
                {...fadeUp(index * 0.08)}
                className={`border-b py-10 transition-colors duration-700 md:py-12 ${
                  isLightActive ? 'border-black/15' : 'border-white/20'
                }`}
              >
                <button
                  type="button"
                  className="accent-arrow-group group grid w-full grid-cols-[minmax(0,1fr)_80px] items-center gap-3 text-left md:grid-cols-[minmax(0,1fr)_190px] md:gap-8"
                  aria-expanded={isOpen}
                  onClick={() => setActiveAccordionItem((activeItem) => (activeItem === item.id ? null : item.id))}
                >
                  <span className={`min-w-0 text-[clamp(2.25rem,11vw,3rem)] uppercase leading-none tracking-[-0.04em] transition-colors duration-700 md:text-[4.7rem] ${
                    isLightActive ? 'text-black' : 'text-white'
                  }`}>
                    {item.title}
                  </span>
                  <span
                    className={`accent-arrow-target flex h-16 w-16 items-center justify-center justify-self-center transition duration-500 md:h-40 md:w-52 md:justify-self-end ${
                      isLightActive ? 'text-black' : 'text-white'
                    } ${
                      isOpen ? 'accent-arrow-active rotate-45' : '-rotate-45'
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
                      <p className={`mt-10 max-w-4xl text-base leading-8 transition-colors duration-700 md:text-xl md:leading-9 ${
                        isLightActive ? 'text-black/75' : 'text-white'
                      }`}>
                        {item.text}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
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
      className="flex min-h-[520px] flex-col rounded-lg border border-white/20 bg-black p-6 text-white"
      aria-label={`${plan.title} plan`}
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            {plan.title}
          </span>
          {plan.featured ? (
            <span className="accent-badge rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
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
          className="circle-reveal pricing-button group/price inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-black text-sm font-semibold text-white transition duration-300"
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
  const footerContentOpacity = useTransform(revealProgress, [0.06, 0.68], [0, 1])
  const footerContentY = useTransform(revealProgress, [0.06, 0.68], [64, 0])

  return (
    <footer
      className="sticky bottom-0 z-0 mt-16 min-h-svh bg-background px-6 pb-10 pt-24 md:mt-32 md:min-h-screen md:px-12 md:pb-24 md:pt-48"
    >
      <motion.div
        style={{ opacity: footerContentOpacity, y: footerContentY }}
        className="mx-auto flex min-h-[calc(100svh-8.5rem)] w-full max-w-6xl translate-y-5 flex-col justify-center md:min-h-[calc(100svh-11rem)] md:translate-y-0 md:justify-between"
      >
        <div className="grid gap-8 md:gap-16 md:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] md:items-end">
          <div>
            <h2 className="max-w-3xl text-[4rem] font-medium leading-[0.9] tracking-[-1px] md:text-8xl md:leading-[0.9] lg:text-9xl">
              Let&rsquo;s work
              <span className="block">Together</span>
            </h2>
            <a
              href="mailto:hello@phaseonedigital.co"
              className="circle-reveal group/footer-contact mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-black px-6 text-sm font-semibold text-white transition duration-300 md:mt-10"
            >
              <span>Get in touch</span>
              <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
                <ArrowRight className="h-4 w-4 transition duration-200 md:group-hover/footer-contact:translate-x-5 md:group-hover/footer-contact:opacity-0" aria-hidden="true" />
                <ArrowRight className="absolute h-4 w-4 -translate-x-5 text-background opacity-0 transition duration-200 md:group-hover/footer-contact:translate-x-0 md:group-hover/footer-contact:opacity-100" aria-hidden="true" />
              </span>
            </a>

            <div className="mt-8 space-y-2.5 text-lg text-foreground md:mt-16 md:space-y-3 md:text-xl">
              <a href="mailto:hello@phaseonedigital.co" className="group/contact relative block w-fit">
                hello@phaseonedigital.co
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 md:group-hover/contact:scale-x-100" />
              </a>
              <a href="tel:+14155501984" className="group/contact relative block w-fit">
                +1 (415) 550-1984
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 md:group-hover/contact:scale-x-100" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
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

            <div className="mt-6 text-foreground md:mt-8">
              <PhaseOneLogo footer />
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

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname)

    window.addEventListener('popstate', updatePathname)
    window.addEventListener('hashchange', updatePathname)

    return () => {
      window.removeEventListener('popstate', updatePathname)
      window.removeEventListener('hashchange', updatePathname)
    }
  }, [])

  return pathname
}

function useMorphingContactDome() {
  useEffect(() => {
    let animationFrame = 0

    const updateDomeShape = () => {
      document.querySelectorAll<HTMLElement>('.about-contact-cover').forEach((cover) => {
        const viewportWidth = window.innerWidth
        const isDesktopViewport = viewportWidth >= 768
        const arcOffset = isDesktopViewport
          ? Math.min(Math.max(viewportWidth * 0.34, 340), 560)
          : Math.min(Math.max(viewportWidth * 0.28, 220), 340)
        const domeTop = cover.getBoundingClientRect().top - arcOffset
        const progress = Math.min(Math.max((window.innerHeight - domeTop) / (window.innerHeight - 120), 0), 1)
        const heightMultiplier = isDesktopViewport ? 3.1 - progress * 0.35 : 2.18 - progress * 0.22
        const widthVw = isDesktopViewport ? 172 + progress * 18 : 200 + progress * 14
        const topOffset = arcOffset * (isDesktopViewport ? 1.08 - progress * 0.08 : 0.86 - progress * 0.07)

        cover.style.setProperty('--about-dome-width', `${widthVw}vw`)
        cover.style.setProperty('--about-dome-height', `${arcOffset * heightMultiplier}px`)
        cover.style.setProperty('--about-dome-top', `${topOffset * -1}px`)
      })
    }

    const scheduleDomeShapeUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateDomeShape)
    }

    updateDomeShape()
    window.addEventListener('scroll', scheduleDomeShapeUpdate, { passive: true })
    window.addEventListener('resize', scheduleDomeShapeUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', scheduleDomeShapeUpdate)
      window.removeEventListener('resize', scheduleDomeShapeUpdate)
    }
  }, [])
}

function QuestionContactSection({
  contentClassName = '',
  coverClassName = '',
  headingLayout = 'stacked',
  id = 'works-contact',
  sectionClassName = '',
}: {
  contentClassName?: string
  coverClassName?: string
  headingLayout?: 'stacked' | 'paired'
  id?: string
  sectionClassName?: string
}) {
  return (
    <ScrollCoverSection className={coverClassName}>
      <section
        id={id}
        className={`mx-auto flex min-h-[120svh] max-w-[92rem] flex-col items-center justify-center py-16 text-center md:min-h-[140svh] md:py-24 ${sectionClassName}`}
      >
        <div className={`w-full ${contentClassName}`}>
          <h2 className="sr-only">Have a question? Book a free call.</h2>
          {headingLayout === 'paired' ? (
            <div aria-hidden="true" className="mx-auto w-fit max-w-full space-y-2 text-left md:space-y-3">
              <ContactFlipPair lines={['HAVE A', 'QUESTION?']} />
              <ContactFlipPair className="font-melodrama-display font-normal" lines={['BOOK A FREE', 'CALL.']} />
            </div>
          ) : (
            <div aria-hidden="true" className="mx-auto w-fit max-w-full space-y-2 text-left md:space-y-3">
              <FlipRevealWord>HAVE A</FlipRevealWord>
              <FlipRevealWord>QUESTION?</FlipRevealWord>
              <FlipRevealWord className="font-melodrama-display font-normal">BOOK A FREE</FlipRevealWord>
              <FlipRevealWord className="font-melodrama-display font-normal">CALL.</FlipRevealWord>
            </div>
          )}

          <motion.form
            {...fadeUp(0.18)}
            className="mx-auto mt-16 grid w-full max-w-4xl gap-x-8 gap-y-8 md:mt-24 md:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <UnderlineField
              id={`${id}-name`}
              name="name"
              placeholder="Name"
            />
            <UnderlineField
              id={`${id}-email`}
              type="email"
              name="email"
              placeholder="Email"
            />
            <UnderlineField
              className="md:col-span-2"
              id={`${id}-message`}
              multiline
              name="message"
              placeholder="Message"
            />
            <button
              type="submit"
              className="circle-reveal group/send-message mx-auto inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full border border-white/40 bg-black px-8 text-sm font-semibold uppercase tracking-[0.08em] text-white transition duration-300 md:col-span-2"
            >
              <span>SEND</span>
              <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
                <ArrowRight className="h-4 w-4 transition duration-200 md:group-hover/send-message:translate-x-5 md:group-hover/send-message:opacity-0" aria-hidden="true" />
                <ArrowRight className="absolute h-4 w-4 -translate-x-5 text-background opacity-0 transition duration-200 md:group-hover/send-message:translate-x-0 md:group-hover/send-message:opacity-100" aria-hidden="true" />
              </span>
            </button>
          </motion.form>
        </div>
      </section>
    </ScrollCoverSection>
  )
}

function WorksPage() {
  const worksRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: worksRef,
    offset: ['start start', 'end end'],
  })
  const galleryY = useTransform(scrollYProgress, [0, 0.58, 1], ['0vh', '-190vh', '-190vh'])

  useMorphingContactDome()

  return (
    <div ref={worksRef} className="relative h-[505svh] bg-background md:h-[550svh]">
      <section className="sticky top-0 z-0 h-screen overflow-hidden bg-white px-6 pt-24 text-black md:px-12 md:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-[16svh] z-0 flex justify-center px-6 text-center">
          <motion.h1
            {...fadeUp(0)}
            className="text-[clamp(5rem,22vw,22rem)] font-medium uppercase leading-[0.78] tracking-[-0.075em] text-black"
          >
            WORKS
          </motion.h1>
        </div>

        <motion.div style={{ y: galleryY }} className="absolute inset-x-0 top-28 z-10 h-[260svh] md:top-32">
          {workPills.map((work, index) => (
            <motion.a
              key={work.title}
              href="#works-contact"
              {...fadeUp(0.08 + index * 0.06)}
              className={`group/work-pill absolute block w-[88vw] max-w-[770px] text-black md:w-[770px] ${work.className}`}
            >
              <span className="accent-work-media relative block h-64 overflow-hidden rounded-full border border-accent bg-white md:h-[480px]">
                <img
                  src={work.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <img
                  src={work.hoverImage}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-black/18" />
              </span>
              <span className="mt-5 block px-2 text-center md:mt-6 md:px-4">
                <span className="block whitespace-nowrap text-xl font-medium uppercase tracking-[-0.02em] md:text-3xl">
                  {work.title}
                </span>
                <span className="accent-text mt-2.5 block text-sm font-medium uppercase tracking-[2.5px] md:text-base">
                  {work.type}
                </span>
              </span>
            </motion.a>
          ))}
        </motion.div>
      </section>

      <div className="absolute inset-x-0 bottom-0 top-[405svh] z-10 bg-background md:top-[450svh]" aria-hidden="true" />

      <div className="absolute inset-x-0 top-[405svh] z-20 md:top-[450svh]">
        <QuestionContactSection
          id="works-contact"
          contentClassName="-mt-24 md:-mt-72"
          coverClassName="about-contact-cover"
          headingLayout="paired"
          sectionClassName="!min-h-0 justify-start !py-0 pb-0 md:!min-h-0 md:!py-0 md:pb-0"
        />
      </div>
    </div>
  )
}

function AboutPage() {
  const aboutRef = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktopBreakpoint()
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ['start 80%', 'end 20%'],
  })
  const offsets = isDesktop
    ? { first: 92, fourth: -88, second: 14, fifth: -138, third: 122 }
    : { first: 18, fourth: -18, second: 4, fifth: -26, third: 24 }
  const firstX = useTransform(scrollYProgress, [0, 1], [0, offsets.first])
  const secondX = useTransform(scrollYProgress, [0, 1], [0, offsets.second])
  const thirdX = useTransform(scrollYProgress, [0, 1], [0, offsets.third])
  const fourthX = useTransform(scrollYProgress, [0, 1], [0, offsets.fourth])
  const fifthX = useTransform(scrollYProgress, [0, 1], [0, offsets.fifth])

  useEffect(() => {
    let animationFrame = 0

    const updateDomeShape = () => {
      const cover = document.querySelector<HTMLElement>('.about-contact-cover')

      if (!cover) {
        return
      }

      const viewportWidth = window.innerWidth
      const isDesktopViewport = viewportWidth >= 768
      const arcOffset = isDesktopViewport
        ? Math.min(Math.max(viewportWidth * 0.34, 340), 560)
        : Math.min(Math.max(viewportWidth * 0.28, 220), 340)
      const domeTop = cover.getBoundingClientRect().top - arcOffset
      const progress = Math.min(Math.max((window.innerHeight - domeTop) / (window.innerHeight - 120), 0), 1)
      const heightMultiplier = isDesktopViewport ? 3.1 - progress * 0.35 : 2.18 - progress * 0.22
      const widthVw = isDesktopViewport ? 172 + progress * 18 : 200 + progress * 14
      const topOffset = arcOffset * (isDesktopViewport ? 1.08 - progress * 0.08 : 0.86 - progress * 0.07)

      cover.style.setProperty('--about-dome-width', `${widthVw}vw`)
      cover.style.setProperty('--about-dome-height', `${arcOffset * heightMultiplier}px`)
      cover.style.setProperty('--about-dome-top', `${topOffset * -1}px`)
    }

    const scheduleDomeShapeUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateDomeShape)
    }

    updateDomeShape()
    window.addEventListener('scroll', scheduleDomeShapeUpdate, { passive: true })
    window.addEventListener('resize', scheduleDomeShapeUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', scheduleDomeShapeUpdate)
      window.removeEventListener('resize', scheduleDomeShapeUpdate)
    }
  }, [])

  return (
    <>
      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-28 text-center text-black md:px-12">
        <motion.h1
          {...fadeUp(0)}
          className="text-center text-[clamp(4rem,17vw,17rem)] font-medium uppercase leading-[0.8] tracking-[-0.07em]"
        >
          ABOUT US
        </motion.h1>
      </section>

      <section className="bg-white px-6 pb-[26rem] pt-12 text-black md:px-12 md:pb-[46rem] md:pt-24">
        <div ref={aboutRef} className="mx-auto max-w-[92rem]">
          <p className="sr-only">
            We design, optimize and market your brand online.
          </p>
          <div aria-hidden="true" className="-ml-4 w-fit max-w-full space-y-1 overflow-visible px-[0.08em] text-left md:mx-auto md:ml-auto md:space-y-3">
            <AboutFlipRevealWord x={firstX}>WE DESIGN</AboutFlipRevealWord>
            <AboutFlipRevealWord x={secondX}><span className="accent-word">OPTIMIZE</span> &amp;</AboutFlipRevealWord>
            <AboutFlipRevealWord x={thirdX}>MARKET</AboutFlipRevealWord>
            <AboutFlipRevealPair
              rows={[
                { text: 'YOUR BRAND', x: fourthX, className: 'font-melodrama-display font-normal' },
                { text: 'ONLINE', x: fifthX, className: 'font-melodrama-display font-normal' },
              ]}
            />
          </div>

          <motion.div
            {...fadeUp(0.28)}
            className="mt-20 text-left md:ml-[32vw] md:mt-28 md:max-w-[42rem]"
          >
            <div className="max-w-md">
              <p className="accent-text text-xs font-semibold uppercase tracking-[0.22em]">
                What We Solve
              </p>
              <h2 className="mt-5 max-w-md text-3xl font-medium leading-[1.05] tracking-[-0.04em] text-black md:text-5xl">
                Online presence should not hold the business back.
              </h2>
            </div>

            <div className="mt-12 space-y-8 text-lg leading-8 text-black/72 md:mt-16 md:text-[2rem] md:leading-[1.38]">
              <p>
                As a web development, design, SEO, and social marketing studio, we
                help companies fix the digital problems that quietly cost them
                attention, trust, and conversions.
              </p>

              <div className="space-y-10 md:space-y-14">
                {[
                  'Outdated or poorly structured websites that fail to communicate the brand, offer, and value clearly.',
                  'Confusing user journeys that make visitors work too hard, increasing bounce rates and lowering conversions.',
                  'Slow, unresponsive, or mobile-unfriendly experiences that make the business feel less credible.',
                  'Limited functionality, weak SEO foundations, and disconnected marketing systems that make growth harder than it needs to be.',
                ].map((item) => (
                  <p key={item} className="flex gap-5 text-black/68">
                    <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-black/70" aria-hidden="true" />
                    <span>{item}</span>
                  </p>
                ))}
              </div>

              <p>
                We bring strategy, interface design, modern development, SEO, and
                campaign thinking together to build websites that look sharp, work
                smoothly, and stay aligned with real business goals.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <QuestionContactSection
        id="about-contact"
        contentClassName="-mt-24 md:-mt-72"
        coverClassName="about-contact-cover"
        headingLayout="paired"
        sectionClassName="!min-h-0 justify-start !py-0 pb-0 md:!min-h-0 md:!py-0 md:pb-0"
      />
    </>
  )
}

function ContactPage() {
  return (
    <>
      <section className="min-h-screen overflow-hidden bg-white text-black">
        <div className="flex min-h-[58svh] items-center justify-center px-6 pb-16 pt-28 text-center md:px-12 md:pt-32">
          <motion.h1
            {...fadeUp(0)}
            className="text-[clamp(4.8rem,18vw,18rem)] font-medium uppercase leading-[0.78] tracking-[-0.040em]"
          >
            CONTACT
          </motion.h1>
        </div>

        <div className="contact-hero-dome contact-dark-start relative min-h-[42svh] bg-background px-6 pb-16 pt-16 text-white md:px-12 md:pb-20 md:pt-20">
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <motion.p
              {...fadeUp(0.08)}
              className="mx-auto max-w-2xl text-xl leading-8 text-white/80 md:text-2xl md:leading-9"
            >
              Book a free consultation call or just type us.
              <br />
              Let&rsquo;s meet and talk about your brand.
            </motion.p>

            <motion.form
              {...fadeUp(0.18)}
              className="mx-auto mt-12 grid w-full max-w-4xl gap-x-8 gap-y-8 md:mt-16 md:grid-cols-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <UnderlineField
                id="contact-name"
                name="name"
                placeholder="Name"
              />
              <UnderlineField
                id="contact-email"
                type="email"
                name="email"
                placeholder="Email"
              />
              <UnderlineField
                className="md:col-span-2"
                id="contact-message"
                multiline
                name="message"
                placeholder="Message"
              />
              <button
                type="submit"
                className="circle-reveal group/contact-send mx-auto inline-flex h-14 w-fit items-center justify-center gap-2 rounded-full border border-white/40 bg-black px-8 text-sm font-semibold uppercase tracking-[0.08em] text-white transition duration-300 md:col-span-2"
              >
                <span>SEND</span>
                <span className="relative inline-flex h-4 w-4 items-center justify-center overflow-hidden">
                  <ArrowRight className="h-4 w-4 transition duration-200 md:group-hover/contact-send:translate-x-5 md:group-hover/contact-send:opacity-0" aria-hidden="true" />
                  <ArrowRight className="absolute h-4 w-4 -translate-x-5 text-background opacity-0 transition duration-200 md:group-hover/contact-send:translate-x-0 md:group-hover/contact-send:opacity-100" aria-hidden="true" />
                </span>
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="bg-background px-6 py-20 text-center text-white md:px-12 md:py-28">
        <motion.div
          {...fadeUp(0)}
          className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-3 md:gap-8"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              Location
            </p>
            <p className="mt-4 text-lg leading-7 text-white md:text-2xl md:leading-8">
              428 Market Street, Suite 1200
              <br />
              San Francisco, CA 94111
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              Email
            </p>
            <a
              href="mailto:hello@phaseonedigital.co"
              className="group/contact relative mt-4 inline-block w-fit text-lg text-white md:text-2xl"
            >
              hello@phaseonedigital.co
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 md:group-hover/contact:scale-x-100" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:pt-1">
            <p className="w-full text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              Socials
            </p>
            {socialLinks.map((social) => {
              const Icon = social.icon

              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="circle-reveal social-button inline-flex h-[55px] w-[55px] items-center justify-center rounded-full border border-white/25 bg-black text-white transition duration-300"
                  aria-label={social.label}
                >
                  {Icon ? (
                    <Icon className="social-button-icon h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <span className="social-button-icon text-base font-semibold">T</span>
                  )}
                </a>
              )
            })}
          </div>
        </motion.div>
      </section>
    </>
  )
}

function App() {
  const pageContentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isWorksPage = pathname === '/works'
  const isAboutPage = pathname === '/about'
  const isContactPage = pathname === '/contact'
  const isHomePage = pathname === '/'
  const [isHomeLightSectionActive, setIsHomeLightSectionActive] = useState(false)
  const { scrollYProgress: footerRevealProgress } = useScroll({
    target: pageContentRef,
    offset: ['end end', 'end start'],
  })

  useEffect(() => {
    if (!isHomePage) {
      setIsHomeLightSectionActive(false)
      return undefined
    }

    const updateHomeLightMode = () => {
      const lightSection = document.querySelector<HTMLElement>('.mission-light-section')

      if (!lightSection) {
        setIsHomeLightSectionActive(false)
        return
      }

      const rect = lightSection.getBoundingClientRect()
      const entersView = rect.top <= window.innerHeight * 0.72
      const hasNotPassed = rect.bottom > window.innerHeight * 0.34
      setIsHomeLightSectionActive(entersView && hasNotPassed)
    }

    updateHomeLightMode()
    window.addEventListener('scroll', updateHomeLightMode, { passive: true })
    window.addEventListener('resize', updateHomeLightMode)

    return () => {
      window.removeEventListener('scroll', updateHomeLightMode)
      window.removeEventListener('resize', updateHomeLightMode)
    }
  }, [isHomePage])

  return (
    <main className={`min-h-screen transition-colors duration-700 ${
      isHomeLightSectionActive ? 'bg-white text-black' : 'bg-background text-foreground'
    }`}>
      <SmoothScroll />
      <HashScroller />
      {/* Keep page content above the sticky footer until the footer reveal zone. */}
      <div ref={pageContentRef} className={`relative z-10 transition-colors duration-700 ${
        isHomeLightSectionActive ? 'bg-white' : 'bg-background'
      }`}>
        <Navbar
          isLightPage={isAboutPage || isWorksPage || isContactPage || isHomeLightSectionActive}
          pathname={pathname}
        />
        {isWorksPage ? (
          <WorksPage />
        ) : isAboutPage ? (
          <AboutPage />
        ) : isContactPage ? (
          <ContactPage />
        ) : (
          <>
            <HeroScrollScene />
            <FeaturedWorkSection isLightActive={isHomeLightSectionActive} />
            <MissionSection isLightActive={isHomeLightSectionActive} />
            <SolutionSection isLightActive={isHomeLightSectionActive} />
            <ServicesSection />
            <CtaSection />
          </>
        )}
      </div>
      {isContactPage ? null : <Footer revealProgress={footerRevealProgress} />}
    </main>
  )
}

export default App
