'use client'
import { GoogleAnalytics } from '@next/third-parties/google'

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useCallback } from "react"
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function AnalyticsTracker({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
            api_host: '/relay-SBu2/',
            ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
            person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
            defaults: '2025-05-24'
        })
    }, [])

    return (
        <PHProvider client={posthog}>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
            {children}
        </PHProvider>
    )
}

/**
 * Hook to track custom events with PostHog
 * @example
 * const trackEvent = useAnalytics()
 * trackEvent('button_clicked', { button_name: 'cta', page: 'home' })
 */
export function useAnalytics() {
    const posthog = usePostHog()

    const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
        if (posthog) {
            posthog.capture(eventName, properties)
        }
    }, [posthog])

    return trackEvent
}