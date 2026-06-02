import { cookies } from 'next/headers';

class ServerMockQueryBuilder {
    private queryState: any;

    constructor(table: string) {
        this.queryState = {
            table,
            action: 'select',
            filters: []
        };
    }

    select(columns: string = '*') {
        this.queryState.action = 'select';
        this.queryState.columns = columns;
        return this;
    }

    insert(values: any[]) {
        this.queryState.action = 'insert';
        this.queryState.values = values;
        return this;
    }

    update(values: any) {
        this.queryState.action = 'update';
        this.queryState.values = values;
        return this;
    }

    delete() {
        this.queryState.action = 'delete';
        return this;
    }

    eq(column: string, value: any) {
        this.queryState.filters.push({ type: 'eq', column, value });
        return this;
    }

    in(column: string, values: any[]) {
        this.queryState.filters.push({ type: 'in', column, values });
        return this;
    }

    single() {
        this.queryState.single = true;
        return this;
    }

    order(column: string, options?: { ascending?: boolean }) {
        this.queryState.order = { column, options };
        return this;
    }

    async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
        try {
            // サーバー側では直接ローカルマネージャーのクエリハンドラを呼び出し
            const { handleMockDbQuery } = require('@/lib/local_db_manager');
            const data = handleMockDbQuery(this.queryState);
            if (onfulfilled) return onfulfilled(data);
            return data;
        } catch (err) {
            if (onrejected) return onrejected(err);
            throw err;
        }
    }
}

export async function createClient() {
    const cookieStore = await cookies();
    const mockUserId = cookieStore.get('mock_user_id')?.value;

    return {
        auth: {
            getUser: async () => {
                if (mockUserId) {
                    return {
                        data: {
                            user: {
                                id: mockUserId,
                                email: "test@example.com",
                                user_metadata: { name: "テストユーザー" }
                            }
                        },
                        error: null
                    };
                }
                return { data: { user: null }, error: null };
            }
        },
        from: (table: string) => {
            return new ServerMockQueryBuilder(table);
        }
    };
}