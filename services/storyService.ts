// services/storyService.ts
import { prisma } from '@/lib/prisma';
import { generateImage } from '@/utils/openai';
import { Story, CreateStoryData, StoryStatus } from '@/types/story';

export class StoryService {
  // 새 스토리 생성
  static async createStory(data: CreateStoryData) {
    try {
      // 이미지 생성
      const imageUrl = await generateImage(data.imagePrompt);

      // DB에 저장
      const story = await prisma.story.create({
        data: {
          ...data,
          status: 'waiting',
          imageUrl,
          essentialItem: data.essentialItem
        }
      });

      return story;
    } catch (error) {
      console.error('Failed to create story:', error);
      throw error;
    }
  }

  // 활성 스토리 조회
  static async getActiveStories() {
    try {
      return await prisma.story.findMany({
        where: {
          status: 'waiting'
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Failed to get active stories:', error);
      throw error;
    }
  }

  // 스토리 상태 업데이트
  static async updateStoryStatus(storyId: string, status: StoryStatus) {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date()
      };

      if (status === 'matched') {
        updateData.matchedAt = new Date();
      } else if (status === 'completed') {
        updateData.completedAt = new Date();
      }

      return await prisma.story.update({
        where: { id: storyId },
        data: updateData
      });
    } catch (error) {
      console.error('Failed to update story status:', error);
      throw error;
    }
  }

  // 스토리 상세 조회
  static async getStoryById(id: string) {
    try {
      return await prisma.story.findUnique({
        where: { id },
        include: {
          donations: true
        }
      });
    } catch (error) {
      console.error('Failed to get story:', error);
      throw error;
    }
  }
}