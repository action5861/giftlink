'use client'
import Image from 'next/image'
import Link from 'next/link'

interface StoryCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  itemNeeded: string
  priceRange: string
  isUrgent: boolean
}

export default function StoryCard({
  id,
  title,
  description,
  imageUrl,
  itemNeeded,
  priceRange,
  isUrgent
}: StoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        {/* Placeholder image */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={225}
            className="object-cover"
          />
        </div>
        {isUrgent && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Urgent
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Needed:</span>
            <span className="ml-2">{itemNeeded}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Price Range:</span>
            <span className="ml-2">{priceRange}</span>
          </div>
        </div>

        <div className="mt-6">
          <Link 
            href={`/story/${id}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Help Now
          </Link>
        </div>
      </div>
    </div>
  )
}