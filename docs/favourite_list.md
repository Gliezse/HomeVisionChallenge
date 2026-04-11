# Favourite list specs

## Business user flow

- Each house card in the list has a hollow outlined star button aligned to the right side of card
- When clicking it, the star becomes golden, in a plain style matching the modern look of the page. A toast notification shows up with the text "House succesfully saved to favourites". If clicked again, the favourite button toggles and the house is removed from favourites. Toast should be shown with the text "House removed from favourites"
- In the header, aligned to the right, is a 3 dots menu which when clicking displays a floating container with options. The only options now should be "Favourites" with a star icon at the left of the word.
- When clicking the option, the user gets redirected to /favourites, where the houses they have saved as favourite should be displayed. 
- In the favourites list, there should be a thrash icon in each card. When clicked, the house is removed from the list, and the same toast is displayed.
- When the user stumbles across the same saved house in the page again, the star should have the correct status (golden if saved, hollow black outlined if not). The IDs should match.
- If the data from the API changed (name, amount)