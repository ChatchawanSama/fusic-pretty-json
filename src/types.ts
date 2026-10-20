export type DocumentColor = 'purple' | 'pink' | 'blue' | 'green' | 'amber'
export type Theme = 'dark' | 'light'
export type OutputMode = 'beautify' | 'minify' | 'tree'
export interface JsonDocument { id: string; name: string; color: DocumentColor; content: string; createdAt: number; updatedAt: number; revision: number }
export interface Preferences { theme: Theme; indent: 2 | 4; fontSize: number; wordWrap: boolean; autoSave: boolean; panelRatio: number; tabOrder: string[] }
export interface JsonDiagnostic { type: string; message: string; line?: number; column?: number; index?: number; suggestion?: string; snippet?: string }
export interface JsonResult { valid: boolean; value?: unknown; error?: string; line?: number; diagnostic?: JsonDiagnostic }
