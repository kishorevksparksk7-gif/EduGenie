document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const askBtn = document.getElementById('ask-btn');
    const quizBtn = document.getElementById('quiz-btn');
    const questionInput = document.getElementById('question-input');
    const topicInput = document.getElementById('topic-input');
    const loadingDiv = document.getElementById('loading');
    const resultSection = document.getElementById('result-section');
    const output = document.getElementById('output');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
        });
    });

    askBtn.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) { alert('Please enter a question!'); return; }
        await sendRequest('/ask', { question }, 'question');
    });

    quizBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        if (!topic) { alert('Please enter a topic!'); return; }
        await sendRequest('/quiz', { topic }, 'topic');
    });

    async function sendRequest(url, body, inputType) {
        loadingDiv.style.display = 'block';
        resultSection.style.display = 'none';
        askBtn.disabled = true;
        quizBtn.disabled = true;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (data.error) {
                output.textContent = 'Error: ' + data.error;
            } else {
                output.textContent = data.answer || data.quiz;
            }
            resultSection.style.display = 'block';
        } catch (error) {
            output.textContent = 'An error occurred: ' + error.message;
            resultSection.style.display = 'block';
        } finally {
            loadingDiv.style.display = 'none';
            askBtn.disabled = false;
            quizBtn.disabled = false;
        }
    }
});