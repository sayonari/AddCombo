const numbersElement = document.querySelector('.numbers');
const buttons = document.querySelectorAll('.keypad button');
const scoreElement = document.querySelector('.score span');
const timerElement = document.querySelector('.timer span');
const comboElement = document.querySelector('.combo span');
const progressInnerElement = document.querySelector('.progress-inner');

let numbers = generateNumbers();
let score = 0;
let max_count = 800;
let count = 0;
let combo = 0;

function generateNumbers() {
    return [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10)
    ];
}

function updateDisplay() {
    numbersElement.innerHTML = '';
    numbers.forEach((number, index) => {
        const numberElement = document.createElement('div');
        numberElement.textContent = number;
        numberElement.classList.add('number');
        numberElement.style.left = `${index * 25}%`;
        numbersElement.appendChild(numberElement);
    });
}

function checkAnswer(answer) {
    const correctAnswer = (numbers[0] + numbers[1]) % 10;
    return answer === correctAnswer;
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateGame() {
    numbers.shift();
    numbers.push(Math.floor(Math.random() * 10));

    const numberElements = numbersElement.querySelectorAll('.number');

    numberElements.forEach((numberElement, index) => {
        numberElement.style.transform = `translateX(-100%)`;
        numberElement.style.transition = "transform 0.5s ease";
    });

    setTimeout(() => {
        updateDisplay();
    }, 500);

    return Promise.resolve();
}

function handleAnswer(answer) {
    if (checkAnswer(answer)) {
        if(count > 0){
            combo++;
        } else {
            combo = 1;
        }
        count = max_count;
        comboElement.textContent = combo;

        score += Math.round(1 + combo*(count/100)**2);
        updateScore();
        animateProgressBar();
        updateGame();
    }
}



function animateProgressBar() {
    progressInnerElement.style.transition = 'transform 0s';
    progressInnerElement.style.transform = 'scaleX(1)';
    timerElement.textContent = count;

    const interval = setInterval(() => {
        count -= 10;
        if (count <= 0) {
            count = 0;
            clearInterval(interval);
        }
        timerElement.textContent = count;

        progressInnerElement.style.transition = 'transform 0s';
        progressInnerElement.style.transform = 'scaleX('+ count/max_count +')';
    }, 10);
      
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const answer = parseInt(button.textContent, 10);
        handleAnswer(answer);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        const answer = parseInt(event.key, 10);
        handleAnswer(answer);
    }
});

updateDisplay();
