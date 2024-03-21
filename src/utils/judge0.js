
export function options(language_id , source_code , stdin){
    const opt ={
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
        base64_encoded: 'true',
        wait: 'true'
        },
        headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RapidAPI_KEY,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RapidAPI_HOST
        },
        data: {
        language_id: language_id,
        source_code: source_code,
        stdin: stdin
        }
    };
    return opt;
}