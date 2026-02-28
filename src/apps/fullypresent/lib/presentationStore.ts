/**
 * Consolidated Presentation Store
 *
 * Single source of truth for all presentation state.
 * Replaces scattered state in page.tsx, usePresentation hook, and refs.
 *
 * Key principles:
 * - All state lives here
 * - Components subscribe to slices they need
 * - Actions are synchronous state updates
 * - Persistence is handled via middleware
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'

import type {
  SlideType,
  Slide,
  PresentationSettings,
  VaultMediaItem,
  Presentation,
  PresentationMeta,
  PanelType,
} from './types'

// ============== State Interface ==============

export type FullyPresentView = 'list' | 'editor'

interface PresentationState {
  // Core data
  presentation: Presentation | null
  currentSlideIndex: number

  // UI state
  view: FullyPresentView
  isPresentMode: boolean
  activePanel: PanelType | null
  isAiPanelExpanded: boolean

  // Persistence state
  isDirty: boolean
  isSaving: boolean
  isLoading: boolean
  lastSavedAt: Date | null
  recentPresentations: PresentationMeta[]

  // Error state
  error: string | null
}

interface PresentationActions {
  // Slide content updates
  setCurrentSlideCanvasJson: (json: string) => void
  setCurrentSlideTalkTrack: (text: string) => void
  setSlideTalkTrack: (index: number, text: string) => void
  setCurrentSlideThumbnail: (thumbnail: string) => void
  setCurrentSlideType: (type: SlideType) => void

  // Navigation
  navigateToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void

  // Slide management
  addSlide: () => string
  deleteSlide: (index: number) => void
  duplicateSlide: (index: number) => void
  reorderSlides: (fromIndex: number, toIndex: number) => void
  moveSlide: (fromIndex: number, toIndex: number) => void

  // Present mode
  enterPresentMode: () => void
  exitPresentMode: () => void

  // View management
  setView: (view: FullyPresentView) => void

  // Panel management
  setActivePanel: (panel: PanelType | null) => void
  togglePanel: (panel: PanelType) => void
  setAiPanelExpanded: (expanded: boolean) => void

  // Presentation metadata
  updateName: (name: string) => void

  // Settings
  updateSettings: (settings: Partial<PresentationSettings>) => void

  // Vault
  addToVault: (item: Omit<VaultMediaItem, 'id' | 'createdAt'>) => void
  removeFromVault: (id: string) => void

  // Rename a presentation in storage without loading it
  renamePresentation: (id: string, name: string) => Promise<void>

  // Persistence
  save: () => Promise<void>
  load: (id: string) => Promise<void>
  loadPresentation: (id: string) => Promise<void>
  createNew: (name?: string) => Promise<void>
  createNewPresentation: (name?: string) => Promise<void>
  deletePresentation: (id: string) => Promise<void>
  loadRecent: () => Promise<void>

  // Initialization
  initialize: () => Promise<void>

  // Reset
  reset: () => void
}

export type PresentationStore = PresentationState & PresentationActions

// ============== Helpers ==============

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const DEFAULT_SETTINGS: PresentationSettings = {
  template: 'spiekermann',
  colorMode: 'light',
  showLogoOnSlides: true,
}

function createEmptySlide(): Slide {
  return {
    id: generateId(),
    canvasJson: '',
    talkTrack: '',
    slideType: 'blank',
  }
}

function createNewPresentation(name?: string): Presentation {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    name: name || 'Untitled Presentation',
    createdAt: now,
    updatedAt: now,
    slides: [createEmptySlide()],
    settings: { ...DEFAULT_SETTINGS },
    vault: [],
  }
}

function extractNameFromSlides(slides: Slide[]): string {
  if (!slides.length) return 'Untitled Presentation'
  const firstSlide = slides[0]
  if (!firstSlide.canvasJson) return 'Untitled Presentation'

  try {
    const data = JSON.parse(firstSlide.canvasJson)
    if (data.objects) {
      for (const obj of data.objects) {
        if ((obj.type === 'i-text' || obj.type === 'text') && obj.text) {
          const text = obj.text.trim()
          if (text.length > 0) {
            return text.length > 50 ? text.substring(0, 47) + '...' : text
          }
        }
      }
    }
  } catch {
    // Invalid JSON
  }
  return 'Untitled Presentation'
}

// ============== IndexedDB Storage ==============

const DB_NAME = 'fully-present-db'
const DB_VERSION = 1
const STORE_NAME = 'presentations'
const CURRENT_KEY = 'fully-present-current'
const MAX_RECENT = 10

class StorageService {
  private dbPromise: Promise<IDBDatabase> | null = null

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
    })

    return this.dbPromise
  }

  async save(presentation: Presentation): Promise<void> {
    const db = await this.getDB()
    const toSave = {
      ...presentation,
      updatedAt: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.put(toSave)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async load(id: string): Promise<Presentation | null> {
    const db = await this.getDB()

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB()

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.delete(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        if (this.getCurrentId() === id) {
          this.setCurrentId(null)
        }
        resolve()
      }
    })
  }

  async listRecent(): Promise<PresentationMeta[]> {
    const db = await this.getDB()

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entries: Presentation[] = request.result || []
        entries.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )

        const recent = entries.slice(0, MAX_RECENT).map((p) => ({
          id: p.id,
          name: p.name,
          updatedAt: p.updatedAt,
          slideCount: p.slides.length,
          thumbnailUrl: p.slides[0]?.thumbnail,
        }))

        resolve(recent)
      }
    })
  }

  getCurrentId(): string | null {
    return localStorage.getItem(CURRENT_KEY)
  }

  setCurrentId(id: string | null): void {
    if (id) {
      localStorage.setItem(CURRENT_KEY, id)
    } else {
      localStorage.removeItem(CURRENT_KEY)
    }
  }
}

const storage = new StorageService()

// ============== Initial State ==============

const initialState: PresentationState = {
  presentation: null,
  currentSlideIndex: 0,
  view: 'list',
  isPresentMode: false,
  activePanel: null,
  isAiPanelExpanded: false,
  isDirty: false,
  isSaving: false,
  isLoading: true,
  lastSavedAt: null,
  recentPresentations: [],
  error: null,
}

// ============== Sync save for beforeunload ==============

// Synchronous save directly to IndexedDB (bypasses async wrapper)
// Used in beforeunload to persist data before page closes
function syncSaveToStorage(presentation: Presentation): void {
  try {
    const toSave = {
      ...presentation,
      updatedAt: new Date().toISOString(),
    }
    // Open a sync transaction - IndexedDB transactions started before
    // unload can still complete
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onsuccess = () => {
      const db = request.result
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(toSave)
    }
  } catch {
    // Best effort - ignore errors during unload
  }
}

// ============== Store ==============

export const usePresentationStore = create<PresentationStore>()(
  subscribeWithSelector(
    immer((set, get) => {
      // Debounced auto-save
      let saveTimeout: ReturnType<typeof setTimeout> | null = null
      const scheduleSave = () => {
        if (saveTimeout) clearTimeout(saveTimeout)
        saveTimeout = setTimeout(() => {
          get().save()
        }, 1000)
      }

      // Flush any pending save immediately (cancels debounce timer)
      const flushSave = () => {
        if (saveTimeout) {
          clearTimeout(saveTimeout)
          saveTimeout = null
        }
        const { presentation, isDirty } = get()
        if (presentation && isDirty) {
          // Use sync save for reliability during unload
          syncSaveToStorage(presentation)
          set((state) => {
            state.isDirty = false
          })
        }
      }

      // Register handlers to flush saves before page closes or hides
      window.addEventListener('beforeunload', flushSave)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          flushSave()
        }
      })

      return {
        ...initialState,

        // ============== Slide Content ==============

        setCurrentSlideCanvasJson: (json: string) => {
          set((state) => {
            if (!state.presentation) return
            const slide = state.presentation.slides[state.currentSlideIndex]
            if (slide) {
              // Safety check: don't overwrite existing content with empty content
              const hasNewContent = json && json.length > 100
              const hasExistingContent = slide.canvasJson && slide.canvasJson.length > 100

              if (!hasNewContent && hasExistingContent) {
                return
              }

              slide.canvasJson = json
              state.isDirty = true
              // Auto-extract name from first slide (only if we have content and name wasn't manually set)
              if (state.currentSlideIndex === 0 && hasNewContent && !state.presentation.nameManuallySet) {
                state.presentation.name = extractNameFromSlides(
                  state.presentation.slides
                )
              }
            }
          })
          scheduleSave()
        },

        setCurrentSlideTalkTrack: (text: string) => {
          set((state) => {
            if (!state.presentation) return
            const slide = state.presentation.slides[state.currentSlideIndex]
            if (slide) {
              slide.talkTrack = text
              state.isDirty = true
            }
          })
          scheduleSave()
        },

        setSlideTalkTrack: (index: number, text: string) => {
          set((state) => {
            if (!state.presentation) return
            const slide = state.presentation.slides[index]
            if (slide) {
              slide.talkTrack = text
              state.isDirty = true
            }
          })
          scheduleSave()
        },

        setCurrentSlideThumbnail: (thumbnail: string) => {
          set((state) => {
            if (!state.presentation) return
            const slide = state.presentation.slides[state.currentSlideIndex]
            if (slide) {
              slide.thumbnail = thumbnail
            }
          })
        },

        setCurrentSlideType: (type: SlideType) => {
          set((state) => {
            if (!state.presentation) return
            const slide = state.presentation.slides[state.currentSlideIndex]
            if (slide) {
              slide.slideType = type
              state.isDirty = true
            }
          })
          scheduleSave()
        },

        // ============== Navigation ==============

        navigateToSlide: (index: number) => {
          set((state) => {
            if (!state.presentation) return
            if (index >= 0 && index < state.presentation.slides.length) {
              state.currentSlideIndex = index
            }
          })
        },

        nextSlide: () => {
          const { presentation, currentSlideIndex, navigateToSlide } = get()
          if (presentation && currentSlideIndex < presentation.slides.length - 1) {
            navigateToSlide(currentSlideIndex + 1)
          }
        },

        prevSlide: () => {
          const { currentSlideIndex, navigateToSlide } = get()
          if (currentSlideIndex > 0) {
            navigateToSlide(currentSlideIndex - 1)
          }
        },

        // ============== Slide Management ==============

        addSlide: () => {
          const newSlide = createEmptySlide()
          set((state) => {
            if (!state.presentation) return
            state.presentation.slides.push(newSlide)
            state.isDirty = true
          })
          scheduleSave()
          return newSlide.id
        },

        deleteSlide: (index: number) => {
          set((state) => {
            if (!state.presentation) return
            if (state.presentation.slides.length <= 1) return // Keep at least one
            state.presentation.slides.splice(index, 1)
            // Adjust current index if needed
            if (state.currentSlideIndex >= state.presentation.slides.length) {
              state.currentSlideIndex = state.presentation.slides.length - 1
            }
            state.isDirty = true
          })
          scheduleSave()
        },

        duplicateSlide: (index: number) => {
          set((state) => {
            if (!state.presentation) return
            const original = state.presentation.slides[index]
            if (!original) return

            const duplicate: Slide = {
              ...original,
              id: generateId(),
              thumbnail: undefined, // Will be regenerated
            }
            state.presentation.slides.splice(index + 1, 0, duplicate)
            state.currentSlideIndex = index + 1
            state.isDirty = true
          })
          scheduleSave()
        },

        reorderSlides: (fromIndex: number, toIndex: number) => {
          set((state) => {
            if (!state.presentation) return
            const slides = state.presentation.slides
            const [moved] = slides.splice(fromIndex, 1)
            slides.splice(toIndex, 0, moved)
            // Adjust current index
            if (state.currentSlideIndex === fromIndex) {
              state.currentSlideIndex = toIndex
            } else if (
              fromIndex < state.currentSlideIndex &&
              toIndex >= state.currentSlideIndex
            ) {
              state.currentSlideIndex--
            } else if (
              fromIndex > state.currentSlideIndex &&
              toIndex <= state.currentSlideIndex
            ) {
              state.currentSlideIndex++
            }
            state.isDirty = true
          })
          scheduleSave()
        },

        // Alias for reorderSlides
        moveSlide: (fromIndex: number, toIndex: number) => {
          get().reorderSlides(fromIndex, toIndex)
        },

        // ============== Present Mode ==============

        enterPresentMode: () => {
          set((state) => {
            state.isPresentMode = true
          })
        },

        exitPresentMode: () => {
          set((state) => {
            state.isPresentMode = false
          })
        },

        // ============== View ==============

        setView: (view: FullyPresentView) => {
          set((state) => {
            state.view = view
          })
        },

        // ============== Panels ==============

        setActivePanel: (panel: PanelType | null) => {
          set((state) => {
            state.activePanel = panel
          })
        },

        togglePanel: (panel: PanelType) => {
          set((state) => {
            state.activePanel = state.activePanel === panel ? null : panel
          })
        },

        setAiPanelExpanded: (expanded: boolean) => {
          set((state) => {
            state.isAiPanelExpanded = expanded
          })
        },

        // ============== Presentation Metadata ==============

        updateName: (name: string) => {
          set((state) => {
            if (!state.presentation) return
            state.presentation.name = name
            // Mark as manually set if user typed a non-empty name;
            // reset if they clear it so auto-extraction can resume
            state.presentation.nameManuallySet = name.trim().length > 0
            state.isDirty = true
          })
          scheduleSave()
        },

        // ============== Settings ==============

        updateSettings: (settings: Partial<PresentationSettings>) => {
          set((state) => {
            if (!state.presentation) return
            state.presentation.settings = {
              ...state.presentation.settings,
              ...settings,
            }
            state.isDirty = true
          })
          scheduleSave()
        },

        // ============== Vault ==============

        addToVault: (item: Omit<VaultMediaItem, 'id' | 'createdAt'>) => {
          set((state) => {
            if (!state.presentation) return
            if (!state.presentation.vault) {
              state.presentation.vault = []
            }
            // Check if already exists by name
            const exists = state.presentation.vault.some(
              (v) => v.name === item.name
            )
            if (!exists) {
              state.presentation.vault.push({
                ...item,
                id: generateId(),
                createdAt: new Date().toISOString(),
              })
              state.isDirty = true
            }
          })
          scheduleSave()
        },

        removeFromVault: (id: string) => {
          set((state) => {
            if (!state.presentation?.vault) return
            const index = state.presentation.vault.findIndex((v) => v.id === id)
            if (index !== -1) {
              state.presentation.vault.splice(index, 1)
              state.isDirty = true
            }
          })
          scheduleSave()
        },

        // ============== Rename in storage ==============

        renamePresentation: async (id: string, name: string) => {
          try {
            const presentation = await storage.load(id)
            if (presentation) {
              presentation.name = name
              presentation.nameManuallySet = name.trim().length > 0
              await storage.save(presentation)
              // If this is the currently loaded presentation, update in state too
              const { presentation: current } = get()
              if (current?.id === id) {
                set((state) => {
                  if (state.presentation) {
                    state.presentation.name = name
                    state.presentation.nameManuallySet = name.trim().length > 0
                  }
                })
              }
              await get().loadRecent()
            }
          } catch (error) {
            console.error('Failed to rename presentation:', error)
          }
        },

        // ============== Persistence ==============

        save: async () => {
          const { presentation, isDirty, isSaving } = get()
          if (!presentation || !isDirty || isSaving) return

          set((state) => {
            state.isSaving = true
          })

          try {
            await storage.save(presentation)
            storage.setCurrentId(presentation.id)
            set((state) => {
              state.isDirty = false
              state.isSaving = false
              state.lastSavedAt = new Date()
            })
          } catch (error) {
            console.error('Failed to save:', error)
            set((state) => {
              state.isSaving = false
              state.error = 'Failed to save presentation'
            })
          }
        },

        load: async (id: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const presentation = await storage.load(id)
            if (presentation) {
              set((state) => {
                state.presentation = presentation
                state.currentSlideIndex = 0
                state.isDirty = false
                state.isLoading = false
                state.view = 'editor'
                state.lastSavedAt = new Date(presentation.updatedAt)
              })
              storage.setCurrentId(id)
            } else {
              set((state) => {
                state.isLoading = false
                state.error = 'Presentation not found'
              })
            }
          } catch (error) {
            console.error('Failed to load:', error)
            set((state) => {
              state.isLoading = false
              state.error = 'Failed to load presentation'
            })
          }
        },

        createNew: async (name?: string) => {
          const presentation = createNewPresentation(name)
          set((state) => {
            state.presentation = presentation
            state.currentSlideIndex = 0
            state.isDirty = false
            state.isLoading = false
            state.view = 'editor'
          })

          try {
            await storage.save(presentation)
            storage.setCurrentId(presentation.id)
            set((state) => {
              state.lastSavedAt = new Date()
            })
            await get().loadRecent()
          } catch (error) {
            console.error('Failed to save new presentation:', error)
          }
        },

        deletePresentation: async (id: string) => {
          try {
            await storage.delete(id)
            const { presentation } = get()
            if (presentation?.id === id) {
              set((state) => {
                state.presentation = null
                state.currentSlideIndex = 0
                state.view = 'list'
              })
            }
            await get().loadRecent()
          } catch (error) {
            console.error('Failed to delete:', error)
            set((state) => {
              state.error = 'Failed to delete presentation'
            })
          }
        },

        // Aliases for backward compatibility
        loadPresentation: async (id: string) => {
          await get().load(id)
        },

        createNewPresentation: async (name?: string) => {
          await get().createNew(name)
        },

        loadRecent: async () => {
          try {
            const recent = await storage.listRecent()
            set((state) => {
              state.recentPresentations = recent
            })
          } catch (error) {
            console.error('Failed to load recent:', error)
          }
        },

        // ============== Initialization ==============

        initialize: async () => {
          set((state) => {
            state.isLoading = true
          })

          try {
            await get().loadRecent()
            set((state) => {
              state.isLoading = false
              state.view = 'list'
            })
          } catch (error) {
            console.error('Failed to initialize:', error)
            set((state) => {
              state.isLoading = false
              state.error = 'Failed to initialize'
            })
          }
        },

        // ============== Reset ==============

        reset: () => {
          set(initialState)
        },
      }
    })
  )
)

// ============== Selectors ==============

export const selectCurrentSlide = (state: PresentationStore): Slide | null => {
  return state.presentation?.slides[state.currentSlideIndex] ?? null
}

export const selectSlides = (state: PresentationStore): Slide[] => {
  return state.presentation?.slides ?? []
}

export const selectSlideCount = (state: PresentationStore): number => {
  return state.presentation?.slides.length ?? 0
}

export const selectVault = (state: PresentationStore): VaultMediaItem[] => {
  return state.presentation?.vault ?? []
}

export const selectSettings = (
  state: PresentationStore
): PresentationSettings => {
  return state.presentation?.settings ?? DEFAULT_SETTINGS
}

// Primitive value selectors
export const selectPresentation = (state: PresentationStore) => state.presentation
export const selectCurrentSlideIndex = (state: PresentationStore) => state.currentSlideIndex
export const selectIsPresentMode = (state: PresentationStore) => state.isPresentMode
export const selectIsLoading = (state: PresentationStore) => state.isLoading
export const selectIsDirty = (state: PresentationStore) => state.isDirty
export const selectLastSavedAt = (state: PresentationStore) => state.lastSavedAt
export const selectRecentPresentations = (state: PresentationStore) => state.recentPresentations

// Actions selector - returns stable references
export const selectActions = (state: PresentationStore) => ({
  setCurrentSlideCanvasJson: state.setCurrentSlideCanvasJson,
  setCurrentSlideTalkTrack: state.setCurrentSlideTalkTrack,
  setSlideTalkTrack: state.setSlideTalkTrack,
  setCurrentSlideThumbnail: state.setCurrentSlideThumbnail,
  setCurrentSlideType: state.setCurrentSlideType,
  navigateToSlide: state.navigateToSlide,
  addSlide: state.addSlide,
  deleteSlide: state.deleteSlide,
  duplicateSlide: state.duplicateSlide,
  moveSlide: state.moveSlide,
  enterPresentMode: state.enterPresentMode,
  exitPresentMode: state.exitPresentMode,
  addToVault: state.addToVault,
  removeFromVault: state.removeFromVault,
  updateSettings: state.updateSettings,
  updateName: state.updateName,
  reorderSlides: state.reorderSlides,
  togglePanel: state.togglePanel,
  setActivePanel: state.setActivePanel,
  setView: state.setView,
  createNewPresentation: state.createNewPresentation,
  loadPresentation: state.loadPresentation,
  deletePresentation: state.deletePresentation,
  renamePresentation: state.renamePresentation,
  initialize: state.initialize,
})

// ============== Hooks for Common Patterns ==============

export function useCurrentSlide(): Slide | null {
  return usePresentationStore(selectCurrentSlide)
}

export function useSlides(): Slide[] {
  return usePresentationStore(useShallow(selectSlides))
}

export function useVault(): VaultMediaItem[] {
  return usePresentationStore(useShallow(selectVault))
}

export function useSettings(): PresentationSettings {
  return usePresentationStore(useShallow(selectSettings))
}

export function useActions() {
  return usePresentationStore(useShallow(selectActions))
}
