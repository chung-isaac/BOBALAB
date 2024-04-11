function typeMessage(message, callback) {
    const chatHistory = document.getElementById('chatHistory');
    const messageElement = document.createElement('div'); // Create a div for the bot message
    chatHistory.appendChild(messageElement); // Append it to the chat history container

    // Prepend "Bot: " label to the message element directly
    const label = document.createElement('span'); // Create a span for the "Bot: " label
    label.textContent = "Bot: "; // Set static text for the label
    messageElement.appendChild(label); // Append the label to the message element

    let i = 0; // Start typing the actual message content after the "Bot: " label
    function typing() {
        if (i < message.length) {
            messageElement.textContent += message.charAt(i);
            i++;
            setTimeout(typing, 25); // Adjust typing speed as needed
        } else {
            chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom after typing
            if (callback) {
                callback(); // Call a callback function if provided
            }
        }
    }
    typing();
}

function appendMessageToChatHistory(message) {
    const chatHistory = document.getElementById('chatHistory');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);

    // Ensure we scroll to the bottom of the chat history to show the newest message
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Call this function with the bot's response instead of directly inserting it into the DOM
function displayBotResponse(botMessage) {
    appendMessageToChatHistory("Bot: " + botMessage);
    // If you're using the typing animation, you may need to adjust the logic 
    // to animate within the newly appended messageElement instead
}

// Assuming you're removing displayBotResponse and instead directly using typeMessage for bot responses
document.getElementById('chatForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userMessage = document.getElementById('userMessage').value;

    // Append user's message to chat history
    appendMessageToChatHistory("You: " + userMessage);
    
    fetch('/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('userMessage').value = ''; // Clear input field
        // Now using typeMessage to display the bot's response with a typing effect
        typeMessage(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('regenerateButton').addEventListener('click', function() {
    fetch('/canRegenerate')
        .then(response => response.json())
        .then(data => {
            if (data.canRegenerate) {
                // Code to trigger the regenerate action, e.g., re-submit the form or directly call the function
                document.getElementById('userMessage').value = "";
                document.getElementById('chatForm').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            } else {
                console.log('Cannot regenerate yet.'); // Handle as appropriate
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

window.onload = function() {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.scrollTop = chatHistory.scrollHeight;
};

function setResponseSet(setNumber) {
    fetch('/setResponseSet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setNumber }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response set changed:', data);
    })
    .catch((error) => {
        console.error('Error setting response set:', error);
    });
}