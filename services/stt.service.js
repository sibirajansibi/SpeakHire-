const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI(); // API key is picked up from environment variables

const transcribeAudio = async (audioFilePath) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "vosk",
    });
    return transcription.text;
  } catch (error) {
    console.error("Error transcribing audio with OpenAI Whisper:", error);
    throw new Error("Failed to transcribe audio.");
  }
};

module.exports = { transcribeAudio };

