/* =========================================================
   KARPATHOS
   =========================================================

   EDIT YOUR ENTIRE WEEKLY TIMETABLE HERE.

   Each item can be:

   Lesson:
   {
       start: "08:00",
       end: "08:45",
       subject: "Mathematics",
       room: "204",
       teacher: "Teacher Name"
   }

   Break:
   {
       start: "08:45",
       end: "08:55",
       type: "break",
       label: "BREAK"
   }

   You can add, remove or reorder entries freely.
   Team A and Team B have completely independent schedules.
   ========================================================= */

   const schedules = {
    A: {
        monday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Bio Info",
                room: "KTT",
                teacher: "BBeus"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "Szoftvertesztelés",
                room: "207",
                teacher: "Harangozó"
            },
            {
                start: "09:40",
                end: "09:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:55",
                end: "10:40",
                subject: "Szoftvertesztelés",
                room: "207",
                teacher: "Harangozó"
            },
            {
                start: "10:30",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "IKT",
                room: "207",
                teacher: "Harangozó"
            },
            {
                start: "11:35",
                end: "11:45",
                type: "break",
                label: "BREAK"
            },
            {
                start: "11:45",
                end: "12:30",
                subject: "IKT",
                room: "207",
                teacher: "Harangozó"
            },
            {
                start: "12:30",
                end: "12:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "12:55",
                end: "13:40",
                subject: "IKT",
                room: "207",
                teacher: "Harangozó"
            },
            {
                start: "13:40",
                end: "13:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "13:50",
                end: "14:35",
                subject: "Suck My",
                room: "201",
                teacher: "Botos"
            }
        ],

        tuesday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Töri",
                room: "101",
                teacher: "Zeke"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "Töri",
                room: "101",
                teacher: "Zeke"
            },
            {
                start: "09:40",
                end: "09:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:55",
                end: "10:40",
                subject: "Matek",
                room: "103",
                teacher: "Teczár"
            },
            {
                start: "10:30",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Matek",
                room: "103",
                teacher: "Teczár"
            },
            {
                start: "11:35",
                end: "11:45",
                type: "break",
                label: "BREAK"
            },
            {
                start: "11:45",
                end: "12:30",
                subject: "Angol",
                room: "137",
                teacher: "Hardi"
            },
            {
                start: "12:30",
                end: "12:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "12:55",
                end: "13:40",
                subject: "Angol",
                room: "137",
                teacher: "Hardi"
            },
            {
                start: "13:40",
                end: "13:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "13:50",
                end: "14:35",
                subject: "Tesi",
                room: "Uszi",
                teacher: "Szarka"
            },
            {
                start: "14:35",
                end: "14:40",
                type: "break",
                label: "BREAK"
            },
            {
                start: "14:40",
                end: "15:25",
                subject: "Irodalom",
                room: "101",
                teacher: "Szümegi"
            }
        ],

        wednesday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Emelt Matek",
                room: "127",
                teacher: "Pálfi"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "Emelt Matek",
                room: "127",
                teacher: "Pálfi"
            },
            {
                start: "09:40",
                end: "09:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:55",
                end: "10:40",
                subject: "Állampolgari",
                room: "101",
                teacher: "Zeke"
            },
            {
                start: "10:30",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Matek",
                room: "103",
                teacher: "Teczár"
            },
            {
                start: "11:35",
                end: "11:45",
                type: "break",
                label: "BREAK"
            },
            {
                start: "11:45",
                end: "12:30",
                subject: "Irodalom",
                room: "101",
                teacher: "Szümegi"
            },
            {
                start: "12:30",
                end: "12:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "12:55",
                end: "13:40",
                subject: "Irodalom",
                room: "101",
                teacher: "Szümegi"
            },
            {
                start: "13:40",
                end: "13:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "13:50",
                end: "14:35",
                subject: "Tesi",
                room: "Janza",
                teacher: "Puskás"
            },
            {
                start: "14:35",
                end: "14:40",
                type: "break",
                label: "BREAK"
            },
            {
                start: "14:40",
                end: "15:25",
                subject: "Matek",
                room: "103",
                teacher: "Teczár"
            }
        ],

        thursday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Webprog",
                room: "207",
                teacher: "Dufka"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "Webprog",
                room: "207",
                teacher: "Dufka"
            },
            {
                start: "09:40",
                end: "09:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:55",
                end: "10:40",
                subject: "Suck My",
                room: "Fizika",
                teacher: "Botos"
            },
            {
                start: "10:30",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Suck My",
                room: "Fizika",
                teacher: "Botos"
            },
            {
                start: "11:35",
                end: "11:45",
                type: "break",
                label: "BREAK"
            },
            {
                start: "11:45",
                end: "12:30",
                subject: "Asztali",
                room: "212",
                teacher: "Harangozó"
            },
            {
                start: "12:30",
                end: "12:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "12:55",
                end: "13:40",
                subject: "Asztali",
                room: "212",
                teacher: "Harangozó"
            },
            {
                start: "13:40",
                end: "13:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "13:50",
                end: "14:35",
                subject: "Asztali",
                room: "212",
                teacher: "Harangozó"
            }
        ],

        friday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Biology",
                room: "302",
                teacher: "Laura Green"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "History",
                room: "202",
                teacher: "Emma Davis"
            },
            {
                start: "09:40",
                end: "09:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:50",
                end: "10:35",
                subject: "English",
                room: "105",
                teacher: "John Brown"
            },
            {
                start: "10:35",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Mathematics",
                room: "204",
                teacher: "Anna Smith"
            }
        ]
    },

    B: {
        monday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "English",
                room: "105",
                teacher: "John Brown"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "Mathematics",
                room: "204",
                teacher: "Anna Smith"
            },
            {
                start: "09:40",
                end: "09:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:50",
                end: "10:35",
                subject: "History",
                room: "202",
                teacher: "Emma Davis"
            },
            {
                start: "10:35",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Computer Science",
                room: "Lab 1",
                teacher: "Michael Taylor"
            }
        ],

        tuesday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Physics",
                room: "301",
                teacher: "Peter Wilson"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "English",
                room: "105",
                teacher: "John Brown"
            },
            {
                start: "09:40",
                end: "09:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:50",
                end: "10:35",
                subject: "Mathematics",
                room: "204",
                teacher: "Anna Smith"
            },
            {
                start: "10:35",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Biology",
                room: "302",
                teacher: "Laura Green"
            }
        ],

        wednesday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Mathematics",
                room: "204",
                teacher: "Anna Smith"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "Art",
                room: "110",
                teacher: "Sophie Clark"
            },
            {
                start: "09:40",
                end: "09:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:50",
                end: "10:35",
                subject: "History",
                room: "202",
                teacher: "Emma Davis"
            },
            {
                start: "10:35",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "English",
                room: "105",
                teacher: "John Brown"
            }
        ],

        thursday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "Biology",
                room: "302",
                teacher: "Laura Green"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "Computer Science",
                room: "Lab 1",
                teacher: "Michael Taylor"
            },
            {
                start: "09:40",
                end: "09:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:50",
                end: "10:35",
                subject: "Physics",
                room: "301",
                teacher: "Peter Wilson"
            },
            {
                start: "10:35",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Mathematics",
                room: "204",
                teacher: "Anna Smith"
            }
        ],

        friday: [
            {
                start: "08:00",
                end: "08:45",
                subject: "History",
                room: "202",
                teacher: "Emma Davis"
            },
            {
                start: "08:45",
                end: "08:55",
                type: "break",
                label: "BREAK"
            },
            {
                start: "08:55",
                end: "09:40",
                subject: "English",
                room: "105",
                teacher: "John Brown"
            },
            {
                start: "09:40",
                end: "09:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "09:50",
                end: "10:35",
                subject: "Mathematics",
                room: "204",
                teacher: "Anna Smith"
            },
            {
                start: "10:35",
                end: "10:50",
                type: "break",
                label: "BREAK"
            },
            {
                start: "10:50",
                end: "11:35",
                subject: "Physical Education",
                room: "Gym",
                teacher: "Mark White"
            }
        ]
    }
};


/* =========================================================
   GENERAL CONSTANTS
   ========================================================= */

const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday"
];

const DAY_NAMES = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday"
};

const DAY_SHORT_NAMES = {
    monday: "MON",
    tuesday: "TUE",
    wednesday: "WED",
    thursday: "THU",
    friday: "FRI"
};

const PASSWORDS = {
    A: "08",
    B: "09"
};

const STORAGE_KEYS = {
    team: "karpathosTeam",
    theme: "karpathosTheme"
};


/* =========================================================
   HELPERS
   ========================================================= */

function pad(number) {
    return String(number).padStart(2, "0");
}

function formatDuration(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    return `${pad(minutes)}:${pad(seconds)}`;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function dateFromTime(date, time) {
    const [hours, minutes] = time.split(":").map(Number);

    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);

    return result;
}

function getCurrentDay() {
    const dayIndex = new Date().getDay();

    if (dayIndex === 0) {
        return "monday";
    }

    if (dayIndex === 6) {
        return "friday";
    }

    return DAYS[dayIndex - 1];
}

function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(date);
}

function getSortedSchedule(team, day) {
    return [...(schedules[team]?.[day] || [])].sort(
        (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
    );
}

function getLessonEntries(schedule) {
    return schedule.filter(item => item.type !== "break");
}


/* =========================================================
   LOGIN PAGE
   ========================================================= */

function initLoginPage() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    if (localStorage.getItem(STORAGE_KEYS.team)) {
        window.location.replace("karpathos.html");
        return;
    }

    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("loginError");

    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const selectedTeam = loginForm.querySelector(
            'input[name="team"]:checked'
        ).value;

        const password = passwordInput.value.trim();

        if (password === PASSWORDS[selectedTeam]) {
            localStorage.setItem(STORAGE_KEYS.team, selectedTeam);
            window.location.replace("karpathos.html");
            return;
        }

        errorMessage.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
    });

    passwordInput.addEventListener("input", () => {
        errorMessage.textContent = "";
    });
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function getLoggedInTeam() {
    return localStorage.getItem(STORAGE_KEYS.team);
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.team);
    window.location.replace("index.html");
}


/* =========================================================
   THEME
   ========================================================= */

function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || "light";
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem(STORAGE_KEYS.theme, theme);

    document.querySelectorAll(".theme-button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.theme === theme
        );
    });
}

function initTheme() {
    applyTheme(getSavedTheme());

    document.querySelectorAll(".theme-button").forEach(button => {
        button.addEventListener("click", () => {
            applyTheme(button.dataset.theme);
        });
    });
}


/* =========================================================
   AVERAGE CALCULATOR
   ========================================================= */

let gradeId = 0;

function addGrade(value = "") {
    const gradesList = document.getElementById("gradesList");

    if (!gradesList) {
        return;
    }

    gradeId++;

    const row = document.createElement("div");
    row.className = "grade-row";
    row.dataset.gradeId = gradeId;

    const input = document.createElement("input");
    input.className = "grade-input";
    input.type = "number";
    input.min = "1";
    input.max = "5";
    input.step = "0.01";
    input.placeholder = "Grade";
    input.value = value;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-grade";
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", "Remove grade");

    input.addEventListener("input", calculateAverage);

    removeButton.addEventListener("click", () => {
        row.remove();
        calculateAverage();
    });

    row.append(input, removeButton);
    gradesList.appendChild(row);

    if (value === "") {
        input.focus();
    }

    calculateAverage();
}

function calculateAverage() {
    const inputs = document.querySelectorAll(".grade-input");
    const averageValue = document.getElementById("averageValue");

    if (!averageValue) {
        return;
    }

    const grades = [...inputs]
        .map(input => Number(input.value))
        .filter(grade => Number.isFinite(grade));

    if (grades.length === 0) {
        averageValue.textContent = "—";
        return;
    }

    const average =
        grades.reduce((sum, grade) => sum + grade, 0) / grades.length;

    averageValue.textContent = average.toFixed(2);
}

function initAverageCalculator() {
    const addButton = document.getElementById("addGradeButton");

    if (!addButton) {
        return;
    }

    addButton.addEventListener("click", () => addGrade());

    addGrade();
}


/* =========================================================
   DAY SELECTOR
   ========================================================= */

let selectedDay = null;

function selectDay(day) {
    if (!DAYS.includes(day)) {
        return;
    }

    selectedDay = day;

    document.querySelectorAll("#daySelector button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.day === selectedDay
        );
    });

    renderSchedule();
    updateTimer();
}

function initDaySelector() {
    const currentDay = getCurrentDay();

    document.querySelectorAll("#daySelector button").forEach(button => {
        button.addEventListener("click", () => {
            selectDay(button.dataset.day);
        });
    });

    selectDay(currentDay);
}


/* =========================================================
   SCHEDULE RENDERING
   ========================================================= */

function getScheduleState(item, schedule, now) {
    const start = dateFromTime(now, item.start);
    const end = dateFromTime(now, item.end);

    if (now >= end) {
        return "finished";
    }

    if (now >= start && now < end) {
        return "current";
    }

    const currentIndex = schedule.indexOf(item);

    const nextLesson = schedule
        .slice(currentIndex + 1)
        .find(entry => entry.type !== "break" && now < dateFromTime(now, entry.start));

    if (nextLesson) {
        return "";
    }

    return "";
}

function getCurrentScheduleEntry(schedule, now) {
    return schedule.find(item => {
        const start = dateFromTime(now, item.start);
        const end = dateFromTime(now, item.end);

        return now >= start && now < end;
    }) || null;
}

function getNextLesson(schedule, now) {
    return getLessonEntries(schedule).find(item => {
        const start = dateFromTime(now, item.start);
        return start > now;
    }) || null;
}

function getNextLessonAfter(schedule, item) {
    if (!item) {
        return null;
    }

    const index = schedule.indexOf(item);

    return schedule
        .slice(index + 1)
        .find(entry => entry.type !== "break") || null;
}

function getCurrentLesson(schedule, now) {
    const current = getCurrentScheduleEntry(schedule, now);

    if (current && current.type !== "break") {
        return current;
    }

    return null;
}

function getCurrentBreak(schedule, now) {
    const current = getCurrentScheduleEntry(schedule, now);

    if (current && current.type === "break") {
        return current;
    }

    return null;
}

function getNextUpcomingLesson(schedule, now) {
    const current = getCurrentScheduleEntry(schedule, now);

    if (current) {
        const currentIndex = schedule.indexOf(current);

        return schedule
            .slice(currentIndex + 1)
            .find(item => item.type !== "break") || null;
    }

    return getNextLesson(schedule, now);
}

function renderSchedule() {
    const team = getLoggedInTeam();
    const scheduleList = document.getElementById("scheduleList");

    if (!team || !scheduleList || !selectedDay) {
        return;
    }

    const schedule = getSortedSchedule(team, selectedDay);
    const now = new Date();

    document.getElementById("selectedDayName").textContent =
        DAY_NAMES[selectedDay];

    const isCurrentDay = selectedDay === getCurrentDay();

    document.getElementById("selectedDayDate").textContent =
        isCurrentDay
            ? "Today"
            : "";

    scheduleList.innerHTML = "";

    if (schedule.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-schedule";
        empty.textContent = "No lessons scheduled for this day.";
        scheduleList.appendChild(empty);
        return;
    }

    let nextLessonMarked = false;

    schedule.forEach(item => {
        if (item.type === "break") {
            const breakElement = document.createElement("div");
            breakElement.className = "schedule-item break";

            breakElement.innerHTML = `
                <div>
                    <div class="break-time">${item.start} – ${item.end}</div>
                </div>
                <div class="break-label">${item.label || "BREAK"}</div>
            `;

            scheduleList.appendChild(breakElement);
            return;
        }

        let state = "";

        if (isCurrentDay) {
            const start = dateFromTime(now, item.start);
            const end = dateFromTime(now, item.end);

            if (now >= end) {
                state = "finished";
            } else if (now >= start && now < end) {
                state = "current";
            } else if (!nextLessonMarked && now < start) {
                state = "next";
                nextLessonMarked = true;
            }
        }

        const element = document.createElement("div");
        element.className = `schedule-item lesson ${state}`;

        const stateLabel = {
            current: "Now",
            next: "Next",
            finished: "Done"
        }[state] || "";

        const teacherText = item.teacher
            ? ` • ${item.teacher}`
            : "";

        element.innerHTML = `
            <div class="schedule-time">
                ${item.start}<br>
                ${item.end}
            </div>

            <div class="schedule-main">
                <div class="schedule-subject">${escapeHtml(item.subject)}</div>
                <div class="schedule-meta">
                    ${item.room ? `Room ${escapeHtml(item.room)}` : ""}
                    ${escapeHtml(teacherText)}
                </div>
            </div>

            <div class="schedule-state">${stateLabel}</div>
        `;

        scheduleList.appendChild(element);
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   TIMER
   ========================================================= */

function setTimerStatus(text, className = "") {
    const status = document.getElementById("timerStatus");

    status.textContent = text;
    status.className = `timer-status ${className}`.trim();
}

function setLessonInformation(context, subject, details) {
    document.getElementById("lessonContext").textContent = context;
    document.getElementById("lessonName").textContent = subject;
    document.getElementById("lessonDetails").textContent = details;
}

function getLessonDetails(lesson) {
    if (!lesson) {
        return "";
    }

    const details = [];

    if (lesson.room) {
        details.push(`Room ${lesson.room}`);
    }

    if (lesson.teacher) {
        details.push(lesson.teacher);
    }

    return details.join(" • ");
}

function updateTimer() {
    const team = getLoggedInTeam();

    if (!team || !selectedDay) {
        return;
    }

    const now = new Date();
    const currentDay = getCurrentDay();

    document.getElementById("currentTime").textContent =
        formatTime(now);

    document.getElementById("todayLabel").textContent =
        DAY_NAMES[currentDay];

    document.getElementById("dateLabel").textContent =
        formatDate(now);

    document.getElementById("footerDay").textContent =
        DAY_SHORT_NAMES[selectedDay];

    const schedule = getSortedSchedule(team, selectedDay);
    const isCurrentDay = selectedDay === currentDay;

    /*
       If another day is selected, the schedule is shown normally,
       but the real-time countdown is deliberately disabled.
    */
    if (!isCurrentDay) {
        setTimerStatus("Schedule preview");
        document.getElementById("countdown").textContent = "--:--:--";

        const firstLesson = getLessonEntries(schedule)[0];

        if (firstLesson) {
            setLessonInformation(
                "First lesson",
                firstLesson.subject,
                getLessonDetails(firstLesson)
            );

            document.getElementById("timerDescription").textContent =
                `${firstLesson.start} start`;
        } else {
            setLessonInformation(
                "Schedule",
                "No lessons",
                "Nothing scheduled"
            );

            document.getElementById("timerDescription").textContent =
                "No timetable entries";
        }

        return;
    }

    if (schedule.length === 0) {
        setTimerStatus("No school");
        document.getElementById("countdown").textContent = "00:00:00";

        setLessonInformation(
            "Today",
            "No lessons",
            "Nothing scheduled"
        );

        document.getElementById("timerDescription").textContent =
            "No lessons scheduled today";

        return;
    }

    const firstEntry = schedule[0];
    const lastEntry = schedule[schedule.length - 1];

    const schoolStart = dateFromTime(now, firstEntry.start);
    const schoolEnd = dateFromTime(now, lastEntry.end);

    const currentEntry = getCurrentScheduleEntry(schedule, now);
    const currentLesson = getCurrentLesson(schedule, now);
    const currentBreak = getCurrentBreak(schedule, now);

    /* BEFORE SCHOOL */
    if (now < schoolStart) {
        const nextLesson = getLessonEntries(schedule)[0];

        setTimerStatus("Before school");

        document.getElementById("countdown").textContent =
            formatDuration((schoolStart - now) / 1000);

        setLessonInformation(
            "Next lesson",
            nextLesson.subject,
            getLessonDetails(nextLesson)
        );

        document.getElementById("timerDescription").textContent =
            `Until ${nextLesson.start}`;

        return;
    }

    /* CURRENT LESSON */
    if (currentLesson) {
        const end = dateFromTime(now, currentLesson.end);
        const nextLesson = getNextLessonAfter(schedule, currentLesson);

        setTimerStatus("In lesson");

        document.getElementById("countdown").textContent =
            formatDuration((end - now) / 1000);

        setLessonInformation(
            "Current lesson",
            currentLesson.subject,
            getLessonDetails(currentLesson)
        );

        document.getElementById("timerDescription").textContent =
            nextLesson
                ? `Ends at ${currentLesson.end} • Next: ${nextLesson.subject}`
                : `Ends at ${currentLesson.end}`;

        return;
    }

    /* CURRENT BREAK */
    if (currentBreak) {
        const end = dateFromTime(now, currentBreak.end);
        const nextLesson = getNextLessonAfter(schedule, currentBreak);

        setTimerStatus("Break", "break");

        document.getElementById("countdown").textContent =
            formatDuration((end - now) / 1000);

        if (nextLesson) {
            setLessonInformation(
                "Next lesson",
                nextLesson.subject,
                getLessonDetails(nextLesson)
            );

            document.getElementById("timerDescription").textContent =
                `Break ends at ${currentBreak.end}`;
        } else {
            setLessonInformation(
                "Break",
                "School day ending",
                ""
            );

            document.getElementById("timerDescription").textContent =
                `Break ends at ${currentBreak.end}`;
        }

        return;
    }

    /* AFTER SCHOOL */
    if (now >= schoolEnd) {
        setTimerStatus("After school", "after-school");

        document.getElementById("countdown").textContent =
            "00:00:00";

        setLessonInformation(
            "School day",
            "Finished",
            "See you tomorrow"
        );

        document.getElementById("timerDescription").textContent =
            `School ended at ${lastEntry.end}`;

        return;
    }

    /*
       We are in a gap between entries that isn't explicitly marked
       as a break. Treat it as a break automatically.
    */
    const nextLesson = getNextUpcomingLesson(schedule, now);

    if (nextLesson) {
        const nextStart = dateFromTime(now, nextLesson.start);

        setTimerStatus("Break", "break");

        document.getElementById("countdown").textContent =
            formatDuration((nextStart - now) / 1000);

        setLessonInformation(
            "Next lesson",
            nextLesson.subject,
            getLessonDetails(nextLesson)
        );

        document.getElementById("timerDescription").textContent =
            `Starts at ${nextLesson.start}`;

        return;
    }

    setTimerStatus("After school", "after-school");
}


/* =========================================================
   DASHBOARD INITIALIZATION
   ========================================================= */

function initDashboard() {
    const team = getLoggedInTeam();

    if (!team || !schedules[team]) {
        window.location.replace("index.html");
        return;
    }

    const teamName = `Team ${team}`;

    document.getElementById("teamBadge").textContent = teamName;
    document.getElementById("mobileTeamBadge").textContent = teamName;
    document.getElementById("footerTeam").textContent = team;

    document.getElementById("logoutButton").addEventListener(
        "click",
        logout
    );

    initTheme();
    initAverageCalculator();
    initDaySelector();

    updateTimer();
    renderSchedule();

    /*
       Updating every second makes the countdown, real clock,
       lesson state and schedule highlighting stay synchronized.
    */
    setInterval(() => {
        updateTimer();
        renderSchedule();
    }, 1000);
}


/* =========================================================
   PAGE ENTRY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initLoginPage();

    if (document.querySelector(".app-shell")) {
        initDashboard();
    }
});
