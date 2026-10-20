import Dexie, { type Table } from 'dexie'
import type { JsonDocument, Preferences } from './types'
class FusicDB extends Dexie { documents!: Table<JsonDocument, string>; preferences!: Table<Preferences & { id: string }, string>; constructor() { super('fusic-json'); this.version(1).stores({ documents: 'id, updatedAt', preferences: 'id' }) } }
export const db = new FusicDB()
export const defaultPreferences: Preferences = { theme: 'dark', indent: 2, fontSize: 14, wordWrap: true, autoSave: true, panelRatio: 0.5, tabOrder: [] }
