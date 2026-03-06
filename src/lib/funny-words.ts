const STOP_WORDS = new Set([
  // English common words
  "the", "a", "an", "is", "it", "in", "on", "at", "to", "for", "of", "and",
  "or", "but", "not", "with", "this", "that", "was", "are", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "must",
  "i", "me", "my", "we", "our", "you", "your", "he", "him", "his",
  "she", "her", "they", "them", "their", "its", "who", "whom", "which",
  "what", "where", "when", "how", "why", "all", "each", "every", "both",
  "few", "more", "most", "other", "some", "such", "no", "nor", "too",
  "very", "just", "about", "above", "after", "again", "also", "am", "any",
  "because", "before", "below", "between", "by", "down", "during", "from",
  "further", "get", "got", "here", "if", "into", "much", "now", "off",
  "once", "only", "out", "over", "own", "same", "so", "still", "than",
  "then", "there", "these", "those", "through", "under", "until", "up",
  "us", "were", "while", "as", "like", "don", "didn", "doesn", "won",
  "isn", "aren", "wasn", "weren", "hasn", "haven", "hadn", "wouldn",
  "couldn", "shouldn", "ll", "ve", "re", "don't", "didn't", "doesn't",
  "won't", "isn't", "aren't", "wasn't", "weren't", "let", "gonna",
  "going", "come", "came", "make", "made", "take", "took", "go", "went",
  "say", "said", "see", "saw", "know", "knew", "think", "thought",
  "look", "looked", "want", "wanted", "give", "gave", "tell", "told",
  "one", "two", "first", "new", "way", "back", "even", "thing", "things",
  "well", "man", "people", "time", "year", "day", "right", "old",
  "great", "big", "small", "long", "little", "good", "bad", "yes",
  "yeah", "oh", "ok", "okay", "really", "actually", "never", "always",
  "still", "already", "sure", "please", "thanks", "sorry",
  "put", "use", "used", "try", "keep", "keep", "seem", "help",
  "show", "turn", "move", "live", "believe", "happen", "call",
  "work", "lot", "point", "hand", "part", "place", "case", "week",
  "head", "end", "side", "room", "face", "fact", "got", "ask",
  "last", "real", "left", "best", "better", "life", "world", "home",
  "kind", "start", "something", "anything", "everything", "nothing",
  "someone", "anyone", "everyone", "im", "hes", "shes", "dont",
  "cant", "wont", "thats", "whats", "youre", "theyre", "its",
  "ive", "youve", "weve", "theyve", "id", "youd", "hed", "shed",
  "much", "many", "own", "another", "around", "away",
]);

export interface FunnyWord {
  word: string;
  count: number;
}

export function extractFunnyWords(captions: string[]): FunnyWord[] {
  const freq: Record<string, number> = {};

  for (const caption of captions) {
    const words = caption
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

    for (const word of words) {
      freq[word] = (freq[word] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count }));
}
