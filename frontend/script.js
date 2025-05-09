const chatWindow = document.getElementById('chat-window');
const input      = document.getElementById('input');
const sendBtn    = document.getElementById('send');

function appendMessage(text, cls) {
    const msg = document.createElement('div');
    msg.className = `message ${cls}`;
    msg.textContent = text;
    chatWindow.append(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    sendBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    input.value = '';

    try {
        const res = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
        });
        const { reply } = await res.json();
        appendMessage(reply, 'bot');
    } catch (err) {
        appendMessage('Error: could not reach server.', 'bot');
    }
});
