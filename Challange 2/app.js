const menuItems = [
    {
        name: 'French Fries with Ketchup',
        price: 223,
        image: 'plate__french-fries.png',
        alt: 'French Fries',
        count: 0
    },
    {
        name: 'Salmon and Vegetables',
        price: 512,
        image: 'plate__salmon-vegetables.png',
        alt: 'Salmon and Vegetables',
        count: 0
    },
    {
        name: 'Spaghetti Meat Sauce',
        price: 782,
        image: 'plate__spaghetti-meat-sauce.png',
        alt: 'Spaghetti with Meat Sauce',
        count: 0
    },
    {
        name: 'Bacon, Eggs, and Toast',
        price: 599,
        image: 'plate__bacon-eggs.png',
        alt: 'Bacon, Eggs, and Toast',
        count: 0
    },
    {
        name: 'Chicken Salad with Parmesan',
        price: 698,
        image: 'plate__chicken-salad.png',
        alt: 'Chicken Salad with Parmesan',
        count: 0
    },
    {
        name: 'Fish Sticks and Fries',
        price: 634,
        image: 'plate__fish-sticks-fries.png',
        alt: 'Fish Sticks and Fries',
        count: 0
    }
]

let menuBtnIdPrefix = "menu-btn-"
let cartIdPrefix = "cart-";
let imgFolder = "images/";
let tax = 0.27;

checkEmptyCart();
menuItems.forEach(menuItem => {
    createMenuItem(menuItem);
});

function checkEmptyCart() {
    let cartSummary = document.querySelector(".cart-summary");
    let cartPanel = document.querySelector(".panel.cart");

    if (cartSummary.children.length === 0) {
        // if cart is empty, add an empty text
        let emptyText = document.createElement("p");
        emptyText.classList.add("empty");
        emptyText.innerText = "Your cart is empty.";
        cartPanel.appendChild(emptyText);
        //total div won't show when cart is empty
        document.querySelector(".totals").style.display = "none";
    }

    if (cartPanel.querySelector(".empty") && cartSummary.children.length > 0) {
        cartPanel.querySelector(".empty").remove();
        document.querySelector(".totals").style.display = "block";
    }
}

function createBasicCard(listElement, menuItem, isMenuItem) {
    //create plate div with pictures and quantity
    let plateDiv = document.createElement("div");
    plateDiv.classList.add("plate");
    listElement.appendChild(plateDiv);
    let plateImg = document.createElement("img");
    plateImg.src = imgFolder + menuItem.image;
    plateImg.alt = menuItem.alt;
    plateImg.classList.add("plate")
    plateDiv.appendChild(plateImg);

    //create content
    let contentDiv = document.createElement("div");
    contentDiv.classList.add("content");
    listElement.appendChild(contentDiv);

    //create p tags for name and price and add to contentDiv
    let itemNameText = document.createElement("p");
    itemNameText.classList.add("menu-item");
    itemNameText.innerText = menuItem.name;
    contentDiv.appendChild(itemNameText);

    let priceText = document.createElement("p");
    priceText.classList.add("price");
    priceText.innerText = "$" + menuItem.price / 100;
    contentDiv.appendChild(priceText);

    if (isMenuItem) {
        return contentDiv;
    }

    if (!isMenuItem) {
        return plateDiv;
    }
}

function createMenuItem(menuItem) {

    //create a list element
    let ulTag = document.querySelector(".menu ul");
    let listElement = document.createElement("li");
    ulTag.appendChild(listElement);

    //create basic card
    let contentDiv = createBasicCard(listElement, menuItem, true);

    //create add button
    let addBtn = document.createElement("button");
    addBtn.classList.add("add");
    addBtn.id = menuBtnIdPrefix + menuItem.name;
    contentDiv.appendChild(addBtn);

    let btnText = document.createElement("span");
    btnText.innerHTML = "Add to Cart";
    addBtn.appendChild(btnText);

    addBtn.addEventListener('click', () => { addItemToCart(menuItem) });
}

function addItemToCart(menuItem) {
    // set the clicked item count to 1 in array   
    menuItems.forEach(item => {
        if (item.name === menuItem.name) {
            item.count = 1;
        }
    });

    let selectedBtn = document.getElementById(menuBtnIdPrefix + menuItem.name);
    selectedBtn.classList.remove("add");
    selectedBtn.classList.add("in-cart");
    selectedBtn.innerHTML = "";
    let inCartImg = document.createElement("img");
    inCartImg.src = "images/check.svg";
    inCartImg.alt = "Check";
    selectedBtn.appendChild(inCartImg);

    let btntext = document.createElement("span");
    btntext.innerText = "In Cart";
    selectedBtn.appendChild(btntext);
    selectedBtn.disabled = true;

    createCartItem(menuItem);
}

function createCartItem(menuItem) {
    let actualQuantity = menuItem.count;

    //create a list element
    let ulTag = document.querySelector(".cart-summary");
    let listElement = document.createElement("li");
    listElement.id = cartIdPrefix + menuItem.name;
    ulTag.appendChild(listElement);

    //create basic card
    let plateDiv = createBasicCard(listElement, menuItem, false);

    //cerate quantity div
    let quantityDiv = document.createElement("div");
    quantityDiv.classList.add("quantity");
    quantityDiv.innerText = actualQuantity;
    plateDiv.appendChild(quantityDiv);

    //create quantity_wrapper div
    let quantityWrapperDiv = document.createElement("div");
    quantityWrapperDiv.classList.add("quantity__wrapper");
    listElement.appendChild(quantityWrapperDiv);

    //create decrease button
    let decreaseBtn = document.createElement("button");
    decreaseBtn.classList.add("decrease");
    let decreaseBtnImg = document.createElement("img");
    decreaseBtnImg.src = imgFolder + "chevron.svg";
    decreaseBtn.appendChild(decreaseBtnImg);
    quantityWrapperDiv.appendChild(decreaseBtn);
    decreaseBtn.addEventListener("click", () => { changeItemQuantityInCart(menuItem, true) });

    //create quantity counter between the increase and decrease button
    let quantityWrapperQuantityDiv = document.createElement("div");
    quantityWrapperQuantityDiv.classList.add("quantity");
    quantityWrapperQuantityDiv.innerText = actualQuantity;
    quantityWrapperDiv.appendChild(quantityWrapperQuantityDiv);

    //create increase button
    let increaseBtn = document.createElement("button");
    increaseBtn.classList.add("increase");
    let increaseBtnImg = document.createElement("img");
    increaseBtnImg.src = imgFolder + "chevron.svg";
    increaseBtn.appendChild(increaseBtnImg);
    quantityWrapperDiv.appendChild(increaseBtn);
    increaseBtn.addEventListener("click", () => { changeItemQuantityInCart(menuItem, false) });

    //show subtotal
    let subtotalDiv = document.createElement("div");
    subtotalDiv.classList.add("subtotal");
    listElement.appendChild(subtotalDiv);
    subTotalAllItems(menuItem);
    checkEmptyCart();
}

function changeItemQuantityInCart(menuItem, isDecrease) {
    menuItems.forEach(item => {
        if (item.name === menuItem.name) {
            isDecrease ? item.count -= 1 : item.count += 1;
            let cartListElement = document.getElementById(cartIdPrefix + menuItem.name);
            if (item.count > 0) {
                //refresh quantity counter in cart element
                cartListElement.querySelector(".plate .quantity").innerText = menuItem.count;
                cartListElement.querySelector(".quantity__wrapper .quantity").innerText = menuItem.count;
            } else {
                cartListElement.remove();
                let menuAddBtn = document.getElementById(menuBtnIdPrefix + menuItem.name);
                menuAddBtn.classList.remove("in-cart");
                menuAddBtn.classList.add("add");
                menuAddBtn.innerHTML = "Add to cart";
                menuAddBtn.disabled = false;
            }
        }
    });
    subTotalAllItems(menuItem);
    checkEmptyCart();
}

function subTotalAllItems(menuItem) {
    let subTotalPerElement = document.getElementById(cartIdPrefix + menuItem.name);
    let total = 0;
    for (let i = 0; i < menuItems.length; i++) {
        //subtotal per element
        if (menuItems[i].count > 0 && menuItems[i].name === menuItem.name) {
            subTotalPerElement.querySelector(".subtotal").innerText = "$" + (menuItems[i].count * menuItems[i].price) / 100;
        }
        //subtotal all elements
        if (menuItems[i].count > 0) {
            total += menuItems[i].count * menuItems[i].price;
        }
    }
    total = total / 100;
    document.querySelector(".amount.price.subtotal").innerText = "$" + total;
    let totalTax = total * tax;
    document.querySelector(".amount.price.tax").innerText = "$" + Math.floor(totalTax * 100) / 100;
    document.querySelector(".amount.price.total").innerText = "$" + Math.floor((total + totalTax) * 100) / 100;
}
