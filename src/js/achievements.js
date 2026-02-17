
import { DataManager } from './data.js';

class AchievementsManager {
    constructor(type) {
        this.type = type; // 'icse' or 'sslc'
        this.currentYear = '2024-2025';
        this.data = null;
        this.init();
    }

    init() {
        this.loadTabs();
        this.loadData();
        this.render();
        this.setupEventListeners();
    }

    loadTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const panes = document.querySelectorAll('.tab-pane');

        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const target = document.getElementById(tab.dataset.tab);
                if (target) target.classList.add('active');
            });
        });
    }

    loadData() {
        const allData = DataManager.getData();
        if (allData && allData[this.type] && allData[this.type][this.currentYear]) {
            this.data = allData[this.type][this.currentYear];
        } else {
            this.data = null; // No data for this year
        }
    }

    render() {
        this.renderTopAchievers();
        this.renderGridAchievers();
        this.renderStats();
        document.getElementById('year-display').textContent = this.currentYear;
        // Also update span in nav wrapper (if same id)
        const label = document.querySelector('.year-label');
        if (label) label.textContent = this.currentYear;
    }

    renderTopAchievers() {
        const container = document.getElementById('top-achievers');
        if (!container) return;
        container.innerHTML = '';

        if (!this.data || !this.data.toppers.length) {
            container.innerHTML = '<p>No data available for this year.</p>';
            return;
        }

        // Get Top 3
        const top3 = this.data.toppers.filter(t => t.rank <= 3).sort((a, b) => a.rank - b.rank);

        // We want order: Rank 2, Rank 1, Rank 3 visually in row.
        // Array for rendering: [Rank 2, Rank 1, Rank 3] if they exist.
        const rank1 = top3.find(t => t.rank === 1);
        const rank2 = top3.find(t => t.rank === 2);
        const rank3 = top3.find(t => t.rank === 3);

        const renderCard = (student) => {
            if (!student) return '';
            const isRank1 = student.rank === 1;
            return `
                <div class="achiever-card rank-${student.rank}">
                    ${isRank1 ? '<div class="crown-icon"><i class="fas fa-crown"></i></div>' : ''}
                    <div class="rank-badge">${student.rank}</div>
                    <img src="${student.photo}" class="achiever-photo">
                    <div class="achiever-info">
                        <div class="achiever-name">${student.name}</div>
                        <div class="achiever-percent">${student.percentage}%</div>
                    </div>
                </div>
            `;
        };

        // Inner HTML construction
        // Mobile view will stack them due to CSS order or flex-direction
        // DOM Order: 2, 1, 3 for visual center effect?
        // Or Flexbox `order` property.
        // Let's just append in order 2, 1, 3.

        if (rank2) container.innerHTML += renderCard(rank2);
        if (rank1) container.innerHTML += renderCard(rank1);
        if (rank3) container.innerHTML += renderCard(rank3);
    }

    renderGridAchievers() {
        const container = document.getElementById('grid-achievers');
        if (!container) return;
        container.innerHTML = '';

        if (!this.data) return;

        // Rank > 3
        const others = this.data.toppers.filter(t => t.rank > 3);

        others.forEach(s => {
            const card = document.createElement('div');
            card.className = 'grid-achiever-card';
            card.innerHTML = `
                <img src="${s.photo}" class="grid-photo">
                <div style="font-weight:600; font-size: 0.9rem;">${s.name}</div>
                <div style="color:var(--primary-color); font-weight:700;">${s.percentage}%</div>
            `;
            container.appendChild(card);
        });
    }

    renderStats() {
        const container = document.getElementById('stats-bar');
        if (!container) return;
        container.innerHTML = '';

        if (!this.data || !this.data.stats) return;

        const s = this.data.stats;
        const statsItems = [
            { label: 'Students Appeared', val: s.appeared },
            { label: '90% + Scorers', val: s.ninetyPlus },
            { label: 'Distinctions', val: s.distinction },
            { label: 'First Class', val: s.firstClass },
            { label: 'Total Centums', val: s.centums }
        ];

        statsItems.forEach(item => {
            container.innerHTML += `
               <div class="stat-box">
                  <h3>${item.val}</h3>
                  <p>${item.label}</p>
               </div>
            `;
        });
    }

    setupEventListeners() {
        // Year selection logic placeholder
        // In a real app this would switch years and re-render
        // For now we only have one year data
        const prev = document.querySelector('.prev-year');
        const next = document.querySelector('.next-year');

        if (prev) prev.addEventListener('click', () => alert("Only 2024-2025 data available in demo"));
        if (next) next.addEventListener('click', () => alert("Only 2024-2025 data available in demo"));
    }
}

// Init based on page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on ICSE page
    if (document.querySelector('.icse-intro')) {
        new AchievementsManager('icse');
    }
    // SSLC check later
    if (document.querySelector('.sslc-intro')) {
        new AchievementsManager('sslc');
    }
});
