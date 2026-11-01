export const createApiConfig = (
    url: string,
    method: string,
    body?: unknown,
) => {
    return{
        url,
        method,
        ...(body!== undefined && { body })
    }
}