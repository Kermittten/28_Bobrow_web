window.appCommon = {
    showLoading: function() {
        document.getElementById('loading-overlay')?.classList.remove('hidden');
    },
    hideLoading: function() {
        document.getElementById('loading-overlay')?.classList.add('hidden');
    },
    displayError: function(elementId, error) {
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
};