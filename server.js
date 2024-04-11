const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const responseSets = {
    1: ["Response 1.1", "Response 1.2", "Response 1.3", "Response 1.4", "Response 1.5"],
    2: ["Response 2.1", "Response 2.2", "Response 2.3", "Response 2.4", "Response 2.5"],
    3: ["Response 3.1", "Response 3.2", "Response 3.3", "Response 3.4", "Response 3.5"],
    4: ["Response 4.1", "Response 4.2", "Response 4.3", "Response 4.4", "Response 4.5"]
};

let currentResponseIndex = 0;
let currentSetNumber = 1; // Default to set 1

app.post('/setResponseSet', (req, res) => {
    const { setNumber } = req.body;
    if (setNumber !== currentSetNumber) {
        currentSetNumber = setNumber;
        currentResponseIndex = 0; // Reset index because the set has changed
    }
    res.json({ message: `Response set changed to ${setNumber}` });
});

// POST route to handle incoming messages
app.post('/message', (req, res) => {
    const userMessage = req.body.message;
    let botResponse = "...";
    
    // Select the current set based on currentSetNumber
    const currentSet = responseSets[currentSetNumber];
    
    // Select the response and increment the index, handling the last response repetition
    botResponse = currentSet[Math.min(currentResponseIndex, currentSet.length - 1)];
    if (currentResponseIndex < currentSet.length - 1) {
        currentResponseIndex++;
    }
    
    // Append the user message and respond with the bot's message
    fs.appendFile('userResponses.txt', userMessage + '\n', (err) => {
        if (err) {
            console.error("Failed to save user response: ", err);
        }
    });

    res.json({ message: botResponse });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// For example, if your HTML, CSS, and JavaScript files are in a folder named 'public'
app.use(express.static('public'));

app.get('/canRegenerate', (req, res) => {
    const canRegenerate = currentResponseIndex > 0;
    res.json({ canRegenerate });
});