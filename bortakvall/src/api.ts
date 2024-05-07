import {Product} from './types.ts';


export const getFetch = async (): Promise<Product[]> => {
    const res = await fetch ("https://www.bortakvall.se/api/v2/products");
    
    if (!res.ok){
        throw new Error (`Kunde inte hämta data. Status code was:${res.status}`);
    }
    const data = await res.json();

    return data.data
}


import { handleFormSubmit } from './form.ts';


const form = document.querySelector<HTMLFormElement>('#personForm')!
form?.addEventListener('submit', handleFormSubmit);



