document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const resultDiv = document.querySelector(".result");
    
    form.addEventListener("submit", function() {
        // Show loading message
        if(resultDiv) {
            resultDiv.textContent = "Predicting delay...";
            resultDiv.classList.add("loading");
        }
    });
});
