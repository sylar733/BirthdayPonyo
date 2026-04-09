// This wrapper ensures the code only runs AFTER the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SETUP & ELEMENTS
    // ==========================================
    const storyText = "Hello... You have been summoned to a very special place. The Frog, the Bunny, and the Owl are waiting for you. Are you ready for your birthday quest?";
    
    const textBox = document.getElementById('text-content');
    const proceedBtn = document.getElementById('proceed-btn');
    const clickPrompt = document.getElementById('click-prompt');
    const introScene = document.getElementById('intro-scene');
    const swampScene = document.getElementById('swamp-scene');
    const bunnyScene = document.getElementById('bunny-scene');
    const owlScene = document.getElementById('owl-scene');
    const birthdayScene = document.getElementById('birthday-scene');

    let isTyping = false;
    let index = 0;

    // ==========================================
    // 2. SCENE 1: INTRO (TYPING EFFECT)
    // ==========================================
    document.addEventListener('click', function(e) {
        // Stop if user clicks a button/input instead of the background
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('diff-btn')) return;

        if (!isTyping && index === 0) {
            isTyping = true;
            if (clickPrompt) clickPrompt.style.display = 'none';
            typeWriter(); 
        }
    });

    function typeWriter() {
        if (index < storyText.length) {
            textBox.innerHTML += storyText.charAt(index);
            index++;
            setTimeout(typeWriter, 50); 
        } else {
            isTyping = false;
            if (proceedBtn) proceedBtn.classList.remove('hidden');
        }
    }

    if (proceedBtn) {
        proceedBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            introScene.classList.add('hidden');
            swampScene.classList.remove('hidden');
            document.body.classList.add('swamp-bg'); 
        });
    }

    // ==========================================
    // 3. SCENE 2: THE SWAMP GAME
    // ==========================================
    const fakeFrogs = document.querySelectorAll('.fake-frog');
    const realFrog = document.querySelector('.real-frog');
    const swampMessageBox = document.getElementById('swamp-message-box');
    const swampText = document.getElementById('swamp-text');
    const nextLevelBtn = document.getElementById('next-level-btn');

    fakeFrogs.forEach(frog => {
        frog.addEventListener('click', () => {
            swampMessageBox.classList.remove('hidden');
            swampText.innerText = "*Ribbit!* I'm just a normal frog! Keep looking!";
            swampText.style.color = "#ff4757"; 
            setTimeout(() => { swampMessageBox.classList.add('hidden'); }, 2000);
        });
    });

    if (realFrog) {
        realFrog.addEventListener('click', () => {
            fakeFrogs.forEach(f => f.classList.add('pop-out'));
            realFrog.style.transition = "all 1s ease";
            realFrog.style.top = "30%";
            realFrog.style.left = "45%";
            realFrog.style.transform = "scale(2)";

            setTimeout(() => {
                swampMessageBox.classList.remove('hidden');
                swampText.innerText = "You found me! I have been guarding the letter 'U'. Take it, and find the others!";
                swampText.style.color = "#2ed573"; 
                if (nextLevelBtn) nextLevelBtn.classList.remove('hidden');
            }, 1000);
        });
    }

    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', () => {
            swampScene.classList.add('hidden');
            bunnyScene.classList.remove('hidden');
            document.body.className = 'meadow-bg'; 
        });
    }

    // ==========================================
    // 4. SCENE 3: BUNNY BOOP GAME
    // ==========================================
    let bunnyScore = 0;
    let bunnyTimer;
    let popSpeed = 3000; 
    const targetScore = 5;

    const difficultyScreen = document.getElementById('difficulty-screen');
    const bunnyGameArea = document.getElementById('bunny-game-area');
    const scoreDisplay = document.getElementById('bunny-score');
    const bunnyMessageBox = document.getElementById('bunny-message-box');
    const bunnyText = document.getElementById('bunny-text');
    const finishBtn = document.getElementById('finish-btn');

    // CRITICAL: We attach this to 'window' so your HTML onclick works!
    window.setDifficulty = function(level) {
        difficultyScreen.classList.add('hidden');
        bunnyGameArea.classList.remove('hidden');
        if (level === 'hard') popSpeed = 1000; 
        else if (level === 'normal') popSpeed = 3000; 
        else if (level === 'easy') popSpeed = 0; 
        setTimeout(popUpBunny, 1000);
    };

    function popUpBunny() {
        if (bunnyScore >= targetScore) return; 
        document.querySelectorAll('.bunny').forEach(b => b.classList.add('hidden'));
        const holes = document.querySelectorAll('.hole');
        const randomIdx = Math.floor(Math.random() * holes.length);
        const bunny = holes[randomIdx].querySelector('.bunny');
        
        if (bunny) {
            bunny.classList.remove('hidden');
            clearTimeout(bunnyTimer);
            if (popSpeed > 0) {
                bunnyTimer = setTimeout(() => {
                    bunny.classList.add('hidden');
                    if (bunnyScore < targetScore) popUpBunny(); 
                }, popSpeed);
            }
        }
    }

    document.querySelectorAll('.bunny').forEach(bunny => {
        bunny.addEventListener('click', function(event) {
            event.stopPropagation();
            if (bunnyScore >= targetScore || this.classList.contains('bonked')) return;
            
            bunnyScore++;
            scoreDisplay.innerText = `Score: ${bunnyScore} / 5`;
            clearTimeout(bunnyTimer);
            this.classList.add('bonked');

            setTimeout(() => {
                this.classList.add('hidden');
                this.classList.remove('bonked');
                if (bunnyScore === targetScore) {
                    bunnyGameArea.classList.add('hidden'); 
                    bunnyMessageBox.classList.remove('hidden');
                    bunnyText.innerText = "*Thump thump!* You are too fast! Here is the letter 'T'. The Wizard Owl is waiting for you next!";
                    bunnyText.style.color = "#ff9ff3";
                    setTimeout(() => finishBtn.classList.remove('hidden'), 1000);
                } else {
                    setTimeout(popUpBunny, 500);
                }
            }, 400); 
        });
    });

    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
            bunnyScene.classList.add('hidden');
            owlScene.classList.remove('hidden');
            document.body.className = 'night-forest-bg';
        });
    }

    // ==========================================
    // 5. SCENE 4: OWL WORDLE GAME
    // ==========================================
    const targetWord = "MAGIC"; 
    let currentAttempt = 0;
    const maxAttempts = 6;
    const wordleGrid = document.getElementById('wordle-grid');
    const wordleInput = document.getElementById('wordle-input');
    const wordleSubmit = document.getElementById('wordle-submit');
    const owlDialogue = document.getElementById('owl-dialogue');
    const finishBtnFinal = document.getElementById('finish-btn-final');

    if (wordleGrid) {
        for (let i = 0; i < maxAttempts * 5; i++) {
            const box = document.createElement('div');
            box.classList.add('wordle-box');
            box.id = `box-${i}`;
            wordleGrid.appendChild(box);
        }
    }

    if (wordleSubmit) {
        wordleSubmit.addEventListener('click', () => {
            if (currentAttempt >= maxAttempts) return;
            let guess = wordleInput.value.toUpperCase();
            
            if (guess.length !== 5) {
                owlDialogue.innerText = "Hoot! Your spell must be 5 letters long!";
                owlDialogue.style.color = "#e74c3c"; 
                return;
            }

            for (let i = 0; i < 5; i++) {
                const box = document.getElementById(`box-${currentAttempt * 5 + i}`);
                box.innerText = guess[i];
                if (guess[i] === targetWord[i]) box.classList.add('correct'); 
                else if (targetWord.includes(guess[i])) box.classList.add('present'); 
                else box.classList.add('absent');  
            }

            currentAttempt++;
            wordleInput.value = ""; 

            if (guess === targetWord) {
                owlDialogue.innerText = "Hoot! You are truly magical! Here is the letter 'E'. Quest Complete!";
                owlDialogue.style.color = "#2ecc71"; 
                wordleInput.disabled = true;
                wordleSubmit.disabled = true;
                finishBtnFinal.classList.remove('hidden');
            } else if (currentAttempt === maxAttempts) {
                owlDialogue.innerText = "Hoot! Resetting board...";
                setTimeout(() => {
                    currentAttempt = 0;
                    document.querySelectorAll('.wordle-box').forEach(b => { 
                        b.innerText = ""; 
                        b.className = "wordle-box"; 
                    });
                    owlDialogue.innerText = "Try again!";
                }, 2000);
            }
        });
    }

    if (finishBtnFinal) {
        finishBtnFinal.addEventListener('click', () => {
            owlScene.classList.add('hidden');
            birthdayScene.classList.remove('hidden');
            document.body.className = 'birthday-bg';
        });
    }

    // ==========================================
    // 6. SCENE 5: RESTART
    // ==========================================
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            location.reload(); 
        });
    }
});