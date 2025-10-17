/**
 * Breadcrumbs Component
 * Mobile-first, responsive, accessible breadcrumb navigation
 * Builds breadcrumbs from router/query params
 */

/**
 * Page hierarchy for breadcrumb generation
 */
const PAGE_HIERARCHY = {
    home: {
        title: 'Home',
        icon: 'home',
        parent: null
    },
    lessons: {
        title: 'Lezioni',
        icon: 'menu_book',
        parent: 'home'
    },
    students: {
        title: 'Studenti',
        icon: 'group',
        parent: 'home'
    },
    classes: {
        title: 'Classi',
        icon: 'school',
        parent: 'home'
    },
    activities: {
        title: 'Attività',
        icon: 'assignment',
        parent: 'home'
    },
    evaluations: {
        title: 'Valutazioni',
        icon: 'assessment',
        parent: 'home'
    },
    schedule: {
        title: 'Orario',
        icon: 'calendar_month',
        parent: 'home'
    },
    agenda: {
        title: 'Agenda',
        icon: 'event',
        parent: 'home'
    },
    'in-classe': {
        title: 'In Classe',
        icon: 'school',
        parent: 'schedule'
    },
    aiAssistant: {
        title: 'Assistente IA',
        icon: 'psychology',
        parent: 'home'
    },
    documentImport: {
        title: 'Importa Documenti',
        icon: 'upload_file',
        parent: 'home'
    },
    settings: {
        title: 'Impostazioni',
        icon: 'settings',
        parent: 'home'
    }
};

/**
 * Generate breadcrumb trail for a given page
 * @param {string} currentPage - Current page identifier
 * @param {object} params - Optional query parameters for context
 * @returns {Array} Array of breadcrumb items
 */
export function generateBreadcrumbs(currentPage, params = {}) {
    const breadcrumbs = [];
    let page = currentPage;
    
    // Build breadcrumb trail by traversing up the hierarchy
    while (page) {
        const pageInfo = PAGE_HIERARCHY[page];
        if (!pageInfo) break;
        
        breadcrumbs.unshift({
            page: page,
            title: pageInfo.title,
            icon: pageInfo.icon,
            isCurrent: page === currentPage
        });
        
        page = pageInfo.parent;
    }
    
    // Add contextual information from params if available
    if (params.class && currentPage === 'in-classe') {
        breadcrumbs[breadcrumbs.length - 1].title = `In Classe - ${params.class}`;
    }
    
    return breadcrumbs;
}

/**
 * Render breadcrumbs HTML
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {string} HTML string for breadcrumbs
 */
function renderBreadcrumbsHTML(breadcrumbs) {
    if (!breadcrumbs || breadcrumbs.length === 0) {
        return '';
    }
    
    const items = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const ariaCurrent = isLast ? ' aria-current="page"' : '';
        
        let itemHTML = `
            <li class="breadcrumbs-item">
                <a href="#${crumb.page}" 
                   class="breadcrumbs-link"
                   ${ariaCurrent}
                   data-page="${crumb.page}">
                    <span class="material-symbols-outlined breadcrumbs-icon">${crumb.icon}</span>
                    <span>${crumb.title}</span>
                </a>
        `;
        
        if (!isLast) {
            itemHTML += `
                <span class="breadcrumbs-separator material-symbols-outlined" aria-hidden="true">
                    chevron_right
                </span>
            `;
        }
        
        itemHTML += '</li>';
        return itemHTML;
    }).join('');
    
    return `
        <nav class="breadcrumbs" aria-label="Breadcrumb">
            <ol class="breadcrumbs-list">
                ${items}
            </ol>
        </nav>
    `;
}

/**
 * Update breadcrumbs in the DOM
 * @param {string} containerId - ID of the container element
 * @param {string} currentPage - Current page identifier
 * @param {object} params - Optional query parameters
 */
export function updateBreadcrumbs(containerId, currentPage, params = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Breadcrumbs container #${containerId} not found`);
        return;
    }
    
    // Hide breadcrumbs on home page
    if (currentPage === 'home') {
        container.innerHTML = '<nav class="breadcrumbs breadcrumbs--hidden"></nav>';
        return;
    }
    
    // Generate and render breadcrumbs
    const breadcrumbs = generateBreadcrumbs(currentPage, params);
    const html = renderBreadcrumbsHTML(breadcrumbs);
    container.innerHTML = html;
    
    // Attach click handlers
    const links = container.querySelectorAll('.breadcrumbs-link');
    links.forEach(link => {
        // Skip current page link (already non-interactive via aria-current)
        if (link.getAttribute('aria-current') === 'page') {
            return;
        }
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (window.app && typeof window.app.switchTab === 'function') {
                window.app.switchTab(page);
            } else if (window.navigationManager) {
                window.navigationManager.navigateToPage(page);
            }
        });
    });
}

/**
 * Initialize breadcrumbs from URL hash or query params
 * @param {string} containerId - ID of the container element
 */
export function initBreadcrumbs(containerId) {
    // Parse current page from URL hash
    const hash = window.location.hash.replace('#', '');
    const [page, queryString] = hash.split('?');
    
    // Parse query parameters
    const params = {};
    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
    }
    
    // Update breadcrumbs
    updateBreadcrumbs(containerId, page || 'home', params);
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#', '');
        const [newPage, newQueryString] = newHash.split('?');
        
        const newParams = {};
        if (newQueryString) {
            const urlParams = new URLSearchParams(newQueryString);
            for (const [key, value] of urlParams) {
                newParams[key] = value;
            }
        }
        
        updateBreadcrumbs(containerId, newPage || 'home', newParams);
    });
}

/**
 * Get breadcrumb trail as text (for accessibility announcements)
 * @param {string} currentPage - Current page identifier
 * @param {object} params - Optional query parameters
 * @returns {string} Text representation of breadcrumb trail
 */
export function getBreadcrumbText(currentPage, params = {}) {
    const breadcrumbs = generateBreadcrumbs(currentPage, params);
    return breadcrumbs.map(crumb => crumb.title).join(' > ');
}

// Export for use in other modules
export default {
    generateBreadcrumbs,
    updateBreadcrumbs,
    initBreadcrumbs,
    getBreadcrumbText
};
