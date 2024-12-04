'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid'

const popularLocations = [
  'New York, United States',
  'Los Angeles, United States',
  'Chicago, United States',
  'Houston, United States',
  'Phoenix, United States',
  'Philadelphia, United States',
  'San Antonio, United States',
  'San Diego, United States',
  'Dallas, United States',
  'Austin, United States',
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('Austin, Texas, United States')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showLocations, setShowLocations] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState(popularLocations)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Handle clicking outside of location dropdown
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocations(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocation(value)
    setShowLocations(true)
    
    // Filter locations based on input
    const filtered = popularLocations.filter(loc => 
      loc.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredLocations(filtered)
  }

  const selectLocation = (loc: string) => {
    setLocation(loc)
    setShowLocations(false)
  }

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, location }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (data.error?.includes('rate limit exceeded')) {
          throw new Error('Rate limit exceeded. Please try again in about an hour.')
        }
        throw new Error(data.error || 'Failed to fetch search results')
      }
      
      setResults(data)
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle preview modal
  const handlePreview = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault()
    setPreviewUrl(url)
    const link = e.currentTarget
    link.classList.add('visited')
  }

  const closePreview = () => {
    setPreviewUrl(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Google Search API</h1>
          <p className="text-white/80">
            Scrape Google and other search engines from our fast, easy, and complete API.
          </p>
        </div>

        {/* Search Form */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Query"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-1/3 relative" ref={locationRef}>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                onFocus={() => setShowLocations(true)}
                placeholder="Location"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <ChevronDownIcon 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowLocations(!showLocations)}
              />
            </div>
            
            {/* Location Dropdown */}
            {showLocations && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                {filteredLocations.map((loc, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => selectLocation(loc)}
                  >
                    {loc}
                  </div>
                ))}
                {filteredLocations.length === 0 && (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    No locations found
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'TEST SEARCH'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Panel - Google Results Preview */}
            <div className="bg-white rounded-lg shadow-lg p-4 h-[790px] overflow-y-auto">
              <div className="border-b pb-2 mb-4">
                <img 
                  src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                  alt="Google" 
                  className="h-7"
                />
                <div className="flex gap-6 mt-4 text-sm">
                  <button className="text-blue-600 border-b-2 border-blue-600 pb-2">All</button>
                  <button className="text-gray-600">News</button>
                  <button className="text-gray-600">Images</button>
                  <button className="text-gray-600">Videos</button>
                  <button className="text-gray-600">Maps</button>
                </div>
              </div>

              <div className="space-y-8">
                {results?.organic_results?.map((result: any, index: number) => (
                  <div key={index} className={`max-w-2xl ${index === 0 ? 'first-result' : ''}`}>
                    <div className={`group p-4 rounded-lg transition-all duration-200 hover:bg-blue-50 
                      ${index === 0 ? 'border border-blue-100 bg-blue-50/50 shadow-sm' : ''}`}>
                      <a 
                        href={result.link}
                        onClick={(e) => handlePreview(e, result.link)}
                        className={`text-[#1a0dab] hover:underline block visited:text-purple-700
                          ${index === 0 ? 'text-2xl font-medium mb-2' : 'text-xl mb-1'}`}
                        data-result={index}
                      >
                        {result.title}
                      </a>
                      <div className={`text-[#006621] mb-1 ${index === 0 ? 'text-base' : 'text-sm'}`}>
                        {result.displayed_link || result.link}
                      </div>
                      <div className={`text-[#4d5156] ${index === 0 ? 'text-base leading-relaxed' : 'text-sm line-clamp-2'}`}>
                        {result.snippet}
                      </div>
                      {index === 0 && result.thumbnail && (
                        <img 
                          src={result.thumbnail}
                          alt={result.title}
                          className="mt-3 rounded-lg max-w-[200px] h-auto"
                        />
                      )}
                    </div>
                  </div>
                ))}

                {results?.related_questions?.map((question: any, index: number) => (
                  <div key={`question-${index}`} className="border rounded-lg p-3 bg-gray-50">
                    <h3 className="font-medium mb-2">{question.question}</h3>
                    <p className="text-sm text-gray-600">{question.snippet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - JSON Response */}
            <div className="bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center">
                <span className="text-white/90">Tools</span>
                <button className="text-white/60 hover:text-white/90">≡</button>
              </div>
              <pre className="p-4 text-sm h-[750px] overflow-auto">
                <code className="text-green-400">
                  {JSON.stringify(results, null, 2)}
                </code>
              </pre>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewUrl && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Preview</h3>
                <button 
                  onClick={closePreview}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 relative">
                <iframe 
                  src={previewUrl} 
                  className="absolute inset-0 w-full h-full"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
              <div className="p-4 border-t flex justify-between items-center bg-gray-50">
                <span className="text-sm text-gray-600">
                  Previewing: {previewUrl}
                </span>
                <a 
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center">
          <a 
            href="#" 
            className="text-white/80 hover:text-white inline-flex items-center gap-1"
          >
            Play with more parameters and search engines
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  )
}
