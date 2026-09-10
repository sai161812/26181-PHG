import { LocalRepository, PersistedState } from '../domain/interfaces';

const STORAGE_KEY = 'sih26181_companion_state_v1';

export class LocalStorageRepository implements LocalRepository {
  private debounceTimer: any = null;
  private pendingState: PersistedState | null = null;
  private lastStorageError: string | null = null;
  private memoryStore: Map<string, string> = new Map();

  private getStorage(): Storage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
    return null;
  }

  public getLastError(): string | null {
    return this.lastStorageError;
  }

  public async load(): Promise<PersistedState | null> {
    try {
      this.lastStorageError = null;
      const storage = this.getStorage();
      const raw = storage ? storage.getItem(STORAGE_KEY) : this.memoryStore.get(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
        console.warn('[LocalStorageRepository] Schema version mismatch or corrupt data. Resetting.');
        return null;
      }
      return parsed as PersistedState;
    } catch (err: any) {
      this.lastStorageError = err?.message || 'Failed to read from browser storage';
      console.error('[LocalStorageRepository] Failed to read from localStorage:', err);
      return null;
    }
  }

  public async save(state: PersistedState): Promise<void> {
    this.pendingState = state;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.flushSync();
    }, 2000);
  }

  public flushSync(): void {
    if (!this.pendingState) return;
    try {
      this.lastStorageError = null;
      const json = JSON.stringify(this.pendingState);
      const storage = this.getStorage();
      if (storage) {
        storage.setItem(STORAGE_KEY, json);
      } else {
        this.memoryStore.set(STORAGE_KEY, json);
      }
    } catch (err: any) {
      this.lastStorageError = err?.name === 'QuotaExceededError'
        ? 'Browser storage quota exceeded. Unable to persist updates.'
        : (err?.message || 'Storage write failure');
      console.error('[LocalStorageRepository] Failed to flush to localStorage:', err);
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('storage-failure', { detail: { error: this.lastStorageError } }));
      }
    } finally {
      this.pendingState = null;
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
    }
  }

  public async clear(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingState = null;
    try {
      this.lastStorageError = null;
      const storage = this.getStorage();
      if (storage) {
        storage.removeItem(STORAGE_KEY);
      } else {
        this.memoryStore.delete(STORAGE_KEY);
      }
    } catch (err: any) {
      this.lastStorageError = err?.message || 'Failed to clear browser storage';
      console.error('[LocalStorageRepository] Failed to remove storage key:', err);
    }
  }
}
