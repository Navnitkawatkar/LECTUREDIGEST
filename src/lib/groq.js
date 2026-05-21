const API_URL = "https://api.groq.ai/v1/models/groq-1.5.3/outputs";
const KEY = import.meta.env.VITE_GROQ_API_KEY;

const difficultyGuide = {
  simple: "Use plain language. Short sentences. Basic concepts only. Good for beginners.",
  standard: "Balanced depth. Clear explanations. Include examples.",
  deep: "Advanced depth. Include edge cases, nuances, and connections between concepts.",
};

export const digestNotes = async (notes, difficulty, customInstructions) => {
  const prompt = `You are an expert academic study assistant.\nAnalyze these lecture notes and return ONLY valid JSON, no explanation, no markdown fences.\n\nDifficulty level: ${difficulty}\nInstruction: ${difficultyGuide[difficulty]}\n${customInstructions ? `Extra instructions: ${customInstructions}` : ""}\n\nLECTURE NOTES:\n"""\n${notes}\n"""\n\nReturn EXACTLY this JSON structure:\n{\n  "subject": "<auto-detect subject e.g. Biology, History, Physics>",\n  "topic": "<specific topic from notes>",\n  "word_count": <integer>,\n  "summary": {\n    "overview": "<2-3 sentence high-level overview>",\n    "key_concepts": [\n      {\n        "term": "<concept name>",\n        "explanation": "<clear explanation>",\n        "importance": "<high|medium|low>"\n      }\n    ],\n    "key_facts": [\n      "<important fact 1>",\n      "<important fact 2>",\n      "<important fact 3>",\n      "<important fact 4>",\n      "<important fact 5>"\n    ],\n    "takeaway": "<single most important thing to remember>"\n  },\n  "quiz": {\n    "questions": [\n      {\n        "id": "<unique string>",\n        "type": "multiple_choice",\n        "question": "<question text>",\n        "options": ["<A>", "<B>", "<C>", "<D>"],\n        "correct": <0-3 index>,\n        "explanation": "<why this answer is correct>",\n        "difficulty": "<easy|medium|hard>"\n      },\n      {\n        "id": "<unique string>",\n        "type": "true_false",\n        "question": "<statement>",\n        "options": ["True", "False"],\n        "correct": <0 or 1>,\n        "explanation": "<explanation>",\n        "difficulty": "<easy|medium|hard>"\n      }\n    ]\n  },\n  "flashcards": [\n    {\n      "id": "<unique string>",\n      "term": "<term or concept>",\n      "definition": "<clear definition>",\n      "example": "<practical example>",\n      "hint": "<memory hint or mnemonic>"\n    }\n  ]\n}\n\nRules:\n- Generate 8 quiz questions minimum (mix of multiple_choice and true_false)\n- Generate 10 flashcards minimum\n- key_concepts should have 5-8 items\n- All content must come directly from the notes provided\n- JSON must be valid and parseable`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      input: prompt,
      max_output_tokens: 1200,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const text = Array.isArray(data.output) ? data.output.join("\n") : data.output || "";
  const raw = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error("Failed to parse Groq response. Please try again.");
  }
};
