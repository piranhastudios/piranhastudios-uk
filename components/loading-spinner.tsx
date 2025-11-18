import { LoaderCircle } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091113] via-[#0f1419] to-[#1a1f24] flex items-center justify-center">
      <LoaderCircle className="h-12 w-12 text-[#fca5a5] animate-spin" />
    </div>
  )
}
