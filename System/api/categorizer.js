import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let predictCategory, tokenize;

try {
  const modelPath = join(__dirname, "..", "naive_bayes_model.json");

  console.log("Loading model from:", modelPath);

  const modelData = JSON.parse(readFileSync(modelPath, "utf8"));
  console.log("Model loaded successfully");

  const classPriors = modelData.class_priors_log;
  const tokenLikelihoods = modelData.likelihoods_log;
  const vocab = modelData.vocab;
  const STOPWORDS = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "if",
    "in",
    "on",
    "of",
    "for",
    "to",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "it",
    "its",
    "this",
    "that",
    "these",
    "those",
    "as",
    "at",
    "by",
    "with",
    "but",
    "about",
    "into",
    "over",
    "after",
    "before",
    "while",
    "so",
    "no",
    "not",
    "too",
    "very",
    "can",
    "cannot",
    "we",
    "you",
    "your",
    "yours",
    "our",
    "ours",
    "they",
    "them",
    "their",
    "theirs",
    "he",
    "she",
    "his",
    "her",
    "i",
    "me",
    "my",
    "mine",
    "do",
    "does",
    "did",
    "doing",
    "have",
    "has",
    "had",
    "having",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "also",
    "than",
    "then",
    "there",
    "here",
    "up",
    "down",
    "out",
    "just",
    "like",
  ]);

  tokenize = function (text) {
    text = text.toLowerCase();
    text = text.replace(/http\S+|www\.\S+/g, " ");
    text = text.replace(/[@#]\w+/g, " ");
    const tokens = text.match(/[a-z]+/g) || [];
    return tokens.filter((t) => !STOPWORDS.has(t) && t.length > 1);
  };

  predictCategory = function (caption) {
    const tokens = tokenize(caption);
    const scores = {};

    for (const cls of Object.keys(classPriors)) {
      scores[cls] = classPriors[cls];

      for (const token of tokens) {
        if (vocab.hasOwnProperty(token)) {
          const wordIndex = vocab[token];
          scores[cls] += tokenLikelihoods[cls][wordIndex];
        } else {
          scores[cls] += Math.log(1e-6);
        }
      }
    }

    return Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );
  };

  console.log("Naive Bayes Model Loaded:");
  console.log(`- Classes: ${Object.keys(classPriors).join(", ")}`);
  console.log(`- Vocabulary: ${Object.keys(vocab).length} words`);
  console.log(
    `- Model size: ${Math.round(
      Buffer.byteLength(JSON.stringify(modelData)) / 1024
    )} KB`
  );
} catch (error) {
  console.error("Failed to load model:", error.message);
  console.error("Please check:");
  console.error("1. The file exists at the correct path");
  console.error("2. The JSON file is valid");
  console.error("3. You have read permissions");
  process.exit(1);
}

export { predictCategory, tokenize };
