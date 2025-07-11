export default function Loading({ section = "content" }) {
  return (
    <div className={`flex items-center justify-center ${section === "hero" ? "h-screen" : "min-h-[400px]"} bg-white`}>
      <div className="flex flex-col items-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-gray-900 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-gray-400 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading {section}...</p>
      </div>
    </div>
  )
}
