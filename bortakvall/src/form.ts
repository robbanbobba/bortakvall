const form = document.querySelector<HTMLFormElement>('#personForm')!
const namnInput = document.querySelector<HTMLInputElement>('#namn')!;
const efterNamnInput = document.querySelector<HTMLInputElement>('#efternamn')!;
const adressInput = document.querySelector<HTMLInputElement>('#adress')!;
const postnrInput = document.querySelector<HTMLInputElement>('#postnr')!;
const ortInput = document.querySelector<HTMLInputElement>('#ort')!; 
const telefonInput = document.querySelector<HTMLInputElement>('#telefon')!;
const emailInput = document.querySelector<HTMLInputElement>('#e-post')!;
const popUpBackground = document.querySelector<HTMLDivElement>('#popUpBackground')!


import { formOrder, orderObject, varuOrder } from "./types";


const fieldsForValitation = [ namnInput, efterNamnInput, adressInput, postnrInput, ortInput, emailInput ]
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function checkValidation(): formOrder | null {

    form.classList.add('needs-validation');
    
    let isValid = true

    for(const field of fieldsForValitation) {
        if(!field.value) {
            field.classList.remove('is-valid')
            field.classList.add('is-invalid');
            isValid = false
            console.log('Checksuccess')
        } else if (field.type === 'email' && !emailRegex.test(field.value)) {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                isValid = false;
        } else {
            field.classList.remove('is-invalid')
            field.classList.add('is-valid')
            console.log('Checkerror')
        }
        
    }
    if(isValid) {
        /* Skicka in datan i ett object dit ordern också skickas, POSTa sen detta till API */
                return {
                    customer_first_name: namnInput.value,
                    customer_last_name: efterNamnInput.value,
                    customer_address: adressInput.value,
                    customer_postcode: postnrInput.value,
                    customer_city: ortInput.value,
                    customer_email: emailInput.value,
                    customer_phone: telefonInput.value,
                }
            } else {
                    console.log('Not sent')
                    return null
                    }
                }


function getOrderFromLocalStorage(): varuOrder | null {
    const orderString = localStorage.getItem('savedOrder');
    if (orderString) {
        return JSON.parse(orderString);
    } else {
        return null; 
    }
}

        export async function handleFormSubmit(e: Event): Promise<void> {
    
        e.preventDefault();
        const varor = getOrderFromLocalStorage()
        const order = checkValidation();
        console.log(order)
        console.log(varor)
        if(order && varor && varor.order_total !== 0) {
            let sendObject: orderObject = {
                ...order,
                ...varor
            }
            console.log(sendObject)
            try {
                const response = await sendOrderToAPI(sendObject);
                console.log('Svar från API:', response.data.id);
            } catch (error) {
                console.error('Error sending order to API:', error);
            } 
        } else if(!order) {
            return;
        }
         else {
           console.log('No valid data to send');
            const ErrorMsg = document.querySelector<HTMLParagraphElement>('#ErrorMsg')!;
            ErrorMsg.innerHTML = 'Du måste ha varor i din varukorg för att kunna handla!'
            let popupError = document.querySelector<HTMLDivElement>('#popupError')!
            popupError.classList.remove('hidden')
            let errorContent = document.querySelector<HTMLDivElement>('popup-content-error')!
            errorContent.appendChild(ErrorMsg);
         }
    };
const errorKnapp = document.querySelector<HTMLButtonElement>('#closePopup')
if (errorKnapp) {
    errorKnapp.addEventListener('click', () => {
    localStorage.clear();
    window.location.href ='/index.html';
    })
}


export async function sendOrderToAPI(newOrder: formOrder) {
    const url = 'https://www.bortakvall.se/api/v2/users/38/orders'; 
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData.data.id)
        popUpBackground.classList.remove('hidden')
        const tack = document.querySelector<HTMLParagraphElement>('#tack')!;
        // const popupContent = document.querySelector<HTMLDivElement>('#popup-content')!;
        tack.innerHTML = `Tack för din beställning ${namnInput.value}! Ditt ordernummer är: ${responseData.data.id}. Du kommer få en orderberbekräftelse skickad till ${emailInput.value}!`
        // popupContent.appendChild(tack)
        return responseData; 
    } catch (error) {
        console.error('Det gick inte att skicka beställningen:', error);
    }
}

const takeMeBack = document.querySelector<HTMLButtonElement>('#takeMeBack')!;
if(takeMeBack) {
takeMeBack.addEventListener('click', () => {
    localStorage.clear();
    window.location.href ='/index.html';
}
)}
const tillbaka = document.querySelector<HTMLButtonElement>('#mera')!;
if(tillbaka) {
tillbaka.addEventListener('click', () => {
    window.location.href ='/index.html';
}
)}

        