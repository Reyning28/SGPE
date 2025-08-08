// ===== ESTILOS PARA MODALES =====
function addModalBaseStyles() {
    if (document.getElementById('modal-base-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-base-styles';
    style.textContent = `
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        
        .modal-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            min-width: 400px;
        }
        
        .modal-header {
            padding: 24px 24px 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 24px;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #374151;
            font-size: 20px;
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #9ca3af;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .modal-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        
        .modal-body {
            padding: 0 24px 24px 24px;
        }
        
        .btn-primary, .btn-secondary, .btn-small {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
        }
        
        .btn-primary {
            background: #2563eb;
            color: white;
        }
        
        .btn-primary:hover {
            background: #1d4ed8;
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
        }
        
        .btn-small {
            padding: 4px 8px;
            font-size: 12px;
        }
        
        .btn-small.primary {
            background: #2563eb;
            color: white;
        }
        
        .btn-small.secondary {
            background: #f3f4f6;
            color: #374151;
        }
    `;
    document.head.appendChild(style);
}

function addProfileStyles() {
    addModalBaseStyles();
    
    const style = document.createElement('style');
    style.textContent = `
        .profile-content {
            max-width: 500px;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            border-radius: 12px;
            color: white;
        }
        
        .profile-avatar {
            position: relative;
        }
        
        .profile-avatar img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 4px solid white;
            object-fit: cover;
        }
        
        .avatar-status {
            position: absolute;
            bottom: 5px;
            right: 5px;
            width: 16px;
            height: 16px;
            background: #10b981;
            border: 3px solid white;
            border-radius: 50%;
        }
        
        .profile-info h3 {
            margin: 0 0 5px 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .profile-info p {
            margin: 0 0 10px 0;
            opacity: 0.9;
        }
        
        .profile-role {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .profile-details {
            margin-bottom: 30px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-row label {
            font-weight: 500;
            color: #6b7280;
        }
        
        .detail-row span {
            color: #374151;
            font-weight: 500;
        }
        
        .profile-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
    `;
    document.head.appendChild(style);
}

function addEditProfileStyles() {
    addModalBaseStyles();
    
    const style = document.createElement('style');
    style.textContent = `
        .edit-profile-form {
            max-width: 600px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            margin-bottom: 8px;
            font-weight: 500;
            color: #374151;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .password-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        
        @media (max-width: 640px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

function addSettingsStyles() {
    addModalBaseStyles();
    
    const style = document.createElement('style');
    style.textContent = `
        .settings-content {
            max-width: 700px;
        }
        
        .settings-tabs {
            display: flex;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 24px;
        }
        
        .tab-btn {
            padding: 12px 20px;
            border: none;
            background: none;
            color: #6b7280;
            font-weight: 500;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
        }
        
        .tab-btn.active {
            color: #2563eb;
            border-bottom-color: #2563eb;
        }
        
        .tab-btn:hover {
            color: #374151;
        }
        
        .settings-tab {
            display: none;
        }
        
        .settings-tab.active {
            display: block;
        }
        
        .settings-tab h4 {
            margin: 0 0 20px 0;
            color: #374151;
            font-size: 18px;
            font-weight: 600;
        }
        
        .setting-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .setting-item:last-child {
            border-bottom: none;
        }
        
        .setting-item label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #374151;
        }
        
        .setting-item select,
        .setting-item input[type="number"] {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            max-width: 200px;
        }
        
        .checkbox-label {
            display: flex !important;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            margin-bottom: 0 !important;
        }
        
        .checkbox-label input[type="checkbox"] {
            margin: 0;
        }
        
        .theme-options {
            display: flex;
            gap: 12px;
        }
        
        .theme-btn {
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            min-width: 80px;
        }
        
        .theme-btn.active {
            border-color: #2563eb;
            background: #eff6ff;
            color: #2563eb;
        }
        
        .theme-btn:hover {
            border-color: #9ca3af;
        }
        
        .settings-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    `;
    document.head.appendChild(style);
}

function addNotificationsStyles() {
    addModalBaseStyles();
    
    const style = document.createElement('style');
    style.textContent = `
        .notifications-content {
            max-width: 800px;
        }
        
        .notifications-header {
            margin-bottom: 24px;
        }
        
        .notifications-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .notification-count {
            font-weight: 600;
            color: #2563eb;
        }
        
        .mark-all-read {
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        
        .mark-all-read:hover {
            background: #f3f4f6;
            color: #374151;
        }
        
        .notification-filters {
            display: flex;
            gap: 8px;
        }
        
        .filter-btn {
            padding: 6px 12px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
        }
        
        .filter-btn.active {
            background: #2563eb;
            color: white;
            border-color: #2563eb;
        }
        
        .notifications-list {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .notification-item {
            display: flex;
            gap: 16px;
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 12px;
            transition: all 0.2s ease;
            background: white;
        }
        
        .notification-item.unread {
            background: #eff6ff;
            border-left: 4px solid #2563eb;
        }
        
        .notification-item.important {
            border-left-color: #dc2626;
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .notification-icon.error {
            background: #fef2f2;
            color: #dc2626;
        }
        
        .notification-icon.success {
            background: #f0fdf4;
            color: #16a34a;
        }
        
        .notification-icon.info {
            background: #eff6ff;
            color: #2563eb;
        }
        
        .notification-icon.warning {
            background: #fffbeb;
            color: #d97706;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
        }
        
        .notification-content p {
            margin: 0 0 8px 0;
            color: #6b7280;
            line-height: 1.4;
        }
        
        .notification-time {
            font-size: 12px;
            color: #9ca3af;
        }
        
        .notification-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: flex-end;
        }
    `;
    document.head.appendChild(style);
}

// Cargar el archivo en el dashboard
if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'modal-styles.js';
    document.head.appendChild(script);
}
