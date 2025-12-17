export function isAdmin(email) {
    return email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
}
