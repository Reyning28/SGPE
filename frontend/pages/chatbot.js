// Chatbot JavaScript
class SGPEChatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messages = [];
        this.userId = this.generateUserId();
        this.apiUrl = 'http://localhost:3000/api/chatbot';
        
        this.init();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        // Crear el botón flotante
        const toggleButton = document.createElement('button');
        toggleButton.className = 'chatbot-toggle';
        toggleButton.innerHTML = '💬';
        toggleButton.setAttribute('aria-label', 'Abrir chatbot');
        
        // Crear el contenedor del chatbot
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <div class="chatbot-header">
                <h3 class="chatbot-title">Asistente SGPE</h3>
                <button class="chatbot-close" aria-label="Cerrar chatbot">×</button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="welcome-message">
                    <h4>¡Hola! 👋</h4>
                    <p>Soy tu asistente virtual del Sistema SGPE. ¿En qué puedo ayudarte hoy?</p>
                    <div class="quick-actions">
                        <button class="quick-action-btn" data-message="¿Cómo crear un cliente?">Crear cliente</button>
                        <button class="quick-action-btn" data-message="¿Cómo generar una factura?">Generar factura</button>
                        <button class="quick-action-btn" data-message="¿Cómo agregar productos?">Agregar productos</button>
                        <button class="quick-action-btn" data-message="Ayuda general">Ayuda</button>
                    </div>
                </div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" class="chatbot-input" placeholder="Escribe tu mensaje..." maxlength="500">
                <button class="chatbot-send" aria-label="Enviar mensaje">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;

        // Agregar al body
        document.body.appendChild(toggleButton);
        document.body.appendChild(container);

        // Guardar referencias
        this.toggleButton = toggleButton;
        this.container = container;
        this.messagesContainer = container.querySelector('#chatbot-messages');
        this.input = container.querySelector('.chatbot-input');
        this.sendButton = container.querySelector('.chatbot-send');
        this.closeButton = container.querySelector('.chatbot-close');
    }

    bindEvents() {
        // Toggle chatbot
        this.toggleButton.addEventListener('click', () => this.toggle());
        this.closeButton.addEventListener('click', () => this.close());

        // Enviar mensaje
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Botones de acción rápida
        this.messagesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const message = e.target.getAttribute('data-message');
                this.input.value = message;
                this.sendMessage();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.container.classList.add('active');
        this.toggleButton.classList.add('active');
        this.input.focus();
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('active');
        this.toggleButton.classList.remove('active');
    }

    addWelcomeMessage() {
        // El mensaje de bienvenida ya está en el HTML
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;

        // Limpiar input
        this.input.value = '';

        // Agregar mensaje del usuario
        this.addMessage(message, 'user');

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        try {
            const response = await fetch(`${this.apiUrl}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    userId: this.userId
                })
            });

            const data = await response.json();

            // Quitar indicador de escritura
            this.hideTypingIndicator();

            if (data.success) {
                this.addMessage(data.response, 'bot');
            } else {
                this.addMessage(data.response || 'Lo siento, no pude procesar tu mensaje.', 'bot');
            }

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.hideTypingIndicator();
            this.addMessage('Lo siento, hubo un error de conexión. Por favor, intenta nuevamente.', 'bot');
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Preservar saltos de línea y formato
        const formattedContent = content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/• /g, '&nbsp;&nbsp;• ');
        
        messageContent.innerHTML = formattedContent;

        if (sender === 'user') {
            messageDiv.appendChild(messageContent);
            messageDiv.appendChild(avatar);
        } else {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
        }

        // Remover mensaje de bienvenida si existe
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Guardar mensaje
        this.messages.push({ content, sender, timestamp: new Date() });
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.sendButton.disabled = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.sendButton.disabled = false;

        const typingIndicator = this.messagesContainer.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    async clearHistory() {
        try {
            await fetch(`${this.apiUrl}/clear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: this.userId
                })
            });

            // Limpiar mensajes locales
            this.messages = [];
            this.messagesContainer.innerHTML = '';
            this.addWelcomeMessage();

        } catch (error) {
            console.error('Error limpiando historial:', error);
        }
    }

    async getStatus() {
        try {
            const response = await fetch(`${this.apiUrl}/status`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error obteniendo estado:', error);
            return null;
        }
    }
}

// Inicializar chatbot cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya existe un chatbot
    if (!window.sgpeChatbot) {
        window.sgpeChatbot = new SGPEChatbot();
    }
});

// Exponer funciones globales para uso desde otras páginas
window.SGPEChatbot = SGPEChatbot;
