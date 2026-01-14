document.addEventListener("DOMContentLoaded", () => {

    const coursesSection = document.querySelector("#courses .section-header");

    const panel = document.createElement("div");
    panel.className = "interactive-panel text-center mt-4";

    panel.innerHTML = `
        <input type="text" class="form-control mb-2" id="nameInput" placeholder="Type your name..." />
        <button class="btn btn-primary me-2" id="actionButton" disabled>Click Me</button>
        <button class="btn btn-outline-primary" id="resetButton">Reset</button>
        <p class="mt-3" id="messageArea">Waiting for input...</p>
        <input type="text" class="form-control mt-4" id="searchInput" placeholder="Search course by name..." />
    `;

    coursesSection.appendChild(panel);

    const nameInput = document.getElementById("nameInput");
    const actionButton = document.getElementById("actionButton");
    const resetButton = document.getElementById("resetButton");
    const messageArea = document.getElementById("messageArea");
    const searchInput = document.getElementById("searchInput");

    nameInput.addEventListener("input", () => {
        if (nameInput.value.trim().length > 0) {
            actionButton.disabled = false;
            actionButton.classList.remove("disabled");
        } else {
            actionButton.disabled = true;
            actionButton.classList.add("disabled");
        }
    });
    
    async function fetchUserData() {
    const url = "https://jsonplaceholder.typicode.com/users/1";

    messageArea.textContent = "Loading data...";
    messageArea.classList.remove("text-gradient");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        messageArea.innerHTML = `
            <strong>Name:</strong> ${data.name}<br>
            <strong>Email:</strong> ${data.email}<br>
            <strong>Phone:</strong> ${data.phone}
        `;
        messageArea.classList.add("text-gradient");

    } catch (error) {
        messageArea.textContent = "Error loading data. Please try again.";
    }
}

actionButton.addEventListener("click", () => {
    fetchUserData();
});

    resetButton.addEventListener("click", () => {
        nameInput.value = "";
        searchInput.value = "";
        actionButton.disabled = true;
        messageArea.textContent = "Waiting for input...";
        messageArea.classList.remove("text-gradient");

        document.querySelectorAll(".course-card").forEach(card => {
            card.classList.remove("d-none", "top-score");
        });
    });

  
    const courseCards = document.querySelectorAll(".course-card");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();

        courseCards.forEach(card => {
            const title = card.querySelector("h4").textContent.toLowerCase();
            if (title.includes(query)) {
                card.classList.remove("d-none");
            } else {
                card.classList.add("d-none");
            }
        });
    });

    let highestScore = 0;
    let topCard = null;

    courseCards.forEach(card => {
        const randomScore = Math.floor(Math.random() * 100) + 1;
        card.dataset.score = randomScore;

        if (randomScore > highestScore) {
            highestScore = randomScore;
            topCard = card;
        }
    });

    if (topCard) {
        topCard.classList.add("top-score");
    }
});
const courseCards = document.querySelectorAll(".course-card");
const firstCard = courseCards[0];

if (firstCard) {
    firstCard.style.border = "3px solid yellow";
    firstCard.style.boxShadow = "0 0 15px rgba(221, 255, 0, 0.99)";
    firstCard.style.transform = "scale(1.05)";
}
const joinElements = document.querySelectorAll("a, button");

joinElements.forEach(el => {
    if (el.textContent.toLowerCase().includes("join")) {
        el.addEventListener("click", () => {
            el.style.backgroundColor = "#4caf50";
            el.style.color = "#fff";
            el.style.border = "none";
            el.style.boxShadow = "0 0 12px rgba(76, 175, 80, 0.8)";
            el.style.transform = "scale(1.1)";
            el.style.transition = "0.3s ease";
            el.textContent = "Joined!";
        });
    }
});

