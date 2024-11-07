export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-20 text-center bg-white">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Simple Gifts, Meaningful Connections
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
          Direct 1:1 essentials donation platform that connects you with those in need. Make a difference with just a few clicks.
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <a href="/auth/signup" className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            Start Giving
          </a>
          <a href="/dashboard" className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50">
            Browse Stories
          </a>
        </div>
      </section>

      {/* Key Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Choose GiftLink?
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 - Precision Giving */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Precision Giving
              </h3>
              <p className="mt-2 text-gray-600">
                Your gift goes directly to those in need, ensuring maximum impact.
              </p>
            </div>

            {/* Card 2 - Full Transparency */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Full Transparency
              </h3>
              <p className="mt-2 text-gray-600">
                Track your donation from purchase to delivery with real-time updates.
              </p>
            </div>

            {/* Card 3 - Dignified Support */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Dignified Support
              </h3>
              <p className="mt-2 text-gray-600">
                Privacy protected through AI characters while maintaining human connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              4 Simple Steps to Make a Difference
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-semibold">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {step}
                </h3>
                <p className="mt-2 text-center text-gray-600">
                  {descriptions[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

const steps = [
  "Choose a Story",
  "Select Essential Items",
  "Make Direct Purchase",
  "Complete the Connection"
]

const descriptions = [
  "Browse through verified stories and find someone you'd like to help.",
  "Pick from a list of needed essential items within your budget.",
  "Buy the items directly through our trusted retail partner.",
  "Track your donation and receive updates about your impact."
]