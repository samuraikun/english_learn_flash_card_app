export interface FlashCard {
  word: string;
  meaning: string;
  phonetic: string;
  definition: string;
  example: string;
  status?: 'understood' | 'learning';
}

export interface CSVRow {
  [key: string]: string;
  'Meaning (JP)': string;
  'Phonetic Symbol': string;
  'English Definition': string;
  'Example Sentence': string;
}
