
import * as React from "react"
import { cn } from "@/lib/utils"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  change?: {
    value: number
    trend: "up" | "down" | "neutral"
  }
  footer?: React.ReactNode
  isLoading?: boolean
}

export function DashboardCard({
  title,
  value,
  icon,
  description,
  change,
  footer,
  isLoading = false,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white shadow-sm p-6 transition-all hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
      ) : (
        <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      )}
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {change && (
        <div className={cn(
          "flex items-center text-xs font-medium mt-2",
          change.trend === "up" ? "text-green-600" : 
          change.trend === "down" ? "text-red-600" : 
          "text-gray-600"
        )}>
          {change.trend === "up" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 01-1-1V3.414l-8.293 8.293a1 1 0 01-1.414-1.414l10-10A1 1 0 0112 0h4a1 1 0 011 1v4a1 1 0 01-1 1h-3z" clipRule="evenodd" />
            </svg>
          ) : change.trend === "down" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 13a1 1 0 011 1v3.586l8.293-8.293a1 1 0 011.414 1.414l-10 10A1 1 0 0112 20H8a1 1 0 01-1-1v-4a1 1 0 011-1h3z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {Math.abs(change.value)}%
        </div>
      )}
      
      {footer && (
        <div className="mt-4 pt-3 border-t text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  )
}
