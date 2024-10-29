import type { FlashCard } from '../types';

const STORAGE_KEY = 'flashcards';

export async function saveFlashCards(cards: FlashCard[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    return true;
  } catch (error) {
    console.error('Error saving flash cards:', error);
    return false;
  }
}

export async function getFlashCards(): Promise<FlashCard[]> {
  try {
    const cards = localStorage.getItem(STORAGE_KEY);
    return cards ? JSON.parse(cards) : [];
  } catch (error) {
    console.error('Error fetching flash cards:', error);
    return [];
  }
}