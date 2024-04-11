document.addEventListener('DOMContentLoaded', function() {
    const paragraph = document.getElementById('highlightableParagraph');
    const words = paragraph.innerText.split(/\s+/);
    paragraph.innerHTML = ''; // Clear the original paragraph content

    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word;
        wordSpan.classList.add('highlightable');

        // Adding a space after each word except the last one
        if (index !== words.length - 1) {
            wordSpan.innerHTML += ' ';
        }

        wordSpan.addEventListener('click', function() {
            this.classList.toggle('highlighted');
        });

        paragraph.appendChild(wordSpan);
    });
});
