"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-4 px-6 md:px-10 fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-primary">Digi</span>.com
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#about" className="text-foreground hover:text-primary transition-colors">
            About us
          </Link>
          <Link href="#services" className="text-foreground hover:text-primary transition-colors">
            Services
          </Link>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
            <Link href="#contact">Contact Us</Link>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white py-4 px-6"
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About us
            </Link>
            <Link
              href="#services"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white rounded-full w-full"
              onClick={() => setIsOpen(false)}
            >
              <Link href="#contact">Contact Us</Link>
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
