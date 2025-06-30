document.addEventListener('DOMContentLoaded', function () {
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const btnGenerate = document.getElementById('btnGenerate');
    const passwordOutput = document.getElementById('passwordOutput');
    const btnCopy = document.getElementById('btnCopy');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const keywordsInput = document.getElementById('keywords');
    const passwordDisplay = document.querySelector('.password-display');

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%*_+-=.<>?';

    // Sistema de Tooltips Aprimorado
    class SmartTooltip {
        constructor(container) {
            this.container = container;
            this.tooltip = container.querySelector('.option-tooltip');
            this.timeout = null;
            this.delay = 3000;

            this.tooltip.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            this.setupEvents();
        }

        setupEvents() {
            this.container.addEventListener('click', () => this.show());
            this.container.addEventListener('mouseenter', () => this.show());
            this.container.addEventListener('mouseleave', () => this.hide());

            document.addEventListener('touchstart', (e) => {
                if (!this.container.contains(e.target)) {
                    this.hide();
                }
            });
        }

        show() {
            if (this.timeout) clearTimeout(this.timeout);

            this.tooltip.style.opacity = '0';
            this.tooltip.style.transform = 'translateY(10px)';
            void this.tooltip.offsetWidth;

            this.tooltip.style.opacity = '1';
            this.tooltip.style.transform = 'translateY(0)';
            this.container.classList.add('show-tooltip');

            this.timeout = setTimeout(() => this.hide(), this.delay);
        }

        hide() {
            if (this.timeout) clearTimeout(this.timeout);

            this.tooltip.style.opacity = '0';
            this.tooltip.style.transform = 'translateY(10px)';

            setTimeout(() => {
                this.container.classList.remove('show-tooltip');
            }, 300);
        }
    }

    // Inicializa todos os tooltips das opções
    document.querySelectorAll('.checkbox-container').forEach(container => {
        new SmartTooltip(container);
    });

    // Event Listeners
    lengthSlider.addEventListener('input', function () {
        lengthValue.textContent = this.value;
        updateStrengthIndicator();
    });

    [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', updateStrengthIndicator);
    });

    btnGenerate.addEventListener('click', generatePassword);
    btnCopy.addEventListener('click', copyPassword);
    passwordDisplay.addEventListener('click', function (e) {
        if (e.target.closest('.btnCopy')) return;
        copyPassword();
    });

    function generatePassword() {
        let chars = '';
        let password = '';
        const keywords = keywordsInput.value.trim();
        let keywordChars = '';

        if (uppercaseCheckbox.checked) chars += uppercaseChars;
        if (lowercaseCheckbox.checked) chars += lowercaseChars;
        if (numbersCheckbox.checked) chars += numberChars;
        if (symbolsCheckbox.checked) chars += symbolChars;

        if (chars === '') {
            chars = uppercaseChars + lowercaseChars + numberChars + symbolChars;
            uppercaseCheckbox.checked = true;
            lowercaseCheckbox.checked = true;
            numbersCheckbox.checked = true;
            symbolsCheckbox.checked = true;
        }

        if (keywords) {
            keywordChars = keywords.split(/\s+/)
                .map(part => part.replace(/[^a-zA-Z0-9]/g, ''))
                .join('')
                .split('')
                .filter(char => chars.includes(char) || chars.includes(char.toLowerCase()) || chars.includes(char.toUpperCase()))
                .join('');
        }

        const passwordLength = parseInt(lengthSlider.value);
        let allChars = [];

        if (uppercaseCheckbox.checked) allChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
        if (lowercaseCheckbox.checked) allChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
        if (numbersCheckbox.checked) allChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
        if (symbolsCheckbox.checked) allChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);

        while (allChars.length < passwordLength) {
            let nextChar;
            let lastChar = allChars.length > 0 ? allChars[allChars.length - 1] : null;
            let isDuplicate;

            do {
                if (keywordChars && Math.random() < 0.8) {
                    const idx = Math.floor(Math.random() * keywordChars.length);
                    nextChar = keywordChars[idx];
                } else {
                    const idx = Math.floor(Math.random() * chars.length);
                    nextChar = chars[idx];
                }

                isDuplicate = lastChar !== null && nextChar.toLowerCase() === lastChar.toLowerCase();

            } while (isDuplicate);

            allChars.push(nextChar);
        }

        password = allChars.sort(() => 0.5 - Math.random()).join('').substring(0, passwordLength);
        passwordOutput.textContent = password;
        updateStrengthIndicator();
    }

    function copyPassword() {
        if (passwordOutput.textContent === 'Clique em "Gerar Senha"') return;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(passwordOutput.textContent)
                .then(showFeedback)
                .catch(fallbackCopy);
        } else {
            fallbackCopy();
        }

        function showFeedback() {
            const copyIcon = btnCopy.querySelector('.copy-icon');
            const checkIcon = btnCopy.querySelector('.check-icon');

            if (copyIcon) {
                copyIcon.style.display = 'none';
            }
            if (checkIcon) {
                checkIcon.style.display = '';
            }

            setTimeout(() => {
                if (checkIcon) {
                    checkIcon.style.display = 'none';
                }
                if (copyIcon) {
                    copyIcon.style.display = '';
                }
            }, 2000);
        }

        function fallbackCopy() {
            const tempInput = document.createElement('input');
            tempInput.value = passwordOutput.textContent;
            tempInput.setAttribute('readonly', '');
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            document.body.appendChild(tempInput);
            tempInput.select();
            tempInput.setSelectionRange(0, 99999);
            let successful = false;
            try {
                successful = document.execCommand('copy');
            } catch (err) { }
            document.body.removeChild(tempInput);
            if (successful) {
                showFeedback();
            } else {
                const originalIconHTML = '<i class="far fa-copy copy-icon"></i><i class="fas fa-check check-icon" style="display: none;"></i>'; // Definir explicitamente para fallback também
                btnCopy.innerHTML = '<i class="fas fa-times"></i>'; // Ícone de erro temporário
                setTimeout(() => {
                    btnCopy.innerHTML = originalIconHTML;
                }, 2000);
            }
        }
    }

    function updateStrengthIndicator() {
        const length = parseInt(lengthSlider.value);
        let strengthScore = 0;

        if (length >= 12) {
            strengthScore += 20;
        } else {
            strengthScore += Math.max(0, (length - 4) / 8 * 20);
        }

        if (uppercaseCheckbox.checked) strengthScore += 20;
        if (lowercaseCheckbox.checked) strengthScore += 20;
        if (numbersCheckbox.checked) strengthScore += 20;
        if (symbolsCheckbox.checked) strengthScore += 20;

        strengthScore = Math.min(100, strengthScore);
        strengthBar.style.width = strengthScore + '%';

        if (strengthScore <= 40) {
            strengthText.textContent = 'Fraca';
            strengthBar.style.background = 'var(--fraca)';
            strengthText.style.color = 'var(--fraca)';
        } else if (strengthScore <= 80) {
            strengthText.textContent = 'Média';
            strengthBar.style.background = 'var(--media)';
            strengthText.style.color = 'var(--media)';
        } else {
            strengthText.textContent = 'Forte';
            strengthBar.style.background = 'var(--forte)';
            strengthText.style.color = 'var(--forte)';
        }
    }

    // Gera uma senha inicial ao carregar
    generatePassword();
});