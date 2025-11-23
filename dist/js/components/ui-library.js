// Professional UI Component Library
// Reusable components for consistency and speed

/**
 * UI Library - Card Components
 */
class UICard {
    static render(config = {}) {
        const {
            title = '',
            subtitle = '',
            icon = '',
            content = '',
            footer = '',
            className = '',
            onClick = null,
            style = ''
        } = config;

        const clickHandler = onClick ? `onclick="${onClick}"` : '';
        const clickClass = onClick ? 'clickable' : '';

        return `
            <div class="ui-card ${className} ${clickClass}" ${clickHandler} style="${style}">
                ${title || icon ? `
                    <div class="ui-card-header">
                        ${icon ? `<span class="ui-card-icon">${icon}</span>` : ''}
                        <div class="ui-card-title-group">
                            ${title ? `<h3 class="ui-card-title">${title}</h3>` : ''}
                            ${subtitle ? `<p class="ui-card-subtitle">${subtitle}</p>` : ''}
                        </div>
                    </div>
                ` : ''}
                ${content ? `<div class="ui-card-content">${content}</div>` : ''}
                ${footer ? `<div class="ui-card-footer">${footer}</div>` : ''}
            </div>
        `;
    }

    static statsCard(config = {}) {
        const {
            label = '',
            value = '',
            change = null,
            icon = '',
            trend = 'neutral', // 'up', 'down', 'neutral'
            className = ''
        } = config;

        const trendClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
        const trendIcon = change > 0 ? '📈' : change < 0 ? '📉' : '➖';

        return `
            <div class="ui-stats-card ${className}">
                <div class="stats-header">
                    ${icon ? `<span class="stats-icon">${icon}</span>` : ''}
                    <span class="stats-label">${label}</span>
                </div>
                <div class="stats-value">${value}</div>
                ${change !== null ? `
                    <div class="stats-change ${trendClass}">
                        <span class="change-icon">${trendIcon}</span>
                        <span class="change-value">${Math.abs(change).toFixed(2)}%</span>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

/**
 * UI Library - Button Components
 */
class UIButton {
    static render(config = {}) {
        const {
            label = 'Button',
            icon = '',
            variant = 'primary', // primary, secondary, danger, success, ghost
            size = 'md', // sm, md, lg
            onClick = null,
            disabled = false,
            className = '',
            fullWidth = false
        } = config;

        const clickHandler = onClick ? `onclick="${onClick}"` : '';
        const widthClass = fullWidth ? 'full-width' : '';
        const disabledAttr = disabled ? 'disabled' : '';

        return `
            <button
                class="ui-btn ui-btn-${variant} ui-btn-${size} ${className} ${widthClass}"
                ${clickHandler}
                ${disabledAttr}
            >
                ${icon ? `<span class="btn-icon">${icon}</span>` : ''}
                <span class="btn-label">${label}</span>
            </button>
        `;
    }

    static group(buttons = [], className = '') {
        return `
            <div class="ui-btn-group ${className}">
                ${buttons.join('')}
            </div>
        `;
    }
}

/**
 * UI Library - Modal Components
 */
class UIModal {
    static render(config = {}) {
        const {
            id = 'modal',
            title = '',
            content = '',
            footer = '',
            size = 'md', // sm, md, lg, xl, full
            closeButton = true,
            onClose = null
        } = config;

        const closeHandler = onClose || `UIModal.close('${id}')`;

        return `
            <div id="${id}" class="ui-modal-overlay hidden" onclick="if(event.target === this) ${closeHandler}">
                <div class="ui-modal ui-modal-${size}" onclick="event.stopPropagation()">
                    ${title ? `
                        <div class="ui-modal-header">
                            <h2 class="ui-modal-title">${title}</h2>
                            ${closeButton ? `
                                <button class="ui-modal-close" onclick="${closeHandler}">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                    <div class="ui-modal-content">
                        ${content}
                    </div>
                    ${footer ? `
                        <div class="ui-modal-footer">
                            ${footer}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    static open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    static close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
}

/**
 * UI Library - Table Components
 */
class UITable {
    static render(config = {}) {
        const {
            headers = [],
            rows = [],
            sortable = true,
            className = '',
            emptyMessage = 'No data available'
        } = config;

        return `
            <div class="ui-table-container ${className}">
                <table class="ui-table ${sortable ? 'sortable' : ''}">
                    <thead>
                        <tr>
                            ${headers.map((header, idx) => `
                                <th ${sortable ? `onclick="UITable.sort(this, ${idx})"` : ''}>
                                    ${header}
                                    ${sortable ? '<span class="sort-icon">⇅</span>' : ''}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.length > 0 ? rows.map(row => `
                            <tr>
                                ${row.map(cell => `<td>${cell}</td>`).join('')}
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="${headers.length}" class="empty-row">${emptyMessage}</td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        `;
    }

    static sort(headerEl, colIndex) {
        const table = headerEl.closest('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Toggle sort direction
        const currentDir = headerEl.dataset.sortDir || 'asc';
        const newDir = currentDir === 'asc' ? 'desc' : 'asc';
        headerEl.dataset.sortDir = newDir;

        // Sort rows
        rows.sort((a, b) => {
            const aVal = a.cells[colIndex].textContent.trim();
            const bVal = b.cells[colIndex].textContent.trim();

            // Try numeric sort first
            const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
            const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return newDir === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // Fallback to string sort
            return newDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));

        // Update sort icons
        table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
        });
        headerEl.classList.add(`sorted-${newDir}`);
    }
}

/**
 * UI Library - Form Components
 */
class UIForm {
    static input(config = {}) {
        const {
            type = 'text',
            name = '',
            placeholder = '',
            value = '',
            label = '',
            error = '',
            icon = '',
            required = false,
            disabled = false
        } = config;

        return `
            <div class="ui-form-group ${error ? 'has-error' : ''}">
                ${label ? `<label class="ui-form-label">${label}${required ? ' *' : ''}</label>` : ''}
                <div class="ui-input-wrapper">
                    ${icon ? `<span class="ui-input-icon">${icon}</span>` : ''}
                    <input
                        type="${type}"
                        name="${name}"
                        placeholder="${placeholder}"
                        value="${value}"
                        class="ui-input ${icon ? 'has-icon' : ''}"
                        ${required ? 'required' : ''}
                        ${disabled ? 'disabled' : ''}
                    />
                </div>
                ${error ? `<span class="ui-form-error">${error}</span>` : ''}
            </div>
        `;
    }

    static select(config = {}) {
        const {
            name = '',
            options = [],
            label = '',
            error = '',
            value = '',
            required = false
        } = config;

        return `
            <div class="ui-form-group ${error ? 'has-error' : ''}">
                ${label ? `<label class="ui-form-label">${label}${required ? ' *' : ''}</label>` : ''}
                <select name="${name}" class="ui-select" ${required ? 'required' : ''}>
                    ${options.map(opt => `
                        <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
                            ${opt.label}
                        </option>
                    `).join('')}
                </select>
                ${error ? `<span class="ui-form-error">${error}</span>` : ''}
            </div>
        `;
    }
}

/**
 * UI Library - Toast Notifications
 */
class UIToast {
    static show(config = {}) {
        const {
            message = '',
            type = 'info', // success, error, warning, info
            duration = 3000,
            position = 'top-right' // top-right, top-left, bottom-right, bottom-left, top-center
        } = config;

        const container = this.getContainer(position);
        const toast = document.createElement('div');
        toast.className = `ui-toast ui-toast-${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        container.appendChild(toast);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.add('fadeout');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }

    static getContainer(position) {
        let container = document.querySelector(`.ui-toast-container.${position}`);
        if (!container) {
            container = document.createElement('div');
            container.className = `ui-toast-container ${position}`;
            document.body.appendChild(container);
        }
        return container;
    }
}

/**
 * UI Library - Loading States
 */
class UILoader {
    static spinner(size = 'md') {
        return `
            <div class="ui-spinner ui-spinner-${size}">
                <div class="spinner-ring"></div>
            </div>
        `;
    }

    static skeleton(config = {}) {
        const { height = '20px', width = '100%', count = 1 } = config;
        return Array(count).fill(0).map(() => `
            <div class="ui-skeleton" style="height: ${height}; width: ${width};"></div>
        `).join('');
    }

    static progress(percent = 0) {
        return `
            <div class="ui-progress-bar">
                <div class="ui-progress-fill" style="width: ${percent}%"></div>
            </div>
        `;
    }
}

/**
 * UI Library - Badge Component
 */
class UIBadge {
    static render(config = {}) {
        const {
            label = '',
            variant = 'default', // default, success, danger, warning, info
            size = 'md', // sm, md, lg
            dot = false
        } = config;

        return `
            <span class="ui-badge ui-badge-${variant} ui-badge-${size} ${dot ? 'has-dot' : ''}">
                ${dot ? '<span class="badge-dot"></span>' : ''}
                ${label}
            </span>
        `;
    }
}

/**
 * UI Library Styles
 */
const UI_STYLES = `
<style>
    /* ===== CARDS ===== */
    .ui-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s ease;
    }

    .ui-card.clickable {
        cursor: pointer;
    }

    .ui-card.clickable:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(16, 185, 129, 0.3);
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    }

    .ui-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }

    .ui-card-icon {
        font-size: 32px;
    }

    .ui-card-title {
        font-size: 20px;
        font-weight: 700;
        color: #f5f5f5;
        margin: 0;
    }

    .ui-card-subtitle {
        font-size: 13px;
        color: #888;
        margin: 4px 0 0 0;
    }

    .ui-card-content {
        color: #d0d0d0;
        line-height: 1.6;
    }

    .ui-card-footer {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.08);
    }

    /* Stats Card */
    .ui-stats-card {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
        border: 1px solid rgba(16, 185, 129, 0.2);
        border-radius: 16px;
        padding: 20px;
    }

    .stats-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
    }

    .stats-label {
        font-size: 12px;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
    }

    .stats-value {
        font-size: 32px;
        font-weight: 800;
        color: #f5f5f5;
        font-family: 'JetBrains Mono', monospace;
        margin-bottom: 8px;
    }

    .stats-change {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 600;
    }

    .stats-change.positive {
        color: #10b981;
    }

    .stats-change.negative {
        color: #ef4444;
    }

    /* ===== BUTTONS ===== */
    .ui-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }

    .ui-btn.full-width {
        width: 100%;
    }

    .ui-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .ui-btn-primary {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
    }

    .ui-btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
    }

    .ui-btn-secondary {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .ui-btn-danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
    }

    .ui-btn-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
    }

    .ui-btn-ghost {
        background: transparent;
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.5);
    }

    .ui-btn-sm {
        padding: 8px 16px;
        font-size: 12px;
    }

    .ui-btn-lg {
        padding: 16px 32px;
        font-size: 16px;
    }

    .ui-btn-group {
        display: flex;
        gap: 8px;
    }

    /* ===== MODALS ===== */
    .ui-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.2s ease;
    }

    .ui-modal-overlay.hidden {
        display: none;
    }

    .ui-modal {
        background: rgba(20, 20, 20, 0.98);
        border: 1px solid rgba(16, 185, 129, 0.2);
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.9);
        max-height: 90vh;
        overflow: hidden;
        animation: modalSlide 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes modalSlide {
        from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .ui-modal-sm { width: 400px; max-width: 90vw; }
    .ui-modal-md { width: 600px; max-width: 90vw; }
    .ui-modal-lg { width: 800px; max-width: 90vw; }
    .ui-modal-xl { width: 1200px; max-width: 95vw; }
    .ui-modal-full { width: 95vw; height: 95vh; }

    .ui-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .ui-modal-title {
        font-size: 24px;
        font-weight: 700;
        color: #f5f5f5;
        margin: 0;
    }

    .ui-modal-close {
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .ui-modal-close:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }

    .ui-modal-content {
        padding: 24px;
        overflow-y: auto;
        max-height: calc(90vh - 160px);
    }

    .ui-modal-footer {
        padding: 24px;
        border-top: 1px solid rgba(255,255,255,0.08);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
    }

    /* ===== TABLES ===== */
    .ui-table-container {
        overflow-x: auto;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.08);
    }

    .ui-table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255,255,255,0.02);
    }

    .ui-table th {
        background: rgba(255,255,255,0.05);
        padding: 16px;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        color: #888;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .ui-table.sortable th {
        cursor: pointer;
        user-select: none;
    }

    .ui-table.sortable th:hover {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }

    .sort-icon {
        margin-left: 4px;
        font-size: 10px;
        opacity: 0.5;
    }

    .ui-table th.sorted-asc .sort-icon::before {
        content: '↑';
        opacity: 1;
    }

    .ui-table th.sorted-desc .sort-icon::before {
        content: '↓';
        opacity: 1;
    }

    .ui-table td {
        padding: 16px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        color: #d0d0d0;
        font-size: 14px;
    }

    .ui-table tr:hover td {
        background: rgba(16, 185, 129, 0.05);
    }

    .ui-table .empty-row {
        text-align: center;
        color: #666;
        padding: 40px;
    }

    /* ===== FORMS ===== */
    .ui-form-group {
        margin-bottom: 20px;
    }

    .ui-form-label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #b0b0b0;
        margin-bottom: 8px;
    }

    .ui-input-wrapper {
        position: relative;
    }

    .ui-input-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 18px;
        color: #888;
    }

    .ui-input {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        color: #e8e8e8;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .ui-input.has-icon {
        padding-left: 44px;
    }

    .ui-input:focus {
        outline: none;
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.05);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .ui-select {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        color: #e8e8e8;
        font-size: 14px;
        cursor: pointer;
    }

    .ui-form-error {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: #ef4444;
    }

    .ui-form-group.has-error .ui-input,
    .ui-form-group.has-error .ui-select {
        border-color: #ef4444;
    }

    /* ===== TOASTS ===== */
    .ui-toast-container {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
    }

    .ui-toast-container.top-right {
        top: 80px;
        right: 20px;
    }

    .ui-toast-container.top-left {
        top: 80px;
        left: 20px;
    }

    .ui-toast-container.bottom-right {
        bottom: 20px;
        right: 20px;
    }

    .ui-toast-container.bottom-left {
        bottom: 20px;
        left: 20px;
    }

    .ui-toast-container.top-center {
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
    }

    .ui-toast {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
        background: rgba(20, 20, 20, 0.98);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        pointer-events: all;
        min-width: 300px;
        animation: toastSlide 0.3s ease;
    }

    @keyframes toastSlide {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .ui-toast.fadeout {
        animation: toastFadeOut 0.3s ease forwards;
    }

    @keyframes toastFadeOut {
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    .ui-toast-success {
        border-left: 4px solid #10b981;
    }

    .ui-toast-error {
        border-left: 4px solid #ef4444;
    }

    .ui-toast-warning {
        border-left: 4px solid #f59e0b;
    }

    .ui-toast-info {
        border-left: 4px solid #3b82f6;
    }

    .toast-icon {
        font-size: 20px;
    }

    .toast-message {
        flex: 1;
        color: #e8e8e8;
        font-size: 14px;
    }

    .toast-close {
        background: none;
        border: none;
        color: #888;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .toast-close:hover {
        background: rgba(255,255,255,0.1);
        color: #f5f5f5;
    }

    /* ===== LOADERS ===== */
    .ui-spinner {
        display: inline-block;
    }

    .ui-spinner-sm .spinner-ring { width: 20px; height: 20px; border-width: 2px; }
    .ui-spinner-md .spinner-ring { width: 40px; height: 40px; border-width: 4px; }
    .ui-spinner-lg .spinner-ring { width: 60px; height: 60px; border-width: 6px; }

    .spinner-ring {
        border: 4px solid rgba(16, 185, 129, 0.1);
        border-top-color: #10b981;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .ui-skeleton {
        background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
        background-size: 200% 100%;
        border-radius: 8px;
        margin-bottom: 12px;
        animation: skeleton 1.5s ease-in-out infinite;
    }

    @keyframes skeleton {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    .ui-progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255,255,255,0.05);
        border-radius: 4px;
        overflow: hidden;
    }

    .ui-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981 0%, #059669 100%);
        border-radius: 4px;
        transition: width 0.3s ease;
    }

    /* ===== BADGES ===== */
    .ui-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }

    .ui-badge-sm {
        padding: 2px 8px;
        font-size: 10px;
    }

    .ui-badge-lg {
        padding: 6px 16px;
        font-size: 14px;
    }

    .ui-badge-default {
        background: rgba(255,255,255,0.1);
        color: #d0d0d0;
    }

    .ui-badge-success {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .ui-badge-danger {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .ui-badge-warning {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .ui-badge-info {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
        border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        animation: pulse 2s ease-in-out infinite;
    }
</style>
`;

// Export all components
if (typeof window !== 'undefined') {
    window.UI = {
        Card: UICard,
        Button: UIButton,
        Modal: UIModal,
        Table: UITable,
        Form: UIForm,
        Toast: UIToast,
        Loader: UILoader,
        Badge: UIBadge,
        styles: UI_STYLES
    };
}
