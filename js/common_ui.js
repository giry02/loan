// [공통 UI 스크립트] AICC 멀티모달 프로젝트 전용

// 전역 변수로 모달 요소들 선언 (초기화는 loadAgentOverlay 후 진행)
let searchModal, listeningModal, resultModal, failModal, categoryModal;
let typingTextEl, cursorEl, mainContentBody, floatingBanner, robotContainer, swipeGuide, scrollContainer, spacer;

function initCommonUI(textToType) {
    // 1. 에이전트 오버레이 주입
    if (typeof AGENT_OVERLAY_HTML !== 'undefined') {
        const overlayContainer = document.createElement('div');
        overlayContainer.innerHTML = AGENT_OVERLAY_HTML;
        document.body.appendChild(overlayContainer);
    } else {
        console.warn("AGENT_OVERLAY_HTML is not defined. Make sure agent_overlay.js is included.");
    }

    // 2. 아이콘 초기화 (동적 주입된 아이콘 포함)
    lucide.createIcons();

    // 3. 요소 참조 가져오기
    typingTextEl = document.getElementById('typing-text');
    cursorEl = document.getElementById('cursor');
    mainContentBody = document.getElementById('main-content-body');
    floatingBanner = document.getElementById('floating-banner');
    robotContainer = document.getElementById('robot-container');
    swipeGuide = document.getElementById('swipe-guide');
    scrollContainer = document.getElementById('main-scroll-container');
    spacer = document.getElementById('bottom-spacer');

    searchModal = document.getElementById('search-modal');
    listeningModal = document.getElementById('listening-modal');
    resultModal = document.getElementById('result-modal');
    failModal = document.getElementById('fail-modal');
    categoryModal = document.getElementById('category-modal');

    // 5. TTS 및 부드러운 타이핑 동기화
    let typingTimer;
    let index = 0;
    
    // TTS 속도에 대략적으로 맞춘 타이핑 인터벌 (100ms)
    const TR_INTERVAL = 110;

    function smoothType() {
        if (!typingTextEl) return;
        if (index < textToType.length) {
            typingTextEl.innerHTML += textToType.charAt(index);
            index++;
            typingTimer = setTimeout(smoothType, TR_INTERVAL);
        } else {
            finishTypingUI();
        }
    }

    let isUIFinished = false;
    function finishTypingUI() {
        if (isUIFinished) return;
        isUIFinished = true;
        clearTimeout(typingTimer);
        
        // 아직 다 못 쓴 글자가 있으면 전부 채워서 '마지막 완료 시점' 완벽 동기화
        if (typingTextEl && index < textToType.length) {
            typingTextEl.innerHTML = textToType;
            index = textToType.length;
        }

        if (cursorEl) cursorEl.style.display = 'none';
        if (mainContentBody) {
            mainContentBody.classList.remove('opacity-0');
            mainContentBody.classList.add('animate-bounce-up');
            
            // 바운스가 끝난 후 본문(h2 등) 텍스트를 읽어주도록 대기
            setTimeout(speakMainContent, 500);
        }
        setTimeout(showBottomElements, 300);
    }

    function showBottomElements() {
        if (floatingBanner) {
            floatingBanner.classList.remove('invisible', 'pointer-events-none', 'opacity-0');
            floatingBanner.classList.add('animate-pop-out');
        }
        if (robotContainer) {
            robotContainer.classList.remove('opacity-0');
            robotContainer.classList.add('animate-bounce-up');
        }
    }

    // 가장 자연스러운 한국어 여성 음성을 찾아 반환하는 헬퍼 함수
    function getKoreanVoice() {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;
        
        // 1. Google (가장 자연스러운 온라인 TTS 우선)
        let bestVoice = voices.find(v => v.lang.includes('ko') && v.name.includes('Google'));
        // 2. Microsoft Heami (윈도우 기본 자연스러운 여성 음성)
        if (!bestVoice) bestVoice = voices.find(v => v.lang.includes('ko') && v.name.includes('Heami'));
        if (!bestVoice) bestVoice = voices.find(v => v.lang.includes('ko') && v.name.includes('Yumi'));
        // 3. MacOS Yuna 등 지원되는 암거나 한국어
        if (!bestVoice) bestVoice = voices.find(v => v.lang.includes('ko'));
        
        return bestVoice;
    }

    function speakMainContent() {
        if (!('speechSynthesis' in window)) return;
        if (!mainContentBody) return;
        
        let contentText = "";
        // 화면에 보여지는(바운스 된 요소들) 큰 제목, 설명글 수집
        const els = mainContentBody.querySelectorAll('h2, .mb-8 p, .mb-6 p');
        els.forEach(el => {
            // 안보이는 요소 무시 (display: none 등)
            if (el.offsetParent !== null) {
                contentText += " " + (el.innerText || el.textContent);
            }
        });
        
        if (contentText.trim().length > 0) {
            contentText = contentText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
            const utterance = new SpeechSynthesisUtterance(contentText);
            utterance.lang = 'ko-KR';
            const voice = getKoreanVoice();
            if (voice) utterance.voice = voice;
            
            utterance.rate = 1.15; // 기본 속도보다 약간 빠르게 자연스러운 대화톤
            utterance.pitch = 1.1; // 약간 높은 톤 (친절함)
            
            window.speechSynthesis.speak(utterance);
        }
    }

    // TTS 음성 발화 (상단 타이핑 문구)
    function speakAndType() {
        if (!('speechSynthesis' in window) || !textToType) {
            smoothType();
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToType);
        utterance.lang = 'ko-KR';
        const voice = getKoreanVoice();
        if (voice) utterance.voice = voice;
        
        // 100ms 당 1글자 속도로 타이핑 맞추기 위해 속도 & 피치 조율
        utterance.rate = 1.25; 
        utterance.pitch = 1.1; 
        
        utterance.onstart = function() {
            smoothType();
        };

        utterance.onend = function() {
             // TTS 발음이 끝나면 찰나의 오차 없이 타이핑UI도 마무리
            finishTypingUI();
        };

        utterance.onerror = function(event) {
            console.warn('TTS Error or Blocked:', event);
            if (!isUIFinished) {
                 smoothType();
            }
        };

        window.speechSynthesis.speak(utterance);
        
        // 브라우저 정책으로 소리가 안날 경우를 대비한 fall-back 
        // 0.8초가 지나도 타이핑(index)이 시작 안 됐다면 그냥 시각적으로라도 시작시킴
        setTimeout(() => {
            if (index === 0 && !isUIFinished) {
                smoothType();
            }
        }, 800);
    }

    // 전역 함수로 노출 (window 객체에 바인딩)
    window.resetMain = function (closeAll = false) {
        window.speechSynthesis.cancel();
        clearTimeout(typingTimer);
        isUIFinished = false;
        index = 0;
        if (typingTextEl) typingTextEl.innerHTML = "";
        if (cursorEl) cursorEl.style.display = 'inline-block';
        if (mainContentBody) {
            mainContentBody.classList.add('opacity-0');
            mainContentBody.classList.remove('animate-bounce-up');
        }

        if (floatingBanner) {
            floatingBanner.classList.add('invisible', 'pointer-events-none', 'opacity-0');
            floatingBanner.classList.remove('animate-pop-out');
        }

        if (robotContainer) robotContainer.classList.add('opacity-0');
        if (spacer) spacer.style.height = '0';
        
        if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
        setTimeout(speakAndType, 300);
    };

    window.continueCounseling = function () {
        closeAllModals();
        window.speechSynthesis.cancel();
        clearTimeout(typingTimer);
        isUIFinished = true;
        if (typingTextEl) typingTextEl.innerHTML = textToType;
        if (cursorEl) cursorEl.style.display = 'none';

        if (mainContentBody) {
            mainContentBody.classList.remove('animate-bounce-up');
            mainContentBody.classList.add('opacity-0');
        }

        if (floatingBanner) floatingBanner.classList.add('invisible', 'pointer-events-none', 'opacity-0');
        if (robotContainer) robotContainer.classList.add('opacity-0');
        if (spacer) spacer.style.height = '120px';

        const target = document.getElementById('target-anchor');
        if (scrollContainer && target) {
            scrollContainer.scrollTo({ top: target.offsetTop, behavior: 'auto' });
        }

        setTimeout(() => {
            if (mainContentBody) {
                mainContentBody.classList.remove('opacity-0');
                mainContentBody.classList.add('animate-bounce-up');
            }
            setTimeout(showBottomElements, 300);
        }, 50);
    };

    // 초기 시작 (페이지 진입 시 자동 시도, 브라우저 정책에 의해 막히면 onerror/fallback 발동)
    setTimeout(speakAndType, 500);
}

// 모달 토글 함수들 삭제됨
