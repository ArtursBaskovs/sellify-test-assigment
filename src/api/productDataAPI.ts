import { useEffect, useRef, useState } from "react";

//custom hook
export const useGetResponse = () => {
    const abortControllerRef = useRef<AbortController | null>(null);
    const [response, setResponse] = useState<any>();
    
    useEffect(() => {
        //unwraped promise from api request and put in useState to get data
        const fetchProductData = async () => {
        const data = await makeApiRequest(abortControllerRef);
        setResponse(data);
        };
        fetchProductData();
    }, []);

    return response;
};

const makeApiRequest = async (abortControllerRef: React.RefObject<AbortController | null>) => {
    
    //abort fetch if it was called again
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    //make request to api
    try {
        const urlAPI = "https://api.github.com/repos/Sellfy/test-assignment-frontend/contents/products.json";
        const response = await fetch(urlAPI, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            signal: abortControllerRef.current?.signal,
        });

        const jsonDataBase64Format = await response.json();
        const decode = atob(jsonDataBase64Format.content);
        const productsData = JSON.parse(decode);
        return productsData;
        
    } catch (error: any) {
        if (error.name === "AbortError") {
            return;
        }
        console.log("Fetching error: ", error);
        return error;
    }

    
}