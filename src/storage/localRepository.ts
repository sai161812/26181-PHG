import { LocalRepository, PersistedState } from '../domain/interfaces';

const STORAGE_KEY = 'sih26181_companion_state_v1';

export class LocalStorageRepository implements LocalRepository {
  private debounceTimer: any = null;
  private pendingState: PersistedState | null = null;

  public async load(): Promise<PersistedState | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || parsed.version !== 1) {
        console.warn('[LocalStorageRepository] Schema version mismatch or corrupt data. Resetting.');
        return null;
      }
      return parsed as PersistedState;
    } catch (err) {
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pendingState));
    } catch (err) {
      console.error('[LocalStorageRepository] Failed to flush to localStorage:', err);
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
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('[LocalStorageRepository] Failed to remove storage key:', err);
    }
  }
}
