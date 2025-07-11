"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react"
import ClientOnly from "./client-only"

function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log(formState)
    // Reset form
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    // Show success message
    alert("Thank you for your message! We will get back to you soon.")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          value={formState.subject}
          onChange={handleChange}
          required
          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          value={formState.message}
          onChange={handleChange}
          required
          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full py-6"
      >
        Send Message <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}

function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="flex items-start space-x-4">
        <MapPin className="h-6 w-6 text-black dark:text-white flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-medium text-black dark:text-white">Address</h3>
          <p className="text-gray-600 dark:text-gray-400">123 Innovation Street, Tech City, TC 12345</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <Mail className="h-6 w-6 text-black dark:text-white flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-medium text-black dark:text-white">Email</h3>
          <p className="text-gray-600 dark:text-gray-400">info@OnDostudio.com</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <Phone className="h-6 w-6 text-black dark:text-white flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-medium text-black dark:text-white">Phone</h3>
          <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-black dark:text-white mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Facebook className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Twitter className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <ClientOnly>
      <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-black dark:text-white">Contact Us</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Have a project in mind? Get in touch with us to discuss how we can help bring your vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-black p-8 rounded-3xl shadow-sm"
            >
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">Send Us a Message</h3>
              <ContactForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-black p-8 rounded-3xl shadow-sm"
            >
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-6">Contact Information</h3>
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>
    </ClientOnly>
  )
}
