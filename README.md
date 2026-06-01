<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Городской Чат-бот | Умный помощник ЖКХ и городского хозяйства</title>
    <!-- Google Fonts и простые стили, без лишних зависимостей, кроме Font Awesome для иконок -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(145deg, #e9f0f5 0%, #d4e2ec 100%);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        /* Основной контейнер чата */
        .chat-app {
            max-width: 1400px;
            width: 100%;
            height: 90vh;
            background: rgba(255,255,255,0.96);
            border-radius: 2rem;
            box-shadow: 0 25px 45px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            backdrop-filter: blur(0px);
            transition: all 0.2s ease;
        }

        /* Шапка */
        .chat-header {
            background: #1e3a5f;
            color: white;
            padding: 1rem 1.8rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            border-bottom: 2px solid #2c5a7a;
        }
        .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .logo-area i {
            font-size: 2rem;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        .title h1 {
            font-size: 1.4rem;
            font-weight: 600;
            letter-spacing: -0.3px;
        }
        .title p {
            font-size: 0.75rem;
            opacity: 0.85;
            margin-top: 2px;
        }
        .settings-panel {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
            background: rgba(255,255,255,0.12);
            padding: 6px 14px;
            border-radius: 40px;
        }
        .api-input {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            border-radius: 32px;
            padding: 4px 12px;
        }
        .api-input input {
            border: none;
            background: transparent;
            padding: 8px 6px;
            font-size: 0.8rem;
            width: 180px;
            font-family: monospace;
            outline: none;
            color: #1e2f3e;
        }
        .api-input button {
            background: none;
            border: none;
            color: #1e3a5f;
            cursor: pointer;
            font-size: 1rem;
        }
        .btn-clear {
            background: rgba(255,255,240,0.2);
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 30px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .btn-clear:hover {
            background: rgba(255,255,240,0.4);
        }
        .model-badge {
            font-size: 0.7rem;
            background: #0f2b3b;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 500;
        }

        /* Окно сообщений */
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            background: #fefef7;
            scroll-behavior: smooth;
        }
        /* Сообщения */
        .message {
            display: flex;
            gap: 12px;
            max-width: 85%;
            animation: fadeInUp 0.2s ease;
        }
        .message.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }
        .message.bot {
            align-self: flex-start;
        }
        .avatar {
            width: 40px;
            height: 40px;
            background: #eef2fa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .user .avatar {
            background: #1e3a5f;
            color: white;
        }
        .bot .avatar {
            background: #d9e6f2;
            color: #1e5a7a;
        }
        .bubble {
            background: white;
            padding: 12px 18px;
            border-radius: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
            line-height: 1.45;
            font-size: 0.95rem;
            color: #1f2e3a;
            border: 1px solid #e9edf2;
        }
        .user .bubble {
            background: #1e3a5f;
            color: white;
            border-bottom-right-radius: 6px;
            border: none;
        }
        .bot .bubble {
            background: #ffffff;
            border-bottom-left-radius: 6px;
        }
        .bubble p {
            margin: 0;
        }
        .thinking .bubble {
            background: #eef2f5;
            color: #4a627a;
            font-style: italic;
        }
        .error-bubble {
            background: #ffe6e5;
            color: #b13e3e;
            border-left: 4px solid #d9534f;
        }

        /* Инпут-панель */
        .chat-input-area {
            padding: 1rem 1.8rem 1.5rem;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }
        .input-wrapper {
            flex: 1;
            background: white;
            border-radius: 48px;
            border: 1px solid #ccdbe8;
            display: flex;
            align-items: center;
            padding: 6px 12px 6px 20px;
            transition: 0.2s;
        }
        .input-wrapper:focus-within {
            border-color: #1e3a5f;
            box-shadow: 0 0 0 3px rgba(30,58,95,0.2);
        }
        .input-wrapper input {
            flex: 1;
            border: none;
            padding: 12px 0;
            font-size: 0.95rem;
            outline: none;
            background: transparent;
            font-family: 'Inter', sans-serif;
        }
        .input-wrapper button {
            background: #1e3a5f;
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        .input-wrapper button:hover {
            background: #0f2e4a;
            transform: scale(1.02);
        }
        .input-wrapper button:disabled {
            background: #b0c4de;
            cursor: not-allowed;
        }
        .examples {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 8px;
        }
        .example-chip {
            background: #eef2f9;
            border-radius: 30px;
            padding: 5px 12px;
            font-size: 0.7rem;
            font-weight: 500;
            color: #1e3a5f;
            cursor: pointer;
            transition: 0.1s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .example-chip:hover {
            background: #dce5f0;
        }

        /* скролл */
        .chat-messages::-webkit-scrollbar {
            width: 6px;
        }
        .chat-messages::-webkit-scrollbar-track {
            background: #e9eef3;
        }
        .chat-messages::-webkit-scrollbar-thumb {
            background: #b9cadb;
            border-radius: 8px;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 680px) {
            .chat-app {
                height: 95vh;
                border-radius: 1.2rem;
            }
            .chat-header {
                padding: 0.8rem 1rem;
            }
            .message {
                max-width: 95%;
            }
            .api-input input {
                width: 130px;
            }
            .settings-panel {
                padding: 4px 8px;
            }
        }
        .status-text {
            font-size: 0.7rem;
            margin-left: 8px;
        }
        i.fa, i.far, i.fas {
            pointer-events: none;
        }
        .warning-key {
            font-size: 0.7rem;
            color: #ffcf9a;
        }
    </style>
</head>
<body>
<div class="chat-app">
    <div class="chat-header">
        <div class="logo-area">
            <i class="fas fa-city"></i>
            <div class="title">
                <h1>Городской советник</h1>
                <p>Управление городским хозяйством • ЖКХ • Инфраструктура</p>
            </div>
        </div>
        <div class="settings-panel">
            <div class="api-input" id="apiKeyContainer">
                <input type="password" id="apiKeyInput" placeholder="OpenAI API ключ" autocomplete="off">
                <button id="toggleApiKey" title="Показать/скрыть"><i class="far fa-eye-slash"></i></button>
                <button id="saveApiKeyBtn" title="Сохранить"><i class="fas fa-save"></i></button>
            </div>
            <button id="clearChatBtn" class="btn-clear"><i class="fas fa-trash-alt"></i> Очистить</button>
            <div class="model-badge"><i class="fas fa-microchip"></i> GPT-3.5 Turbo</div>
        </div>
    </div>

    <div class="chat-messages" id="chatMessages">
        <div class="message bot">
            <div class="avatar"><i class="fas fa-robot"></i></div>
            <div class="bubble">
                <p>🏙️ Здравствуйте! Я — <strong>городской AI-помощник</strong> в сфере управления городским хозяйством. Задавайте вопросы о ЖКХ, транспорте, благоустройстве, экологии, ремонте дорог, тарифах и многом другом.<br>⚙️ Для начала работы <strong>введите ваш OpenAI API ключ</strong> (сохранится локально).</p>
            </div>
        </div>
    </div>

    <div class="chat-input-area">
        <div style="flex:1">
            <div class="input-wrapper">
                <input type="text" id="messageInput" placeholder="Спросить о городских проблемах, ЖКХ, тарифах..." autocomplete="off">
                <button id="sendBtn"><i class="fas fa-paper-plane"></i></button>
            </div>
            <div class="examples">
                <span class="example-chip" data-question="Как сообщить о яме на дороге?"><i class="fas fa-road"></i> Яма на дороге</span>
                <span class="example-chip" data-question="Что делать при аварии на отоплении зимой?"><i class="fas fa-temperature-low"></i> Отопление</span>
                <span class="example-chip" data-question="Как рассчитывается плата за вывоз мусора?"><i class="fas fa-trash-alt"></i> Вывоз ТКО</span>
                <span class="example-chip" data-question="Как организовать дворовое озеленение?"><i class="fas fa-tree"></i> Озеленение</span>
                <span class="example-chip" data-question="Где узнать расписание общественного транспорта?"><i class="fas fa-bus"></i> Транспорт</span>
            </div>
        </div>
    </div>
</div>

<script>
    // DOM элементы
    const messagesContainer = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendBtn');
    const clearChatButton = document.getElementById('clearChatBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const toggleApiKeyBtn = document.getElementById('toggleApiKey');
    const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');

    // Конфигурация модели
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const DEFAULT_MODEL = 'gpt-3.5-turbo';

    // Хранилище истории сообщений (для отображения и контекста)
    let conversationHistory = [];   // массив объектов { role, content, isError? не включаем в историю API }
    let isLoading = false;
    let currentApiKey = '';

    // Загружаем ключ из localStorage при старте
    function loadApiKey() {
        const savedKey = localStorage.getItem('urban_gpt_key');
        if (savedKey) {
            currentApiKey = savedKey;
            apiKeyInput.value = '••••••••••••••••••••••';
            // Маскируем визуально, но реальный ключ храним в переменной
            apiKeyInput.setAttribute('data-real-key', savedKey);
            apiKeyInput.type = 'password';
        } else {
            currentApiKey = '';
            apiKeyInput.value = '';
        }
    }

    function getActualApiKey() {
        // если в поле маскированный плейсхолдер, берем из localStorage или из data-real-key
        if (apiKeyInput.value && apiKeyInput.value.includes('•••')) {
            return localStorage.getItem('urban_gpt_key') || '';
        }
        return apiKeyInput.value.trim();
    }

    function saveApiKey() {
        const newKey = apiKeyInput.value.trim();
        if (newKey && !newKey.includes('•••')) {
            localStorage.setItem('urban_gpt_key', newKey);
            currentApiKey = newKey;
            apiKeyInput.setAttribute('data-real-key', newKey);
            // заменяем поле на скрытую маску для безопасности
            apiKeyInput.value = '••••••••••••••••••••••';
            apiKeyInput.type = 'password';
            addInfoMessage('✅ API ключ сохранён (хранится только в браузере).');
        } else if (newKey === '' && localStorage.getItem('urban_gpt_key')) {
            localStorage.removeItem('urban_gpt_key');
            currentApiKey = '';
            apiKeyInput.value = '';
            addInfoMessage('🔑 Ключ API удалён. Введите новый для использования модели.');
        } else if (newKey && !newKey.includes('•••')) {
            localStorage.setItem('urban_gpt_key', newKey);
            currentApiKey = newKey;
            apiKeyInput.value = '••••••••••••••••••••••';
            addInfoMessage('✅ Ключ обновлён.');
        } else if (!newKey || newKey.length < 10) {
            addInfoMessage('⚠️ Пожалуйста, введите корректный OpenAI API ключ (начинается с sk-...).', true);
        }
    }

    function addInfoMessage(text, isError = false) {
        const tempId = 'info-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'bot');
        msgDiv.innerHTML = `<div class="avatar"><i class="fas fa-info-circle"></i></div><div class="bubble ${isError ? 'error-bubble' : ''}" style="font-size:0.85rem"><p>ℹ️ ${text}</p></div>`;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
        setTimeout(() => {
            if (msgDiv.parentNode) msgDiv.remove();
        }, 4500);
    }

    // Добавляем сообщение в интерфейс и в историю (кроме системных ошибок)
    function addMessageToUI(role, content, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role === 'user' ? 'user' : 'bot');
        if (isError) {
            messageDiv.classList.add('bot');
        }
        const avatarIcon = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-landmark"></i>';
        messageDiv.innerHTML = `
            <div class="avatar">${avatarIcon}</div>
            <div class="bubble ${isError ? 'error-bubble' : ''}">
                <p>${escapeHtml(content)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        // Сохраняем в историю только не ошибочные сообщения, для контекста
        if (!isError && role !== 'system') {
            conversationHistory.push({ role: role, content: content });
        }
        // Лимит истории: держим последние 20 сообщений (10 диалогов), чтобы не перегружать токены
        while (conversationHistory.length > 20) {
            conversationHistory.shift();
        }
    }

    // Показ "печатает..."
    let thinkingMessageDiv = null;
    function showThinking() {
        if (thinkingMessageDiv) removeThinking();
        thinkingMessageDiv = document.createElement('div');
        thinkingMessageDiv.classList.add('message', 'bot', 'thinking');
        thinkingMessageDiv.innerHTML = `
            <div class="avatar"><i class="fas fa-brain"></i></div>
            <div class="bubble"><p><i class="fas fa-circle-notch fa-spin"></i> Анализирую запрос в сфере городского хозяйства...</p></div>
        `;
        messagesContainer.appendChild(thinkingMessageDiv);
        scrollToBottom();
    }

    function removeThinking() {
        if (thinkingMessageDiv && thinkingMessageDiv.parentNode) {
            thinkingMessageDiv.remove();
            thinkingMessageDiv = null;
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        });
    }

    // Отправка запроса к OpenAI
    async function sendToGPT(userMessage) {
        const apiKey = getActualApiKey();
        if (!apiKey || apiKey.length < 20) {
            addInfoMessage('Пожалуйста, укажите действующий OpenAI API ключ (sk-...). Сохраните его через кнопку 💾', true);
            removeThinking();
            return false;
        }

        // Строим системный промпт (эксперт в городском хозяйстве)
        const systemPrompt = `Ты — профессиональный виртуальный консультант в сфере управления городским хозяйством и ЖКХ.
Твоя задача: давать точные, полезные и дружелюбные ответы на вопросы граждан и специалистов по темам:
- Жилищно-коммунальное хозяйство (капремонт, тарифы, аварийные службы)
- Транспортная инфраструктура (дороги, общественный транспорт, разметка)
- Благоустройство (озеленение, парки, детские площадки, освещение)
- Экология и обращение с отходами (раздельный сбор, контейнерные площадки)
- Управление городскими службами (как подать заявку, инциденты)
Отвечай с учётом российского и международного опыта, чётко структурируй, используй списки, если нужно. Если вопрос не по теме — вежливо направь в рамки городского хозяйства. Всегда будь полезным, не выдумывай несуществующих законов, но давай практические рекомендации.`;

        const messagesForAPI = [
            { role: "system", content: systemPrompt },
            ...conversationHistory.slice(-12), // последние ~12 сообщений для контекста
            { role: "user", content: userMessage }
        ];

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: DEFAULT_MODEL,
                    messages: messagesForAPI,
                    temperature: 0.7,
                    max_tokens: 800,
                    top_p: 0.95,
                    frequency_penalty: 0.2,
                    presence_penalty: 0.3
                })
            });

            if (!response.ok) {
                let errorDetail = `Ошибка API (${response.status})`;
                if (response.status === 401) errorDetail = 'Неверный API ключ. Проверьте и сохраните ключ заново.';
                if (response.status === 429) errorDetail = 'Превышен лимит запросов или недостаточно баланса на аккаунте OpenAI.';
                if (response.status === 500) errorDetail = 'Ошибка на сервере OpenAI, попробуйте позже.';
                const errData = await response.json().catch(() => ({}));
                throw new Error(errorDetail + (errData.error?.message ? `: ${errData.error.message}` : ''));
            }

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                const botReply = data.choices[0].message.content;
                addMessageToUI('assistant', botReply);
                return true;
            } else {
                throw new Error('Неожиданный ответ от модели');
            }
        } catch (error) {
            console.error('LLM Error:', error);
            addMessageToUI('assistant', `❌ Ошибка при обращении к языковой модели: ${error.message}. Проверьте ключ или попробуйте позже.`, true);
            return false;
        }
    }

    // Основной обработчик отправки сообщения
    async function handleSendMessage() {
        if (isLoading) return;
        const userText = messageInput.value.trim();
        if (!userText) return;

        // Проверка API ключа на уровне предупреждения
        const apiKeyCheck = getActualApiKey();
        if (!apiKeyCheck || apiKeyCheck.length < 15) {
            addInfoMessage('Сначала добавьте и сохраните OpenAI API ключ (в поле справа вверху). Без него большая модель не работает.', true);
            return;
        }

        // Добавляем сообщение пользователя в UI и историю
        addMessageToUI('user', userText);
        messageInput.value = '';
        messageInput.focus();
        isLoading = true;
        sendButton.disabled = true;
        showThinking();

        try {
            await sendToGPT(userText);
        } catch (err) {
            console.error(err);
            addMessageToUI('assistant', `⚠️ Техническая ошибка: ${err.message}. Пожалуйста, повторите позже.`, true);
        } finally {
            removeThinking();
            isLoading = false;
            sendButton.disabled = false;
            scrollToBottom();
        }
    }

    // Очистка чата (сохраняем только приветственное сообщение и ключ)
    function clearChat() {
        conversationHistory = [];
        messagesContainer.innerHTML = '';
        // Восстанавливаем приветственное сообщение
        const welcomeDiv = document.createElement('div');
        welcomeDiv.classList.add('message', 'bot');
        welcomeDiv.innerHTML = `<div class="avatar"><i class="fas fa-robot"></i></div><div class="bubble"><p>🏙️ Чат очищен. Я — городской AI-помощник. Задавайте вопросы по ЖКХ, транспорту, благоустройству.<br>⚙️ API ключ сохранён, можете начинать диалог.</p></div>`;
        messagesContainer.appendChild(welcomeDiv);
        scrollToBottom();
        addInfoMessage('История диалога очищена, контекст обнулён.');
    }

    // Примеры быстрых вопросов
    function setExampleQuestion(question) {
        messageInput.value = question;
        handleSendMessage();
    }

    // Вспомогательные ивенты
    function toggleApiKeyVisibility() {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleApiKeyBtn.innerHTML = '<i class="far fa-eye"></i>';
            // если стоит маскированное значение, показываем реальный ключ из data
            if (apiKeyInput.value.includes('•••')) {
                const real = localStorage.getItem('urban_gpt_key');
                if (real) apiKeyInput.value = real;
            }
        } else {
            apiKeyInput.type = 'password';
            toggleApiKeyBtn.innerHTML = '<i class="far fa-eye-slash"></i>';
            if (apiKeyInput.value && !apiKeyInput.value.includes('sk-')) {
                const saved = localStorage.getItem('urban_gpt_key');
                if (saved) apiKeyInput.value = '••••••••••••••••••••••';
                else apiKeyInput.value = '';
            } else if (apiKeyInput.value.includes('sk-')) {
                // ничего не делаем, но потом сохраняем при сохранении
            }
        }
    }

    // Инициализация и прослушка
    document.addEventListener('DOMContentLoaded', () => {
        loadApiKey();
        // восстанавливаем маскировку
        if (localStorage.getItem('urban_gpt_key') && apiKeyInput.value === '') {
            apiKeyInput.value = '••••••••••••••••••••••';
            apiKeyInput.type = 'password';
        }
        sendButton.addEventListener('click', handleSendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSendMessage();
            }
        });
        clearChatButton.addEventListener('click', clearChat);
        saveApiKeyBtn.addEventListener('click', saveApiKey);
        toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);
        // примеры
        document.querySelectorAll('.example-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const question = chip.getAttribute('data-question');
                if (question) setExampleQuestion(question);
            });
        });
        // убираем возможные предупреждения при начальной загрузке
        if (!localStorage.getItem('urban_gpt_key')) {
            setTimeout(() => {
                addInfoMessage('🔑 Чтобы использовать большую языковую модель, введите OpenAI API ключ в правом верхнем углу и нажмите 💾. Ключ хранится локально в вашем браузере.', false);
            }, 800);
        }
    });
</script>
</body>
</html>
