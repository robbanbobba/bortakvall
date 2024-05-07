import {getFetch} from './api.ts';
import {Product} from './types.ts';
import { OrderItem, varuOrder } from './types.ts';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css'


const candyContainer = document.querySelector<HTMLDivElement>('.main')!;
const buttonVarukorg = document.querySelector<HTMLButtonElement>('#buttonVarukorg')!;
const popUpKassa = document.querySelector<HTMLDivElement>('#popupKassa')!;
//const shoppingListElement = document.querySelector<HTMLDivElement>('#shoppingList'!);


const popupInfo = document.querySelector<HTMLDivElement>('.popupInfo')!;
const popupImage = document.querySelector<HTMLImageElement>('#popupImage')!;
const nameText = document.querySelector<HTMLParagraphElement>('#nameText')!;
const infoText = document.querySelector<HTMLParagraphElement>('#infoText')!;
const priceText = document.querySelector<HTMLParagraphElement>('#priceText')!;
const stockQuantity = document.querySelector<HTMLParagraphElement>('#stockQuantity')!;
const closeButton = document.querySelector<HTMLButtonElement>('#closeButton')!;
const tillKassa = document.querySelector<HTMLButtonElement>('#tillKassa')!;

const sortOptions = document.getElementById('sortOptions') as HTMLSelectElement;

//HTML-fix, låt stå!!!
if (window.location.pathname === '/index.html') {
  sortOptions.addEventListener('change', async () => {
  const selectedOption = sortOptions.value; // hämtar värdet 

  try {
    let response: Product[] = await getFetch();

    if (selectedOption === 'name') {
      // Sortera efter namn
      const sortedResponse = response.sort((a, b) => a.name.localeCompare(b.name));// jämför strängarna 
      candyContainer.innerHTML = ''; // "startar om "
      renderData(sortedResponse); // uppdaterar valet 
    } else if (selectedOption === 'id') {
      // Sortera efter ID
      candyContainer.innerHTML = '';
      renderData(response);
    } else if (selectedOption === 'price') {
      // Sortera efter pris
      const sortedResponse = response.sort((a, b) => a.price - b.price);
      candyContainer.innerHTML = '';
      renderData(sortedResponse);
    }
  } catch (error) {
    console.error("Ett fel uppstod vid sortering:", error);
  }
});
}
let totalPrice: number = 0; // totala priset är 0 
let shoppingList: Product []=[];

const addToCart = (product: Product) => { //funktion som lägger till produkter i varukorgen
 
  // Om produkten finns i varukorgen..
  const existProduct = shoppingList.find(item => item.id === product.id);
  if (existProduct) {
    // Om produkten redan finns, öka antalet
    existProduct.quantity = (existProduct.quantity || 1) + 1; // kollar om det antalet är falsy  med 1

} else {
    // Om produkten inte finns, lägg till i varukorgen
    const newProduct: Product = { ...product, quantity: 1 }; // skapar man en ny produkt
    shoppingList.push(newProduct); //pushar den nya produkten till Shoppinglist 
  }

  totalPrice += product.price;  //totala priset ökar med den nya priset
  updateTotalPrice(); // uppdatera priset
  updateTotalProducts();// uppdatera produkterna
  saveProducts();// spara i localStorage
};
//ta bort varor!
const removeButton = (productId: number): void => {
  const index: number = shoppingList.findIndex(item => item.id === productId);
  
  if (index !== -1) { // kontrollerar om varan finns i varukorgen 
    const removeProduct = shoppingList.splice(index, 1)[0]; //  ta bort ett index 
    totalPrice -= removeProduct.price * (removeProduct.quantity || 1);
    updateTotalPrice();
    updateTotalProducts();
    saveProducts();
  } else {
    console.log( productId, "finns inte i varukorgen");
  }
};

// uppdatera det nya antalet i varukorgen
const updateTotalPrice = () => {
  const totalPriceElement = document.getElementById('total-price');
  if (totalPriceElement) {
    totalPriceElement.textContent = totalPrice.toFixed(2) +  'kr' ; //toFixed är en metod som fixar decimaler till string
    }
};

// uppdatera produkterna som är i varukorgen
const updateTotalProducts = () => {
  const shoppingListElement = document.getElementById('shoppingList');
  if (shoppingListElement) {
    shoppingListElement.innerHTML = shoppingList
    .map(item =>`
    <li>
    <img src="${'https://www.bortakvall.se' + item.images.thumbnail}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
    <span style= "font-size: 16px; font-weight:bold;">${item.name}</span>
    <div class="button-container">
      <button class="antalGodisPlus" data-product-id="${item.id}">+</button>
      <span style="font-weight: bold;"> ${item.quantity || 1}</span>
    <button class="antalGodisMinus" data-product-id="${item.id}">-</button>
  </div>
  <div class="buyInfo">
    Per skopa: <span style="font-weight: bold; font-size:15px;">${item.price} kr</span><br>
    ${item.quantity > 1 ? `Totalt pris: <span style="font-weight: bold; font-size:15px;">${item.price * item.quantity} kr</span>`
        : ''}
        <button class="removeButton" data-product-id="${item.id}">
          <img src="/src/images/delete.png" alt="Delete">
        </button><hr>
  </div>
  </li>
`)
.join('');


const plusButtons = document.querySelectorAll('.antalGodisPlus');
plusButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = parseInt(button.getAttribute('data-product-id') || '0', 10);
    antalAdderas(productId);
  });
});
const minusButtons = document.querySelectorAll('.antalGodisMinus');
minusButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = parseInt(button.getAttribute('data-product-id') || '0', 10);
    antalMinskar(productId);
  });
});
}
const antalAdderas = (productId: number) => {
  const product = shoppingList.find(item => item.id === productId);
  if (product) {
    product.quantity = (product.quantity || 1) + 1;
    updateTotalProducts();
  }
};

const antalMinskar = (productId: number) => {
  const product = shoppingList.find(item => item.id === productId);
  if (product && product.quantity && product.quantity > 1) {
    product.quantity -= 1;
    updateTotalProducts();
  }
};

 // Lägg till eventlyssnare för "Ta bort" -knappar
 const removeButtons = document.querySelectorAll('.removeButton');
 removeButtons.forEach(button => {
   button.addEventListener('click', () => {
     console.log("klickar")
     const productId = parseInt(button.getAttribute('data-product-id')||'0',10);// om värdet misslyckas används värdet 0
     removeButton(productId); //anropar funktionen och tar bort produktens ID som den har hämtat
   });
});
};
updateTotalProducts();
// skapar en variabel för att spara min varukorg i localStorage
const saveProducts = () =>{
  localStorage.setItem('shoppinglist',JSON.stringify(shoppingList));
};
// om det finns varor i varukorgen så ska det sparas i localStorage
const getSaveProducts = () =>{
  const saveShopingList=localStorage.getItem('shoppinglist');  
  if (saveShopingList){
    shoppingList = JSON.parse (saveShopingList);
    //reduce för att ta reda på summan
    totalPrice = shoppingList.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    updateTotalPrice();
    updateTotalProducts();
  }
};
console.log(getSaveProducts());
//Sparar orderkorgen inför orderskick
function saveOrderToLocalStorage(theOrder: varuOrder) {
  try {
      const orderString = JSON.stringify(theOrder);
      localStorage.setItem('savedOrder', orderString);
      console.log('Success')
  } catch (error) {
      console.error('Error saving order to localStorage:', error);
  }
}

//Ta kunden till kassan
tillKassa?.addEventListener('click', (e) => {
  e.preventDefault()
  toKassa()
  window.location.href ='/kassa.html';
})
//Förbereder ordern för kassan
export const toKassa = () => {
  // Returnera en interface-anpassad version av shoppingList till localStorage
  function createOrderItems(shoppingList: Product[]): OrderItem[] {
    return shoppingList.map(item => ({
      product_id: item.id,
      qty: item.quantity,
      item_price: item.price,
      item_total: item.price * item.quantity,
  }));
  }
// Creating the order
let theOrder: varuOrder = {
  order_total: totalPrice,
  order_items: createOrderItems(shoppingList),
};
console.log(theOrder)
saveOrderToLocalStorage(theOrder);

    console.log('klickar i kassan');
    
};
    

let products: Product[] = [];

// Hämta produktdata från API
//HTML-fix, låt stå!!
if (window.location.pathname === '/index.html') {
async function fetchProductData() {
  try {
    const response = await fetch('https://www.bortakvall.se/api/v2/products');
    const responseData = await response.json();

    if (responseData.status === 'success' && Array.isArray(responseData.data)) {
      products = responseData.data;

      console.log('Produkter hämtade:', products);
      updateAvailableProductsCount();
    }
  } catch (error) {
    console.error('Fel vid hämtning av produktdata från API:', error);
  }
}
fetchProductData();

console.log(shoppingList)

// Uppdatera antalet tillgängliga produkter i webbläsaren
function updateAvailableProductsCount() {
  try {
    if (products && Array.isArray(products)) {
      const totalProductsCount = products.length;

      // Räkna antalet produkter i lager
      const inStockProducts = products.filter(product => product.stock_quantity > 0);
      const inStockProductsCount = inStockProducts.length;

      console.log('Antal produkter:', totalProductsCount);
      console.log('Antal produkter i lager:', inStockProductsCount);

      const countElement = document.getElementById('availableProductsCount')!;
      countElement.innerText = `Visar ${totalProductsCount} produkter varav ${inStockProductsCount} är i lager`;
    }
  } catch (error) {
    console.error(error);
  }
}
}




const renderData = async (products: Product[]) => {
  try {

    products.forEach(item => {
    const divContainer = document.createElement('div');

  // Visa bild
  const imageElement = document.createElement('img');
  imageElement.src = 'https://www.bortakvall.se' + item.images.thumbnail;
  imageElement.alt = item.name;
  imageElement.id = 'imageElement'
  divContainer.appendChild(imageElement);
  imageElement.style.padding = '15px';


  // Visa namn
  const nameElement = document.createElement('p');
  nameElement.innerHTML = ` ${item.name}`;
  nameElement.id = 'nameElement';
  divContainer.appendChild(nameElement);

  // Visa pris
  const priceElement = document.createElement('p');
  priceElement.innerHTML = `Pris: ${item.price} kr`;
  divContainer.appendChild(priceElement);
  priceElement.id = 'priceElement'
  candyContainer?.appendChild(divContainer)

   // Lägg till i varukorgenknapp
   const buyButton = document.createElement('button');
   buyButton.innerHTML='Lägg till i varukorgen';

    if(item.stock_status ==='instock'){
      buyButton.addEventListener('click', () =>{
        addToCart(item)// om den finns i lagret lägg den i varukorgen
      
      // Visa popuprutan
      popUpKassa.style.display = 'block';

      // Dölj popuprutan efter två sekunder
      setTimeout(() => {
    
      popUpKassa.style.display = 'none';
        }, 2000);
      });
    }else {
      buyButton.innerHTML = 'Tillfälligt slut';
      buyButton.disabled =true;
      buyButton.title ='Tillfälligt slut';
    }
  divContainer.appendChild(buyButton);

  // Länkelement
  const linkElement = document.createElement('a');
  linkElement.innerHTML = 'Läs mer';
  linkElement.id = 'linkElement';

  linkElement.addEventListener('click', (event) => {
  event.preventDefault();

  popupInfo.style.display = 'block';
  popupImage.src = 'https://www.bortakvall.se' + item.images.large;
  nameText.innerHTML = `Namn: ${item.name}`;
  infoText.innerHTML = `Information: ${item.description}`
  priceText.innerHTML = `Pris: ${item.price} kr`
  
  const stockQuantityElement = stockQuantity as HTMLElement;
  

  if (item.stock_quantity === null) {
    stockQuantityElement.innerHTML = `Tillfälligt slut`;
  } else {
    stockQuantityElement.innerHTML = `Tillgängligt i lager: ${item.stock_quantity} lådor`;
  }
})

  
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    popupInfo.style.display = 'none';

  })

  divContainer.appendChild(linkElement);

  candyContainer.appendChild(divContainer);
  })

 } catch(error) {
    console.error("Didn't work", error)
    }
  }


  (async () => {
    try {
      let initialData = await getFetch();
      
      if (window.location.pathname === "/index.html") {
        renderData(initialData);
      }
    } catch (error) {
      console.error("Ett fel inträffade:", error);
    }
  })();


getSaveProducts(); //sparar i localStorage


let popUpVisible = false;

// Visa eller dölj popup-rutan när knappen klickas
if (buttonVarukorg && popUpKassa) {
buttonVarukorg.addEventListener('click', (event) => {
event.stopPropagation();
if (!popUpVisible) {
  popUpKassa.style.display = 'block';
  popUpVisible = true;
} else {
  popUpKassa.style.display = 'none';
  popUpVisible = false;
}
});

  // Dölj popup-rutan när du klickar utanför den
  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    if (popUpVisible && target !== buttonVarukorg && !popUpKassa.contains(target)) {
      popUpKassa.style.display = 'none';
      popUpVisible = false;
    }
  });
};

// //Skapa en funktion för att rendera ut varukorgen i kassan
function visaProdukteriKassan()  {
  const rullband = document.querySelector<HTMLDivElement>('#rullband')!
  console.log(shoppingList);
  if (shoppingList.length > 0 && rullband) {
  rullband.classList.remove('hidden')
  shoppingList.forEach(item => {
    const productContainer = document.createElement('div');
    productContainer.style.backgroundColor = 'black';
    productContainer.style.borderBottom = 'solid'
    productContainer.innerHTML = 
    `<ul class="list-group list-group-flush">
    <li class="list-group-item" style="font-weight: bold;">${item.name}</li>
    <li class="list-group-item"><img src="${'https://www.bortakvall.se' + item.images.thumbnail}" height="100px" alt="${item.name}”></li>
    <li class="list-group-item">Pris: ${item.price} kr/ skopa</li>
    <li class="list-group-item">Antal skopor: ${item.quantity}</li>
    </ul>`;
    rullband.appendChild(productContainer)
  })
  const total = document.createElement('div');
  total.innerHTML = `<div class="totalen">Totalkostnad: ${totalPrice} kr</div>`;
  rullband.appendChild(total)
}}
  
visaProdukteriKassan()