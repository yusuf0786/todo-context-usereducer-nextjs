export const data = async () => {
    const response = await fetch('http://localhost:3000/api');
    const data = await response.json();
    return data
}