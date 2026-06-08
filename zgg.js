const ZGG = {
    BASE_URL: "https://cdn.jsdelivr.net/gh/Zenith-UB/ZGG.js/",

    async init(gridSelector, cardsAcross = 5, jsonFile = "g.json") {
        const grid = document.querySelector(gridSelector);

        if (!grid) {
            console.error("Grid not found:", gridSelector);
            return;
        }

        grid.innerHTML = "";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = `repeat(${cardsAcross}, minmax(0, 1fr))`;
        grid.style.gap = "16px";

        this.createOverlay();

        try {
            const games = await fetch(jsonFile).then(r => r.json());

            for (const game of games) {
                const card = document.createElement("div");

                card.className = "zgg-card";
                card.style.cursor = "pointer";
                card.style.textAlign = "center";

                const img = document.createElement("img");
                img.src = this.BASE_URL + game.image;
                img.alt = game.title;
                img.style.width = "100%";
                img.style.aspectRatio = "1";
                img.style.objectFit = "cover";
                img.style.display = "block";

                const title = document.createElement("div");
                title.textContent = game.title;
                title.style.marginTop = "8px";

                card.appendChild(img);
                card.appendChild(title);

                card.addEventListener("click", () => {
                    this.openGame(this.BASE_URL + game.game);
                });

                grid.appendChild(card);
            }
        } catch (err) {
            console.error("ZGG:", err);
        }
    },

    createOverlay() {
        if (document.getElementById("zgg-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "zgg-overlay";

        Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            background: "rgba(0,0,0,.9)",
            display: "none",
            zIndex: "999999"
        });

        const close = document.createElement("button");
        close.textContent = "✕";

        Object.assign(close.style, {
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: "1000000",
            cursor: "pointer"
        });

        const iframe = document.createElement("iframe");

        Object.assign(iframe.style, {
            width: "100%",
            height: "100%",
            border: "none"
        });

        close.onclick = () => {
            overlay.style.display = "none";
            iframe.src = "about:blank";
        };

        overlay.appendChild(iframe);
        overlay.appendChild(close);

        document.body.appendChild(overlay);

        this.overlay = overlay;
        this.iframe = iframe;
    },

    openGame(url) {
        this.iframe.src = url;
        this.overlay.style.display = "block";
    }
};
