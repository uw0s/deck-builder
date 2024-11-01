# deck-builder

This project is a web-based deckbuilder application that allows users to build and save card decks using real card data, with configurable settings for deck limits, card limits, and other parameters.

## Configuration

The `config.json` file allows you to customize general parameters of the deckbuilder:

```json
{
    "paths": {
        "cardJson": "prm/cards.json",
        "images": "prm/img/"
    }
}
```

The `cards.json` file is used to customize various parameters of the deckbuilder and map card images to their corresponding names. Each card entry consists of an ID, image filename, the card name and its description. The structure looks like this:

```json
{
    "deckSizeLimit": 21,
    "cardLimitPerDeck": 7,
    "useRemoteImages": false,
    "cardDimensions": {
        "width": 367,
        "height": 512
    },
    "cardsPerRow": 7,
    "cardData": {
        "000010": {
            "image": "000010.webp",
            "name": "Placeholder_0",
            "description": "<b>Bold<b>"
        },
        "000020": {
            "image": "000020.webp",
            "name": "Placeholder_1",
            "description": "L1\nL2"
        },
        "000030": {
            "image": "000030.webp",
            "name": "Placeholder_2",
            "description": "🔴🟢"
        }
    }
}
```