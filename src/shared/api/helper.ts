export const createApiConfig = (
    url: string,
    method: string,
    body?: object
) => {
    return{
        url,
        method,
        ...(body && { body })
    }
}