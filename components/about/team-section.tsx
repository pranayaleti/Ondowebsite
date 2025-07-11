"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"
import { Github, Linkedin, Twitter } from "lucide-react"

const team = [
  {
    name: "Alex Thompson",
    role: "Founder & CEO",
    bio: "With over 15 years of experience in web development and digital strategy, Alex founded OnDo Studio with a vision to help businesses succeed online through exceptional web solutions.",
    image: "/images/team/alex-thompson.png",
    social: {
      twitter: "https://twitter.com/alexthompson",
      linkedin: "https://linkedin.com/in/alexthompson",
      github: "https://github.com/alexthompson",
    },
  },
  {
    name: "Sarah Johnson",
    role: "Lead Designer",
    bio: "Sarah brings 10+ years of UI/UX design experience, creating intuitive and visually stunning interfaces that enhance user engagement and drive business results.",
    image: "/images/team/sarah-johnson.png",
    social: {
      twitter: "https://twitter.com/sarahjohnson",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
    },
  },
  {
    name: "Michael Chen",
    role: "Technical Director",
    bio: "Michael oversees all technical aspects of our projects, ensuring they're built with clean, efficient code and optimized for performance, security, and scalability.",
    image: "/images/team/michael-chen.png",
    social: {
      twitter: "https://twitter.com/michaelchen",
      linkedin: "https://linkedin.com/in/michaelchen",
      github: "https://github.com/michaelchen",
    },
  },
  {
    name: "Emily Rodriguez",
    role: "Frontend Developer",
    bio: "Emily specializes in creating responsive, accessible, and performant user interfaces using the latest frontend technologies and best practices.",
    image: "/images/team/emily-rodriguez.png",
    social: {
      twitter: "https://twitter.com/emilyrodriguez",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      github: "https://github.com/emilyrodriguez",
    },
  },
  {
    name: "David Wilson",
    role: "Backend Developer",
    bio: "David builds robust server-side applications and APIs that power our web solutions, with expertise in database design, security, and performance optimization.",
    image: "/images/team/david-wilson.png",
    social: {
      twitter: "https://twitter.com/davidwilson",
      linkedin: "https://linkedin.com/in/davidwilson",
      github: "https://github.com/davidwilson",
    },
  },
  {
    name: "Jessica Lee",
    role: "Digital Marketing Specialist",
    bio: "Jessica helps our clients grow their online presence through strategic SEO, content marketing, and digital advertising campaigns that drive targeted traffic and conversions.",
    image: "/images/team/jessica-lee.png",
    social: {
      twitter: "https://twitter.com/jessicalee",
      linkedin: "https://linkedin.com/in/jessicalee",
      github: "https://github.com/jessicalee",
    },
  },
]

export default function TeamSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-blue-50/50 dark:from-black/50 dark:to-gray-900/50"></div>
      <div className="absolute inset-0 bg-grid opacity-25"></div>

      <div className="container px-4 md:px-6 relative">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground">
            We're a team of passionate experts dedicated to creating exceptional web experiences
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="gradient-text font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex space-x-3">
                  {member.social.twitter && (
                    <Link
                      href={member.social.twitter}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter className="h-5 w-5" />
                    </Link>
                  )}
                  {member.social.linkedin && (
                    <Link
                      href={member.social.linkedin}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  )}
                  {member.social.github && (
                    <Link
                      href={member.social.github}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
