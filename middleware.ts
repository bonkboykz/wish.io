import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
 
  
  const match = pathname.match(/^\/sharePage\/([a-zA-Z0-9-]+)$/);

  if (match) {
    const token = match[1];


    const apiUrl = new URL(`/api/wishlists/token/${token}`, request.url);


    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    const data = await res.json();
    const id = data.id;


    const redirectUrl = new URL(`/wishlist/${id}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/sharePage/:path*']
};
