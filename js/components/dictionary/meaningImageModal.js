// ========================================================
// 🖼️ FLASHCARD MEANING IMAGE MODAL & PRESETS
// Module: js/components/dictionary/meaningImageModal.js
// Ceiling: < 350 lines | Role: Image Attachment & Presets
// ========================================================

(function (window) {
    'use strict';

    window.currentImageTargetWordIdx = null;
    window.currentImageTargetMeaningIdx = null;
    let currentModalSelectedImageUrl = '';
    let currentModalSelectedImageTitle = '';

    const meaningImagePresets = {
        'resilient': [
            { url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80', title: 'Mầm xanh kiên cường', tag: 'Tự nhiên / Ý chí' },
            { url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&auto=format&fit=crop&q=80', title: 'Vượt dốc bền bỉ', tag: 'Thể thao / Thử thách' },
            { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', title: 'Hải đăng giữa bão biển', tag: 'Vững vàng trước sóng gió' },
            { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80', title: 'Bật dậy sau cú ngã', tag: 'Phục hồi nhanh' }
        ],
        'serendipity': [
            { url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80', title: 'Tiệm sách ấm cúng', tag: 'Tình cờ tìm thấy' },
            { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80', title: 'Cầu vồng sau mưa bão', tag: 'May mắn bất ngờ' },
            { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', title: 'Duyên gặp dưới ô mưa', tag: 'Duyên kỳ ngộ' }
        ],
        'break the ice': [
            { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80', title: 'Bắt chuyện cởi mở', tag: 'Phá vỡ e ngại' },
            { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80', title: 'Bạn bè cười nói vui vẻ', tag: 'Không khí ấm áp' }
        ]
    };

    function openMeaningImageModal(wordIdx, meaningIdx) {
        window.currentImageTargetWordIdx = wordIdx;
        window.currentImageTargetMeaningIdx = meaningIdx;
        const targetWord = (wordIdx >= 0 && window.stagedWords) ? window.stagedWords[wordIdx] : { word: window.currentActiveWord || 'resilient', meaningVi: 'Kiên cường' };
        if (!targetWord) return;

        const modal = document.getElementById('meaningImageModal');
        if (modal) modal.classList.remove('hidden');
        renderImagePresets(targetWord.word.toLowerCase());
        switchImageModalTab('preset');
    }

    function closeMeaningImageModal() {
        const modal = document.getElementById('meaningImageModal');
        if (modal) modal.classList.add('hidden');
        clearSelectedModalImage();
    }

    function switchImageModalTab(tab) {
        const tabBtnPreset = document.getElementById('tabBtnPreset');
        const tabBtnUpload = document.getElementById('tabBtnUpload');
        const tabBtnUrl = document.getElementById('tabBtnUrl');
        const viewPreset = document.getElementById('imageModalPresetView');
        const viewUpload = document.getElementById('imageModalUploadView');
        const viewUrl = document.getElementById('imageModalUrlView');

        const activeClass = "px-3 py-1.5 rounded-xl bg-[#3C4D00] text-[#D4EE7F] font-bold text-xs";
        const inactiveClass = "px-3 py-1.5 rounded-xl text-[#909283] hover:text-[#E5E3DB] font-bold text-xs";

        if (tabBtnPreset) tabBtnPreset.className = tab === 'preset' ? activeClass : inactiveClass;
        if (tabBtnUpload) tabBtnUpload.className = tab === 'upload' ? activeClass : inactiveClass;
        if (tabBtnUrl) tabBtnUrl.className = tab === 'url' ? activeClass : inactiveClass;

        if (viewPreset) viewPreset.classList.toggle('hidden', tab !== 'preset');
        if (viewUpload) viewUpload.classList.toggle('hidden', tab !== 'upload');
        if (viewUrl) viewUrl.classList.toggle('hidden', tab !== 'url');
    }

    function renderImagePresets(word) {
        const grid = document.getElementById('meaningImagePresetsGrid') || document.getElementById('meaningImagePresetGrid');
        if (!grid) return;
        const presets = meaningImagePresets[word] || meaningImagePresets['resilient'];

        grid.innerHTML = presets.map((p) => {
            const isSelected = (currentModalSelectedImageUrl === p.url);
            return `
            <div onclick="selectImagePreset('${p.url}', '${p.title.replace(/'/g, "\\'")}')" class="group relative rounded-2xl overflow-hidden border ${isSelected ? 'border-2 border-[#B8D166] bg-[#3C4D00]/40' : 'border border-[#46483C] bg-[#20211C]'} p-1.5 transition-all cursor-pointer active:scale-95 shadow-sm">
                <div class="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/40">
                    <img src="${p.url}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span class="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-[#D4EE7F] bg-[#1B1C17]/85 border border-[#46483C] px-1.5 py-0.5 rounded-full">${p.tag}</span>
                </div>
                <span class="text-xs font-semibold text-white block truncate mt-1 px-1">${p.title}</span>
            </div>
            `;
        }).join('');
    }

    function selectImagePreset(url, title) {
        currentModalSelectedImageUrl = url;
        currentModalSelectedImageTitle = title || 'Ảnh từ gợi ý AI';
        updateModalSelectedImageUI();
    }

    function handleMeaningImageFileUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            currentModalSelectedImageUrl = e.target.result;
            currentModalSelectedImageTitle = file.name || 'Ảnh tải lên từ máy';
            const img = document.getElementById('uploadImagePreviewImg');
            const container = document.getElementById('uploadImagePreviewContainer');
            if (img) img.src = currentModalSelectedImageUrl;
            if (container) container.classList.remove('hidden');
            updateModalSelectedImageUI();
        };
        reader.readAsDataURL(file);
    }

    function previewMeaningImageUrl(url) {
        if (!url || !url.startsWith('http')) return;
        currentModalSelectedImageUrl = url;
        currentModalSelectedImageTitle = 'Ảnh từ liên kết URL';
        const img = document.getElementById('urlImagePreviewImg');
        const container = document.getElementById('urlImagePreviewContainer');
        if (img) img.src = url;
        if (container) container.classList.remove('hidden');
        updateModalSelectedImageUI();
    }

    function updateModalSelectedImageUI() {
        const displayBox = document.getElementById('modalSelectedImageDisplay');
        const imgEl = document.getElementById('modalSelectedImageImg');
        const titleEl = document.getElementById('modalSelectedImageTitle');
        const applyBtn = document.getElementById('btnApplyMeaningImage');

        if (currentModalSelectedImageUrl) {
            if (displayBox) displayBox.classList.remove('hidden');
            if (imgEl) imgEl.src = currentModalSelectedImageUrl;
            if (titleEl) titleEl.innerText = currentModalSelectedImageTitle || 'Ảnh đã chọn';
            if (applyBtn) {
                applyBtn.innerText = 'Áp dụng ảnh vào nghĩa';
                applyBtn.classList.remove('opacity-50', 'pointer-events-none');
            }
        } else {
            if (displayBox) displayBox.classList.add('hidden');
            if (applyBtn) {
                applyBtn.innerText = 'Chọn hoặc tải ảnh lên';
                applyBtn.classList.add('opacity-50', 'pointer-events-none');
            }
        }
    }

    function clearSelectedModalImage() {
        currentModalSelectedImageUrl = '';
        currentModalSelectedImageTitle = '';
        updateModalSelectedImageUI();
    }

    function confirmApplyMeaningImage() {
        if (!currentModalSelectedImageUrl) {
            if (typeof showDictToast === 'function') showDictToast('Vui lòng chọn hoặc tải lên 1 ảnh!');
            return;
        }

        if (window.currentImageTargetWordIdx === -2) {
            if (typeof updateManualImagePreview === 'function') updateManualImagePreview(currentModalSelectedImageUrl);
            closeMeaningImageModal();
            return;
        }

        if (window.currentImageTargetWordIdx >= 0 && window.stagedWords && window.stagedWords[window.currentImageTargetWordIdx]) {
            window.stagedWords[window.currentImageTargetWordIdx].image = currentModalSelectedImageUrl;
            if (typeof renderStagedWordsList === 'function') renderStagedWordsList();
            if (typeof showDictToast === 'function') showDictToast('✨ Đã gắn ảnh minh họa thành công!');
        }

        closeMeaningImageModal();
    }

    function previewFullImage(url, word, meaningText) {
        const modal = document.getElementById('fullImagePreviewModal');
        const img = document.getElementById('fullImagePreviewImg');
        const wordEl = document.getElementById('fullImageWordTitle');
        const meaningEl = document.getElementById('fullImageMeaningText');

        if (img) img.src = url;
        if (wordEl) wordEl.innerText = word ? `Từ vựng: ${word}` : 'Ảnh minh họa Flashcard';
        if (meaningEl) meaningEl.innerText = meaningText || '';
        if (modal) modal.classList.remove('hidden');
    }

    function closeFullImagePreview() {
        const modal = document.getElementById('fullImagePreviewModal');
        if (modal) modal.classList.add('hidden');
    }

    // Attach to window
    window.openMeaningImageModal = openMeaningImageModal;
    window.closeMeaningImageModal = closeMeaningImageModal;
    window.switchImageModalTab = switchImageModalTab;
    window.selectImagePreset = selectImagePreset;
    window.selectPresetImage = selectImagePreset;
    window.handleMeaningImageFileUpload = handleMeaningImageFileUpload;
    window.previewMeaningImageUrl = previewMeaningImageUrl;
    window.clearSelectedModalImage = clearSelectedModalImage;
    window.confirmApplyMeaningImage = confirmApplyMeaningImage;
    window.previewFullImage = previewFullImage;
    window.closeFullImagePreview = closeFullImagePreview;

})(window);
