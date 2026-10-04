export interface SparkItem {
  type: 'Quote' | 'Fact' | 'Challenge' | 'Playful' | 'Context';
  text: string;
}

export const DAILY_SPARK_POOL: SparkItem[] = [
  // Short Quotes
  { type: 'Quote', text: "Start before you're ready." },
  { type: 'Quote', text: "A little progress is still progress." },
  { type: 'Quote', text: "Make it easy to begin." },
  { type: 'Quote', text: "Done is better than endlessly tweaking." },
  { type: 'Quote', text: "You don't need a perfect day." },
  { type: 'Quote', text: "Small steady steps beat rare giant leaps." },
  { type: 'Quote', text: "Simplicity is the ultimate sophistication." },

  // Micro-Facts
  { type: 'Fact', text: "Octopuses have three hearts." },
  { type: 'Fact', text: "Cleopatra lived closer to the Moon landing than to the construction of the Great Pyramid." },
  { type: 'Fact', text: "Honey never spoils—3,000-year-old honey in Egyptian tombs is still edible." },
  { type: 'Fact', text: "Sharks existed on Earth before trees appeared." },
  { type: 'Fact', text: "Venus is the only planet in our solar system that spins clockwise." },
  { type: 'Fact', text: "A day on Venus is longer than a year on Venus." },

  // Tiny Challenges
  { type: 'Challenge', text: "Do one thing you've been avoiding." },
  { type: 'Challenge', text: "Clear one tiny task." },
  { type: 'Challenge', text: "Work for 10 minutes before deciding whether to stop." },
  { type: 'Challenge', text: "Make something slightly better today." },
  { type: 'Challenge', text: "Take three slow deep breaths before your next move." },

  // Playful Messages
  { type: 'Playful', text: "The dashboard has been waiting for you." },
  { type: 'Playful', text: "One task. Then another." },
  { type: 'Playful', text: "Your future self has entered the chat." },
  { type: 'Playful', text: "Suspiciously productive behavior detected." },
  { type: 'Playful', text: "No need to conquer the world before lunch." },
];

export function getDynamicSpark(remainingTasks: number, totalTasks: number, focusStreak: number): SparkItem {
  // 30% chance of showing a contextual message if relevant
  if (Math.random() < 0.35) {
    if (totalTasks > 0 && remainingTasks === 0) {
      return { type: 'Context', text: "Everything's done. That's a good place to be." };
    }
    if (remainingTasks > 0) {
      return {
        type: 'Context',
        text: `${remainingTasks} ${remainingTasks === 1 ? 'thing is' : 'things are'} waiting for you.`,
      };
    }
    if (focusStreak >= 3) {
      return { type: 'Context', text: `You're on a ${focusStreak}-session focus streak.` };
    }
  }

  // Pick random item from pool
  const randomIndex = Math.floor(Math.random() * DAILY_SPARK_POOL.length);
  return DAILY_SPARK_POOL[randomIndex];
}
