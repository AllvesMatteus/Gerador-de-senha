function generatePassword() {
    let baseWords = document.getElementById("baseWords").value.trim();
    let length = parseInt(document.getElementById("length").value);
    let includeUppercase = document.getElementById("includeUppercase").checked;
    let includeNumbers = document.getElementById("includeNumbers").checked;
    let includeSpecial = document.getElementById("includeSpecial").checked;

    let lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    let uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let specialChars = "!@#$%^&*-_=+;:,.?/";

    let allChars = lowercaseLetters;
    if (includeUppercase) allChars += uppercaseLetters;
    if (includeNumbers) allChars += numbers;
    if (includeSpecial) allChars += specialChars;

    let password = "";

    if (baseWords.length > 0) {
        password = transformBaseWords(baseWords, includeUppercase, includeNumbers, includeSpecial);
    }

    while (password.length < length) {
        let newChar;
        do {
            newChar = allChars[Math.floor(Math.random() * allChars.length)];
        } while (password.includes(newChar) || (password.length > 0 && newChar === password[password.length - 1]));
        password += newChar;
    }


    password = shuffleString(password.substring(0, length));

    document.getElementById("password").textContent = password;
}

function transformBaseWords(words, includeUppercase, includeNumbers, includeSpecial) {
    let replacements = {
        'a': ['4', '@'], 'A': ['@', '4'],
        'e': ['3', '€'], 'E': ['€', '3'],
        'i': ['1', '!'], 'I': ['!', '1'],
        'o': ['0', 'Ø'], 'O': ['Ø', '0'],
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
        }, 1000);
    }
}