'use client'

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

const clickupDocs = {
    "Terms of Service": "https://doc.clickup.com/9015202187/p/h/8cnj4cb-16215/a7328b8fa6ee6f4",
    "Privacy Policy": "https://doc.clickup.com/9015202187/p/h/8cnj4cb-16275/5a06a23018a179c",
} as const

const LegalDoc = () => {
    const searchParams = useSearchParams()
    // Select the correct doc based on ?docKey=, defaulting to Terms of Service.
    const docKey = searchParams.get("docKey") === "privacy" ? "Privacy Policy" : "Terms of Service"
    const docUrl = clickupDocs[docKey]

    return (
        <div className="min-h-screen bg-[#091113] text-[#e5e7eb]">
            {/* Header: sticky below main navbar showing dropdown to change doc type */}
            <div className="sticky top-0 z-10 bg-[#091113]/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-center">
                <select
                    onChange={(e) => {
                        const selectedDoc = e.target.value
                        window.location.href =
                            selectedDoc === "Privacy Policy" ? "/legal?docKey=privacy" : "/legal?docKey=tos"
                    }}
                    value={docKey}
                    className="bg-[#1a1f24] border border-white/20 text-[#e5e7eb] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fca5a5]/50 focus:border-[#fca5a5]/50"
                >
                    <option value="Terms of Service">Terms of Service</option>
                    <option value="Privacy Policy">Privacy Policy</option>
                </select>
            </div>

            {/* Embedded document */}
            <iframe
                src={docUrl}
                className="w-full h-screen"
                scrolling="yes"
                frameBorder="0"
                allowFullScreen
                style={{ backgroundColor: "transparent" }}
            />
        </div>
    )
}

const LegalPage = () => (
    <Suspense>
        <LegalDoc />
    </Suspense>
)

export default LegalPage
