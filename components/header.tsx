"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Laptop, Smartphone, ChevronDown, Calculator, FileText, SearchCheck, Mail, Linkedin, Github, LogIn, Camera, Sparkles, UserCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DeviceCompatibilityModal } from "@/components/device-compatibility-modal"

interface NavSubItem {
  name: string
  href: string
  badge?: string
  icon?: any
}

interface NavGroupItem {
  name: string
  href?: string
  subItems?: NavSubItem[]
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-expand active group on mobile
  useEffect(() => {
    navigationGroups.forEach((group) => {
      if (group.subItems?.some((sub) => sub.href === pathname)) {
        setMobileExpandedGroup(group.name)
      }
    })
  }, [pathname])

  const navigationGroups: NavGroupItem[] = [
    { name: 'Home', href: '/' },
    {
      name: 'LTPS Calculator',
      subItems: [
        { name: 'LTPS Calculator', href: '/ltps', icon: Calculator, badge: 'Weighted' },
        { name: 'Simple Calculator', href: '/simple', icon: Calculator },
        { name: 'Screenshot Calculator', href: '/screenshot', icon: Camera, badge: 'OCR' },
        { name: 'ERP Login', href: '/login', icon: LogIn, badge: 'Live ERP' },
      ],
    },
    {
      name: 'AI Resume Suite',
      subItems: [
        { name: 'AI Resume Builder', href: '/resume-builder', icon: FileText, badge: '15 Templates' },
        { name: 'AI Resume Analyzer', href: '/resume-analyzer', icon: SearchCheck, badge: '100-Pt ATS' },
        { name: 'AI Cover Letter', href: '/cover-letter', icon: Mail },
      ],
    },
    {
      name: 'Profile Optimizers',
      subItems: [
        { name: 'LinkedIn Optimizer', href: '/linkedin', icon: Linkedin, badge: 'Recruiter SEO' },
        { name: 'GitHub Optimizer', href: '/github', icon: Github, badge: 'Engineering' },
      ],
    },
  ]

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 160)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-3 ${
        isScrolled
          ? "bg-[#0C162B]/90 backdrop-blur-md border-b border-blue-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.3)] py-2.5"
          : "bg-transparent py-3.5 border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4 flex justify-between items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="relative flex items-center">
              <Image
                src="/aethercv-logo.png"
                alt="AETHERCV AI Logo"
                width={42}
                height={42}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shadow-[0_0_18px_rgba(37,99,235,0.55)] border border-blue-400/40 group-hover:scale-105 transition-transform"
                priority
                unoptimized
              />
            </div>
            <span className="font-poppins font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-sky-300 transition-colors">
              AETHERCV <span className="text-sky-400">AI</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation with Dropdown Groups */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <nav>
            <ul className="flex items-center gap-1.5 lg:gap-2">
              {navigationGroups.map((group, index) => {
                if (group.href) {
                  const isActive = pathname === group.href
                  return (
                    <motion.li
                      key={group.name}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        href={group.href}
                        prefetch={false}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all relative font-outfit ${
                          isActive
                            ? "bg-gradient-to-r from-[#4F7DFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                            : "text-[#9CAEC9] hover:text-white hover:bg-blue-600/15"
                        }`}
                      >
                        {group.name}
                      </Link>
                    </motion.li>
                  )
                }

                const isGroupActive = group.subItems?.some((sub) => sub.href === pathname)
                const isOpen = activeDropdown === group.name

                return (
                  <motion.li
                    key={group.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(group.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : group.name)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all relative font-outfit flex items-center gap-1.5 ${
                        isGroupActive
                          ? "bg-gradient-to-r from-[#4F7DFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                          : isOpen
                          ? "text-white bg-blue-600/20"
                          : "text-[#9CAEC9] hover:text-white hover:bg-blue-600/15"
                      }`}
                    >
                      <span>{group.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-white" : "text-[#9CAEC9]"
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && group.subItems && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1.5 w-56 rounded-2xl bg-[#0C162B]/95 backdrop-blur-xl border border-blue-500/25 p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.55)] z-50"
                        >
                          <ul className="flex flex-col gap-1">
                            {group.subItems.map((sub) => {
                              const isSubActive = pathname === sub.href
                              const IconComponent = sub.icon
                              return (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.href}
                                    prefetch={false}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold font-outfit transition-all flex items-center justify-between group ${
                                      isSubActive
                                        ? "bg-blue-600/25 text-white border border-blue-500/35 shadow-sm"
                                        : "text-[#9CAEC9] hover:text-white hover:bg-blue-600/15"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {IconComponent && (
                                        <IconComponent
                                          className={`w-3.5 h-3.5 ${
                                            isSubActive ? "text-sky-400" : "text-[#818cf8] group-hover:text-sky-400"
                                          }`}
                                        />
                                      )}
                                      <span>{sub.name}</span>
                                    </div>
                                    {sub.badge && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-sky-300 font-mono border border-blue-500/25">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setIsDeviceModalOpen(true)}
            className="relative p-2 rounded-xl text-[#9CAEC9] hover:text-white hover:bg-blue-600/15 transition-all border border-blue-500/20"
            title="Device & Screen Compatibility (Laptops, Tablets, Phones)"
          >
            <div className="relative flex items-center justify-center">
              <Laptop className="w-4 h-4 text-sky-400" />
              <Smartphone className="w-2.5 h-2.5 text-blue-300 absolute -bottom-1 -right-1.5 bg-[#0C162B] rounded-full p-0.5 border border-blue-400/40" />
            </div>
          </button>
          <ModeToggle />
        </div>

        {/* Mobile Action Controls */}
        <div className="md:hidden flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsDeviceModalOpen(true)}
            className="relative p-1.5 rounded-xl text-[#9CAEC9] hover:text-white hover:bg-blue-600/15 transition-all border border-blue-500/20"
            title="Device & Screen Compatibility"
          >
            <div className="relative flex items-center justify-center">
              <Laptop className="w-3.5 h-3.5 text-sky-400" />
              <Smartphone className="w-2.5 h-2.5 text-blue-300 absolute -bottom-1 -right-1 bg-[#0C162B] rounded-full p-0.5 border border-blue-400/40" />
            </div>
          </button>
          <ModeToggle />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#9CAEC9] hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <DeviceCompatibilityModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      {/* Mobile Menu with Expandable Sub-Groups */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0C162B]/95 backdrop-blur-xl border-b border-blue-500/20 max-h-[80vh] overflow-y-auto"
          >
            <nav className="container mx-auto px-4 py-3">
              <ul className="flex flex-col gap-2">
                {navigationGroups.map((group) => {
                  if (group.href) {
                    const isActive = pathname === group.href
                    return (
                      <li key={group.name}>
                        <Link
                          href={group.href}
                          prefetch={false}
                          className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all block font-outfit ${
                            isActive
                              ? "bg-gradient-to-r from-[#4F7DFF] to-[#2563EB] text-white shadow-sm"
                              : "text-[#9CAEC9] hover:text-white hover:bg-blue-600/15"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {group.name}
                        </Link>
                      </li>
                    )
                  }

                  const isGroupActive = group.subItems?.some((sub) => sub.href === pathname)
                  const isExpanded = mobileExpandedGroup === group.name

                  return (
                    <li key={group.name} className="rounded-xl border border-blue-500/15 bg-[#111D34]/40 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setMobileExpandedGroup(isExpanded ? null : group.name)}
                        className={`w-full text-xs font-semibold px-3 py-2.5 transition-all flex items-center justify-between font-outfit ${
                          isGroupActive
                            ? "text-sky-300 bg-blue-500/10 font-bold"
                            : "text-white hover:bg-blue-600/10"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{group.name}</span>
                          {isGroupActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          )}
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#9CAEC9] transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-sky-400" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && group.subItems && (
                        <div className="px-2 pb-2 pt-1 border-t border-blue-500/10 bg-[#0C162B]/60">
                          <ul className="flex flex-col gap-1">
                            {group.subItems.map((sub) => {
                              const isSubActive = pathname === sub.href
                              const IconComponent = sub.icon
                              return (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.href}
                                    prefetch={false}
                                    className={`text-xs font-medium px-3 py-2 rounded-lg transition-all flex items-center justify-between font-outfit ${
                                      isSubActive
                                        ? "bg-gradient-to-r from-[#4F7DFF] to-[#2563EB] text-white shadow-sm"
                                        : "text-[#9CAEC9] hover:text-white hover:bg-blue-600/15"
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    <div className="flex items-center gap-2">
                                      {IconComponent && <IconComponent className="w-3.5 h-3.5 text-sky-400" />}
                                      <span>{sub.name}</span>
                                    </div>
                                    {sub.badge && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
