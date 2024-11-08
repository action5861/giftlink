// data/stories.ts
import { Story } from '@/types/story';

export const stories: Story[] = [
  {
    id: 'story1',
    title: '꿈을 향해 공부하는 고등학생',
    age: 16,
    gender: '여',
    situation: '한부모 가정의 고등학생입니다',
    essentialItem: {
      name: '동복 교복',
      description: '낡은 교복을 새 것으로 교체하고 싶어요'
    },
    story: "공부하는 게 정말 좋아요. 성적도 올랐는데, 낡은 교복이 신경 쓰여요. 새 교복을 입고 더 열심히 공부하고 싶습니다.",
    imagePrompt: "A hopeful high school girl in a worn-out uniform, studying at desk, determined expression, watercolor style illustration, warm lighting, Korean art style",
    status: 'waiting'
  },
  {
    id: 'story2',
    title: '아기와 함께 성장하는 엄마',
    age: 21,
    gender: '여',
    situation: '육아로 힘든 젊은 엄마입니다',
    essentialItem: {
      name: '6개월치 분유',
      description: '아기의 건강한 성장을 위한 분유가 필요해요'
    },
    story: "아기가 건강하게 자라는 모습이 저의 가장 큰 기쁨이에요. 분유값이 부담되지만 아기를 위해 열심히 살고 있어요.",
    imagePrompt: "Young mother lovingly holding baby, gentle and caring expression, warm lighting, watercolor style, soft colors, Korean illustration style",
    status: 'waiting'
  },
  {
    id: 'story3',
    title: '추운 겨울을 준비하는 할아버지',
    age: 75,
    gender: '남',
    situation: '기초생활수급자 독거노인입니다',
    essentialItem: {
      name: '겨울 이불세트',
      description: '따뜻한 겨울을 보내기 위한 이불이 필요해요'
    },
    story: "혼자 지내는 겨울이 가장 힘들어요. 낡은 이불로는 추위를 이기기가 어려워요.",
    imagePrompt: "Elderly man in simple room, gentle smile despite hardship, warm winter lighting, watercolor illustration, emotional Korean style art",
    status: 'waiting'
  },
  {
    id: 'story4',
    title: '취업을 준비하는 청년',
    age: 23,
    gender: '남',
    situation: '장애인 취업준비생입니다',
    essentialItem: {
      name: '면접용 정장',
      description: '첫 면접을 위한 정장이 필요해요'
    },
    story: "휠체어를 타지만 꿈을 향해 도전하고 있어요. 면접에서 좋은 인상을 주고 싶어요.",
    imagePrompt: "Young man in wheelchair with hopeful expression, simple casual clothes, warm lighting, watercolor style, Korean illustration",
    status: 'waiting'
  },
  {
    id: 'story5',
    title: '한국에서 꿈꾸는 어린 학생',
    age: 9,
    gender: '여',
    situation: '다문화가정 초등학생입니다',
    essentialItem: {
      name: '학습교재세트',
      description: '한국어 공부를 위한 교재가 필요해요'
    },
    story: "한국어를 열심히 배우고 있어요. 더 많은 친구들과 이야기하고 싶어요.",
    imagePrompt: "Young multicultural student studying Korean, bright eyes, determined look, watercolor style, warm colors, Korean illustration",
    status: 'waiting'
  },
  {
    id: 'story6',
    title: '동생들을 돌보는 형',
    age: 17,
    gender: '남',
    situation: '소년가장입니다',
    essentialItem: {
      name: '생필품 세트',
      description: '동생들과 사용할 기본 생필품이 필요해요'
    },
    story: "부모님 없이 동생들과 살고 있어요. 힘들지만 동생들을 위해 열심히 살고 있어요.",
    imagePrompt: "Teenage boy looking after younger siblings, protective and caring expression, warm lighting, watercolor style, emotional Korean art",
    status: 'waiting'
  },
  {
    id: 'story7',
    title: '혼자서 아이들을 키우는 아빠',
    age: 45,
    gender: '남',
    situation: '한부모 가정의 아버지입니다',
    essentialItem: {
      name: '아이들 간식세트',
      description: '아이들에게 간식을 챙겨주고 싶어요'
    },
    story: "아이들의 웃음소리가 제 삶의 힘이에요. 더 나은 아빠가 되고 싶어요.",
    imagePrompt: "Single father preparing food for children, gentle caring expression, warm home setting, watercolor style, Korean illustration",
    status: 'waiting'
  },
  {
    id: 'story8',
    title: '할머니와 사는 초등학생',
    age: 11,
    gender: '남',
    situation: '조손가정 학생입니다',
    essentialItem: {
      name: '체육복세트',
      description: '학교 체육시간에 필요한 체육복이 필요해요'
    },
    story: "할머니가 열심히 키워주시는데, 체육복이 낡아서 불편해요.",
    imagePrompt: "Young boy in worn-out clothes with hopeful smile, simple school setting, watercolor style, emotional Korean art",
    status: 'waiting'
  },
  {
    id: 'story9',
    title: '꿈을 그리는 미술학도',
    age: 26,
    gender: '여',
    situation: '미술을 공부하는 청년입니다',
    essentialItem: {
      name: '기본 미술도구세트',
      description: '그림 공부를 위한 기본적인 도구가 필요해요'
    },
    story: "그림으로 세상을 표현하고 싶어요. 기본적인 미술도구가 있다면 더 열심히 공부할 수 있을 것 같아요.",
    imagePrompt: "Young artist with paintbrush, passionate yet struggling expression, art studio setting, watercolor style, Korean illustration",
    status: 'waiting'
  },
  {
    id: 'story10',
    title: '새로운 시작을 꿈꾸는 학생',
    age: 15,
    gender: '여',
    situation: '북한이탈청소년입니다',
    essentialItem: {
      name: '겨울 교복',
      description: '새 학교 생활을 위한 교복이 필요해요'
    },
    story: "새로운 환경에 적응하려 노력하고 있어요. 친구들과 어울리며 공부하고 싶어요.",
    imagePrompt: "Teenage girl in simple uniform, hopeful expression about new beginnings, school setting, watercolor style, Korean illustration",
    status: 'waiting'
  }
];