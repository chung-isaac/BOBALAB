let responses = [];

/**
 * Event listener for CSV file input change.
 * Reads the CSV file and initializes the chat form submit event listener.
 */
document.getElementById('csvFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            responses = parseCSV(text);
            document.getElementById('chatForm').addEventListener('submit', handleChatSubmit);
        };
        reader.readAsText(file);
    }
});


/**
 * Parses CSV text into an array of response objects.
 * @param {string} text - The CSV text to parse.
 * @returns {Array<Object>} - Array of response objects with id, response, and rating properties.
 */
function parseCSV(text) {
    const lines = text.split('\n').slice(1); // Assuming the first line is headers
    return lines.map(line => {
        const [id, response, rating] = line.split(',');
        return { id, response, rating: parseInt(rating, 10) };
    });
}


/**
 * Handles the chat form submission.
 * Appends the user's message to the chat history and calls the currently selected response function.
 * @param {Event} e - The form submission event.
 */
function handleChatSubmit(e) {
    e.preventDefault();
    const userMessage = document.getElementById('userMessage').value;
    document.getElementById('userMessage').value = ''; // Clear input field
    if (userMessage.trim() !== '') {
        appendMessageToChatHistory("You: " + userMessage);
    }
    currentResponseFunction();  // Call the currently selected response function
}

let currentResponseFunction = () => displayMultipleResponses(responses);  // Default function

/**
 * Sets the current response function to display a specific set of responses.
 */
function pickRandomResponses() {
    currentResponseFunction = () => displayMultipleResponses(responses);
}

function pickGoodResponses() {
    currentResponseFunction = () => filterAndDisplayResponses(response => response.rating >= 4);
}

function pickBadResponses() {
    currentResponseFunction = () => filterAndDisplayResponses(response => response.rating <= 2);
}

function pickMixedResponses() {
    currentResponseFunction = function() {
        let goodResponses = responses.filter(response => response.rating >= 4);
        let badResponses = responses.filter(response => response.rating <= 2);
        let mixedResponses = [];
        mixedResponses = mixedResponses.concat(goodResponses.slice(0, 3), badResponses.slice(0, 2));
        displayMultipleResponses(mixedResponses);
    };
}


/**
 * Filters the responses based on the provided criteria and displays them.
 * @param {Function} filterCriteria - The filter criteria function.
 */
function filterAndDisplayResponses(filterCriteria) {
    const filteredResponses = responses.filter(filterCriteria);
    displayMultipleResponses(filteredResponses);
}


/**
 * Displays up to 5 random responses from the filtered list.
 * @param {Array<Object>} filteredResponses - The filtered responses to display.
 */
function displayMultipleResponses(filteredResponses) {
    if (filteredResponses.length > 0) {
        const selectedResponses = [];
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * filteredResponses.length);
            selectedResponses.push(filteredResponses[randomIndex].response);
        }
        typeMessage("Sure! Here are some suggestions:", selectedResponses);
    } else {
        typeMessage("No suitable response found.");
    }
}


/**
 * Appends a message to the chat history.
 * @param {string} message - The message to append.
 */
function appendMessageToChatHistory(message) {
    const chatHistory = document.getElementById('chatHistory');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}


/**
 * Types out the message and optionally a list of responses with a typing animation.
 * @param {string} message - The message to type out.
 * @param {Array<string>} [responses=[]] - The list of responses to type out sequentially.
 */
function typeMessage(message, responses = []) {
    const chatHistory = document.getElementById('chatHistory');
    const messageElement = document.createElement('div');
    chatHistory.appendChild(messageElement);

    const label = document.createElement('span');
    label.textContent = "Bot: ";
    messageElement.appendChild(label);

    const textSpan = document.createElement('span');
    messageElement.appendChild(textSpan);

    let i = 0;
    function typing() {
        if (i < message.length) {
            textSpan.textContent += message.charAt(i);
            i++;
            setTimeout(typing, 25); // Simulate typing speed
        } else if (responses.length > 0) {
            typeResponsesSequentially(messageElement, responses);
        } else {
            chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to new message
        }
    }
    typing();
}


/**
 * Types out the responses sequentially with a typing animation.
 * @param {HTMLElement} messageElement - The message element to append responses to.
 * @param {Array<string>} responses - The list of responses to type out.
 */
function typeResponsesSequentially(messageElement, responses) {
    const chatHistory = document.getElementById('chatHistory');
    const ul = document.createElement('ul');
    messageElement.appendChild(ul);

    let responseIndex = 0;

    function typeNextResponse() {
        if (responseIndex < responses.length) {
            const li = document.createElement('li');
            ul.appendChild(li);

            let j = 0;
            function typing() {
                if (j < responses[responseIndex].length) {
                    li.textContent += responses[responseIndex].charAt(j);
                    j++;
                    setTimeout(typing, 25); // Simulate typing speed for each character
                } else {
                    responseIndex++;
                    setTimeout(typeNextResponse, 500); // Delay before typing the next response
                }
                chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to new message
            }
            typing();
        } else {
            chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to new message
        }
    }
    typeNextResponse();
}


/**
 * Initializes the event listeners on window load.
 * Attaches event listeners to buttons for selecting response types and regenerating responses.
 */
window.onload = function() {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Attach event listeners to buttons
    document.getElementById('randomButton').addEventListener('click', pickRandomResponses);
    document.getElementById('goodButton').addEventListener('click', pickGoodResponses);
    document.getElementById('badButton').addEventListener('click', pickBadResponses);
    document.getElementById('mixedButton').addEventListener('click', pickMixedResponses);

    document.getElementById('regenerateButton').addEventListener('click', function() {
        currentResponseFunction();
    });
};
