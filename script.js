// ===== BIRTHDAY CELEBRATION SCRIPT =====

(function() {
    'use strict';

    // ===== AUDIO SYSTEM =====
    let audioCtx = null;
    let isMusicPlaying = false;
    let musicNodes = [];
    let musicTimer = null;
    let musicGainNode = null;
    let noButtonMoves = 0;

    // Happy birthday melody
    const birthdayMelody = [
        { freq: 392.00, dur: 0.4 },
        { freq: 392.00, dur: 0.4 },
        { freq: 440.00, dur: 0.8 },
        { freq: 392.00, dur: 0.8 },
        { freq: 523.25, dur: 0.8 },
        { freq: 493.88, dur: 1.2 },
        { freq: 392.00, dur: 0.4 },
        { freq: 392.00, dur: 0.4 },
        { freq: 440.00, dur: 0.8 },
        { freq: 392.00, dur: 0.8 },
        { freq: 587.33, dur: 0.8 },
        { freq: 523.25, dur: 1.2 },
        { freq: 392.00, dur: 0.4 },
        { freq: 392.00, dur: 0.4 },
        { freq: 659.25, dur: 0.8 },
        { freq: 587.33, dur: 0.4 },
        { freq: 523.25, dur: 0.4 },
        { freq: 493.88, dur: 0.4 },
        { freq: 440.00, dur: 1.2 },
        { freq: 440.00, dur: 0.4 },
        { freq: 523.25, dur: 0.4 },
        { freq: 587.33, dur: 0.8 },
        { freq: 523.25, dur: 0.8 },
        { freq: 493.88, dur: 1.2 },
        { freq: 392.00, dur: 0.8 },
        { freq: 440.00, dur: 1.6 }
    ];

    function initAudio() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                musicGainNode = audioCtx.createGain();
                musicGainNode.connect(audioCtx.destination);
                musicGainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            } catch (e) {
                console.warn('Web Audio not supported');
                return false;
            }
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return true;
    }

    function stopAllMusic() {
        if (musicTimer) {
            clearTimeout(musicTimer);
            musicTimer = null;
        }
        musicNodes.forEach(node => {
            try {
                if (node && node.stop) node.stop();
            } catch (e) {}
        });
        musicNodes = [];
        isMusicPlaying = false;
        updateMusicButton();
    }

    function playMusic() {
        if (!initAudio()) return;
        
        stopAllMusic();
        
        isMusicPlaying = true;
        updateMusicButton();
        
        let time = audioCtx.currentTime + 0.1;
        
        birthdayMelody.forEach((note) => {
            const osc = audioCtx.createOscillator();
            const noteGain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, time);
            
            noteGain.gain.setValueAtTime(0.15, time);
            noteGain.gain.exponentialRampToValueAtTime(0.001, time + note.dur);
            
            osc.connect(noteGain);
            noteGain.connect(musicGainNode);
            
            osc.start(time);
            osc.stop(time + note.dur + 0.05);
            musicNodes.push(osc);
            
            time += note.dur;
        });
        
        const totalDuration = birthdayMelody.reduce((acc, note) => acc + note.dur, 0) + 1;
        
        musicTimer = setTimeout(() => {
            if (isMusicPlaying) {
                playMusic();
            }
        }, totalDuration * 1000);
    }

    function updateMusicButton() {
        const btn = document.getElementById('musicControlBtn');
        if (btn) {
            btn.textContent = isMusicPlaying ? 'Pause Music' : 'Play Music';
        }
    }

    // ===== INTRO OVERLAY =====
    function setupIntroOverlay() {
        const introOverlay = document.getElementById('introOverlay');
        const startBtn = document.getElementById('startBtn');
        
        if (startBtn && introOverlay) {
            startBtn.addEventListener('click', function() {
                introOverlay.style.display = 'none';
                playMusic();
                createConfetti();
            });
        }
    }

    // ===== PRIVATE MESSAGE TOGGLE =====
    function setupMessageToggle() {
        const toggleBtn = document.getElementById('toggleMessageBtn');
        const privateMsg = document.getElementById('privateMessage');
        const closeBtn = privateMsg ? privateMsg.querySelector('.close-overlay') : null;
        
        if (toggleBtn && privateMsg) {
            toggleBtn.addEventListener('click', function() {
                privateMsg.style.display = 'block';
            });
        }
        
        if (closeBtn && privateMsg) {
            closeBtn.addEventListener('click', function() {
                privateMsg.style.display = 'none';
            });
        }
        
        if (privateMsg) {
            privateMsg.addEventListener('click', function(e) {
                if (e.target === privateMsg) {
                    privateMsg.style.display = 'none';
                }
            });
        }
    }

    // ===== WISH POPUP =====
    function setupWishPopup() {
        const wishBtn = document.getElementById('wishBtn');
        const wishPopup = document.getElementById('wishPopup');
        const closePopup = wishPopup ? wishPopup.querySelector('.close-popup') : null;
        const wishDone = wishPopup ? wishPopup.querySelector('.btn-wish-done') : null;
        
        if (wishBtn && wishPopup) {
            wishBtn.addEventListener('click', function() {
                wishPopup.style.display = 'block';
                createConfetti();
            });
        }
        
        if (closePopup && wishPopup) {
            closePopup.addEventListener('click', function() {
                wishPopup.style.display = 'none';
            });
        }
        
        if (wishDone && wishPopup) {
            wishDone.addEventListener('click', function() {
                wishPopup.style.display = 'none';
                createConfetti();
            });
        }
    }

    // ===== LETTER MODALS =====
    function setupLetterModals() {
        const letterCards = document.querySelectorAll('.letter-card');
        const letterModals = {
            1: document.getElementById('letterModal1'),
            2: document.getElementById('letterModal2'),
            3: document.getElementById('letterModal3'),
            4: document.getElementById('letterModal4')
        };
        
        letterCards.forEach(card => {
            card.addEventListener('click', function() {
                const letterNum = this.getAttribute('data-letter');
                const modal = letterModals[letterNum];
                
                if (modal) {
                    modal.classList.add('show');
                    
                    // Close button
                    const closeBtn = modal.querySelector('.close-letter-modal');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', function() {
                            modal.classList.remove('show');
                        });
                    }
                    
                    // Close on outside click
                    modal.addEventListener('click', function(e) {
                        if (e.target === modal) {
                            modal.classList.remove('show');
                        }
                    });
                }
            });
        });
    }

    // ===== DINNER INVITATION WITH LOOPING NO BUTTON =====
    function setupDinnerInvitation() {
        const yesBtn = document.getElementById('dinnerYes');
        const noBtn = document.getElementById('dinnerNo');
        const response = document.getElementById('dinnerResponse');
        
        if (yesBtn && response) {
            yesBtn.addEventListener('click', function() {
                response.innerHTML = 'That makes me so happy! I cannot wait to celebrate with you. I will plan something special.';
                createConfetti();
                if (noBtn) noBtn.style.display = 'none';
            });
        }
        
        if (noBtn && response) {
            noBtn.addEventListener('click', function(e) {
                e.preventDefault();
                noButtonMoves++;
                
                const randomX = Math.random() * 200 - 100;
                const randomY = Math.random() * 200 - 100;
                noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
                
                const funnyResponses = [
                    'Are you sure? Think again!',
                    'The button seems to be moving away...',
                    'You really want to say no?',
                    'The yes button is right there!',
                    'I think you meant to click yes!',
                    'This button doesn\'t want to be clicked!'
                ];
                
                response.innerHTML = funnyResponses[noButtonMoves % funnyResponses.length];
                
                if (noButtonMoves >= 5) {
                    noBtn.style.transform = 'scale(0.3)';
                    response.innerHTML = 'Just click yes already! I promise it will be amazing!';
                }
                
                if (noButtonMoves >= 8) {
                    noBtn.style.display = 'none';
                    response.innerHTML = 'There is no escape! The answer is yes!';
                }
            });
            
            noBtn.addEventListener('mouseenter', function() {
                if (noButtonMoves > 0) {
                    const randomX = Math.random() * 300 - 150;
                    const randomY = Math.random() * 300 - 150;
                    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
                }
            });
        }
    }

    // ===== CONFETTI SYSTEM =====
    function createConfetti() {
        const container = document.getElementById('confettiContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        const colors = ['#b388c9', '#c9a0dc', '#d4b8e0', '#e8d5f0', '#9b59b6', '#8e44ad', '#f0e0f0'];
        const confettiCount = 150;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 8 + 4 + 'px';
            confetti.style.height = Math.random() * 8 + 4 + 'px';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            
            container.appendChild(confetti);
        }
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 6000);
    }

    // ===== LOVE SYSTEM =====
    function showLove() {
        const loveContainer = document.getElementById('loveContainer');
        if (!loveContainer) return;
        
        loveContainer.style.display = 'block';
        createConfetti();
        
        const closeBtn = loveContainer.querySelector('.close-overlay');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                loveContainer.style.display = 'none';
            });
        }
        
        loveContainer.addEventListener('click', function(e) {
            if (e.target === loveContainer) {
                loveContainer.style.display = 'none';
            }
        });
    }

    // ===== MEMORY SYSTEM =====
    function showMemory() {
        const memoryContainer = document.getElementById('memoryContainer');
        if (!memoryContainer) return;
        
        memoryContainer.style.display = 'block';
        
        const closeBtn = memoryContainer.querySelector('.close-overlay');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                memoryContainer.style.display = 'none';
            });
        }
        
        memoryContainer.addEventListener('click', function(e) {
            if (e.target === memoryContainer) {
                memoryContainer.style.display = 'none';
            }
        });
    }

    // ===== PHOTO INTERACTIONS =====
    function setupPhotoInteractions() {
        const photos = document.querySelectorAll('.photo-frame');
        
        photos.forEach(photo => {
            photo.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // ===== INITIALIZATION =====
    function init() {
        setupIntroOverlay();
        setupMessageToggle();
        setupPhotoInteractions();
        setupLetterModals();
        setupDinnerInvitation();
        setupWishPopup();
        
        const musicBtn = document.getElementById('musicControlBtn');
        if (musicBtn) {
            musicBtn.addEventListener('click', function() {
                if (isMusicPlaying) {
                    stopAllMusic();
                } else {
                    playMusic();
                }
            });
        }
        
        const confettiBtn = document.getElementById('confettiBtn');
        if (confettiBtn) {
            confettiBtn.addEventListener('click', createConfetti);
        }
        
        const heartBtn = document.getElementById('heartBtn');
        if (heartBtn) {
            heartBtn.addEventListener('click', showLove);
        }
        
        const memoryBtn = document.getElementById('memoryBtn');
        if (memoryBtn) {
            memoryBtn.addEventListener('click', showMemory);
        }
        
        console.log('Birthday celebration initialized!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();