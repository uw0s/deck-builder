(() => {
    const configFile = 'config.json';
    const errorMessage = document.getElementById('error-message');
    const cardList = document.getElementById('card-list');
    const deckList = document.getElementById('deck-list');
    const deckCounter = document.getElementById('deck-counter');
    const copyDeckBtn = document.getElementById('copy-deck-btn');
    const saveDeckBtn = document.getElementById('save-deck-btn');
    const searchInput = document.getElementById('search-input');
    const clearDeckBtn = document.getElementById('clear-deck-btn');

    let deckSizeLimit;
    let cardLimitPerDeck;
    let paths = {};
    let cardDimensions = {};
    let cardsPerRow;
    let allCards = [];
    let deck = {};

    function showError(message, timeout) {
        errorMessage.textContent = message;
        setTimeout(() => {
            errorMessage.textContent = '';
        }, timeout);
    }

    function applyThemeBasedOnPreference() {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-bs-theme', prefersDarkScheme ? 'dark' : 'light');
    }

    function renderCards(searchQuery = '') {
        cardList.innerHTML = '';
        cardList.classList.add('card-grid');
        const filteredCards = allCards.filter(card =>
            card.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        filteredCards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-item';
            cardDiv.innerHTML = `
            <img src="${card.img}" alt="${card.name}" 
                width="${cardDimensions.width}" height="${cardDimensions.height}"
                loading="lazy"
                data-bs-toggle="tooltip" 
                data-bs-placement="bottom"
                data-bs-html="true"
                data-bs-title="${card.description}">
            <p>${card.name}</p>
        `;
            cardDiv.onclick = () => addCardToDeck(card.name);
            cardList.appendChild(cardDiv);
        });
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }

    function updateDeck() {
        deckList.innerHTML = '';
        const deckSize = Object.values(deck).reduce((total, count) => total + count, 0);
        deckCounter.textContent = `${deckSize} / ` + deckSizeLimit + ` cards`;
        allCards.forEach(card => {
            if (deck[card.name]) {
                const deckCardDiv = document.createElement('div');
                deckCardDiv.className = 'deck-card d-flex align-items-center';
                deckCardDiv.innerHTML = `
                <img src="${card.img}" alt="${card.name}">
                <span style="cursor: pointer;">${card.name} (x${deck[card.name]})</span>
            `;
                deckCardDiv.querySelector('span').onclick = () => removeCardFromDeck(card.name);
                deckList.appendChild(deckCardDiv);
            }
        });
    }

    function loadCardImages(cardData) {
        deckCounter.textContent = `0 / ${deckSizeLimit} cards`;
        allCards = Object.keys(cardData).map(cardId => {
            return {
                name: cardData[cardId].name,
                img: useRemoteImages ? cardData[cardId].image : `${paths.images}${cardData[cardId].image}`,
                number: cardId,
                description: cardData[cardId].description
            };
        });
        renderCards();
    }

    function addCardToDeck(cardName) {
        const deckSize = Object.values(deck).reduce((total, count) => total + count, 0);
        if (deckSize >= deckSizeLimit) {
            showError('Deck size limit reached!', 1500);
            return;
        }
        if (!deck[cardName]) {
            deck[cardName] = 1;
        } else if (deck[cardName] < cardLimitPerDeck) {
            deck[cardName] += 1;
        } else {
            showError('You can only have up to ' + cardLimitPerDeck + ' copies of each card!', 1500)
            return;
        }
        updateDeck();
    }

    function removeCardFromDeck(cardName) {
        if (deck[cardName]) {
            deck[cardName] -= 1;
            if (deck[cardName] === 0) {
                delete deck[cardName];
            }
            updateDeck();
        }
    }

    function clearDeck() {
        deck = {};
        updateDeck();
    }

    function saveDeckAsImage() {
        const deckSize = Object.keys(deck).reduce((total, card) => total + deck[card], 0);
        if (deckSize === 0) {
            showError('No cards in deck to save', 1500);
            return;
        }
        const cardWidth = cardDimensions.width;
        const cardHeight = cardDimensions.height;
        const totalRows = Math.ceil(deckSize / cardsPerRow);
        const canvasWidth = cardsPerRow * cardWidth;
        const canvasHeight = totalRows * cardHeight;
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let x = 0;
        let y = 0;
        let totalImages = 0;
        let imagesLoaded = 0;
        allCards.forEach(card => {
            if (deck[card.name]) {
                for (let i = 0; i < deck[card.name]; i++) {
                    totalImages++;
                    const cardImage = new Image();
                    cardImage.src = card.img;
                    cardImage.onload = function () {
                        ctx.drawImage(cardImage, x, y, cardWidth, cardHeight);
                        x += cardWidth;
                        if (x >= canvasWidth) {
                            x = 0;
                            y += cardHeight;
                        }
                        imagesLoaded++;
                        if (imagesLoaded === totalImages) {
                            const imgData = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.href = imgData;
                            link.download = 'deck.png';
                            link.click();
                        }
                    };
                }
            }
        });
        if (totalImages === 0) {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'deck.png';
            link.click();
        }
    }

    function copyDeckToClipboard() {
        const deckLines = Object.entries(deck)
            .map(([cardName, count]) => `${count}x ${cardName}`)
            .join('\n');
        const originalIcon = '<i class="bi bi-file-text-fill"></i>';
        const successIcon = '<i class="bi bi-check-lg"></i>';
        if (deckLines.length === 0) {
            showError('No cards in deck to copy', 1500)
            return;
        }
        navigator.clipboard.writeText(deckLines).then(() => {
            copyDeckBtn.innerHTML = successIcon;
            setTimeout(() => {
                copyDeckBtn.innerHTML = originalIcon;
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        applyThemeBasedOnPreference();
    });
    saveDeckBtn.addEventListener('click', function () {
        saveDeckAsImage();
    });
    searchInput.addEventListener('input', function (e) {
        renderCards(e.target.value);
    });
    copyDeckBtn.addEventListener('click', copyDeckToClipboard);
    clearDeckBtn.addEventListener('click', clearDeck);

    applyThemeBasedOnPreference();

    fetch(configFile)
        .then(response => response.json())
        .then(config => {
            deckSizeLimit = config.deckSizeLimit;
            cardLimitPerDeck = config.cardLimitPerDeck;
            useRemoteImages = config.useRemoteImages;
            paths = config.paths;
            cardDimensions = config.cardDimensions;
            cardsPerRow = config.cardsPerRow;
            fetch(paths.cardJson)
                .then(response => response.json())
                .then(cardData => {
                    loadCardImages(cardData);
                });
        });
})();