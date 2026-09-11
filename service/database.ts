import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

export type Cafe = { id: number; nome: string; nota: number; data: string };

const WEB_STORAGE_KEY = 'cafescore-cafes';
const db = Platform.OS === 'web' ? null : SQLite.openDatabaseSync('cafes.db');

function lerCafesWeb(): Cafe[] {
  if (typeof localStorage === 'undefined') return [];
  const dados = localStorage.getItem(WEB_STORAGE_KEY);
  return dados ? (JSON.parse(dados) as Cafe[]) : [];
}

function salvarCafesWeb(cafes: Cafe[]) {
  localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(cafes));
}

export function initDatabase() {
  if (Platform.OS === 'web' || !db) return;
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cafes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      nota INTEGER NOT NULL,
      data TEXT NOT NULL
    );
  `);
}

export function adicionarCafe(nome: string, nota: number) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  if (Platform.OS === 'web') {
    const cafes = lerCafesWeb();
    const proximoId = cafes.reduce((maiorId, cafe) => Math.max(maiorId, cafe.id), 0) + 1;
    salvarCafesWeb([{ id: proximoId, nome, nota, data: dataAtual }, ...cafes]);
    return;
  }
  db?.runSync('INSERT INTO cafes (nome, nota, data) VALUES (?, ?, ?);', [nome, nota, dataAtual]);
}

export function obterCafes(): Cafe[] {
  if (Platform.OS === 'web') return lerCafesWeb();
  return db?.getAllSync<Cafe>('SELECT * FROM cafes ORDER BY id DESC;') ?? [];
}

export function removerCafe(id: number) {
  if (Platform.OS === 'web') {
    salvarCafesWeb(lerCafesWeb().filter((cafe) => cafe.id !== id));
    return;
  }
  db?.runSync('DELETE FROM cafes WHERE id = ?;', [id]);
}