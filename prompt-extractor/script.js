let currentMatchIndex = 0;
let matches = [];

function approximateTokenCount(text) {
    // Rough approximation: count words, considering typical English tokenization
    const words = text.match(/[\w\-'’]+/g) || [];
    return words.length;
}


function extractSnippets() {
    const inputText = document.getElementById('inputText').value;
    const searchPhrases = document.getElementById('searchPhrase').value.split(',').map(s => s.trim());
    const lines = inputText.split('\n');
    let outputText = '';
    let lastEnd = -1;
    matches = []; // Reset matches array

    // Create a regex that matches any of the search terms
    const searchRegex = new RegExp('(' + searchPhrases.join('|') + ')', 'i');

    lines.forEach((line, index) => {
        if (line.match(searchRegex)) {
            let start = Math.max(0, index - 50);
            let end = Math.min(lines.length, index + 51);
            if (start <= lastEnd) {
                start = lastEnd + 1;
            }
            if (start < end) {
                const snippet = lines.slice(start, end).join('\n');
                if (snippet.match(searchRegex)) {
                    const highlightedSnippet = snippet.replace(searchRegex, '<span class="highlight">$1</span>');
                    const enhancedSnippet = enhanceVisibility(highlightedSnippet, searchRegex);
                    matches.push(enhancedSnippet);
                    outputText += snippet + '\n\n';
                    lastEnd = end - 1;
                }
            }
        }
    });

    document.getElementById('outputText').value = outputText.trim();
    updateCharCount('output');
    if (matches.length > 0) {
        currentMatchIndex = 0;
        displayMatch();
    } else {
        document.getElementById('matchView').innerHTML = "No matches found.";
    }
}

function enhanceVisibility(snippet, regex) {
    return snippet.split('\n').map(line => {
        if (line.match(regex)) {
            return `<div style="background-color: yellow; font-size: larger;">${line.replace(regex, '<span style="color: red; font-weight: bold;">$1</span>')}</div>`;
        } else {
            return line;
        }
    }).join('\n');
}

function nextMatch() {
    if (matches.length > 0) {
        currentMatchIndex = (currentMatchIndex + 1) % matches.length;
        displayMatch();
    }
}

function displayMatch() {
    const matchView = document.getElementById('matchView');
    matchView.innerHTML = matches[currentMatchIndex];
}

function updateCharCount(type) {
    const textArea = (type === 'input') ? document.getElementById('inputText') : document.getElementById('outputText');
    const charCountId = (type === 'input') ? 'inputCharCount' : 'outputCharCount';
    const tokenCountId = (type === 'input') ? 'inputTokenCount' : 'outputTokenCount';
    document.getElementById(charCountId).textContent = textArea.value.length;
    document.getElementById(tokenCountId).textContent = approximateTokenCount(textArea.value);
}


