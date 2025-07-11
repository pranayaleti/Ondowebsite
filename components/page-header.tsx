import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export default function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white/50 dark:from-gray-900/50 dark:to-black/50"></div>
      <div className="absolute inset-0 bg-grid opacity-25"></div>

      {/* Animated background blobs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-400/10 rounded-full filter blur-3xl animate-blob animation-delay-300"></div>
      <div className="absolute bottom-20 left-[10%] w-72 h-72 bg-violet-400/10 rounded-full filter blur-3xl animate-blob animation-delay-500"></div>

      <div className="container px-4 md:px-6 relative">
        <div className={cn("max-w-3xl", className)}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{title}</h1>
          {description && <p className="text-xl text-muted-foreground">{description}</p>}
        </div>
      </div>
    </section>
  )
}
