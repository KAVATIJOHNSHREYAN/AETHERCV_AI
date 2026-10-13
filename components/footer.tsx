import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Globe, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-blue-500/15 bg-[#0C162B]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Image
              src="/aethercv-logo.png"
              alt="AETHERCV AI"
              width={38}
              height={38}
              className="h-9 w-9 rounded-full object-cover shadow-[0_0_12px_rgba(37,99,235,0.4)] border border-blue-400/40"
              unoptimized
            />
            <div>
              <p className="text-sm text-[#9CAEC9] font-outfit">
                AETHERCV AI • Developed by{" "}
                <a 
                  href="https://kavatijohnshreyan-github-io.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-[#4F7DFF] transition-colors"
                >
                  Kavati John Shreyan
                </a>
              </p>
              <p className="text-xs text-[#64748B] mt-0.5 font-outfit">
                &copy; {new Date().getFullYear()} KL University • Unified Enterprise SaaS Suite
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/KAVATIJOHNSHREYAN/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#9CAEC9] hover:text-[#4F7DFF] transition-colors p-2 rounded-xl hover:bg-blue-600/15"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/kavati-john-shreyan-956a35366/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#9CAEC9] hover:text-[#4F7DFF] transition-colors p-2 rounded-xl hover:bg-blue-600/15"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://kavatijohnshreyan-github-io.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#9CAEC9] hover:text-[#4F7DFF] transition-colors p-2 rounded-xl hover:bg-blue-600/15"
              aria-label="Website"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a 
              href="mailto:johnshreyan83@gmail.com" 
              className="text-[#9CAEC9] hover:text-[#4F7DFF] transition-colors p-2 rounded-xl hover:bg-blue-600/15"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
