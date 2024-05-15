/**
 * Initializes the interactive paragraph highlighting functionality once the DOM content is loaded.
 * This function sets up the paragraph to allow words to be highlighted on click and some words to be
 * pre-set as underlined. It also tracks the count of words that are both highlighted and underlined.
 */
document.addEventListener('DOMContentLoaded', function() {
    const paragraph = document.getElementById('highlightableParagraph');
    const words = paragraph.innerText.split(/\s+/);
    paragraph.innerHTML = '';
    let highlightedUnderlinedCount = 0;

    /**
     * Updates the count of words that are both highlighted and underlined.
     */
    function updateCount() {
        highlightedUnderlinedCount = 0; // Reset count
        const spans = paragraph.querySelectorAll('span');
        spans.forEach(span => {
            if (span.classList.contains('highlighted') && span.classList.contains('underlined')) {
                highlightedUnderlinedCount++;
            }
        });
        document.getElementById('count').innerText = highlightedUnderlinedCount;
    }

    // Process each word in the paragraph
    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word;
        wordSpan.classList.add('highlightable');

        // Randomly decide to underline some words
        if (Math.random() < 0.3) { // Adjust probability as needed, here it's 30%
            wordSpan.classList.add('underlined');
        }

        // Add click event to toggle highlight class and check conditions
        wordSpan.addEventListener('click', function() {
            this.classList.toggle('highlighted');
            updateCount();
        });

        paragraph.appendChild(wordSpan);

        // Add space between words
        if (index < words.length - 1) {
            paragraph.appendChild(document.createTextNode(' '));
        }
    });
});
