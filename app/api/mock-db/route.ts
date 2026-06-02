import { NextRequest, NextResponse } from 'next/server';
import { handleMockDbQuery } from '@/lib/local_db_manager';

export async function POST(req: NextRequest) {
    try {
        const queryState = await req.json();
        const result = handleMockDbQuery(queryState);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Mock DB API Error:', error);
        return NextResponse.json({ data: null, error: { message: error.message || 'Internal Server Error' } }, { status: 500 });
    }
}
