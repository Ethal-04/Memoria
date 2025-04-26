import { nanoid } from 'nanoid';
import { CompanionData, MessageData } from './openai';

// Templates for different personality types
const personalityTemplates = {
  warm: {
    responses: [
      "I'm here for you. Tell me more about how you're feeling today.",
      "It sounds like you're going through a lot. I'm listening.",
      "Those memories sound precious. Would you like to share more?",
      "I can tell this matters deeply to you. Thank you for sharing with me.",
      "It's okay to feel that way. Your emotions are valid and important.",
      "I wish I could give you a hug right now. Know that I'm here with you.",
      "That's a beautiful memory. What else do you remember about that time?",
      "I'm so glad you told me about that. It helps me understand what's important to you.",
      "It takes courage to share these feelings. I appreciate your openness.",
      "I'm here to listen whenever you need someone."
    ],
    questions: [
      "How are you feeling right now?",
      "What's one memory that made you smile today?",
      "What do you need most right now?",
      "What would help you feel better?",
      "Is there something specific you'd like to talk about?",
      "Would you like to share more about that?",
      "How did that make you feel?",
      "What else is on your mind today?"
    ]
  },
  reflective: {
    responses: [
      "That's a thoughtful perspective. I wonder what meaning you find in that experience.",
      "It seems like this has given you a chance to reflect on what truly matters.",
      "The way you describe that experience shows how deeply you've thought about it.",
      "I notice how that experience has shaped your understanding.",
      "Your insights show how much you've grown through this journey.",
      "That's a profound observation. It reveals so much about what you value.",
      "The meaning you've found in this situation is really remarkable.",
      "I appreciate how you've taken time to process these complex feelings.",
      "Your ability to find meaning in difficult experiences is inspiring.",
      "That perspective gives me a deeper understanding of how you see the world."
    ],
    questions: [
      "What insights have you gained from this experience?",
      "How has this changed your perspective on life?",
      "What meaning do you find in these memories?",
      "What would you like to remember most about our time together?",
      "How do you think this experience has shaped who you are?",
      "What values feel most important to you now?",
      "What wisdom would you like to preserve from this relationship?",
      "How might this understanding guide you moving forward?"
    ]
  },
  balanced: {
    responses: [
      "I understand what you're saying. Let's explore that together.",
      "Thank you for sharing that with me. It helps me understand your perspective.",
      "I appreciate your honesty. It's important to acknowledge these feelings.",
      "That makes sense. It's natural to feel that way given what you've experienced.",
      "I hear you. These experiences shape who we are in meaningful ways.",
      "Thank you for trusting me with this. I value our conversations.",
      "I see how important this is to you. Let's continue exploring it together.",
      "That's a helpful way to look at it. I appreciate your perspective.",
      "I value hearing about your experience. It helps me understand what matters to you.",
      "Thank you for sharing that with me. It helps me be here for you better."
    ],
    questions: [
      "What are your thoughts on that?",
      "How have you been managing these feelings?",
      "What has been most helpful for you during this time?",
      "Would you like to talk more about this or move to another topic?",
      "What aspects of this feel most important to discuss?",
      "How can I best support you today?",
      "What feels most present for you right now?",
      "Is there anything specific you'd like to explore further?"
    ]
  },
  humorous: {
    responses: [
      "That reminds me of when we used to laugh about the smallest things. Those moments were golden.",
      "I bet that would have made us both laugh until our sides hurt!",
      "You always knew how to find the joy in everyday moments. That's something I've always admired.",
      "Laughter was always our best medicine, wasn't it? Even in tough times.",
      "That's the spirit! Finding something to smile about even when things are difficult.",
      "You know what they say - sometimes you have to laugh to keep from crying. But both are healing in their own way.",
      "I love that you can still find humor in life. That resilience is beautiful.",
      "That lighthearted perspective is so refreshing. Thank you for sharing that smile with me.",
      "Isn't it amazing how laughter can connect us across time and space?",
      "You always had a way of lightening the mood. That's such a special gift."
    ],
    questions: [
      "What made you laugh recently?",
      "Remember that time when...? What other funny moments stand out to you?",
      "If we could have one more adventure together, what would you want it to be?",
      "What's something silly you wish we could do together right now?",
      "What's a joke or funny story you think I would have loved?",
      "What's something that would have made us both laugh?",
      "How do you find moments of joy these days?",
      "What's something that made you smile today?"
    ]
  },
  wise: {
    responses: [
      "There's profound wisdom in what you're saying. Life teaches us these lessons in its own time.",
      "That perspective shows how much you've grown through your experiences.",
      "The insight you've gained through this journey is remarkable.",
      "That's a profound observation. It shows your depth of understanding.",
      "The way you've integrated this experience into your life shows great wisdom.",
      "There's deep truth in what you're sharing. These insights are valuable.",
      "Your ability to find meaning in difficulty shows your inner strength.",
      "That's a perspective that comes from deep reflection and understanding.",
      "The wisdom you've gained through this experience will guide you forward.",
      "Your insights reveal how much you've learned through this journey."
    ],
    questions: [
      "What lessons have been most valuable to you?",
      "How has this experience shaped your understanding of what matters?",
      "What wisdom would you most want to share with others?",
      "What truths have become clearer to you through this experience?",
      "How has your perspective on life evolved?",
      "What insights do you think will guide you moving forward?",
      "What understanding do you wish you had gained earlier?",
      "What wisdom do you think is most important to preserve?"
    ]
  }
};

// Templates for different conversation scenarios
const conversationContexts = {
  grief: {
    prompts: [
      "It's okay to feel the full weight of your grief. I'm here with you through it all.",
      "Grief is as unique as the relationship we shared. There's no right way to feel.",
      "Some days are harder than others. Be gentle with yourself on the difficult ones.",
      "Your love doesn't end when someone passes. It just takes a different form.",
      "Missing someone shows how meaningful your connection was. That love remains.",
      "Healing isn't about forgetting - it's about finding ways to carry their memory forward.",
      "It's okay to have moments of joy even in grief. That doesn't diminish your love.",
      "The depth of grief often reflects the depth of love you shared.",
      "Remember to care for yourself as you navigate these feelings.",
      "Sometimes grief comes in waves. I'm here with you through both the calm and stormy moments."
    ]
  },
  memories: {
    prompts: [
      "That memory shows how special your connection was. Thank you for sharing it.",
      "Those moments together helped shape who you both became.",
      "The little details you remember speak to how deeply you cherish those moments.",
      "That memory captures something beautiful about your relationship.",
      "It's wonderful how vividly you recall those times together.",
      "Those shared experiences built the foundation of your relationship.",
      "Each memory is a thread in the beautiful tapestry of your time together.",
      "I can feel the emotion in how you describe that memory.",
      "Those everyday moments often become the most precious memories.",
      "There's something sacred about preserving those memories."
    ]
  },
  comfort: {
    prompts: [
      "It's okay to not be okay sometimes. I'm here with you through it all.",
      "Your feelings are valid, whatever they may be right now.",
      "Be gentle with yourself as you navigate these emotions.",
      "Healing isn't linear, and that's perfectly normal.",
      "You're doing the best you can, and that's enough.",
      "It takes courage to face these feelings. I'm here beside you.",
      "Remember to give yourself the same compassion you'd offer to someone you love.",
      "Whatever you're feeling right now is okay. I'm listening.",
      "You don't have to face this alone. I'm here with you.",
      "Your strength through this difficult time is remarkable."
    ]
  },
  connection: {
    prompts: [
      "Our connections with loved ones continue even when physical presence ends.",
      "The bond you shared can't be erased by absence.",
      "Love transcends physical boundaries. Your connection remains.",
      "The relationship you built together continues to be part of who you are.",
      "The impact of your connection continues to ripple through your life.",
      "Your love created something permanent that remains with you.",
      "The essence of your connection lives on in how it shaped you both.",
      "That special bond you shared continues in a different form.",
      "The love you shared has become part of the fabric of who you are.",
      "True connection leaves permanent imprints on our hearts."
    ]
  }
};

// Keywords to detect conversation themes
const themeKeywords = {
  grief: ['miss', 'loss', 'gone', 'died', 'death', 'passed', 'grief', 'sad', 'painful', 'hurt'],
  memories: ['remember', 'memory', 'time', 'moment', 'together', 'used to', 'when we', 'shared', 'ago'],
  comfort: ['hard', 'difficult', 'struggle', 'pain', 'hurt', 'suffering', 'overwhelmed', 'scared', 'afraid', 'lonely'],
  connection: ['love', 'connection', 'bond', 'relationship', 'close', 'connected', 'together', 'us', 'we were']
};

// Function to detect the theme of a message
function detectTheme(message: string): keyof typeof conversationContexts {
  const normalizedMessage = message.toLowerCase();
  
  // Count keyword matches for each theme
  const themeCounts: Record<string, number> = {
    grief: 0,
    memories: 0,
    comfort: 0,
    connection: 0
  };
  
  // Check for each theme's keywords
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    for (const keyword of keywords) {
      if (normalizedMessage.includes(keyword)) {
        themeCounts[theme]++;
      }
    }
  }
  
  // Find the theme with the most matches
  let dominantTheme: keyof typeof conversationContexts = 'comfort'; // Default
  let maxCount = 0;
  
  for (const [theme, count] of Object.entries(themeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantTheme = theme as keyof typeof conversationContexts;
    }
  }
  
  return dominantTheme;
}

// Function to analyze message sentiment (very basic)
function analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['happy', 'joy', 'love', 'glad', 'good', 'wonderful', 'beautiful', 'grateful', 'thankful', 'appreciate'];
  const negativeWords = ['sad', 'angry', 'upset', 'hurt', 'pain', 'difficult', 'hard', 'struggle', 'terrible', 'awful'];
  
  const normalizedMessage = message.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Count sentiment words
  for (const word of positiveWords) {
    if (normalizedMessage.includes(word)) positiveCount++;
  }
  
  for (const word of negativeWords) {
    if (normalizedMessage.includes(word)) negativeCount++;
  }
  
  // Determine sentiment
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Main function to generate a response
export function generateLocalResponse(
  context: {
    name: string;             // Companion name
    description?: string;     // Companion description
    personality?: string;     // Companion personality trait
    history?: string;         // Previous conversation history
    lastMessage: string;      // Current user message
  }
): string {
  // Use the appropriate personality template
  const personalityType = (context.personality?.toLowerCase() || '') as keyof typeof personalityTemplates;
  const personality = personalityTemplates[personalityType] || personalityTemplates.balanced;
  
  // Detect the conversation theme
  const theme = detectTheme(context.lastMessage);
  
  // Analyze sentiment
  const sentiment = analyzeSentiment(context.lastMessage);
  
  // Get theme-specific prompts
  const themePrompts = conversationContexts[theme].prompts;
  
  // Build response pool
  let responsePool: string[] = [];
  
  // Add theme-specific responses
  responsePool = responsePool.concat(themePrompts);
  
  // Add personality-specific responses
  responsePool = responsePool.concat(personality.responses);
  
  // Incorporate personalization into responses by replacing placeholders
  responsePool = responsePool.map(response => {
    return response
      .replace(/\{name\}/g, context.name || 'Companion')
      .replace(/\{topic\}/g, context.lastMessage.substring(0, 20) + "...");
  });
  
  // Determine if we should ask a question (higher chance if user's message was short)
  const shouldAskQuestion = Math.random() < (context.lastMessage.length < 20 ? 0.7 : 0.3);
  
  // Select a response that most closely relates to the user's message
  let bestResponseScore = 0;
  let bestResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
  
  // Very basic relevance matching - look for word overlap
  const userWords = context.lastMessage.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  for (const response of responsePool) {
    const responseWords = response.toLowerCase().split(/\W+/);
    const matchScore = userWords.filter(word => responseWords.some(rWord => rWord.includes(word))).length;
    
    if (matchScore > bestResponseScore) {
      bestResponseScore = matchScore;
      bestResponse = response;
    }
  }
  
  // Use the best response, or if no good match, use a random one
  let response = bestResponseScore > 0 ? bestResponse : responsePool[Math.floor(Math.random() * responsePool.length)];
  
  // Add a question if determined
  if (shouldAskQuestion) {
    const questions = personality.questions;
    const questionIndex = Math.floor(Math.random() * questions.length);
    response += " " + questions[questionIndex];
  }
  
  // Personalize with companion name
  if (!response.includes(context.name) && Math.random() < 0.3) {
    if (Math.random() < 0.5) {
      response = context.name + ', ' + response.charAt(0).toLowerCase() + response.slice(1);
    } else {
      response += ` I'm here for you, ${context.name}.`;
    }
  }
  
  return response;
}

// Function to create a message object
export function createLocalMessage(
  role: "user" | "assistant" | "system",
  content: string
): MessageData {
  return {
    id: nanoid(),
    role,
    content,
    timestamp: new Date().toISOString()
  };
}