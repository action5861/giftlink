// src/utils/generateAvatar.ts

export function generateCharacterImage(age: number, gender: string): string {
    return `https://api.dicebear.com/7.x/personas/svg?seed=${age}${gender}`;
  }