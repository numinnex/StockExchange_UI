export type AuthResponseSucces = {
    token: string,
    refreshToken :string 
}
export type AuthResponseFailure = {
    errors: string[]
}