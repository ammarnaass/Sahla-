/**
 * 💾 محرك التخزين المستديم الذري (Atomic JSON Storage Engine)
 * Aligned with Prisma models and guarantees state persistence across server restarts
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// التأكد من وجود مجلد البيانات
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonStore {
  constructor(collectionName, defaultData = []) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.defaultData = defaultData;
    this._memoryCache = null;
    this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this._memoryCache = JSON.parse(raw);
      } else {
        this._memoryCache = JSON.parse(JSON.stringify(this.defaultData));
        this._persist();
      }
    } catch (err) {
      console.error(`[JsonStore] Error reading ${this.collectionName}:`, err.message);
      this._memoryCache = JSON.parse(JSON.stringify(this.defaultData));
    }
  }

  _persist() {
    try {
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this._memoryCache, null, 2), 'utf8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error(`[JsonStore] Error writing ${this.collectionName}:`, err.message);
    }
  }

  getAll() {
    return [...this._memoryCache];
  }

  find(predicate) {
    return this._memoryCache.find(predicate) || null;
  }

  filter(predicate) {
    return this._memoryCache.filter(predicate);
  }

  insert(item) {
    this._memoryCache.push(item);
    this._persist();
    return item;
  }

  update(predicate, updater) {
    const idx = this._memoryCache.findIndex(predicate);
    if (idx !== -1) {
      this._memoryCache[idx] = typeof updater === 'function' 
        ? updater(this._memoryCache[idx]) 
        : { ...this._memoryCache[idx], ...updater };
      this._persist();
      return this._memoryCache[idx];
    }
    return null;
  }

  delete(predicate) {
    const beforeCount = this._memoryCache.length;
    this._memoryCache = this._memoryCache.filter(item => !predicate(item));
    const deletedCount = beforeCount - this._memoryCache.length;
    if (deletedCount > 0) {
      this._persist();
    }
    return deletedCount > 0;
  }

  replace(newCollection) {
    this._memoryCache = [...newCollection];
    this._persist();
  }
}

module.exports = JsonStore;
