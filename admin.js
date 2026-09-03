import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");
const searchInput = document.getElementById("searchInput");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

const productsRef = collection(db, "products");

let editingProductId = null;


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    productTable.innerHTML = "";

    try {

        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) {

            productTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No products found
                    </td>
                </tr>
            `;

            return;
        }

        snapshot.forEach((item) => {

            const product = item.data();

            productTable.innerHTML += `
                <tr>

                    <td>
                        <img
                            src="${product.image || ""}"
                            width="70"
                            height="70"
                            style="object-fit:cover;border-radius:8px;"
                        >
                    </td>

                    <td>
                        ${product.name || "-"}
                    </td>

                    <td>
                        ${product.category || "-"}
                    </td>

                    <td>
                        ₹${product.price || 0}
                    </td>

                    <td>
                        ${product.featured ? "⭐ Yes" : "No"}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editProduct('${item.id}')"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteProduct('${item.id}')"
                        >
                            Delete
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error("Load products error:", error);

        productTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Error loading products ❌
                </td>
            </tr>
        `;
    }
}


// ===============================
// ADD / UPDATE PRODUCT
// ===============================

productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const product = {

        name: document.getElementById("productName").value.trim(),

        price: Number(
            document.getElementById("productPrice").value
        ),

        category:
            document.getElementById("productCategory").value,

        image:
            document.getElementById("productImage").value.trim(),

        description:
            document.getElementById("productDescription").value.trim(),

        featured:
            document.getElementById("featured").checked
    };

    try {

        if (editingProductId) {

            await updateDoc(
                doc(db, "products", editingProductId),
                product
            );

            alert("Product Updated Successfully ✅");

            editingProductId = null;

            saveBtn.textContent = "Save Product";

        } else {

            await addDoc(
                productsRef,
                {
                    ...product,
                    createdAt: serverTimestamp()
                }
            );

            alert("Product Added Successfully ✅");
        }

        productForm.reset();

        await loadProducts();

    } catch (error) {

        console.error("Save product error:", error);

        alert("Error saving product ❌");
    }
});


// ===============================
// EDIT PRODUCT
// ===============================

window.editProduct = async function (id) {

    try {

        const snapshot = await getDocs(productsRef);

        let productData = null;

        snapshot.forEach((item) => {

            if (item.id === id) {
                productData = item.data();
            }

        });

        if (!productData) {

            alert("Product not found ❌");

            return;
        }

        document.getElementById("productName").value =
            productData.name || "";

        document.getElementById("productPrice").value =
            productData.price || "";

        document.getElementById("productCategory").value =
            productData.category || "";

        document.getElementById("productImage").value =
            productData.image || "";

        document.getElementById("productDescription").value =
            productData.description || "";

        document.getElementById("featured").checked =
            productData.featured || false;

        editingProductId = id;

        saveBtn.textContent = "Update Product";

        document
            .querySelector(".form-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    } catch (error) {

        console.error("Edit error:", error);

        alert("Error loading product ❌");
    }
};


// ===============================
// DELETE PRODUCT
// ===============================

window.deleteProduct = async function (id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        await deleteDoc(
            doc(db, "products", id)
        );

        alert("Product Deleted Successfully ✅");

        await loadProducts();

    } catch (error) {

        console.error("Delete error:", error);

        alert("Error deleting product ❌");
    }
};


// ===============================
// SEARCH PRODUCTS
// ===============================

searchInput.addEventListener("input", () => {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const rows =
        productTable.querySelectorAll("tr");

    rows.forEach((row) => {

        const text =
            row.textContent.toLowerCase();

        row.style.display =
            text.includes(searchText) ? "" : "none";
    });
});


// ===============================
// LOGOUT
// ===============================

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        window.location.href = "index.html";

    });
}


// ===============================
// START ADMIN PANEL
// ===============================

loadProducts();