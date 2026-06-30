// Базовые данные
const staff = [
    { nick: "Root_Admin", role: "Руководство", online: "15ч", status: "На смене" }
];

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('d-none'));
    document.getElementById(`tab-${tab}`).classList.remove('d-none');
}

function renderRules() {
    const rules = JSON.parse(localStorage.getItem('rules') || '[]');
    const container = document.getElementById('rulesContainer');
    container.innerHTML = rules.map(r => `
        <div class="col-md-4"><div class="card p-3 mb-3">
            <h5>${r.title}</h5><p>${r.body}</p>
        </div></div>`).join('');
}

function saveRule() {
    const rules = JSON.parse(localStorage.getItem('rules') || '[]');
    rules.push({ title: document.getElementById('ruleTitle').value, body: document.getElementById('ruleBody').value });
    localStorage.setItem('rules', JSON.stringify(rules));
    location.reload();
}

function openRuleModal() { new bootstrap.Modal(document.getElementById('ruleModal')).show(); }

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById('staffTableBody');
    tbody.innerHTML = staff.map(s => `<tr><td>${s.nick}</td><td>${s.role}</td><td>${s.online}</td><td>${s.status}</td></tr>`).join('');
    renderRules();
});
