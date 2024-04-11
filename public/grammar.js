document.addEventListener('DOMContentLoaded', function() {
    const paragraph = document.getElementById('highlightableParagraph');
    const words = paragraph.innerText.split(/\s+/); // Split by one or more spaces
    paragraph.innerHTML = ''; // Clear the original paragraph content

    words.forEach((word, index) => {
        // Create a span for the word
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word;
        wordSpan.classList.add('highlightable');

        // Add click event to toggle highlight class
        wordSpan.addEventListener('click', function() {
            this.classList.toggle('highlighted');
        });

        paragraph.appendChild(wordSpan);

        // Add a space after the word, but not for the last word
        if (index < words.length - 1) {
            paragraph.appendChild(document.createTextNode(' '));
        }
    });
});
