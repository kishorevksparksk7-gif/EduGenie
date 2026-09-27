document.addEventListener('DOMContentLoaded', function() {
    var askBtn = document.getElementById('ask-btn');
    var quizBtn = document.getElementById('quiz-btn');
    var questionInput = document.getElementById('question-input');
    var topicInput = document.getElementById('topic-input');
    var loadingDiv = document.getElementById('loading');
    var resultSection = document.getElementById('result-section');
    var output = document.getElementById('output');
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');

    // Tab switching
    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            tabContents.forEach(function(c) { c.classList.remove('active'); });
            btn.classList.add('active');
            var tabId = btn.getAttribute('data-tab');
            var content = document.getElementById(tabId + '-tab');
            if (content) {
                content.classList.add('active');
            }
        });
    });

    // Ask a Question
    if (askBtn) {
        askBtn.addEventListener('click', function() {
            var question = questionInput.value.trim();
            if (!question) {
                alert('Please enter a question!');
                return;
            }
            sendRequest('/ask', { question: question });
        });
    }

    // Generate Quiz
    if (quizBtn) {
        quizBtn.addEventListener('click', function() {
            var topic = topicInput.value.trim();
            if (!topic) {
                alert('Please enter a topic!');
                return;
            }
            sendRequest('/quiz', { topic: topic });
        });
    }

    function sendRequest(url, body) {
        loadingDiv.style.display = 'block';
        resultSection.style.display = 'none';
        if (askBtn) askBtn.disabled = true;
        if (quizBtn) quizBtn.disabled = true;

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.error) {
                output.textContent = 'Error: ' + data.error;
            } else {
                output.textContent = data.answer || data.quiz;
            }
            resultSection.style.display = 'block';
        })
        .catch(function(error) {
            output.textContent = 'An error occurred: ' + error.message;
            resultSection.style.display = 'block';
        })
        .finally(function() {
            loadingDiv.style.display = 'none';
            if (askBtn) askBtn.disabled = false;
            if (quizBtn) quizBtn.disabled = false;
        });
    }
});