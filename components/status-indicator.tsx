import { CheckCircle2, XCircle } from "lucide-react"

// Configuration - Change this to control your availability status
const TAKING_NEW_PROJECTS = true // Set to false when not accepting new projects

interface StatusIndicatorProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function StatusIndicator({ 
  className = "", 
  showText = true, 
  size = "md" 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {TAKING_NEW_PROJECTS ? (
        <>
          <CheckCircle2 className={`${sizeClasses[size]} text-emerald-400`} />
          {showText && (
            <span className={`${textSizeClasses[size]} text-emerald-400 font-medium`}>
              Taking new projects
            </span>
          )}
        </>
      ) : (
        <>
          <XCircle className={`${sizeClasses[size]} text-red-400`} />
          {showText && (
            <span className={`${textSizeClasses[size]} text-red-400 font-medium`}>
              Not taking new projects
            </span>
          )}
        </>
      )}
    </div>
  )
}

// Export the status for use in other components if needed
export const isAcceptingProjects = TAKING_NEW_PROJECTS
