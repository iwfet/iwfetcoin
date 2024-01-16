export const JSONToObject = <T>(data: string): T | null => {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        return null;
    }
};