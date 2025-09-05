// Configuration
const CONFIG = {
    modelId: 'qwen/qwen3-coder',
    provider: 'fireworks',
};

// State
let apiKey = '';
let currentSession = null;
let messages = [];

// DOM Elements
const setupScreen = document.getElementById('setupScreen');
const chatScreen = document.getElementById('chatScreen');
const setupForm = document.getElementById('setupForm');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const downloadBtn = document.getElementById('downloadBtn');
const newSessionBtn = document.getElementById('newSessionBtn');
const changeKeyBtn = document.getElementById('changeKeyBtn');

// Initialize
setupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    apiKey = document.getElementById('apiKey').value.trim();
    
    if (apiKey) {
        // Store in localStorage for convenience
        localStorage.setItem('openRouterApiKey', apiKey);
        
        // Switch to chat screen
        setupScreen.classList.remove('active');
        chatScreen.classList.add('active');
        
        // Initialize session
        initializeSession();
    }
});

// Check for stored API key on load
window.addEventListener('load', () => {
    const storedKey = localStorage.getItem('openRouterApiKey');
    if (storedKey) {
        document.getElementById('apiKey').value = storedKey;
    }
});

// Change API Key
changeKeyBtn.addEventListener('click', () => {
    chatScreen.classList.remove('active');
    setupScreen.classList.add('active');
});

// Initialize new session
function initializeSession() {
    currentSession = {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        model: CONFIG.modelId,
    };
    messages = [];
    chatMessages.innerHTML = '';
}

// New session
newSessionBtn.addEventListener('click', () => {
    if (messages.length > 0) {
        const shouldDownload = confirm('Do you want to download the current conversation before starting a new one?');
        if (shouldDownload) {
            downloadConversation();
        }
    }
    initializeSession();
});

// Download conversation
downloadBtn.addEventListener('click', () => {
    downloadConversation();
});

function downloadConversation() {
    if (messages.length === 0) {
        alert('No messages to download');
        return;
    }
    
    const conversation = {
        session: currentSession,
        messages: messages,
        endTime: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-philo-session-${currentSession.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Chat functionality
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message (this adds to both UI and messages array)
    addMessage('user', message);
    messageInput.value = '';
    
    // Disable input while processing
    messageInput.disabled = true;
    sendButton.disabled = true;
    
    try {
        // Add loading indicator
        const loadingId = addMessage('assistant', '<div class="loading"></div>', true);
        
        // Call OpenRouter API - no need to pass message since it's already in messages array
        const response = await callOpenRouter();
        
        // Remove loading and add actual response
        removeMessage(loadingId);
        addMessage('assistant', response);
        
    } catch (error) {
        removeMessage(loadingId);
        addMessage('assistant', `Error: ${error.message}`);
    } finally {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
});

// Add message to chat
function addMessage(role, content, isTemp = false) {
    const messageId = Date.now().toString();
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.id = `msg-${messageId}`;
    
    messageDiv.innerHTML = `
        <div class="message-role">${role === 'user' ? 'Human' : 'AI'}:</div>
        <div class="message-content">${content}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (!isTemp) {
        messages.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });
    }
    
    return messageId;
}

// Remove message
function removeMessage(messageId) {
    const element = document.getElementById(`msg-${messageId}`);
    if (element) {
        element.remove();
    }
}

// Call OpenRouter API
async function callOpenRouter() {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Project Philo Interview'
            },
            body: JSON.stringify({
                model: CONFIG.modelId,
                provider: {
                    order: [CONFIG.provider]
                },
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('OpenRouter API Error:', error);
        throw error;
    }
}

// Enable Enter to send (Shift+Enter for new line)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Warn before leaving with unsaved conversation
window.addEventListener('beforeunload', (e) => {
    if (messages.length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});