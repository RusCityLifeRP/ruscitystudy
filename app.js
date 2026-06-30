// === ИЕРАРХИЯ ДОЛЖНОСТЕЙ ===
const ROLES_HIERARCHY = [
    "Руководство проекта", "Руководитель администрации", "Специальный администратор",
    "Главный администратор", "Зам. главного администратора", "Главный куратор",
    "Помощник главного куратора", "Администратор 4 уровня", "Администратор 3 уровня",
    "Администратор 2 уровня", "Модератор"
];

// === ИНИЦИАЛИЗАЦИЯ СУПЕР-АДМИНА (FUTURE) ===
if (!localStorage.getItem("rc_staff_db_v3")) {
    const startStaff = [{ 
        nickname: "Future", 
        password: "superboss2026", 
        role: "Руководство проекта", 
        online: 0, 
        tickets: 0, 
        status: "На смене" 
    }];
    localStorage.setItem("rc_staff_db_v3", JSON.stringify(startStaff));
}

// === БОЛЬШОЙ ПАКЕТ КУРСОВ С РП-СИТУАЦИЯМИ ===
const expandedCourses = [
    { 
        id: "rp_advanced", 
        title: "Курс 1: Проверка на Блат и Слив", 
        desc: "Изучение критических нарушений среди старшего состава и администрации.",
        questions: [
            { 
                q: "Вы заметили, что Главный Куратор фракций закрыл глаза на грубое нарушение от лидера (своего друга) и выдал устное предупреждение вместо письменного выговора. Ваши действия?", 
                o: [
                    "Ничего не делать, это его право как куратора.",
                    "Зафиксировать факт предвзятости (Блат) и напрямую передать доказательства Руководству проекта (Future).",
                    "Написать об этом в общий чат игроков."
                ], 
                a: 1 
            },
            {
                q: "Администратор 2 уровня зашел в игру и начал массово банить всех подряд с причиной 'Продажа вирт'. Что происходит и как реагировать?",
                o: [
                    "Это попытка слива сервера. Необходимо немедленно выдать ему бан/варн (если есть права) или зайти в админ-конференцию и затребовать его срочное снятие через Руководство.",
                    "Подождать пока он закончит и написать жалобу на форум.",
                    "Попросить его остановиться в OOC-чат."
                ],
                a: 0
            }
        ], userAnswers: null
    },
    { 
        id: "gmp_rules", 
        title: "Курс 2: Проведение ГМП и МП", 
        desc: "Правила организации глобальных ситуаций, распределение техники и слежка за участниками.",
        questions: [
            { 
                q: "Во время проведения ГМП фракция ОПГ начала срывать процесс: использовать баги стрельбы (+С) и RK. Организатор просит помощи. Как поступить?", 
                o: [
                    "Заморозить всё ГМП и отменить его.",
                    "Откинуть нарушителей в деморган/варн согласно общим правилам сервера, не останавливая ход основного мероприятия.",
                    "Выдать ОПГшникам миниганы, чтобы уравнять шансы."
                ], 
                a: 1 
            }
        ], userAnswers: null
    },
    {
        id: "log_investigation",
        title: "Курс 3: Махинации и Логи сервера",
        desc: "Анализ подозрительных переводов, выявление продавцов игровой валюты.",
        questions: [
            {
                q: "В логах обнаружен перевод: Игрок А (1 уровень) передал Игроку Б (50 уровень) через трейд 50.000.000 рублей сразу после регистрации. Как это расценивать?",
                o: [
                    "Игроку просто повезло, это подарок.",
                    "Подозрение на покупку/продажу вирт или взлом аккаунта. Вызвать обоих на проверку рег. данных или передать логи Техническому администратору.",
                    "Забанить только первоуровневого игрока."
                ],
                a: 1
            }
        ], userAnswers: null
    },
    {
        id: "report_culture",
        title: "Курс 4: Культура общения и Репорт",
        desc: "Регламент работы со сложными обращениями в тикет-систему.",
        questions: [
            {
                q: "Игрок флудит в репорт капсом: 'МЕНЯ ДМЯТ СУКИ ПОМОГИТЕ!!!!'. Ваша реакция?",
                o: [
                    "Выдать мут за капс и проигнорировать репорт.",
                    "Зайти в скрытую слежку (рекон) за игроком, чтобы наказать ДМщика, а после этого выдать автору репорта мут за капс/мат в тикет.",
                    "Ответить: 'Не капсите' и закрыть тикет."
                ],
                a: 1
            }
        ], userAnswers: null
    }
];

if (!localStorage.getItem("rc_courses_db_v3")) {
    localStorage.setItem("rc_courses_db_v3", JSON.stringify(expandedCourses));
}

// === ДАННЫЕ ДЛЯ ПРАВИЛ И КОМАНД ===
const rulesData = [
    { category: "Общие правила сервера", rules: [{ title: "1.1 Никнейм", text: "Ник должен соответствовать формату Имя_Фамилия.", punishment: "Kick / Смена ника" }, { title: "1.2 DeathMatch (DM)", text: "Убийство или нанесение урона без IC причины.", punishment: "Demorgan 60-120 мин" }] },
    { category: "Правила Администрации", rules: [{ title: "3.1 Игнорирование", text: "Запрещено игнорировать репорт при наличии онлайна.", punishment: "Выговор" }, { title: "3.2 Конфиденциальность", text: "Слив админ-информации запрещен.", punishment: "Снятие + ЧС" }] }
];

const commandsData = [
    { group: "Основные команды", commands: [{ cmd: "/re [ID]", desc: "Слежка за игроком", example: "/re 15" }, { cmd: "/setmats", desc: "Выдать материалы фракции", example: "/setmats 2 5000" }] }
];

// === ЗАПУСК И СЛУШАТЕЛИ ===
document.addEventListener("DOMContentLoaded", () => {
    renderRules();
    renderCourses();
    renderCommands();
    renderStaff();
    initRoleSelects();

    document.getElementById("profileBtn").addEventListener("click", openProfileModal);
    document.getElementById("loginForm").addEventListener("submit", (e) => { e.preventDefault(); handleLogin(); });
    document.getElementById("logoutBtn").addEventListener("click", handleLogout);
    
    const staffForm = document.getElementById("staffAdminForm");
    if(staffForm) staffForm.addEventListener("submit", (e) => { e.preventDefault(); saveStaffMember(); });

    checkAccessRights();
});

function getCurrentUser() { return JSON.parse(localStorage.getItem("rc_user")) || null; }

function checkAccessRights() {
    const user = getCurrentUser();
    const adminControls = document.getElementById("adminStaffControls");
    const actionCols = document.querySelectorAll(".admin-actions-col");
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
        ROLES_HIERARCHY.forEach(role => { select.innerHTML += `<option value="${role}">${role}</option>`; });
    }
}

// === РЕНДЕР ТАБЛИЦЫ АДМИНИСТРАЦИИ ===
function renderStaff() {
    const staff = JSON.parse(localStorage.getItem("rc_staff_db_v3")) || [];
    const tbody = document.getElementById("staffTableBody");
    if (!tbody) return;
    
    const user = getCurrentUser();
    const isBoss = user && user.role === "Руководство проекта";
    
    tbody.innerHTML = "";
    staff.forEach((s, index) => {
        // Логика подбора стилей на основе статуса человека
        let statusClass = "status-on-duty"; 
        if (s.status === "На форуме") statusClass = "status-forum"; // Добавили класс для форума
        if (s.status === "Не на смене") statusClass = "status-off-duty";
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
    const staff = JSON.parse(localStorage.getItem("rc_staff_db_v3"))[index];
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
    const staff = JSON.parse(localStorage.getItem("rc_staff_db_v3")) || [];

    if (indexStr === "") {
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

    localStorage.setItem("rc_staff_db_v3", JSON.stringify(staff));
    closeStaffModal();
    renderStaff();
    updateProfileUIData();
}

function deleteStaffMember(index) {
    if (confirm("Вы действительно хотите удалить данного администратора?")) {
        const staff = JSON.parse(localStorage.getItem("rc_staff_db_v3"));
        staff.splice(index, 1);
        localStorage.setItem("rc_staff_db_v3", JSON.stringify(staff));
        renderStaff();
    }
}

function closeStaffModal() { document.getElementById("staffAdminModal").classList.remove("open"); }

// === АВТОРИЗАЦИЯ ===
function handleLogin() {
    const nick = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const staff = JSON.parse(localStorage.getItem("rc_staff_db_v3")) || [];
    const matched = staff.find(s => s.nickname.toLowerCase() === nick.toLowerCase());

    if (!matched || matched.password !== pass) {
        alert("Неверный никнейм или пароль доступа!");
        return;
    }

    const userData = { nickname: matched.nickname, role: matched.role, status: matched.status };
    localStorage.setItem("rc_user", JSON.stringify(userData));
    showAccountCard(userData);
    checkAccessRights();
    renderStaff();
    closeModal();
}

// === КУРСЫ ===
function renderCourses() {
    const courses = JSON.parse(localStorage.getItem("rc_courses_db_v3")) || [];
    const grid = document.getElementById("coursesGrid"); if (!grid) return; grid.innerHTML = "";
    courses.forEach(c => {
        let percent = calculateCourseProgress(c);
        let status = "Не начат"; let badgeClass = "badge-not-started";
        if (percent > 0 && percent < 100) { status = "В процессе"; badgeClass = "badge-in-progress"; }
        else if (percent === 100) { status = "Завершен"; badgeClass = "badge-completed"; }
        grid.innerHTML += `<div class="card course-card"><div><h3 class="course-title">${c.title} <span class="accent-text">(${percent}%)</span></h3><p class="course-desc">${c.desc}</p><div class="progress-bar-container" style="margin-bottom: 15px;"><div class="progress-bar" style="width: ${percent}%;"></div></div></div><div class="course-footer"><span class="badge ${badgeClass}">${status}</span><button class="btn btn-secondary btn-sm" onclick="startCourse('${c.id}')">Пройти</button></div></div>`;
    });
}
function calculateCourseProgress(course) { if (!course.userAnswers) return 0; let correctCount = 0; course.questions.forEach((q, idx) => { if (course.userAnswers[idx] === q.a) correctCount++; }); return Math.round((correctCount / course.questions.length) * 100); }
function startCourse(courseId) { const courses = JSON.parse(localStorage.getItem("rc_courses_db_v3")); const course = courses.find(c => c.id === courseId); document.getElementById("activeCourseTitle").innerText = course.title; const container = document.getElementById("courseTestContainer"); container.innerHTML = ""; course.questions.forEach((q, qIdx) => { let optionsHtml = ""; q.o.forEach((opt, oIdx) => { let checked = (course.userAnswers && course.userAnswers[qIdx] === oIdx) ? "checked" : ""; optionsHtml += `<label class="option-label" style="display:block; margin: 8px 0;"><input type="radio" name="question_${qIdx}" value="${oIdx}" ${checked} onchange="saveAnswer('${courseId}', ${qIdx}, ${oIdx})"> <span>${opt}</span></label>`; }); container.innerHTML += `<div class="test-question-block" style="margin-bottom:20px; border-bottom: 1px solid #333; padding-bottom:15px;"><p><strong>Вопрос №${qIdx + 1}:</strong> ${q.q}</p><div>${optionsHtml}</div></div>`; }); document.getElementById("activeCourseZone").style.display = "block"; }
function saveAnswer(courseId, qIdx, oIdx) { const courses = JSON.parse(localStorage.getItem("rc_courses_db_v3")); const course = courses.find(c => c.id === courseId); if (!course.userAnswers) course.userAnswers = {}; course.userAnswers[qIdx] = oIdx; localStorage.setItem("rc_courses_db_v3", JSON.stringify(courses)); renderCourses(); updateProfileUIData(); }
function closeCourseZone() { document.getElementById("activeCourseZone").style.display = "none"; }

// === ИСПРАВЛЕННЫЙ ХЕНДЛЕР ПРАВИЛ (АККОРДЕОН) ===
function renderRules() {
    const container = document.getElementById("rulesAccordion"); 
    if(!container) return; 
    container.innerHTML = ""; 
    rulesData.forEach((cat) => {
        const item = document.createElement("div");
        item.className = "accordion-item"; 
        let rHtml = "";
        cat.rules.forEach(r => { 
            rHtml += `<div class="rule-inner-card" style="background:#1a1a1a; padding:15px; margin-bottom:10px; border-radius:6px;"><div style="font-weight:bold; color:#ffc107;">${r.title}</div><div>${r.text}</div><div style="color:#dc3545; font-size:12px; margin-top:5px;">Наказание: ${r.punishment}</div></div>`; 
        });
        item.innerHTML = `
            <button class="accordion-header" style="width:100%; text-align:left; padding:15px; background:#222; border:none; color:#fff; cursor:pointer; font-weight:bold; display:flex; justify-content:between;">
                <span>${cat.category}</span>
            </button>
            <div class="accordion-content" style="display:none; padding:15px; background:#111;">${rHtml}</div>
        `;
        
        // Исправленный клик по кнопке (аккордеону)
        item.querySelector(".accordion-header").addEventListener("click", () => {
            const content = item.querySelector(".accordion-content");
            const isOpen = content.style.display === "block";
            content.style.display = isOpen ? "none" : "block";
        });
        container.appendChild(item);
    });
}

function openProfileModal() { const m = document.getElementById("profileModal"); m.classList.add("open"); const u = getCurrentUser(); if (u) { showAccountCard(u); } else { showLoginCard(); } }
function closeModal() { document.getElementById("profileModal").classList.remove("open"); }
function showLoginCard() { document.getElementById("accountCard").style.display = "none"; document.getElementById("loginCard").style.display = "block"; }
function showAccountCard(user) { document.getElementById("loginCard").style.display = "none"; document.getElementById("accountCard").style.display = "block"; updateProfileUIData(); }
function updateProfileUIData() { const user = getCurrentUser(); if (!user) return; document.getElementById("profNick").innerText = user.nickname; document.getElementById("profRole").innerText = user.role; document.getElementById("profStatus").innerText = user.status; const courses = JSON.parse(localStorage.getItem("rc_courses_db_v3")) || []; let total = 0; courses.forEach(c => { total += calculateCourseProgress(c); }); let avg = courses.length ? Math.round(total / courses.length) : 0; const pBar = document.getElementById("profProgress"); if (pBar) pBar.style.width = `${avg}%`; const pText = document.getElementById("profProgressText"); if (pText) pText.innerText = `${avg}%`; }
function handleLogout() { localStorage.removeItem("rc_user"); location.reload(); }
function renderCommands() { const container = document.getElementById("commandsContainer"); if(!container) return; container.innerHTML = ""; commandsData.forEach(g => { let rowsHtml = ""; g.commands.forEach(c => { rowsHtml += `<tr><td style="color:#ffc107; font-family:monospace;">${c.cmd}</td><td>${c.desc}</td><td>${c.example}</td></tr>`; }); container.innerHTML += `<h3>${g.group}</h3><table style="width:100%; border-collapse:collapse; margin-bottom:20px;"><thead style="background:#222;"><tr><th style="padding:10px; text-align:left;">Команда</th><th style="padding:10px; text-align:left;">Описание</th><th style="padding:10px; text-align:left;">Пример</th></tr></thead><tbody>${rowsHtml}</tbody></table>`; }); }
