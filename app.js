// === ИЕРАРХИЯ ДОЛЖНОСТЕЙ (РОЛЕЙ) ===
const ROLES_HIERARCHY = [
    "Руководство проекта",
    "Руководитель администрации",
    "Специальный администратор",
    "Главный администратор",
    "Зам. главного администратора",
    "Главный куратор",
    "Помощник главного куратора",
    "Администратор 4 уровня",
    "Администратор 3 уровня",
    "Администратор 2 уровня",
    "Модератор"
];

// === ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ И ЕДИНСТВЕННОГО СОЗДАТЕЛЯ ===
// Создаем пустую базу реальных пользователей, если её нет, и добавляем вас как Руководство
if (!localStorage.getItem("rc_staff_db")) {
    const startStaff = [
        { 
            nickname: "Future", 
            password: "superboss2026", // При необходимости измените пароль прямо здесь
            role: "Руководство проекта", 
            online: 0, 
            tickets: 0, 
            status: "На смене" 
        }
    ];
    localStorage.setItem("rc_staff_db", JSON.stringify(startStaff));
}

// Шаблон курсов с реальными RP-ситуациями
const defaultCourses = [
    { 
        id: "rp_situations", 
        title: "Разбор сложных RP-ситуаций", 
        desc: "Тестирование на знание регламента и умение отличать IC процессы от OOC нарушений.",
        questions: [
            { 
                q: "Игрок написал в репорт: 'Меня грабят в ЗЗ (возле автосалона)'. Вы видите: 4 человека в масках с оружием держат игрока на парковке автосалона. Ваши действия?", 
                o: [
                    "Сразу заспавнить грабителей и выдать им бан за читы.", 
                    "Сказать игроку, что это IC-процесс и закрыть репорт.", 
                    "Зафиксировать нарушение (Ограбление в ЗЗ), наказать грабителей согласно правилам (Demorgan/Warn) и вернуть игрока в исходное состояние."
                ], 
                a: 2 
            },
            { 
                q: "В ходе разборок на форуме предоставлен лог: [22:15:10] Ivan_Oskolkov: (( ты нулевой, иди плачь )). Является ли это нарушением?", 
                o: [
                    "Да, это Оскорбление/Токсичность в OOC чат. Наказание — Мут.", 
                    "Нет, в OOC чат разрешено писать всё, что угодно.", 
                    "Это завуалированное PG, нужно выдать Warn."
                ], 
                a: 0 
            }
        ],
        userAnswers: null
    }
];

if (!localStorage.getItem("rc_courses_db")) {
    localStorage.setItem("rc_courses_db", JSON.stringify(defaultCourses));
}

const rulesData = [
    { category: "Общие правила проекта", rules: [{ title: "1.1 Никнейм", text: "Формат Имя_Фамилия. Без мата.", punishment: "Kick" }] }
];

const commandsData = [
    { group: "Административные команды", commands: [{ cmd: "/warn", desc: "Выдача варна", example: "/warn 10 PG" }] }
];

// === СЛУШАТЕЛИ И СТАРТ СИСТЕМЫ ===
document.addEventListener("DOMContentLoaded", () => {
    renderRules();
    renderCourses();
    renderCommands();
    renderStaff(); // Отрендерит только реальных пользователей из localStorage
    initRoleSelects();

    const burgerMenu = document.getElementById("burgerMenu");
    const navMenu = document.getElementById("navMenu");
    if(burgerMenu) burgerMenu.addEventListener("click", () => navMenu.classList.toggle("open"));

    document.getElementById("profileBtn").addEventListener("click", openProfileModal);
    document.getElementById("loginForm").addEventListener("submit", (e) => { e.preventDefault(); handleLogin(); });
    document.getElementById("logoutBtn").addEventListener("click", handleLogout);
    
    const staffForm = document.getElementById("staffAdminForm");
    if(staffForm) {
        staffForm.addEventListener("submit", (e) => { e.preventDefault(); saveStaffMember(); });
    }

    checkAccessRights();
});

function closeMenu() { document.getElementById("navMenu").classList.remove("open"); }
function getCurrentUser() { return JSON.parse(localStorage.getItem("rc_user")) || null; }

function checkAccessRights() {
    const user = getCurrentUser();
    const adminControls = document.getElementById("adminStaffControls");
    const actionCols = document.querySelectorAll(".admin-actions-col");

    // Доступ к панели управления есть ТОЛЬКО у вашего аккаунта Future (Руководство проекта)
    if (user && user.role === "Руководство проекта") {
        if(adminControls) adminControls.style.display = "block";
        actionCols.forEach(col => col.style.display = "table-cell");
    } else {
        if(adminControls) adminControls.style.display = "none";
        actionCols.forEach(col => col.style.display = "none");
    }
}

function initRoleSelects() {
    const select = document.getElementById("staffRoleSelect");
    if(select) {
        select.innerHTML = "";
        ROLES_HIERARCHY.forEach(role => {
            select.innerHTML += `<option value="${role}">${role}</option>`;
        });
    }
}

// === РЕНДЕР ТАБЛИЦЫ РЕАЛЬНЫХ ПОЛЬЗОВАТЕЛЕЙ ===
function renderStaff() {
    const staff = JSON.parse(localStorage.getItem("rc_staff_db")) || [];
    const tbody = document.getElementById("staffTableBody");
    if (!tbody) return;
    
    const user = getCurrentUser();
    const isBoss = user && user.role === "Руководство проекта";
    
    tbody.innerHTML = "";
    staff.forEach((s, index) => {
        let statusClass = "status-on-duty";
        if (s.status === "В отпуске") statusClass = "status-vacation";
        if (s.status === "Уволен") statusClass = "status-fired";

        let actionsHtml = isBoss ? `
            <td class="admin-actions-col">
                <button class="btn btn-sm btn-secondary" onclick="editStaffMember(${index})">Роль/Статус</button>
                <button class="btn btn-sm btn-danger" style="margin-left:5px;" onclick="deleteStaffMember(${index})">&times;</button>
            </td>
        ` : `<td class="admin-actions-col" style="display:none;"></td>`;

        tbody.innerHTML += `
            <tr>
                <td style="font-weight: 500;">${s.nickname}</td>
                <td><span class="role-badge">${s.role}</span></td>
                <td>${s.online || 0} ч.</td>
                <td>${s.tickets || 0}</td>
                <td><span class="status-indicator ${statusClass}">${s.status}</span></td>
                ${actionsHtml}
            </tr>
        `;
    });
    checkAccessRights();
}

function openAddStaffModal() {
    document.getElementById("staffModalTitle").innerText = "Регистрация администратора";
    document.getElementById("editStaffIndex").value = "";
    document.getElementById("staffNick").value = "";
    document.getElementById("staffOnline").value = "0";
    document.getElementById("staffTickets").value = "0";
    
    let pGroup = document.getElementById("staffPasswordGroup");
    if(!pGroup) {
        pGroup = document.createElement("div");
        pGroup.className = "form-group";
        pGroup.id = "staffPasswordGroup";
        pGroup.innerHTML = `<label>Пароль для аккаунта</label><input type="text" id="staffPass" required placeholder="Придумайте пароль">`;
        document.getElementById("staffAdminForm").insertBefore(pGroup, document.getElementById("staffAdminForm").lastElementChild);
    } else {
        document.getElementById("staffPass").value = "";
    }
    
    document.getElementById("staffAdminModal").classList.add("open");
}

function editStaffMember(index) {
    const staff = JSON.parse(localStorage.getItem("rc_staff_db"))[index];
    document.getElementById("staffModalTitle").innerText = "Изменение роли и статуса";
    document.getElementById("editStaffIndex").value = index;
    document.getElementById("staffNick").value = staff.nickname;
    document.getElementById("staffRoleSelect").value = staff.role;
    document.getElementById("staffStatusSelect").value = staff.status;
    document.getElementById("staffOnline").value = staff.online;
    document.getElementById("staffTickets").value = staff.tickets;
    
    const pGroup = document.getElementById("staffPasswordGroup");
    if(pGroup) pGroup.remove();

    document.getElementById("staffAdminModal").classList.add("open");
}

function saveStaffMember() {
    const indexStr = document.getElementById("editStaffIndex").value;
    const staff = JSON.parse(localStorage.getItem("rc_staff_db")) || [];

    if (indexStr === "") {
        // Создание реального нового пользователя в БД
        const newData = {
            nickname: document.getElementById("staffNick").value.trim(),
            password: document.getElementById("staffPass").value.trim(),
            role: document.getElementById("staffRoleSelect").value,
            status: document.getElementById("staffStatusSelect").value,
            online: parseInt(document.getElementById("staffOnline").value) || 0,
            tickets: parseInt(document.getElementById("staffTickets").value) || 0
        };
        staff.push(newData);
    } else {
        // Редактирование существующего
        const idx = parseInt(indexStr);
        staff[idx].nickname = document.getElementById("staffNick").value.trim();
        staff[idx].role = document.getElementById("staffRoleSelect").value;
        staff[idx].status = document.getElementById("staffStatusSelect").value;
        staff[idx].online = parseInt(document.getElementById("staffOnline").value) || 0;
        staff[idx].tickets = parseInt(document.getElementById("staffTickets").value) || 0;
        
        const currentUser = getCurrentUser();
        if(currentUser && currentUser.nickname === staff[idx].nickname) {
            currentUser.role = staff[idx].role;
            currentUser.status = staff[idx].status;
            localStorage.setItem("rc_user", JSON.stringify(currentUser));
        }
    }

    localStorage.setItem("rc_staff_db", JSON.stringify(staff));
    closeStaffModal();
    renderStaff();
    updateProfileUIData();
}

function deleteStaffMember(index) {
    if (confirm("Вы действительно хотите удалить данного администратора из реестра?")) {
        const staff = JSON.parse(localStorage.getItem("rc_staff_db"));
        staff.splice(index, 1);
        localStorage.setItem("rc_staff_db", JSON.stringify(staff));
        renderStaff();
    }
}

function closeStaffModal() { document.getElementById("staffAdminModal").classList.remove("open"); }

// === АВТОРИЗАЦИЯ С ПРОВЕРКОЙ ПАРОЛЯ ===
function handleLogin() {
    const nick = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    const staff = JSON.parse(localStorage.getItem("rc_staff_db")) || [];
    const matched = staff.find(s => s.nickname.toLowerCase() === nick.toLowerCase());

    if (!matched) {
        alert("Пользователь с таким никнеймом не зарегистрирован в таблице администрации!");
        return;
    }

    if (matched.password !== pass) {
        alert("Неверный пароль доступа!");
        return;
    }

    const userData = { nickname: matched.nickname, role: matched.role, status: matched.status };
    localStorage.setItem("rc_user", JSON.stringify(userData));
    showAccountCard(userData);
    checkAccessRights();
    renderStaff();
    closeModal();
}

// === ВСПОМОГАТЕЛЬНЫЙ ФУНКЦИОНАЛ (Курсы, правила, UI) ===
function renderCourses() {
    const courses = JSON.parse(localStorage.getItem("rc_courses_db")) || [];
    const grid = document.getElementById("coursesGrid"); if (!grid) return; grid.innerHTML = "";
    courses.forEach(c => {
        let percent = calculateCourseProgress(c);
        let status = "Не начат"; let badgeClass = "badge-not-started";
        if (percent > 0 && percent < 100) { status = "В процессе"; badgeClass = "badge-in-progress"; }
        else if (percent === 100) { status = "Завершен"; badgeClass = "badge-completed"; }
        grid.innerHTML += `<div class="card course-card"><div><h3 class="course-title">${c.title} <span class="accent-text">(${percent}%)</span></h3><p class="course-desc">${c.desc}</p><div class="progress-bar-container" style="margin-bottom: 15px;"><div class="progress-bar" style="width: ${percent}%;"></div></div></div><div class="course-footer"><span class="badge ${badgeClass}">${status}</span><button class="btn btn-secondary btn-sm" onclick="startCourse('${c.id}')">Пройти курс</button></div></div>`;
    });
}
function calculateCourseProgress(course) { if (!course.userAnswers) return 0; let correctCount = 0; course.questions.forEach((q, idx) => { if (course.userAnswers[idx] === q.a) correctCount++; }); return Math.round((correctCount / course.questions.length) * 100); }
function startCourse(courseId) { const user = getCurrentUser(); if (!user) { alert("Необходимо авторизоваться в Профиле!"); return; } const courses = JSON.parse(localStorage.getItem("rc_courses_db")); const course = courses.find(c => c.id === courseId); document.getElementById("activeCourseTitle").innerText = `Модуль: ${course.title}`; const container = document.getElementById("courseTestContainer"); container.innerHTML = ""; course.questions.forEach((q, qIdx) => { let optionsHtml = ""; q.o.forEach((opt, oIdx) => { let checked = (course.userAnswers && course.userAnswers[qIdx] === oIdx) ? "checked" : ""; optionsHtml += `<label class="option-label"><input type="radio" name="question_${qIdx}" value="${oIdx}" ${checked} onchange="saveAnswer('${courseId}', ${qIdx}, ${oIdx})"><span>${opt}</span></label>`; }); container.innerHTML += `<div class="test-question-block"><p><strong>РП-Ситуация №${qIdx + 1}:</strong> ${q.q}</p><div class="test-options">${optionsHtml}</div></div>`; }); document.getElementById("activeCourseZone").style.display = "block"; }
function saveAnswer(courseId, qIdx, oIdx) { const courses = JSON.parse(localStorage.getItem("rc_courses_db")); const course = courses.find(c => c.id === courseId); if (!course.userAnswers) course.userAnswers = {}; course.userAnswers[qIdx] = oIdx; localStorage.setItem("rc_courses_db", JSON.stringify(courses)); renderCourses(); updateProfileUIData(); }
function closeCourseZone() { document.getElementById("activeCourseZone").style.display = "none"; }
function openProfileModal() { const m = document.getElementById("profileModal"); m.classList.add("open"); const u = getCurrentUser(); if (u) { showAccountCard(u); } else { showLoginCard(); } }
function closeModal() { document.getElementById("profileModal").classList.remove("open"); }
function showLoginCard() { document.getElementById("accountCard").style.display = "none"; document.getElementById("loginCard").style.display = "block"; }
function showAccountCard(user) { document.getElementById("loginCard").style.display = "none"; document.getElementById("accountCard").style.display = "block"; updateProfileUIData(); }
function updateProfileUIData() { const user = getCurrentUser(); if (!user) return; document.getElementById("profNick").innerText = user.nickname; document.getElementById("profRole").innerText = user.role; document.getElementById("profStatus").innerText = user.status; const courses = JSON.parse(localStorage.getItem("rc_courses_db")) || []; let total = 0; courses.forEach(c => { total += calculateCourseProgress(c); }); let avg = courses.length ? Math.round(total / courses.length) : 0; document.getElementById("profProgress").style.width = `${avg}%`; document.getElementById("profProgressText").innerText = `${avg}%`; }
function handleLogout() { localStorage.removeItem("rc_user"); location.reload(); }
function renderRules() { const container = document.getElementById("rulesAccordion"); if(!container) return; container.innerHTML = ""; rulesData.forEach((cat) => { const item = document.createElement("div"); item.className = "accordion-item"; let rHtml = ""; cat.rules.forEach(r => { rHtml += `<div class="rule-inner-card"><div class="rule-title-sub">${r.title}</div><div>${r.text}</div><div class="rule-punishment">Наказание: ${r.punishment}</div></div>`; }); item.innerHTML = `<button class="accordion-header"><span>${cat.category}</span></button><div class="accordion-content">${rHtml}</div>`; item.querySelector(".accordion-header").addEventListener("click", () => { item.classList.toggle("active"); }); container.appendChild(item); }); }
function renderCommands() { const container = document.getElementById("commandsContainer"); if(!container) return; container.innerHTML = ""; commandsData.forEach(g => { let rowsHtml = ""; g.commands.forEach(c => { rowsHtml += `<tr><td>${c.cmd}</td><td>${c.desc}</td><td>${c.example}</td></tr>`; }); container.innerHTML += `<h3>${g.group}</h3><table><tbody>${rowsHtml}</tbody></table>`; }); }
