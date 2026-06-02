import fs from 'fs';
import path from 'path';
import { INITIAL_SALONS, INITIAL_COMPANIES, INITIAL_REVIEWS, INITIAL_PROFILES } from './mock_data';

const DB_FILE_PATH = path.join(process.cwd(), 'lib', 'local_db.json');

// 初期データベースオブジェクトの作成
const getInitialDb = () => ({
    salons: INITIAL_SALONS,
    companies: INITIAL_COMPANIES,
    review: INITIAL_REVIEWS,
    profiles: INITIAL_PROFILES
});

// データベースの読込
export function getMockDb() {
    try {
        if (!fs.existsSync(DB_FILE_PATH)) {
            const initialData = getInitialDb();
            fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
            return initialData;
        }
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
    } catch (e) {
        console.error('Failed to read local mock DB, returning initial data.', e);
        return getInitialDb();
    }
}

// データベースの書込
export function writeMockDb(data: any) {
    try {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error('Failed to write to local mock DB.', e);
    }
}

// モッククエリパーサー
export function handleMockDbQuery(queryState: any) {
    const db = getMockDb();
    const table = queryState.table;
    let list = db[table] || [];

    // フィルタリング処理
    if (queryState.filters && Array.isArray(queryState.filters)) {
        for (const filter of queryState.filters) {
            if (filter.type === 'eq') {
                list = list.filter((item: any) => item[filter.column] === filter.value);
            } else if (filter.type === 'in') {
                list = list.filter((item: any) => {
                    const val = item[filter.column];
                    return Array.isArray(filter.values) && filter.values.includes(val);
                });
            }
        }
    }

    // アクション別処理
    if (queryState.action === 'select') {
        // 並び替え処理
        if (queryState.order) {
            const { column, options } = queryState.order;
            const asc = options?.ascending ?? true;
            list = [...list].sort((a: any, b: any) => {
                if (a[column] < b[column]) return asc ? -1 : 1;
                if (a[column] > b[column]) return asc ? 1 : -1;
                return 0;
            });
        }

        // 単一取得
        if (queryState.single) {
            return { data: list[0] || null, error: null };
        }
        return { data: list, error: null };
    }

    if (queryState.action === 'insert') {
        const valuesToInsert = Array.isArray(queryState.values) ? queryState.values : [queryState.values];
        const newRows = valuesToInsert.map((v: any, index: number) => {
            // IDの自動採番
            let nextId = 1;
            if (list.length > 0) {
                const ids = list.map((item: any) => typeof item.id === 'number' ? item.id : 0);
                nextId = Math.max(...ids) + 1 + index;
            }
            return {
                id: nextId,
                created_at: new Date().toISOString(),
                ...v
            };
        });

        list.push(...newRows);
        db[table] = list;
        writeMockDb(db);

        // Supabase のインサートレスポンス形式に適合
        return { data: newRows, error: null };
    }

    if (queryState.action === 'update') {
        const updatedList = (db[table] || []).map((item: any) => {
            let matches = true;
            if (queryState.filters && Array.isArray(queryState.filters)) {
                for (const filter of queryState.filters) {
                    if (filter.type === 'eq' && item[filter.column] !== filter.value) {
                        matches = false;
                    }
                    if (filter.type === 'in' && (!Array.isArray(filter.values) || !filter.values.includes(item[filter.column]))) {
                        matches = false;
                    }
                }
            }
            if (matches) {
                return { ...item, ...queryState.values };
            }
            return item;
        });

        db[table] = updatedList;
        writeMockDb(db);

        // 更新されたレコードのみを返す
        const affectedRows = updatedList.filter((item: any) => {
            let matches = true;
            if (queryState.filters && Array.isArray(queryState.filters)) {
                for (const filter of queryState.filters) {
                    if (filter.type === 'eq' && item[filter.column] !== filter.value) {
                        matches = false;
                    }
                    if (filter.type === 'in' && (!Array.isArray(filter.values) || !filter.values.includes(item[filter.column]))) {
                        matches = false;
                    }
                }
            }
            return matches;
        });

        return { data: affectedRows, error: null };
    }

    if (queryState.action === 'delete') {
        const deletedItems: any[] = [];
        const remainingList = (db[table] || []).filter((item: any) => {
            let matches = true;
            if (queryState.filters && Array.isArray(queryState.filters)) {
                for (const filter of queryState.filters) {
                    if (filter.type === 'eq' && item[filter.column] !== filter.value) {
                        matches = false;
                    }
                    if (filter.type === 'in' && (!Array.isArray(filter.values) || !filter.values.includes(item[filter.column]))) {
                        matches = false;
                    }
                }
            }
            if (matches) {
                deletedItems.push(item);
            }
            return !matches;
        });

        db[table] = remainingList;
        writeMockDb(db);

        return { data: deletedItems, error: null };
    }

    return { data: null, error: { message: 'Unknown query action' } };
}
