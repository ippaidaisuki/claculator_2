document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.btn');
    const bubbleContainer = document.getElementById('bubble-container');
    
    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let shouldResetDisplay = false;

    // Available images in the images folder
    const images = [
        'gon1.png', 'gon2.png', 'gon3.png', 'gon4.png', 'gon5.png',
        'har1.png', 'har2.png', 'har3.png', 'har4.png', 'har5.png'
    ];

    // Create a floating bubble with a random image
    function spawnBubble() {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random size between 80px and 150px
        const size = Math.floor(Math.random() * 70) + 80;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random horizontal position (0% to 100% minus the size)
        const leftPos = Math.random() * 90;
        bubble.style.left = `${leftPos}%`;
        
        // Select a random image
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const img = document.createElement('img');
        img.src = `images/${randomImage}`;
        
        bubble.appendChild(img);
        bubbleContainer.appendChild(bubble);
        
        // Remove bubble after animation completes (4 seconds)
        setTimeout(() => {
            bubble.remove();
        }, 4000);
    }

    // Trigger confetti effect
    function fireConfetti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }

    // Calculator Logic
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const isNumber = button.classList.contains('number');
            const action = button.dataset.action;
            const number = button.dataset.number;

            // Trigger bubble effect only on number buttons
            if (isNumber) {
                spawnBubble();
                
                if (shouldResetDisplay) {
                    currentInput = number || '.';
                    shouldResetDisplay = false;
                } else {
                    if (number) {
                        currentInput = currentInput === '0' ? number : currentInput + number;
                    } else if (action === 'decimal' && !currentInput.includes('.')) {
                        currentInput += '.';
                    }
                }
                updateDisplay();
            }

            // Operators
            if (action && !isNumber) {
                if (action === 'clear') {
                    currentInput = '0';
                    previousInput = '';
                    operator = null;
                    updateDisplay();
                } else if (action === 'calculate') {
                    if (operator && previousInput) {
                        calculate();
                        operator = null;
                        previousInput = '';
                        shouldResetDisplay = true;
                        updateDisplay();
                        
                        // Fire confetti on equal
                        fireConfetti();
                    }
                } else {
                    // Multiply, divide, add, subtract
                    if (operator && !shouldResetDisplay) {
                        calculate();
                        updateDisplay();
                    }
                    operator = action;
                    previousInput = currentInput;
                    shouldResetDisplay = true;
                }
            }
        });
    });

    function calculate() {
        let result = 0;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case 'add': result = prev + current; break;
            case 'subtract': result = prev - current; break;
            case 'multiply': result = prev * current; break;
            case 'divide': 
                if(current === 0) {
                    result = 'Error'; 
                } else {
                    result = prev / current; 
                }
                break;
            default: return;
        }
        
        // Format to avoid long decimals
        if (typeof result === 'number') {
            currentInput = Math.round(result * 100000000) / 100000000 + '';
        } else {
            currentInput = result;
        }
    }

    function updateDisplay() {
        display.value = currentInput;
    }
});
