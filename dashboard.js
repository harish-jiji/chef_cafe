import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE", // NOTE: In a real app, this should be consistent with admin.html config. 
    // Since the user didn't provide it in the snippet, I'm assuming it's already configured or I should copy from admin.html if possible. 
    // I will check admin.html for the config to ensure it works out of the box.
    authDomain: "chef-s-cafe.firebaseapp.com",
    projectId: "chef-s-cafe",
    storageBucket: "chef-s-cafe.firebasestorage.app",
    messagingSenderId: "374260905436",
    appId: "1:374260905436:web:1ec075836261563f113702"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to get today's date string YYYY-MM-DD that matches how we save bills
const today = new Date().toISOString().slice(0, 10);

async function loadDashboard() {
    console.log("Loading dashboard for date:", today);

    try {
        const q = query(
            collection(db, "bills"),
            where("date", "==", today),
            where("status", "==", "PAID")
        );

        const snap = await getDocs(q);

        let totalAmount = 0;
        let totalBills = snap.size;
        let itemsMap = {};

        snap.forEach(doc => {
            const bill = doc.data();
            totalAmount += Number(bill.total) || 0;

            if (bill.items && Array.isArray(bill.items)) {
                bill.items.forEach(item => {
                    itemsMap[item.name] = (itemsMap[item.name] || 0) + Number(item.qty);
                });
            }
        });

        document.getElementById("todayAmount").textContent = `₹${totalAmount}`;
        document.getElementById("billCount").textContent = totalBills;

        renderChart(itemsMap);

    } catch (error) {
        console.error("Error loading dashboard:", error);
        if (error.code === 'failed-precondition') {
            console.log("Creating index required...");
            // The error message in console usually contains the link to create the index
        }
        alert("Error loading dashboard data. Check console for details (Index might be missing).");
    }
}

function renderChart(itemsMap) {
    const ctx = document.getElementById("itemsChart");

    if (Object.keys(itemsMap).length === 0) {
        // Handle empty state if needed, but ChartJS handles empty data okay usually
    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(itemsMap),
            datasets: [{
                label: "Qty Sold",
                data: Object.values(itemsMap),
                backgroundColor: "#4f46e5",
                borderRadius: 6,
                barThickness: 30,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

loadDashboard();
