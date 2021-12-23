async function newQuestionFormHandler (event) {
    event.preventDefault();

    const title = document.querySelector('input[name="question-title"]').value;
    const content = document.querySelector('textarea[name="question-content"]').value;

    const response = await fetch('/api/questions', {
        method: 'POST',
        body: JSON.stringify({
            title,
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard')
    } else {
        alert(response.statusText)
    }
}

document.querySelector('#new-question-form').addEventListener('submit', newQuestionFormHandler);