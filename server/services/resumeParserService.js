const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { extractResumeData } = require('./geminiService');

async function extractRawText(file) {
  if (file.mimetype === 'application/pdf') {
    const parsed = await pdfParse(file.buffer);
    return parsed.text;
  }

  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return parsed.value;
  }

  const error = new Error('Unsupported file type');
  error.statusCode = 400;
  throw error;
}

async function parseResume(file) {
  const rawText = (await extractRawText(file)).trim();
  if (!rawText) {
    const error = new Error('Could not extract readable text from the resume');
    error.statusCode = 400;
    throw error;
  }

  const structured = await extractResumeData(rawText);
  return { rawText, ...structured };
}

module.exports = { parseResume };
