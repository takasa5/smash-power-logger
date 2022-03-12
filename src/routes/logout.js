import cookie from "cookie";

export async function get({ locals }) {
    delete locals.auth;
    delete locals.user;
    return {
        status: 200,
        headers: {
            "set-cookie": cookie.serialize("user", "", {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 0
            }),
            "cache-control": "no-store"
        },
        body: {
            user: {}
        }
    };
}