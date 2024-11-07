import type { Metadata } from 'next'
import FilterSection from '@/components/dashboard/FilterSection'
import StoryCard from '@/components/dashboard/StoryCard'

export const metadata: Metadata = {
  title: 'Dashboard - GiftLink',
  description: 'Browse and help people in need',
}

// 임시 데이터
const sampleStories = [
  {
    id: '1',
    title: "Help Sarah with School Supplies",
    description: "Sarah is a bright student who needs basic school supplies to continue her education. Your help will make a big difference in her academic journey.",
    imageUrl: "/api/placeholder/400/225",
    itemNeeded: "School Supplies Set",
    priceRange: "$15-20",
    isUrgent: true
  },
  {
    id: '2',
    title: "Winter Coat for Tom",
    description: "Tom needs a warm winter coat for the upcoming cold season. Help him stay warm and comfortable during winter months.",
    imageUrl: "/api/placeholder/400/225",
    itemNeeded: "Winter Coat",
    priceRange: "$18-20",
    isUrgent: false
  },
  {
    id: '3',
    title: "Basic Groceries for Elder Kim",
    description: "Elder Kim needs help with basic groceries this month. Your support will ensure she has enough food for the next few weeks.",
    imageUrl: "/api/placeholder/400/225",
    itemNeeded: "Grocery Package",
    priceRange: "$15-20",
    isUrgent: true
  }
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <FilterSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sampleStories.map((story) => (
            <StoryCard
              key={story.id}
              {...story}
            />
          ))}
        </div>
      </div>
    </main>
  )
}