// === ХРАНЕНИЕ ДАННЫХ ВНУТРИ ДВИЖКА (МАССИВЫ И ОБЪЕКТЫ) ===

const rulesData = [
    {
        category: "Общие правила проекта",
        rules: [
            { title: "1.1 Игровой никнейм", text: "Никнейм игрока на сервере должен иметь формат Имя_Фамилия. Запрещено использование нецензурных слов.", punishment: "Kick / Изменение ника" },
            { title: "1.2 Отыгровка в свою пользу", text: "Запрещено моделирование ситуаций, дающих необоснованное преимущество в обход логики RP.", punishment: "Demorgan 60 минут" }
        ]
    },
    {
        category: "Правила гос. организаций",
        rules: [
            { title: "2.1 Взятки и коррупция", text: "Минимальный размер взятки должностным лицом — 25.000, максимальный — 500.000 игровых рублей.", punishment: "Warn / Увольнение" },
            { title: "2.2 Обыск без оснований", text: "Сотрудникам силовых ведомств (УВД/ФСБ) категорически запрещено обыскивать граждан или транспорт без ордера или процессуальной фиксации.", punishment: "Demorgan 120 минут" }
        ]
    },
    {
        category: "Правила похищений",
        rules: [
            { title: "3.1 Лимиты выкупа", text: "Суммы выкупа за заложников зависят от ранга и фракции. Передача денег происходит под контролем администрации.", punishment: "Устное предупреждение лидеру" },
            { title: "3.2 Зеленые зоны", text: "Проведение похищений в границах функциональных Зеленых Зон строго карается.", punishment: "Ban 3 дня всем участникам" }
        ]
    },
    {
        category: "Правила ограблений и поставок",
        rules: [
            { title: "4.1 Нападение на матовозку", text: "Атака на военную колонну снабжения допускается только в количестве от 4-х человек со стороны криминальных структур.", punishment: "Demorgan 60 минут" },
            { title: "4.2 Перекрытие дорог", text: "Использование автотранспорта для полного блокирования дорожного полотна без зазоров запрещено (PG).", punishment: "Demorgan 90 минут" }
        ]
    },
    {
        category: "Правила налетов",
        rules: [
            { title: "5.1 Время налетов", text: "Налеты на бизнесы и склады разрешено проводить в промежуток с 14:00 до 23:00 по МСК.", punishment: "Аннулирование итогов налета" }
        ]
    },
    {
        category: "Правила войны за КрАЗ",
        rules: [
            { title: "6.1 Использование софта", text: "Использование сторонних модификаций и запрещенного софта для захвата ценных грузов на КрАЗе.", punishment: "Permanent Ban" }
        ]
    },
    {
        category: "Правила мероприятий",
        rules: [
            { title: "7.1 Поведение на МП", text: "Запрещен срыв глобальных и фракционных серверных мероприятий, ДМ во время проведения ивентов.", punishment: "Kick / Demorgan 60 минут" }
        ]
    },
    {
        category: "Правила лидеров",
        rules: [
            { title: "8.1 Онлайн лидера", text: "Минимальный чистый онлайн лидера фракции должен составлять не менее 3 часов в сутки.", punishment: "Выговор лидеру (1/3)" }
        ]
    }
];

const coursesData = [
    { id: "rp_base", title: "Основы RP", desc: "Изучение базовых понятий ролевого процесса: терминология, предотвращение MG, правила отыгровок действий.", status: "Не начат", progress: 0 },
    { id: "server_cmd", title: "Команды сервера", desc: "Практический разбор синтаксиса системных команд взаимодействия, государственных ведомств и раций.", status: "В процессе", progress: 45 },
    { id: "admin_tools", title: "Администрирование", desc: "Регламент работы с репортами, логирование нарушений, правила выдачи блокировок чатов, деморганов и банов.", status: "Завершен", progress: 100 }
];

const commandsData = [
    {
        group: "Команды взаимодействия",
        commands: [
            { cmd: "/me", desc: "Отыгровка действий персонажа от первого лица.", example: "/me плавным движением руки передал документы" },
            { cmd: "/do", desc: "Описание состояния окружения или персонажа.", example: "/do Паспорт находится в раскрытом виде в руке." },
            { cmd: "/try", desc: "Попытка выполнения сложного действия с шансом на успех.", example: "/try попытался взломать замок двери [Успешно]" },
            { cmd: "/pay", desc: "Передача наличных денежных средств другому игроку.", example: "/pay 12 5000" }
        ]
    },
    {
        group: "Административные команды",
        commands: [
            { cmd: "/warn", desc: "Выдача предупреждения на аккаунт (3 варна = бан).", example: "/warn 105 Нарушение правил гос.структур" },
            { cmd: "/kick", desc: "Принудительное отключение нарушителя от сервера.", example: "/kick 42 АФК без ESC на дороге" },
            { cmd: "/ban", desc: "Блокировка доступа к игровому серверу на определенный срок.", example: "/ban 14 30 Читы / Уход от RP" },
            { cmd: "/mute", desc: "Блокировка текстового или голосового чата игрока.", example: "/mute 88 60 Оскорбление администрации" }
        ]
    },
    {
        group: "Транспортные команды",
        commands: [
            { cmd: "/engine", desc: "Запустить или заглушить двигатель транспортного средства.", example: "/engine" },
            { cmd: "/lock", desc: "Открыть или закрыть двери автомобиля.", example: "/lock" },
            { cmd: "/fix", desc: "Быстрое восстановление работоспособности двигателя администратором.", example: "/fix 215" }
        ]
    }
];

const staffData = [
    { nickname: "Maxim_Voronov", role: "Руководство", online: 42, tickets: 198, status: "На смене" },
    { nickname: "Alexander_Blat", role: "Руководитель администрации", online: 35, tickets: 154, status: "На смене" },
    { nickname: "Dmitry_Medvedev", role: "Специальный администратор", online: 28, tickets: 120, status: "На смене" },
    { nickname: "Roman_Gromov", role: "Главный администратор", online: 30, tickets: 145, status: "На смене" },
    { nickname: "Nikita_Morozov", role: "Зам. главного администратора", online: 25, tickets: 98, status: "В отпуске" },
    { nickname: "Alina_Kross", role: "Главный куратор", online: 22, tickets: 87, status: "На смене" },
    { nickname: "Sergey_Karpov", role: "Администратор 4 уровня", online: 19, tickets: 76, status: "На смене" },
    { nickname: "Ivan_Sokolov", role: "Администратор 3 уровня", online: 15, tickets: 62, status: "В отпуске" },
    { nickname: "Pavel_Volkov", role: "Администратор 2 уровня", online: 12, tickets: 44, status: "На смене" },
    { nickname: "Egor_Orlov", role: "Модератор", online: 8, tickets: 21, status: "Уволен" }
];

// === ЛОГИКА РЕНДЕРИНГА И ИНТЕРАКТИВА ===

document.addEventListener("DOMContentLoaded", () => {
    // Первичный рендеринг блоков данных
    renderRules();
    renderCourses();
    renderCommands();
    renderStaff();

    // Настройка бургер-меню
    const burgerMenu = document.getElementById("burgerMenu");
    const navMenu = document.getElementById("navMenu");
    burgerMenu.addEventListener("click", () => {
        navMenu.classList.toggle("open");
    });

    // Обработка загрузки карты
    const mapFileInput = document.getElementById("mapFileInput");
    mapFileInput.addEventListener("change", handleMapUpload);

    const mapViewWrapper = document.getElementById("mapViewWrapper");
    mapViewWrapper.addEventListener("click", (e) => {
        if (e.target.id === "uploadedMap") {
            const rect = e.target.getBoundingClientRect();
            const x = Math.round(e.clientX - rect.left);
            const y = Math.round(e.clientY - rect.top);
            alert(`Установка маркера зоны\nКоординаты клика по карте: X: ${x}, Y: ${y}`);
        }
    });

    document.getElementById("addMarkerBtn").addEventListener("click", () => {
        alert("Режим добавления меток активирован! Кликните в любую точку на карте города.");
    });

    // Модальное окно профиля и авторизации
    const profileModal = document.getElementById("profileModal");
    const profileBtn = document.getElementById("profileBtn");
    const loginCard = document.getElementById("loginCard");
    const accountCard = document.getElementById("accountCard");
    
    const closeLoginBtn = document.getElementById("closeLoginBtn");
    const closeAccountBtn = document.getElementById("closeAccountBtn");

    profileBtn.addEventListener("click", () => {
        profileModal.classList.add("open");
        const user = localStorage.getItem("rc_user");
        if (user) {
            showAccountCard(JSON.parse(user));
        } else {
            showLoginCard();
        }
    });

    closeLoginBtn.addEventListener("click", () => profileModal.classList.remove("open"));
    closeAccountBtn.addEventListener("click", () => profileModal.classList.remove("open"));

    // Форма логина
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Выход из профиля
    document.getElementById("logoutBtn").addEventListener("click", handleLogout);

    // Подсветка активных пунктов меню при скролле
    window.addEventListener("scroll", () => {
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-link");
        let currentSectionId = "hero";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });
});

function closeMenu() {
    document.getElementById("navMenu").classList.remove("open");
}

// Рендеринг правил (аккордеон)
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
                    <div class="rule-punishment">Регламент наказания: ${r.punishment}</div>
                </div>
            `;
        });

        item.innerHTML = `
            <button class="accordion-header">
                <span>${cat.category}</span>
                <i class="fa-solid fa-chevron-down accordion-icon"></i>
            </button>
            <div class="accordion-content">
                ${rulesHtml}
            </div>
        `;

        // Событие клика для раскрытия списков аккордеона
        item.querySelector(".accordion-header").addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            document.querySelectorAll(".accordion-item").forEach(el => {
                el.classList.remove("active");
                el.querySelector(".accordion-content").style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add("active");
                const content = item.querySelector(".accordion-content");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });

        container.appendChild(item);
    });
}

// Рендеринг курсов
function renderCourses() {
    const grid = document.getElementById("coursesGrid");
    grid.innerHTML = "";

    coursesData.forEach(c => {
        let badgeClass = "badge-not-started";
        if (c.status === "В процессе") badgeClass = "badge-in-progress";
        if (c.status === "Завершен") badgeClass = "badge-completed";

        grid.innerHTML += `
            <div class="card course-card">
                <div>
                    <h3 class="course-title">${c.title}</h3>
                    <p class="course-desc">${c.desc}</p>
                </div>
                <div class="course-footer">
                    <span class="badge ${badgeClass}">${c.status}</span>
                    <button class="btn btn-secondary btn-sm" onclick="alert('Переход к изучению курса: &quot;${c.title}&quot;. Модуль находится в режиме синхронизации с игровым сервером.')">Перейти к курсу</button>
                </div>
            </div>
        `;
    });
}

// Рендеринг таблиц игровых команд
function renderCommands() {
    const container = document.getElementById("commandsContainer");
    container.innerHTML = "";

    commandsData.forEach(g => {
        let rowsHtml = "";
        g.commands.forEach(c => {
            rowsHtml += `
                <tr>
                    <td style="font-family: monospace; color: #FFA500; font-weight: bold;">${c.cmd}</td>
                    <td>${c.desc}</td>
                    <td style="color: #B0B0B0; font-style: italic;">${c.example}</td>
                </tr>
            `;
        });

        container.innerHTML += `
            <h3 class="group-title">${g.group}</h3>
            <div class="table-wrapper">
                <table class="commands-table">
                    <thead>
                        <tr>
                            <th>Команда</th>
                            <th>Описание</th>
                            <th>Пример использования</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    });
}

// Рендеринг таблицы состава администрации
function renderStaff() {
    const tbody = document.getElementById("staffTableBody");
    tbody.innerHTML = "";

    staffData.forEach(s => {
        let statusClass = "status-on-duty";
        if (s.status === "В отпуске") statusClass = "status-vacation";
        if (s.status === "Уволен") statusClass = "status-fired";

        tbody.innerHTML += `
            <tr>
                <td style="font-weight: 500;">${s.nickname}</td>
                <td>${s.role}</td>
                <td>${s.online}</td>
                <td>${s.tickets}</td>
                <td><span class="status-indicator ${statusClass}">${s.status}</span></td>
            </tr>
        `;
    });
}

// Загрузка карты
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

// Управление профилем (Авторизация)
function showLoginCard() {
    document.getElementById("accountCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";
}

function showAccountCard(user) {
    document.getElementById("loginCard").style.display = "none";
    document.getElementById("accountCard").style.display = "block";

    document.getElementById("profNick").innerText = user.nickname;
    document.getElementById("profRole").innerText = user.role;
    document.getElementById("profStatus").innerText = user.status;
    
    // Вычисляем средний прогресс по курсам для профиля
    const totalProgress = coursesData.reduce((acc, c) => acc + c.progress, 0);
    const avgProgress = Math.round(totalProgress / coursesData.length);

    document.getElementById("profProgress").style.width = `${avgProgress}%`;
    document.getElementById("profProgressText").innerText = `${avgProgress}%`;
}

function handleLogin() {
    const nick = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (nick && pass) {
        // Попытка сопоставить с существующим администратором из staffData
        const matchedStaff = staffData.find(s => s.nickname.toLowerCase() === nick.toLowerCase());
        
        const userData = {
            nickname: matchedStaff ? matchedStaff.nickname : nick,
            role: matchedStaff ? matchedStaff.role : "Стажёр администрации",
            status: matchedStaff ? matchedStaff.status : "На смене"
        };

        localStorage.setItem("rc_user", JSON.stringify(userData));
        showAccountCard(userData);
    }
}

function handleLogout() {
    localStorage.removeItem("rc_user");
    location.reload();
}

// Заглушка экспорта состава в CSV
function exportStaffCSV() {
    alert("Формирование документа...\nЭкспорт таблицы состава администрации в формат .CSV успешно сгенерирован и подготовлен локальной машиной.");
}
