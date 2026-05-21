// ✅ CORRECT Groq API URL and format
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL   = "llama-3.3-70b-versatile";
const KEY     = import.meta.env.VITE_GROQ_API_KEY;

const difficultyGuide = {
  simple:   "Use plain language. Short sentences. Basic concepts only. Good for beginners.",
  standard: "Balanced depth. Clear explanations. Include examples.",
  deep:     "Advanced depth. Include edge cases, nuances, and connections between concepts.",
};

export const digestNotes = async (notes, difficulty, customInstructions) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: "You are an expert academic study assistant. Always respond with valid JSON only. No explanation, no markdown fences, no extra text.",
        },
        {
          role: "user",
          content: `Analyze these lecture notes and return ONLY valid JSON.

Difficulty: ${difficulty}
Instruction: ${difficultyGuide[difficulty]}
${customInstructions ? `Extra: ${customInstructions}` : ""}

LECTURE NOTES:
"""
${notes}
"""

Return EXACTLY this JSON:
{
  "subject": "<auto-detect subject>",
  "topic": "<specific topic>",
  "word_count": <integer>,
  "summary": {
    "overview": "<2-3 sentence overview>",
    "key_concepts": [
      {
        "term": "<concept>",
        "explanation": "<explanation>",
        "importance": "<high|medium|low>"
      }
    ],
    "key_facts": ["<fact 1>", "<fact 2>", "<fact 3>", "<fact 4>", "<fact 5>"],
    "takeaway": "<single most important thing>"
  },
  "quiz": {
    "questions": [
      {
        "id": "<unique string>",
        "type": "multiple_choice",
        "question": "<question>",
        "options": ["<A>", "<B>", "<C>", "<D>"],
        "correct": <0-3>,
        "explanation": "<why correct>",
        "difficulty": "<easy|medium|hard>"
      },
      {
        "id": "<unique string>",
        "type": "true_false",
        "question": "<statement>",
        "options": ["True", "False"],
        "correct": <0 or 1>,
        "explanation": "<explanation>",
        "difficulty": "<easy|medium|hard>"
      }
    ]
  },
  "flashcards": [
    {
      "id": "<unique string>",
      "term": "<term>",
      "definition": "<definition>",
      "example": "<example>",
      "hint": "<memory hint>"
    }
  ]
}

Rules:
- Minimum 8 quiz questions
- Minimum 10 flashcards
- key_concepts must have 5-8 items
- JSON only, no extra text`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Groq API error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices[0].message.content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse response. Please try again.");
  }
};