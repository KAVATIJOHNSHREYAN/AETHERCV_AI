import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Globe, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Image
              src="/aethercv-logo.png"
              alt="AETHERCV AI"
              width={38}
              height={38}
              className="h-9 w-9 rounded-xl object-contain shadow-sm border border-blue-500/20"
            />
            <div>
              <p className="text-sm text-muted-foreground font-outfit">
                AETHERCV AI • Developed by{" "}
                <a 
                  href="https://kavatijohnshreyan-github-io.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-foreground hover:text-blue-500 transition-colors"
                >
                  Kavati John Shreyan
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                &copy; {new Date().getFullYear()} KL University
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/KAVATIJOHNSHREYAN/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/kavati-john-shreyan-956a35366/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://kavatijohnshreyan-github-io.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500 transition-colors"
              aria-label="Website"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a 
              href="mailto:2400033326cse2@gmail.com" 
              className="text-muted-foreground hover:text-blue-500 transition-colors"
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
