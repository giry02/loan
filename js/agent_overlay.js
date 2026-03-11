const AGENT_OVERLAY_HTML = `
    <!-- [컴포넌트 주입 영역] -->
    <div class="w-full bg-white flex flex-col items-center relative z-20 pb-4 pt-2 cursor-default select-none rounded-t-[20px]"
        id="swipe-area">
        <div class="w-full px-6 h-20 flex items-center justify-center relative">
            <div class="relative w-full flex items-center">
                <!-- 말풍선 배너 (invisible pointer-events-none 사용) -->
                <div class="flex-1 flex items-center bg-[#ebf2ff] h-[60px] rounded-full pl-6 pr-14 -mr-8 opacity-0 relative z-0 shadow-sm border border-white min-w-0 invisible pointer-events-none"
                    id="floating-banner">
                    <button
                        class="w-6 h-6 bg-[#d8e4fc] rounded-full flex-shrink-0 flex items-center justify-center text-[#5031E5] mr-2 hover:bg-white transition-colors pointer-events-auto"
                        onclick="event.stopPropagation(); this.parentElement.classList.add('invisible', 'pointer-events-none')"><i
                            class="w-3.5 h-3.5" data-lucide="x"></i></button>
                    <p class="text-[#1e2a4a] font-bold text-[14px] leading-tight">진행에 어려움이 있으시면<br />상담사 연결이라고 말씀해주세요.</p>
                </div>
                <!-- AI 로봇 아이콘 및 말풍선 -->
                <div class="relative z-10 flex-shrink-0 transition-transform opacity-0" id="robot-container">
                    <div class="w-16 h-16 bg-[#5031E5] rounded-full border-[4px] border-white shadow-lg flex items-center justify-center cursor-default transition-transform">
                        <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24">
                            <line x1="12" x2="12" y1="2" y2="5"></line>
                            <circle cx="12" cy="2" fill="currentColor" r="1.5" stroke="none"></circle>
                            <rect height="15" rx="5" ry="5" width="18" x="3" y="5"></rect>
                            <circle cx="8.5" cy="11.5" fill="currentColor" r="1.5" stroke="none"></circle>
                            <circle cx="15.5" cy="11.5" fill="currentColor" r="1.5" stroke="none"></circle>
                            <path d="M9 16c.5 1 2.5 1 3 1s2.5 0 3-1"></path>
                        </svg>
                        <div
                            class="absolute top-[45%] -left-[2px] w-[3px] h-[6px] bg-blue-200 rounded-l-full animate-pulse">
                        </div>
                        <div
                            class="absolute top-[45%] -right-[2px] w-[3px] h-[6px] bg-blue-200 rounded-r-full animate-pulse">
                        </div>
                    </div>
                    <div class="absolute -top-9 -right-2 bg-[#5031E5] text-white text-[12px] font-bold px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5 animate-float cursor-default whitespace-nowrap z-20 border border-white/20">
                        <span>듣고 있어요!</span>
                        <div class="flex items-center gap-[2px] h-3">
                            <div class="w-[2px] bg-white rounded-full animate-eq-1"></div>
                            <div class="w-[2px] bg-white rounded-full animate-eq-2"></div>
                            <div class="w-[2px] bg-white rounded-full animate-eq-3"></div>
                            <div class="w-[2px] bg-white rounded-full animate-eq-4"></div>
                            <div class="w-[2px] bg-white rounded-full animate-eq-5"></div>
                        </div>
                        <div
                            class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#5031E5]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
