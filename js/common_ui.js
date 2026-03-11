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

    // 5. 타이핑 효과 시작
    let typingTimer;
    let index = 0;

    function type() {
        if (!typingTextEl) return;
        if (index < textToType.length) {
            typingTextEl.innerHTML += textToType.charAt(index);
            index++;
            typingTimer = setTimeout(type, 80);
        } else {
            if (cursorEl) cursorEl.style.display = 'none';
            if (mainContentBody) {
                mainContentBody.classList.remove('opacity-0');
                mainContentBody.classList.add('animate-bounce-up');
            }
            setTimeout(showBottomElements, 300);
        }
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

    // 전역 함수로 노출 (window 객체에 바인딩)
    window.resetMain = function (closeAll = false) {
        clearTimeout(typingTimer);
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
        setTimeout(type, 300);
    };

    window.continueCounseling = function () {
        closeAllModals();
        clearTimeout(typingTimer);
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

    // 초기 시작
    setTimeout(type, 500);
}

// 모달 토글 함수들 삭제됨
