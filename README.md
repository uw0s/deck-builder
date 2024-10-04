# deck-builder

This project is a web-based deckbuilder application that allows users to build and save card decks using real card data, with configurable settings for deck limits, card limits, and other parameters via a `config.json` file.

## Configuration

The `config.json` file allows you to customize various parameters of the deckbuilder:

```json
{
    "deckSizeLimit": 21,
    "cardLimitPerDeck": 7,
    "paths": {
        "cardJson": "prm/cards.json",
        "images": "prm/img/"
    },
    "cardDimensions": {
        "width": 367,
        "height": 512
    },
    "cardsPerRow": 7
}
```

The `cards.json` file is used to map card images to their corresponding names. Each card entry consists of an ID, image filename, the card name and its description. The structure looks like this:

```json
{
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
```