'use client'

import { useEffect } from 'react'

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {

    useEffect(() => {
        console.error('[Global Error Boundary]:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl shadow-sm max-w-md">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                    Oops! Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    An unexpected error occurred while loading the gallery.
                    Please try again or refresh the page.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/70 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                    >
                        Try again
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/70 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                    >
                        Refresh page
                    </button>
                </div>
            </div>

            {error.digest && (
                <p className="mt-4 text-xs text-gray-400 font-mono">
                    Error ID: {error.digest}
                </p>
            )}
        </div>
    )
}
