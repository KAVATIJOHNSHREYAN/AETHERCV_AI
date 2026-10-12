"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Laptop, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DeviceCompatibilityModal } from "@/components/device-compatibility-modal"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)
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

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Simple Calculator', href: '/simple' },
    { name: 'LTPS Calculator', href: '/ltps' },
    { name: 'Screenshot Calculator', href: '/screenshot' },
    { name: 'ERP Login', href: '/login' },
    { name: 'AI Resume Analyzer', href: '/resume-analyzer' },
    { name: 'AI Cover Letter', href: '/cover-letter' },
    { name: 'AI Resume Builder', href: '/resume-builder' },
    { name: 'LinkedIn Optimizer', href: '/linkedin' },
    { name: 'GitHub Optimizer', href: '/github' },
  ]

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
                width={44}
                height={44}
                className="h-9 sm:h-10 w-auto rounded-xl object-contain shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform"
                priority
              />
            </div>
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-3 lg:gap-5">
          <nav>
            <ul className="flex items-center gap-2 lg:gap-4">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all relative font-outfit ${
                        isActive
                          ? "bg-gradient-to-r from-[#4F7DFF] to-[#2563EB] text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]"
                          : "text-[#9CAEC9] hover:text-white hover:bg-blue-600/15"
                      }`}
                    >
                      {item.name}
                    </Link>
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0C162B]/95 backdrop-blur-xl border-b border-blue-500/20"
          >
            <nav className="container mx-auto px-4 py-3">
              <ul className="flex flex-col gap-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all block font-outfit ${
                          isActive
                            ? "bg-gradient-to-r from-[#4F7DFF] to-[#2563EB] text-white shadow-sm"
                            : "text-[#9CAEC9] hover:text-white hover:bg-blue-600/15"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
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
