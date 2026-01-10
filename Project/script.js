document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       1) Build Interactive Panel
       ========================= */
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

    /* =========================
       2) Input controls button
       ========================= */
    nameInput.addEventListener("input", () => {
        if (nameInput.value.trim().length > 0) {
            actionButton.disabled = false;
            actionButton.classList.remove("disabled");
        } else {
            actionButton.disabled = true;
            actionButton.classList.add("disabled");
        }
    });

    /* =========================
       3) Button changes text
       ========================= */
    actionButton.addEventListener("click", () => {
        const userName = nameInput.value.trim();
        messageArea.textContent = `Welcome, ${userName}! You are ready to learn.`;
        messageArea.classList.add("text-gradient");
    });

    /* =========================
       4) Reset button
       ========================= */
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

    /* =========================
       5) Search courses by name
       ========================= */
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

    /* =========================
       6) Highlight top score
       (simulate scores)
       ========================= */
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
