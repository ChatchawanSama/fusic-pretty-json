import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db, defaultPreferences } from './db'
import { orderDocuments, useStore } from './stores'
import type { JsonDocument } from './types'

describe('document store', () => {
  beforeEach(async () => { await db.delete(); await db.open(); useStore.setState({ documents: [], activeId: null, prefs: defaultPreferences, initialized: false, dirty: new Set() }) })
  it('creates and duplicates documents', async () => { const first = await useStore.getState().createDocument({ name: 'API', content: '{"ok":true}' }); await useStore.getState().duplicateDocument(first.id); expect(useStore.getState().documents).toHaveLength(2); expect(useStore.getState().documents[0].content).toBe(first.content) })
  it('persists and deletes documents', async () => { const doc = await useStore.getState().createDocument({ name: 'Saved' }); expect(await db.documents.get(doc.id)).toBeTruthy(); await useStore.getState().deleteDocument(doc.id); expect(await db.documents.get(doc.id)).toBeUndefined() })
  it('persists the panel layout ratio with preferences', async () => { await useStore.getState().setPrefs({ panelRatio: 0.65 }); expect((await db.preferences.get('preferences'))?.panelRatio).toBe(0.65) })
  it('restores tabs in creation order, regardless of update order', async () => {
    const docs = [
      { id: '3', name: 'Three', createdAt: 300, updatedAt: 900 },
      { id: '1', name: 'One', createdAt: 100, updatedAt: 1000 },
      { id: '2', name: 'Two', createdAt: 200, updatedAt: 800 },
    ] as JsonDocument[]
    expect(orderDocuments(docs).map((doc) => doc.name)).toEqual(['One', 'Two', 'Three'])
  })
  it('persists reordering and appends new tabs after the reordered list', async () => {
    const one = await useStore.getState().createDocument({ name: 'One' }); const two = await useStore.getState().createDocument({ name: 'Two' }); const three = await useStore.getState().createDocument({ name: 'Three' });
    await useStore.getState().reorderDocuments(three.id, one.id)
    expect(useStore.getState().documents.map((doc) => doc.name)).toEqual(['Three', 'One', 'Two'])
    expect((await db.preferences.get('preferences'))?.tabOrder).toEqual([three.id, one.id, two.id])
    const four = await useStore.getState().createDocument({ name: 'Four' })
    expect(useStore.getState().documents.map((doc) => doc.name)).toEqual(['Three', 'One', 'Two', 'Four'])
  })
  it('persists recently closed tabs and reopens them newest first without duplicates', async () => {
    const one = await useStore.getState().createDocument({ name: 'One', content: '{"one":1}' })
    const two = await useStore.getState().createDocument({ name: 'Two', content: '{"two":2}' })
    const three = await useStore.getState().createDocument({ name: 'Three', content: '{"three":3}' })
    useStore.getState().setActive(one.id)
    await useStore.getState().closeDocumentTab(one.id)
    await useStore.getState().closeDocumentTab(two.id)
    expect((await db.preferences.get('preferences'))?.recentlyClosed.map((item) => item.id)).toEqual([two.id, one.id])
    expect((await db.preferences.get('preferences'))?.recentlyClosed.find((item) => item.id === one.id)?.wasActive).toBe(true)

    expect(await useStore.getState().reopenDocumentTab(two.id)).toBe(true)
    expect(useStore.getState().documents.map((doc) => doc.id)).toEqual([one.id, two.id, three.id])
    expect(useStore.getState().activeId).toBe(one.id)
    expect(await useStore.getState().reopenDocumentTab(one.id)).toBe(true)
    expect(useStore.getState().documents.map((doc) => doc.id)).toEqual([one.id, two.id, three.id])
    expect(useStore.getState().activeId).toBe(one.id)
    expect(await useStore.getState().reopenDocumentTab(one.id)).toBe(false)
  })
})
