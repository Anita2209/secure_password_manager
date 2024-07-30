document.addEventListener("DOMContentLoaded", () => {
    const lengthInput = document.getElementById("length");
    const uppercaseCheckbox = document.getElementById("uppercase");
    const lowercaseCheckbox = document.getElementById("lowercase");
    const symbolsCheckbox = document.getElementById("symbols");
    const numbersCheckbox = document.getElementById("numbers");
    const generateButton = document.getElementById("generator");
    const resultText = document.getElementById("result22");
    const strengthBar = document.getElementById("strength-bar");
    const strengthFeedback = document.getElementById("strength-feedback");
    const savePasswordButton = document.getElementById("savePassword");
    const showSavedDetailsButton = document.getElementById("showSavedDetails");
    const savedDetailsContainer = document.getElementById("savedDetails");
    const themeSwitcher = document.getElementById("themeSwitcher");
    const toast = document.getElementById("toast");
    const clipboardBtn = document.getElementById("clipboard");
    const toggleVisibilityBtn = document.getElementById("toggleVisibility");

    let isPasswordVisible = false;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generatePassword() {
        const length = parseInt(lengthInput.value);
        const includeUppercase = uppercaseCheckbox.checked;
        const includeLowercase = lowercaseCheckbox.checked;
        const includeSymbols = symbolsCheckbox.checked;
        const includeNumbers = numbersCheckbox.checked;

        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";
        const numberChars = "0123456789";

        let allChars = "";
        if (includeUppercase) allChars += uppercaseChars;
        if (includeLowercase) allChars += lowercaseChars;
        if (includeSymbols) allChars += symbolChars;
        if (includeNumbers) allChars += numberChars;

        if (allChars === "") allChars = lowercaseChars;

        let password = "";
        for (let i = 0; i < length; i++) {
            password += allChars[getRandomInt(0, allChars.length - 1)];
        }

        resultText.textContent = password;
        calculateStrength(password);
    }

    function calculateStrength(password) {
        let strength = 0;
        let feedback = '';
    
        const length = password.length;
        if (length >= 12) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[!@#$%^&*(){}[\]=<>/,.]/.test(password)) strength += 1;
    
        const strengthPercentage = (strength / 5) * 100;
    
        // Debugging info
        console.log('Password:', password);
        console.log('Length:', length);
        console.log('Strength Score:', strength);
        console.log('Strength Percentage:', strengthPercentage);
    
        strengthBar.style.width = `${strengthPercentage}%`;
    
        if (strengthPercentage < 50) {
            strengthBar.style.backgroundColor = '#ff4d4d'; // Red
            feedback = 'Weak: Add uppercase letters, symbols, or numbers';
        } else if (strengthPercentage < 70) {
            strengthBar.style.backgroundColor = '#ffcc00'; // Orange
            feedback = 'Medium: Add more symbols or increase length';
        } else {
            strengthBar.style.backgroundColor = '#4caf50'; // Green
            feedback = 'Strong: Good job!';
        }
    
        strengthFeedback.innerText = feedback;
    }

    function savePassword() {
        const appName = document.getElementById("appName").value;
        const username = document.getElementById("username").value;
        const password = resultText.textContent; // Use the generated password

        if (appName && username && password) {
            const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
            savedPasswords.push({ appName, username, password });
            localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));

            showToast("Password saved successfully!");
            document.getElementById("appName").value = "";
            document.getElementById("username").value = "";
        } else {
            showToast("Please fill out all fields.");
        }
    }

    function displaySavedPasswords() {
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
        savedDetailsContainer.innerHTML = ""; // Clear existing entries
        
        if (savedPasswords.length === 0) {
            savedDetailsContainer.innerHTML = "<p>No saved passwords.</p>";
            return;
        }
        
        savedPasswords.forEach(entry => {
            const appName = entry.appName ? entry.appName : '';
            const username = entry.username ? entry.username : '';
            const password = entry.password ? entry.password : '';
            
            if (appName && username && password) {
                const savedPasswordEntry = document.createElement('div');
                savedPasswordEntry.className = 'password-entry';
                savedPasswordEntry.innerHTML = `
                    <div class="details">
                        <span>${appName}</span>
                        <span>${username}</span>
                        <span>${password}</span>
                    </div>
                `;
                savedDetailsContainer.appendChild(savedPasswordEntry);
            }
        });
    }

    function showToast(message) {
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
    }

    function toggleDetailsVisibility() {
        const isVisible = savedDetailsContainer.style.display === "block";
        savedDetailsContainer.style.display = isVisible ? "none" : "block";
        if (!isVisible) {
            displaySavedPasswords(); // Load passwords when the section is shown
        }
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-theme");
    }

    function copyToClipboard() {
        const password = resultText.textContent;

        if (!password) {
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();

        showToast("Password copied to clipboard!");
    }

    function togglePasswordVisibility() {
        isPasswordVisible = !isPasswordVisible;
        resultText.textContent = isPasswordVisible ? resultText.textContent : resultText.textContent.replace(/./g, '•');
    }

    generateButton.addEventListener("click", generatePassword);
    savePasswordButton.addEventListener("click", savePassword);
    showSavedDetailsButton.addEventListener("click", toggleDetailsVisibility);
    themeSwitcher.addEventListener("change", toggleTheme);
    clipboardBtn.addEventListener("click", copyToClipboard);
    toggleVisibilityBtn.addEventListener("click", togglePasswordVisibility);

    // Initial state: savedDetailsContainer is hidden
    savedDetailsContainer.style.display = "none";
});
