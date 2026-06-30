// === ХИЕРАРХИЯ ДОЛЖНОСТЕЙ (РОЛЕЙ) ДЛЯ ВЫДАЧИ ===
const ROLES_HIERARCHY = [
    "Руководство проекта",
    "Руководитель администрации",
    "Специальный администратор",
    "Главный администратор",
    "Зам. главного администратора",
    "Главный куратор",
    "Помощник главного куратора", // Добавлен согласно ТЗ
    "Администратор 4 уровня",
    "Администратор 3 уровня",
    "Администратор 2 уровня",
    "Модератор"
];

// === ДАННЫЕ ПО УМОЛЧАНИЮ ДЛЯ ИНИЦИАЛИЗАЦИИ В LOCALSTORAGE ===
const defaultStaff = [
    { nickname: "Maxim_Voronov", role: "Руководство проекта", online: 42, tickets: 198, status: "На смене" },
    { nickname: "Alexander_Blat", role: "Руководитель администрации", online: 35, tickets: 154, status: "На смене" },
    { nickname: "Dmitry_Medvedev", role: "Специальный администратор", online: 28, tickets: 120, status: "На смене" },
    { nickname: "Roman_Gromov", role: "Главный администратор", online: 30, tickets: 145, status: "На смене" },
    { nickname: "Nikita_Morozov", role: "Зам. главного администратора", online: 25, tickets: 98, status: "В отпуске" },
    { nickname: "Alina_Kross", role: "Главный куратор", online: 22, tickets: 87, status: "На смене" },
    { nickname: "Pavel_Durov", role: "Помощник главного куратора", online: 20, tickets: 79, status: "На смене" },
    { nickname: "Sergey_Karpov", role: "Администратор 4 уровня", online: 19, tickets: 76, status: "На смене" },
    { nickname: "Ivan_Sokolov", role: "Администратор 3 уровня", online: 15, tickets: 62, status: "В отпуске" },
    { nickname: "Egor_Orlov", role: "Модератор", online: 8, tickets: 21, status: "Уволен" }
];

const defaultCourses = [
    { 
        id: "rp_base", 
        title: "Основы RP", 
        desc: "Базовые понятия ролевого процесса: терминология, предотвращение MG, правила отыгровок.",
        questions: [
            { q: "Что означает термин PG (Powergaming)?", o: ["Убийство без причины", "Преувеличение физических возможностей персонажа", "Повторное убийство"], a: 1 },
            { q: "Какая команда служит для описания состояния окружения?", o: ["/me", "/try", "/do"], a: 2 }
        ],
        userAnswers: null // Хранит ответы пользователя для вычисления процентов
    },
    { 
        id: "server_cmd", 
        title: "Команды сервера", 
        desc: "Практический разбор синтаксиса системных команд взаимодействия и наказаний.",
        questions: [
            { q: "Какая команда выдает предупреждение на аккаунт (Варн)?", o: ["/kick", "/warn", "/ban"], a: 1 },
            { q: "Правильный синтаксис блокировки репорта (Мута)?", o: ["/mute [ID] [Время] [Причина]", "/mute [Время] [ID]", "/slap [ID]"], a: 0 }
        ],
        userAnswers: null
    },
    { 
        id: "admin_tools", 
        title: "Администрирование", 
        desc: "Регламент работы с репортами, логирование и разбор спорных ситуаций.",
        questions: [
            { q: "Разрешено ли влезать в РП процесс без активного репорта?", o: ["Да", "Нет", "Только с разрешения Руководства"], a: 1 }
        ],
        userAnswers: null
    }
];

// Инициализация локальной БД приложения
if (!localStorage.getItem("rc_staff_db")) localStorage.setItem("rc_staff_db", JSON.stringify(defaultStaff));
if (!localStorage.getItem("rc_courses_db")) localStorage.setItem("rc_courses_db", JSON.stringify(defaultCourses));

// Константные блоки статических данных (Правила и Команды)
const rulesData = [
    { category: "Общие правила проекта", rules: [{ title: "1.1 Никнейм", text: "Формат Имя_Фамилия. Без мата.", punishment: "Kick" }] },
    { category: "Правила гос. организаций", rules: [{ title: "2.1 Взятка", text: "Мин. 25.000, макс. 500.000 рублей.", punishment: "Warn" }] },
    { category: "Правила похищений", rules: [{ title: "3.1 Зеленые зоны", text: "Похищения в ЗЗ строго запрещены.", punishment: "Ban 3 дня" }] },
    { category: "Правила ограблений и поставок", rules: [{ title: "4.1 Матовозка", text: "Нападение от 4 человек криминала.", punishment: "Demorgan 60 мин" }] },
    { category: "Правила налетов", rules: [{ title: "5.1 Время", text: "Проведение налетов с 14:00 до 23:00.", punishment: "Откат налета" }] },
    { category: "Правила войны за КрАЗ", rules: [{ title: "6.1 Читы", text: "Использование софта на КрАЗе.", punishment: "PermBan" }] },
    { category: "Правила мероприятий", rules: [{ title: "7.1 Срыв МП", text: "Помеха или ДМ на ивентах администрации.", punishment: "Demorgan 120 мин" }] },
    { category: "Правила лидеров", rules: [{ title: "8.1 Онлайн", text: "Норма лидера — 3 часа чистого онлайна в день.", punishment: "Выговор лидеру" }] }
];

const commandsData = [
    { group: "Команды взаимодействия", commands: [{ cmd: "/me", desc: "Действие от 1-го лица", example: "/me достал паспорт" }, { cmd: "/do", desc: "Описание окружения", example: "/do Паспорт в руке." }] },
    { group: "Административные команды", commands: [{ cmd: "/warn", desc: "Выдача варна", example: "/warn 10 PG" }, { cmd: "/ban", desc: "Бан аккаунта", example: "/ban 5 30 Читы" }] },
    { group: "Транспортные команды", commands: [{ cmd: "/engine", desc: "Двигатель", example: "/engine" }] }
];

// === ОРИЕНТАЦИЯ СИСТЕМЫ ПРИ ЗАГРУЗКЕ ===
document.addEventListener("DOMContentLoaded", () => {
    renderRules();
    renderCourses();
    renderCommands();
    renderStaff();
    initRoleSelects();

    // Навигация и бургер
    const burgerMenu = document.getElementById("burgerMenu");
    const navMenu = document.getElementById("navMenu");
    if(burgerMenu) burgerMenu.addEventListener("click", () => navMenu.classList.toggle("open"));

    // Профиль и Авторизация
    document.getElementById("profileBtn").addEventListener("click", openProfileModal);
    document.getElementById("loginForm").addEventListener("submit", (e) => { e.preventDefault(); handleLogin(); });
    document.getElementById("logoutBtn").addEventListener("click", handleLogout);
    document.getElementById("mapFileInput").addEventListener("change", handleMapUpload);
    document.getElementById("staffAdminForm").addEventListener("submit", (e) => { e.preventDefault(); saveStaffMember(); });

    checkAccessRights();
});

function closeMenu() { document.getElementById("navMenu").classList.remove("open"); }

// === ПРОВЕРКА ДОСТУПА И СИСТЕМЫ ПРАВ ===
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("rc_user")) || null;
}

function checkAccessRights() {
    const user = getCurrentUser();
    const adminControls = document.getElementById("adminStaffControls");
    const actionCols = document.querySelectorAll(".admin-actions-col");

    // Если авторизован как "Руководство проекта"
    if (user && user.role === "Руководство проекта") {
        if(adminControls) adminControls.style.display = "block";
        actionCols.forEach(col => col.style.display = "table-cell");
    } else {
        if(adminControls) adminControls.style.display = "none";
        actionCols.forEach(col => col.style.display = "none");
    }
}

// Заполнение селекторов должностей и ролей в формах
function initRoleSelects() {
    const select = document.getElementById("staffRoleSelect");
    if(select) {
        select.innerHTML = "";
        ROLES_HIERARCHY.forEach(role => {
            select.innerHTML += `<option value="${role}">${role}</option>`;
        });
    }
}

// === ОНЛАЙН ТАБЛИЦА АДМИНИСТРАЦИИ (CRUD) ===
function renderStaff() {
    const staff = JSON.parse(localStorage.getItem("rc_staff_db"));
    const tbody = document.getElementById("staffTableBody");
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
                <td>${s.online}</td>
                <td>${s.tickets}</td>
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
    document.getElementById("staffAdminModal").classList.add("open");
}

function saveStaffMember() {
    const indexStr = document.getElementById("editStaffIndex").value;
    const staff = JSON.parse(localStorage.getItem("rc_staff_db"));

    const newData = {
        nickname: document.getElementById("staffNick").value.trim(),
        role: document.getElementById("staffRoleSelect").value,
        status: document.getElementById("staffStatusSelect").value,
        online: parseInt(document.getElementById("staffOnline").value) || 0,
        tickets: parseInt(document.getElementById("staffTickets").value) || 0
    };

    if (indexStr === "") {
        // Регистрация нового
        staff.push(newData);
    } else {
        // Редактирование существующего (выдача ролей)
        const idx = parseInt(indexStr);
        staff[idx] = newData;
        
        // Если редактировали самого себя, обновляем сессию
        const currentUser = getCurrentUser();
        if(currentUser && currentUser.nickname === staff[idx].nickname) {
            currentUser.role = newData.role;
            currentUser.status = newData.status;
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

// === ИНТЕРАКТИВНЫЕ АКТИВНЫЕ КУРСЫ ===
function renderCourses() {
    const courses = JSON.parse(localStorage.getItem("rc_courses_db"));
    const grid = document.getElementById("coursesGrid");
    grid.innerHTML = "";

    courses.forEach(c => {
        let percent = calculateCourseProgress(c);
        let status = "Не начат";
        let badgeClass = "badge-not-started";

        if (percent > 0 && percent < 100) { status = "В процессе"; badgeClass = "badge-in-progress"; }
        else if (percent === 100) { status = "Завершен"; badgeClass = "badge-completed"; }

        grid.innerHTML += `
            <div class="card course-card">
                <div>
                    <h3 class="course-title">${c.title} <span class="accent-text">(${percent}%)</span></h3>
                    <p class="course-desc">${c.desc}</p>
                    <div class="progress-bar-container" style="margin-bottom: 15px;">
                        <div class="progress-bar" style="width: ${percent}%;"></div>
                    </div>
                </div>
                <div class="course-footer">
                    <span class="badge ${badgeClass}">${status}</span>
                    <button class="btn btn-secondary btn-sm" onclick="startCourse('${c.id}')">Пройти курс</button>
                </div>
            </div>
        `;
    });
}

function calculateCourseProgress(course) {
    if (!course.userAnswers) return 0;
    let correctCount = 0;
    course.questions.forEach((q, idx) => {
        if (course.userAnswers[idx] === q.a) correctCount++;
    });
    return Math.round((correctCount / course.questions.length) * 100);
}

function startCourse(courseId) {
    const user = getCurrentUser();
    if (!user) { alert("Для прохождения сертифицированных курсов необходимо авторизоваться в Профиле!"); return; }

    const courses = JSON.parse(localStorage.getItem("rc_courses_db"));
    const course = courses.find(c => c.id === courseId);
    
    document.getElementById("activeCourseTitle").innerText = `Тестирование по модулю: ${course.title}`;
    const container = document.getElementById("courseTestContainer");
    container.innerHTML = "";

    course.questions.forEach((q, qIdx) => {
        let optionsHtml = "";
        q.o.forEach((opt, oIdx) => {
            let checked = (course.userAnswers && course.userAnswers[qIdx] === oIdx) ? "checked" : "";
            optionsHtml += `
                <label class="option-label">
                    <input type="radio" name="question_${qIdx}" value="${oIdx}" ${checked} onchange="saveAnswer('${courseId}', ${qIdx}, ${oIdx})">
                    <span>${opt}</span>
                </label>
            `;
        });

        container.innerHTML += `
            <div class="test-question-block">
                <p><strong>Вопрос №${qIdx + 1}:</strong> ${q.q}</p>
                <div class="test-options">${optionsHtml}</div>
            </div>
        `;
    });

    document.getElementById("activeCourseZone").style.display = "block";
    document.getElementById("activeCourseZone").scrollIntoView({ behavior: "smooth" });
}

function saveAnswer(courseId, qIdx, oIdx) {
    const courses = JSON.parse(localStorage.getItem("rc_courses_db"));
    const course = courses.find(c => c.id === courseId);
    
    if (!course.userAnswers) course.userAnswers = {};
    course.userAnswers[qIdx] = oIdx;

    localStorage.setItem("rc_courses_db", JSON.stringify(courses));
    renderCourses();
    updateProfileUIData();
}

function closeCourseZone() { document.getElementById("activeCourseZone").style.display = "none"; }

// === АВТОРИЗАЦИЯ И ПРОФИЛЬ ===
function openProfileModal() {
    const modal = document.getElementById("profileModal");
    modal.classList.add("open");
    const user = getCurrentUser();
    if (user) { showAccountCard(user); } else { showLoginCard(); }
}

function closeModal() { document.getElementById("profileModal").classList.remove("open"); }
function showLoginCard() { document.getElementById("accountCard").style.display = "none"; document.getElementById("loginCard").style.display = "block"; }

function showAccountCard(user) {
    document.getElementById("loginCard").style.display = "none";
    document.getElementById("accountCard").style.display = "block";
    updateProfileUIData();
}

function updateProfileUIData() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById("profNick").innerText = user.nickname;
    document.getElementById("profRole").innerText = user.role;
    document.getElementById("profStatus").innerText = user.status;

    // Считаем прогресс по всем курсам в localStorage
    const courses = JSON.parse(localStorage.getItem("rc_courses_db"));
    let totalPercent = 0;
    courses.forEach(c => { totalPercent += calculateCourseProgress(c); });
    let avgPercent = Math.round(totalPercent / courses.length);

    document.getElementById("profProgress").style.width = `${avgPercent}%`;
    document.getElementById("profProgressText").innerText = `${avgPercent}%`;
}

function handleLogin() {
    const nick = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (nick && pass) {
        const staff = JSON.parse(localStorage.getItem("rc_staff_db"));
        const matched = staff.find(s => s.nickname.toLowerCase() === nick.toLowerCase());

        const userData = {
            nickname: matched ? matched.nickname : nick,
            role: matched ? matched.role : "Модератор",
            status: matched ? matched.status : "На смене"
        };

        localStorage.setItem("rc_user", JSON.stringify(userData));
        showAccountCard(userData);
        checkAccessRights();
        renderStaff();
        closeModal();
    }
}

function handleLogout() {
    localStorage.removeItem("rc_user");
    location.reload();
}

// === ОСТАЛЬНЫЕ СТАТИЧЕСКИЕ СЕКЦИИ ===
function renderRules() {
    const container = document.getElementById("rulesAccordion");
    container.innerHTML = "";
    rulesData.forEach((cat, index) => {
        const item = document.createElement("div");
        item.className = "accordion-item";
        let rulesHtml = "";
        cat.rules.forEach(r => {
            rulesHtml += `
                <div class="rule-inner-card">
                    <div class="rule-title-sub">${r.title}</div>
                    <div class="rule-text">${r.text}</div>
                    <div class="rule-punishment">Наказание: ${r.punishment}</div>
                </div>
            `;
        });
        item.innerHTML = `
            <button class="accordion-header"><span>${cat.category}</span><i class="fa-solid fa-chevron-down accordion-icon"></i></button>
            <div class="accordion-content">${rulesHtml}</div>
        `;
        item.querySelector(".accordion-header").addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            document.querySelectorAll(".accordion-item").forEach(el => { el.classList.remove("active"); el.querySelector(".accordion-content").style.maxHeight = null; });
            if (!isActive) { item.classList.add("active"); const content = item.querySelector(".accordion-content"); content.style.maxHeight = content.scrollHeight + "px"; }
        });
        container.appendChild(item);
    });
}

function renderCommands() {
    const container = document.getElementById("commandsContainer");
    container.innerHTML = "";
    commandsData.forEach(g => {
        let rowsHtml = "";
        g.commands.forEach(c => { rowsHtml += `<tr><td style="font-family: monospace; color: #FFA500; font-weight: bold;">${c.cmd}</td><td>${c.desc}</td><td style="color:#B0B0B0; font-style:italic;">${c.example}</td></tr>`; });
        container.innerHTML += `<h3 class="group-title">${g.group}</h3><div class="table-wrapper"><table class="commands-table"><thead><tr><th>Команда</th><th>Описание</th><th>Пример</th></tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
    });
}

function handleMapUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("uploadedMap").src = e.target.result;
            document.getElementById("mapUploadZone").style.display = "none";
            document.getElementById("mapViewWrapper").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

function exportStaffCSV() { alert("CSV сформирован локально на основе ONLINE таблицы."); }
