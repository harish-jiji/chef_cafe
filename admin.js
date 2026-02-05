// Firebase config (same as menu.html)
const firebaseConfig = {
    apiKey: "AIzaSyAON6aij8dNG0RLJ1DdlcwMkPZsAGe-SBQ",
    authDomain: "chef-s-cafe.firebaseapp.com",
    projectId: "chef-s-cafe"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// AUTH STATE
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("loginBox").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        loadItems();
    } else {
        document.getElementById("loginBox").classList.remove("hidden");
        document.getElementById("dashboard").classList.add("hidden");
    }
});

// LOGIN
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .catch(err => alert(err.message));
}

// LOGOUT
function logout() {
    auth.signOut();
}

// ADD ITEM
function addItem() {
    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const category = document.getElementById("category").value;

    if (!name || !price) {
        alert("Fill all fields");
        return;
    }

    db.collection("menu_items").add({
        name,
        price,
        category
    });

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
}

// LOAD + DELETE ITEMS
function loadItems() {
    db.collection("menu_items").onSnapshot(snapshot => {
        const itemsDiv = document.getElementById("items");
        itemsDiv.innerHTML = "";

        snapshot.forEach(doc => {
            const item = doc.data();
            itemsDiv.innerHTML += `
        <div class="item">
          <strong>${item.name}</strong> – ₹${item.price}
          <br><small>${item.category}</small>
          <button onclick="deleteItem('${doc.id}')">Delete</button>
        </div>
      `;
        });
    }, (error) => {
        console.error("Error loading items:", error);
        if (error.code === 'permission-denied') {
            // alert("Permission denied accessing menu items.");
        }
    });
}

function deleteItem(id) {
    if (confirm("Delete this item?")) {
        db.collection("menu_items").doc(id).delete();
    }
}
