const calculateFluencyScore = (transcript) => {
  // This is a simplified example. A real fluency score would involve more complex NLP.
  // Factors could include:
  // - Words per minute (WPM)
  // - Pauses and hesitations (if detectable from STT output or audio analysis)
  // - Repetitions
  // - Filler words (e.g., "um", "uh")
  // - Grammatical correctness (requires more advanced NLP)

  if (!transcript || transcript.trim().length === 0) {
    return 0.00;
  }

  const words = transcript.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Example: Assign a higher score for more words, with a cap.
  // This is a placeholder. A real system would use more sophisticated metrics.
  let score = Math.min(100, wordCount / 5 * 10); // 5 words = 10 points, max 100

  // Deduct points for common filler words (very basic example)
  const fillerWords = ["um", "uh", "like", "you know"];
  let fillerCount = 0;
  words.forEach(word => {
    if (fillerWords.includes(word.toLowerCase())) {
      fillerCount++;
    }
  });
  score = Math.max(0, score - (fillerCount * 5)); // Deduct 5 points per filler word

  // Ensure score is between 0 and 100
  return parseFloat(score.toFixed(2));
};

module.exports = { calculateFluencyScore };

