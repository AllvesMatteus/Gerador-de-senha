function generatePassword() {
    let baseWords = document.getElementById("baseWords").value.trim();
    let length = parseInt(document.getElementById("length").value);
    let includeUppercase = document.getElementById("includeUppercase").checked;
    let includeNumbers = document.getElementById("includeNumbers").checked;
    let includeSpecial = document.getElementById("includeSpecial").checked;
    let onlyNumbers = document.getElementById("onlyNumbers").checked;

    let lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    let uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let specialChars = "!@#$%&*-_=+:,./";

    let allChars = onlyNumbers ? numbers : lowercaseLetters;
    if (!onlyNumbers) {
        if (includeUppercase) allChars += uppercaseLetters;
        if (includeNumbers) allChars += numbers;
        if (includeSpecial) allChars += specialChars;
    }

    if (onlyNumbers) {
        baseWords = "";
    }

    let password = "";

    if (!onlyNumbers && baseWords.length > 0) {
        password = transformBaseWords(baseWords, includeUppercase, includeNumbers, includeSpecial);
    }

    while (password.length < length) {
        let newChar = allChars[Math.floor(Math.random() * allChars.length)];
        if (
            password.length >= 2 &&
            password[password.length - 1] === newChar &&
            password[password.length - 2] === newChar &&
            password[password.length - 3] === newChar
        ) {
            continue;
        }
        password += newChar;
    }

    password = shuffleString(password.substring(0, length));

    document.getElementById("password").textContent = password;
}

function transformBaseWords(words, includeUppercase, includeNumbers, includeSpecial) {
    let replacements = {
        'a': ['4', '@'], 'A': ['@', '4'],
        'e': ['3'], 'E': ['3'],
        'i': ['1', '!'], 'I': ['!', '1'],
        'o': ['0'], 'O': ['0'],
        's': ['$', '5'], 'S': ['5', '$'],
        'g': ['9', 'G'], 't': ['7', 'T']
    };

    let transformed = words.replace(/\s+/g, '').split("").map(char => {
        if (replacements[char]) {
            let options = replacements[char];

            if (!includeNumbers) options = options.filter(c => isNaN(c));
            if (!includeSpecial) options = options.filter(c => /^[a-zA-Z0-9]+$/.test(c));

            let newChar = options.length > 0 ? options[Math.floor(Math.random() * options.length)] : char;
            return includeUppercase ? newChar : newChar.toLowerCase();
        }

        return includeUppercase ? char : char.toLowerCase();
    }).join("");

    return shuffleString(transformed);
}

function shuffleString(str) {
    return str.split("").sort(() => Math.random() - 0.5).join("");
}

function copyPassword() {
    const passwordText = document.getElementById("password").textContent;

    if (passwordText === "Clique em \"Gerar Senha\"") {
        alert("Gere uma senha primeiro!");
        return;
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(passwordText)
            .then(() => {
                showCopyFeedback();
            })
            .catch(() => {
                if (!fallbackCopyTextToClipboard(passwordText)) {
                    alert("Erro ao copiar a senha. Tente novamente.");
                } else {
                    showCopyFeedback();
                }
            });
    } else {
        if (!fallbackCopyTextToClipboard(passwordText)) {
            alert("Erro ao copiar a senha. Tente novamente.");
        } else {
            showCopyFeedback();
        }
    }

    function showCopyFeedback() {
        const passwordDiv = document.getElementById("password");
        passwordDiv.textContent = "Senha copiada!";
        setTimeout(() => {
            passwordDiv.textContent = passwordText;
        }, 2000);
    }
}

function evaluatePasswordStrength() {
    const length = parseInt(document.getElementById("length").value);
    const strengthLabel = document.getElementById("strength-label");
    const strengthDiv = document.getElementById("password-strength");

    if (length < 7) {
        strengthLabel.textContent = "RUIM";
        strengthDiv.style.color = "red";
    } else if (length >= 8 && length <= 9) {
        strengthLabel.textContent = "BOA";
        strengthDiv.style.color = "yellow";
    } else if (length >= 10 && length <= 11) {
        strengthLabel.textContent = "MUITO BOA";
        strengthDiv.style.color = "green";
    } else if (length >= 12) {
        strengthLabel.textContent = "EXCELENTE";
        strengthDiv.style.color = "purple";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const wordElement = document.getElementById("dynamic-word");
    const originalWord = "Senha";
    let currentWord = originalWord;
    let index = originalWord.length - 1;
    let addingAsterisks = true;

    function updateWord() {
        if (addingAsterisks) {
            currentWord = currentWord.substring(0, index) + "*".repeat(originalWord.length - index);
            index--;
            if (index < 0) {
                addingAsterisks = false;
                index = 0;
            }
        } else {
            currentWord = originalWord.substring(0, index + 1) + "*".repeat(originalWord.length - index - 1);
            index++;
            if (index >= originalWord.length) {
                addingAsterisks = true;
                index = originalWord.length - 1;
            }
        }

        wordElement.textContent = currentWord;
    }

    setInterval(updateWord, 400);
});