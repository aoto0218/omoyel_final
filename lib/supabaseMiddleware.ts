import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    const mockUserId = request.cookies.get('mock_user_id')?.value;

    if (
        !mockUserId &&
        (
            request.nextUrl.pathname.startsWith('/mypage') ||
            request.nextUrl.pathname.startsWith('/review')
        )
    ) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';

        const nextPath = request.nextUrl.pathname + request.nextUrl.search;
        url.searchParams.set('next', nextPath);

        return NextResponse.redirect(url);
    }

    return NextResponse.next({
        request,
    });
}