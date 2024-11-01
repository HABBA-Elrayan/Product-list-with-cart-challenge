import jsonData from './data.js';

let cart = {}; 

// Affichage des produits  
jsonData.forEach(produit => {
    document.querySelector('.container-produits').innerHTML += `
    <div class="product">
        <img src="${produit.image.desktop}" class="img" data-name="${produit.name}">
        <div class="button-addtocart button-off" data-name="${produit.name}" data-price="${produit.price}">
          <img src="./assets/images/icon-add-to-cart.svg"> Add to Cart
        </div>
        <div class="names">
          <p>${produit.category}</p>
          <p>${produit.name}</p>
          <p>${produit.price}$</p>
        </div>
    </div>`;
});

// Attache un événement "click" à chaque bouton
document.querySelectorAll('.button-off').forEach(button => {
    button.addEventListener('click', () => {
        const nom = button.dataset.name;
        const prix = parseFloat(button.dataset.price);
        ajout(nom, prix, button);
    });
});

function ajout(nom, prix, button) {
    if (!cart[nom] && !button.classList.contains("rouge")) {
        const img = button.previousElementSibling;
        cart[nom] = { prix: prix, quantité: 1 };
        button.classList.add('rouge');
        img.classList.add("rouge-img");
        button.innerHTML = `
      <img src="./assets/images/icon-decrement-quantity.svg" class="moins" data-name="${nom}">
      <div>${cart[nom].quantité}</div>
      <img src="./assets/images/icon-increment-quantity.svg" class="plus" data-name="${nom}">`;
        afficherAchats();
    }

    if (cart[nom]) {
        button.querySelector('.plus').onclick = () => plus(nom, button);
        button.querySelector('.moins').onclick = () => moins(nom, button);
    }
}

function moins(nom, button) {
    if (cart[nom]) {
        cart[nom].quantité--;
        if (cart[nom].quantité <= 0) {
            delete cart[nom];
            setTimeout(()=>{
                button.classList.remove('rouge');
                button.previousElementSibling.classList.remove("rouge-img");
                button.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg"> Add to Cart`;
            }, 1)
            
            afficherAchats();
        } else {
            button.querySelector('div').innerText = cart[nom].quantité;
            afficherAchats();
        }
    }
}

function plus(nom, button) {
    if (cart[nom]) {
        cart[nom].quantité++;
        button.querySelector('div').innerText = cart[nom].quantité;
        afficherAchats();
    }
}

function afficherAchats() {
    document.querySelector('.container-cart').innerHTML = '';
    document.querySelector('.container-confirmer').innerHTML = '';
    const cartArray = Object.keys(cart).map(nom => {
        return {
            name: nom,
            price: cart[nom].prix,
            quantité: cart[nom].quantité,
            image: jsonData.find(prod => prod.name === nom).image
        };
    });

    let quantity = 0;
    let total = 0;
    
    cartArray.forEach(produit => {
        document.querySelector('.container-cart').innerHTML += `
        <div class="produit-cart">
            <div class="item">
              <div>
                <p>${produit.name}</p>
                <div class="qt-p">
                  <p>X${produit.quantité}</p>
                  <p>${produit.price}$</p>
                  <p>${(produit.price * produit.quantité).toFixed(2)}$</p>
                </div>
              </div>
              <button class="supprimer-produit" data-name="${produit.name}"><img src="./assets/images/icon-remove-item.svg" alt=""></button>
            </div>
            <hr>
          </div>`;

        document.querySelector(".container-confirmer").innerHTML += `
             <div class="produit-cart produit-cart-2">
                <div class="item">
                    <div class="el">
                        <img src="${produit.image.thumbnail}" alt="">
                        <div class="ok">
                            <p>${produit.name}</p>
                            <div class="qt-p">
                            <p>X${produit.quantité}</p>
                            <p>${produit.price}$</p>
                            </div>  
                        </div>
                    </div>
                    <p>${(produit.price * produit.quantité).toFixed(2)}$</p>
                </div>
            </div>`;

        total += produit.price * produit.quantité;
        quantity += produit.quantité;
    });

    document.querySelectorAll('.total-2').forEach(elem => {
        elem.innerText =  `${total.toFixed(2)}$`;
    }); 
    document.querySelector('.cart-quantity').innerText = `Your Cart (${quantity})`;


    document.querySelectorAll('.supprimer-produit').forEach(button => {
        button.addEventListener("click", () => {
            const nom = button.dataset.name;
            supprimerProduit(nom);
        });
    });
}

function supprimerProduit(nom) {
    if (cart[nom]) {
        const button = document.querySelector(`.button-off[data-name="${nom}"]`);
        delete cart[nom];
        if (button) {
            setTimeout(()=>{
                button.classList.remove('rouge');
                button.previousElementSibling.classList.remove("rouge-img");
                button.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg"> Add to Cart`;
                
            }, 1)
        }
        
        afficherAchats();
    }
}

document.querySelector('.js-confirm').addEventListener('click', Confirmer);

document.querySelector(".js-new-order").addEventListener('click', () => {
    document.querySelector('.body').classList.remove('blur');
    document.querySelector(".confirm-order-div").classList.remove("conf");
    cart = {};
    setTimeout(()=>{
        document.querySelectorAll('.button-addtocart').forEach(button => {
            button.classList.remove('rouge');
            button.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg"> Add to Cart`;
        });
        document.querySelectorAll('.img').forEach(img => {
            img.classList.remove("rouge-img");
        });
    }, 1)
    afficherAchats();
});

function Confirmer() {
    if (Object.keys(cart).length > 0) { 
        document.querySelector('.body').classList.add('blur');
        document.querySelector(".confirm-order-div").classList.add("conf");
    } else {
        alert("Votre panier est vide. Veuillez ajouter des produits avant de confirmer.");
    }
}


