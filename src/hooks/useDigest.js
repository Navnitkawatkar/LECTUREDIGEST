import { useEffect, useRef, useState } from "react";
import { digestNotes } from "../lib/groq";
import { buildSessionTitle, formatDate, generateExcerpt, wordCount } from "../lib/utils";
import { generateId, saveSession } from "../lib/storage";

const progressMessages = [
  "Reading your notes...",
  "Identifying key concepts...",
  "Building your quiz...",
  "Creating flashcards...",
  "Almost done...",
];

export const useDigest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(progressMessages[0]);
  const progressRef = useRef(null);

  useEffect(() => {
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, []);

  const startProgress = () => {
    let index = 0;
    setProgress(progressMessages[index]);
    progressRef.current = setInterval(() => {
      index = (index + 1) % progressMessages.length;
      setProgress(progressMessages[index]);
    }, 1500);
  };

  const stopProgress = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  };

  const submitDigest = async ({ notes, difficulty, customInstructions }) => {
    setError(null);
    setLoading(true);
    startProgress();

    try {
      const digest = await digestNotes(notes, difficulty, customInstructions);
      const normalizedDigest = {
        ...digest,
        difficulty,
        word_count: digest.word_count || wordCount(notes),
        quiz: {
          ...digest.quiz,
          total: digest.quiz?.questions?.length || 0,
        },
      };

      const session = {
        id: generateId(),
        title: buildSessionTitle({ topic: normalizedDigest.topic, subject: normalizedDigest.subject }),
        created_at: new Date().toISOString(),
        subject: normalizedDigest.subject,
        topic: normalizedDigest.topic,
        difficulty,
        word_count: normalizedDigest.word_count,
        notes_preview: generateExcerpt(notes, 120),
        digest: normalizedDigest,
      };

      saveSession(session);
      return session;
    } catch (error) {
      const message = error?.message || "Unable to process notes right now. Please try again.";
      setError(message);
      throw new Error(message);
    } finally {
      stopProgress();
      setLoading(false);
    }
  };

  const resetError = () => setError(null);

  return {
    loading,
    error,
    progress,
    submitDigest,
    resetError,
  };
};
