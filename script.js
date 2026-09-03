// ================= HERO SLIDER =================

const hero = document.querySelector(".hero");

const heroImages = [
    "images/hero1.jpg",
    "images/hero2.jpg",
    "images/hero3.jpg",
    "images/hero4.jpg"
];

let heroIndex = 0;

if (hero) {
    setInterval(() => {

        heroIndex =
            (heroIndex + 1) % heroImages.length;

        hero.style.backgroundImage =
            `url("${heroImages[heroIndex]}")`;

    }, 4000);
}


// ================= SMOOTH NAVIGATION =================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function(e) {

        const target =
            document.querySelector(
                this.getAttribute("href")
            );

        if (target) {

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// ================= FIREBASE PRODUCTS =================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


const productsContainer =
    document.getElementById("productsContainer");

const noProducts =
    document.getElementById("noProducts");

const categoryButtons =
    document.querySelectorAll(".category-btn");

let allProducts = [];


// ================= LOAD PRODUCTS =================

async function loadProducts() {

    if (!productsContainer) return;

    try {

        const snapshot =
            await getDocs(
                collection(db, "products")
            );

        allProducts = [];

        snapshot.forEach(doc => {

            allProducts.push({
                id: doc.id,
                ...doc.data()
            });

        });


        const params =
            new URLSearchParams(
                window.location.search
            );

        const category =
            params.get("category");


        if (category) {

            filterProducts(category);

            setActiveCategory(category);

        } else {

            displayProducts(allProducts);

        }

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}


// ================= DISPLAY PRODUCTS =================

function displayProducts(products) {

    productsContainer.innerHTML = "";


    if (products.length === 0) {

        noProducts.style.display = "block";

        return;
    }


    noProducts.style.display = "none";


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>


            <div class="product-info">

                <span>
                    ${product.category}
                </span>
<h3>
    ${product.name}
</h3>

<div class="product-price">
    ₹${product.price || 0}
</div>

<p>
    ${product.description || ""}
</p>

<a
    href="https://wa.me/918088717407?text=${encodeURIComponent(
        "Hi Elite Studio, I am interested in " +
        product.name +
        ". Price: ₹" +
        (product.price || 0)
    )}"
    target="_blank"
    class="product-link"
>
    Enquire on WhatsApp →
</a>
                           </div>

        `;


        productsContainer.appendChild(card);

    });

}


// ================= FILTER PRODUCTS =================

function filterProducts(category) {

    const filteredProducts =
        allProducts.filter(product =>
            product.category === category
        );

    displayProducts(filteredProducts);

}


// ================= ACTIVE CATEGORY =================

function setActiveCategory(category) {

    categoryButtons.forEach(button => {

        button.classList.remove("active");


        if (
            button.dataset.category === category
        ) {

            button.classList.add("active");

        }

    });

}


// ================= CATEGORY BUTTONS =================

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category =
            button.dataset.category;


        setActiveCategory(category);


        if (category === "All") {

            window.history.replaceState(
                {},
                "",
                "products.html"
            );

            displayProducts(allProducts);

        } else {

            window.history.replaceState(
                {},
                "",
                `products.html?category=${encodeURIComponent(category)}`
            );

            filterProducts(category);

        }

    });

});


// ================= INITIAL LOAD =================

loadProducts();