document.addEventListener('DOMContentLoaded', function() {
    const result = document.getElementById('resultValue');
    if (result.textContent.trim() !== '0 MINUTES') {
        result.parentElement.classList.add('visible');
    }
});