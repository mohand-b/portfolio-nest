import { Injectable } from '@nestjs/common';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

@Injectable()
export class AvatarService {
  private readonly backgroundColors = [
    'b6e3f4',
    'c0aede',
    'd1d4f9',
    'ffd5dc',
    'ffdfbf',
  ];

  generate(seed: string): string {
    const backgroundIndex =
      this.simpleHash(seed) % this.backgroundColors.length;
    const backgroundColor = this.backgroundColors[backgroundIndex];

    const avatar = createAvatar(avataaars, {
      seed,
      backgroundColor: [backgroundColor],
      backgroundType: ['gradientLinear'],
      radius: 50,
    });

    return avatar.toString();
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
