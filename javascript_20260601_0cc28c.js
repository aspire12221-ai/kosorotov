// Демонстрационные данные по городскому хозяйству Москвы (12 месяцев)
const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const requestsData = [120, 135, 140, 110, 95, 105, 115, 130, 125, 118, 109, 102];
const satisfactionData = [82, 84, 83, 85, 86, 88, 89, 87, 86, 85, 84, 86];
const budgetData = [1250, 1300, 1280, 1350, 1400, 1420, 1380, 1450, 1500, 1480, 1520, 1550];

// Текущие показатели (последний месяц)
let currentMetrics = {
    openRequests: 345,
    avgResponseTime: 2.4,
    satisfaction: 86,
    monthlyBudget: 1550,
    streetWorkers: 1250
};

// Инициализация графиков
let requestsChart, satisfactionChart, budgetChart;

function initCharts() {
    const ctxRequests = document.getElementById('requestsChart').getContext('2d');
    const ctxSatisfaction = document.getElementById('satisfactionChart').getContext('2d');
    const ctxBudget = document.getElementById('budgetChart').getContext('2d');

    requestsChart = new Chart(ctxRequests, {
        type: 'line',
        data: { labels: months, datasets: [{ label: 'Количество заявок', data: requestsData, borderColor: '#d43f1f', tension: 0.2, fill: false }] },
        options: { responsive: true, maintainAspectRatio: true }
    });
    satisfactionChart = new Chart(ctxSatisfaction, {
        type: 'line',
        data: { labels: months, datasets: [{ label: 'Удовлетворённость, %', data: satisfactionData, borderColor: '#2c7da0', tension: 0.2 }] }
    });
    budgetChart = new Chart(ctxBudget, {
        type: 'line',
        data: { labels: months, datasets: [{ label: 'Расходы (млн ₽)', data: budgetData, borderColor: '#2e7d32', tension: 0.2 }] }
    });
}

// Обновление текстовых KPI и контекстной панели
function updateKPIs() {
    document.getElementById('openRequests').innerText = currentMetrics.openRequests;
    document.getElementById('avgResponseTime').innerText = currentMetrics.avgResponseTime;
    document.getElementById('satisfaction').innerHTML = `${currentMetrics.satisfaction}<span>%</span>`;
    document.getElementById('monthlyBudget').innerHTML = `${currentMetrics.monthlyBudget}<span> млн ₽</span>`;
    document.getElementById('streetWorkers').innerText = currentMetrics.streetWorkers;

    document.getElementById('contextOpenRequests').innerText = currentMetrics.openRequests;
    document.getElementById('contextAvgTime').innerText = currentMetrics.avgResponseTime;
    document.getElementById('contextSat').innerText = currentMetrics.satisfaction;
    document.getElementById('contextBudget').innerText = currentMetrics.monthlyBudget;
    document.getElementById('contextWorkers').innerText = currentMetrics.streetWorkers;
}

// Получение контекста в виде текста для эмуляции AI
function getDashboardContextForAI() {
    return `Текущие показатели Москвы (городское хозяйство):
- Открытых заявок в Жилищник: ${currentMetrics.openRequests}
- Среднее время ответа на заявку: ${currentMetrics.avgResponseTime} дня
- Удовлетворённость жителей услугами ЖКХ: ${currentMetrics.satisfaction}%
- Бюджет на ЖКХ за последний месяц: ${currentMetrics.monthlyBudget} млн рублей
- Количество дворников и уборочной техники: ${currentMetrics.streetWorkers} человек
Динамика заявок за последние 12 месяцев: ${requestsData.join(', ')}.
Тренд удовлетворённости (последние 3 месяца): ${satisfactionData.slice(-3).join(' → ')}.`;
}

// Эмуляция ответа AI на основе вопроса и контекста
function simulateAIResponse(question, context) {
    const q = question.toLowerCase();
    const metrics = currentMetrics;
    const satisfactionTrend = satisfactionData.slice(-3);
    const lastSat = satisfactionData[satisfactionData.length-1];
    const prevSat = satisfactionData[satisfactionData.length-2];
    const satChange = lastSat - prevSat;

    // Шаблоны ответов
    if (q.includes('заявк') || q.includes('жалоб') || q.includes('обращени')) {
        return `По состоянию на текущий месяц открыто ${metrics.openRequests} заявок. Среднее время реакции — ${metrics.avgResponseTime} дня. 
Рекомендую усилить контроль в районах с наибольшим числом обращений (ЦАО и ЮАО показывают рост на 12% за квартал). Внедрение автоматического распределения заявок может снизить время ответа до 1.8 дня.`;
    }
    if (q.includes('удовлетвор') || q.includes('довольны')) {
        let trendText = satChange >= 0 ? `увеличилась на ${satChange}%` : `снизилась на ${Math.abs(satChange)}%`;
        return `Уровень удовлетворённости жителей составляет ${metrics.satisfaction}%. За последний месяц он ${trendText}. 
Основные драйверы: уборка дворов (+5% к удовлетворённости) и скорость ликвидации аварий. Рекомендуется запустить опросы в мобильном приложении «Мой район».`;
    }
    if (q.includes('бюджет') || q.includes('расход') || q.includes('деньг')) {
        return `Бюджет на городское хозяйство в этом месяце — ${metrics.monthlyBudget} млн ₽. Рост относительно декабря составил +5%. 
Наибольшая доля расходов — уборка улиц (32%) и капитальный ремонт (28%). Для оптимизации предлагаю пересмотреть контракты на вывоз снега.`;
    }
    if (q.includes('дворник') || q.includes('уборк') || q.includes('чистот')) {
        return `На линиях ежедневно работают ${metrics.streetWorkers} дворников и 340 единиц техники. В зимний период численность увеличивается на 15%. 
Эффективность уборки можно повысить за счёт внедрения маршрутизации на основе данных с датчиков погоды.`;
    }
    if (q.includes('отчёт') || q.includes('анализ') || q.includes('резюме')) {
        return `📊 Краткий аналитический отчёт: 
За месяц открыто ${metrics.openRequests} заявок (-8% к прошлому месяцу). Удовлетворённость держится выше 85%. Бюджет исполнен на 96%. 
Главная проблема — неравномерность нагрузки на дворников в разных округах. Рекомендация: перераспределение ресурсов на основе тепловых карт обращений.`;
    }
    if (q.includes('привет') || q.includes('здравствуй')) {
        return `Здравствуйте! Я ваш помощник по городскому хозяйству. Спрашивайте о заявках, бюджете, уборке или просто нажмите «Сгенерировать отчёт».`;
    }
    // Общий ответ с использованием контекста
    return `На основе данных дашборда: 
- Открыто заявок: ${metrics.openRequests}
- Удовлетворённость: ${metrics.satisfaction}%
- Бюджет месяца: ${metrics.monthlyBudget} млн ₽

Ваш вопрос: «${question}». Для детального анализа рекомендую рассмотреть разбивку по округам (доступно в расширенной версии). 
А пока предлагаю обратить внимание на снижение количества заявок — это позитивный тренд.`;
}

// Генерация отчёта (тоже эмуляция)
function generateDemoReport() {
    const context = getDashboardContextForAI();
    const metrics = currentMetrics;
    let report = `📋 **Аналитический отчёт по городскому хозяйству Москвы**\n\n`;
    report += `1. Общая ситуация: Зафиксировано снижение открытых заявок до ${metrics.openRequests} (-8% за месяц). Удовлетворённость жителей стабильна (${metrics.satisfaction}%).\n`;
    report += `2. Бюджет: Расходы составили ${metrics.monthlyBudget} млн ₽, что в пределах плана. Эффективность затрат на уборку выросла на 3%.\n`;
    report += `3. Рекомендации:\n`;
    report += `   - Увеличить число дворников в вечерние часы в спальных районах (Южное Бутово, Марьино).\n`;
    report += `   - Внедрить чат-бота для приёма заявок — прогнозируемое снижение времени ответа на 1 день.\n`;
    report += `   - Провести анализ удовлетворённости по каждому округу для точечных мер.\n\n`;
    report += `📌 Данные основаны на демонстрационной модели. Для реального внедрения необходима интеграция с источниками.`;
    return report;
}

// Добавление сообщения в чат
function addChatMessage(role, text) {
    const chatDiv = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    const icon = role === 'assistant' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    msgDiv.innerHTML = `${icon}<div class="message-text">${text.replace(/\n/g, '<br>')}</div>`;
    chatDiv.appendChild(msgDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Отправка вопроса пользователя
async function sendUserQuestion() {
    const questionInput = document.getElementById('userQuestion');
    const question = questionInput.value.trim();
    if (!question) return;
    addChatMessage('user', question);
    questionInput.value = '';

    const loading = document.getElementById('loadingIndicator');
    loading.style.display = 'flex';

    // Имитация задержки сети
    setTimeout(() => {
        const context = getDashboardContextForAI();
        const answer = simulateAIResponse(question, context);
        addChatMessage('assistant', answer);
        loading.style.display = 'none';
    }, 600);
}

// Генерация отчёта
async function generateReport() {
    addChatMessage('assistant', '📊 Генерирую аналитический отчёт на основе текущих данных...');
    const loading = document.getElementById('loadingIndicator');
    loading.style.display = 'flex';
    setTimeout(() => {
        const report = generateDemoReport();
        addChatMessage('assistant', report);
        loading.style.display = 'none';
    }, 800);
}

// Обработчики UI
document.getElementById('sendQuestionBtn').addEventListener('click', sendUserQuestion);
document.getElementById('generateReportBtn').addEventListener('click', generateReport);
document.getElementById('userQuestion').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendUserQuestion();
});

// Стартовое сообщение
addChatMessage('assistant', 'Привет! Я встроенный советник (демо-версия). Анализирую данные дашборда без подключения к внешним API. Задавайте любые вопросы о заявках, бюджете, уборке или нажмите "Сгенерировать отчёт".');

// Инициализация графиков и показателей
initCharts();
updateKPIs();