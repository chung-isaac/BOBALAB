document.addEventListener('DOMContentLoaded', function() {
    const paragraph = document.getElementById('highlightableParagraph');
    const words = paragraph.innerText.split(/\s+/);
    paragraph.innerHTML = ''; // Clear the paragraph

    words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word + ' '; // Add the word with a space
        wordSpan.classList.add('highlightable');

        // Toggle highlight class on click
        wordSpan.addEventListener('click', () => {
            wordSpan.classList.toggle('highlighted');
        });

        paragraph.appendChild(wordSpan);
    });
});