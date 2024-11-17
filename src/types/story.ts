export interface Story {
    id: string
    authorId: string
    age: number
    gender: string
    region: string
    story: string
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED'
    createdAt: string
    updatedAt: string
    author: {
      name: string
      email: string
    }
    items: {
      id: string
      name: string
      category: string
      quantity: number
      status: 'NEEDED' | 'FULFILLED'
    }[]
  }
  
  export interface StoryResponse {
    stories: Story[]
    isPreview: boolean
    metadata?: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
  