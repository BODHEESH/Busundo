"use client"

import ProfessionalNav from "./ProfessionalNav"

interface PageWrapperProps {
  children: React.ReactNode
  currentPage?: string
  title?: string
  description?: string
  gradient?: boolean
}

export default function PageWrapper({ 
  children, 
  currentPage, 
  title, 
  description,
  gradient = false 
}: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNav currentPage={currentPage} />
      
      {title && (
        <div className={`pt-24 pb-12 ${gradient ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800' : 'bg-white border-b border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${gradient ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            {description && (
              <p className={`text-xl ${gradient ? 'text-blue-100' : 'text-gray-600'} max-w-3xl`}>
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      
      <main className={title ? 'py-12' : 'pt-24 pb-12'}>
        {children}
      </main>
    </div>
  )
}
