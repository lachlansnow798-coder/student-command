const STORAGE_KEY = "student-command-v28";
const LEGACY_STORAGE_KEYS = ["student-command-v27", "student-command-v26", "student-command-v25", "student-command-v24", "student-command-v23", "student-command-v22", "student-command-v21", "student-command-v20", "student-command-v19", "student-command-v18", "student-command-v17", "student-command-v16", "student-command-v15", "student-command-v14", "student-command-v13", "student-command-v12", "student-command-v11", "student-command-v10", "student-command-v9"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const state = loadState();
let currentImportProposals = [];
let audioContext = null;
let toastTimer = null;

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
  proofSignal: document.querySelector("#proofSignal"),
  nextTestMetric: document.querySelector("#nextTestMetric"),
  studyMetric: document.querySelector("#studyMetric"),
  readinessMetric: document.querySelector("#readinessMetric"),
  scheduleRange: document.querySelector("#scheduleRange"),
  weekPlan: document.querySelector("#weekPlan"),
  todayTitle: document.querySelector("#todayTitle"),
  todayDateLabel: document.querySelector("#todayDateLabel"),
  dailyBriefingLead: document.querySelector("#dailyBriefingLead"),
  dailyBriefingGrid: document.querySelector("#dailyBriefingGrid"),
  nextBlockTitle: document.querySelector("#nextBlockTitle"),
  nextBlockDetail: document.querySelector("#nextBlockDetail"),
  nextBlockCountdown: document.querySelector("#nextBlockCountdown"),
  mustDoStatus: document.querySelector("#mustDoStatus"),
  todayMustDos: document.querySelector("#todayMustDos"),
  setupForm: document.querySelector("#setupForm"),
  setupSchoolName: document.querySelector("#setupSchoolName"),
  setupCommuteStart: document.querySelector("#setupCommuteStart"),
  setupSchoolStart: document.querySelector("#setupSchoolStart"),
  setupSchoolEnd: document.querySelector("#setupSchoolEnd"),
  setupSchoolDays: document.querySelectorAll(".setup-school-day"),
  setupCycleEnabled: document.querySelector("#setupCycleEnabled"),
  setupCycleLength: document.querySelector("#setupCycleLength"),
  setupCycleStartDate: document.querySelector("#setupCycleStartDate"),
  setupCycleSubjects: document.querySelector("#setupCycleSubjects"),
  quickActivityForm: document.querySelector("#quickActivityForm"),
  quickActivityName: document.querySelector("#quickActivityName"),
  quickActivityDate: document.querySelector("#quickActivityDate"),
  quickActivityStart: document.querySelector("#quickActivityStart"),
  quickActivityEnd: document.querySelector("#quickActivityEnd"),
  quickActivityType: document.querySelector("#quickActivityType"),
  quickActivityDetail: document.querySelector("#quickActivityDetail"),
  quickActivityList: document.querySelector("#quickActivityList"),
  checklist: document.querySelector("#checklist"),
  checklistCount: document.querySelector("#checklistCount"),
  taskForm: document.querySelector("#taskForm"),
  taskType: document.querySelector("#taskType"),
  subject: document.querySelector("#subject"),
  dueDate: document.querySelector("#dueDate"),
  priority: document.querySelector("#priority"),
  topics: document.querySelector("#topics"),
  taskList: document.querySelector("#taskList"),
  importText: document.querySelector("#importText"),
  importImage: document.querySelector("#importImage"),
  importStatus: document.querySelector("#importStatus"),
  importPreview: document.querySelector("#importPreview"),
  importProposals: document.querySelector("#importProposals"),
  analyzeImport: document.querySelector("#analyzeImport"),
  clearImport: document.querySelector("#clearImport"),
  acceptImport: document.querySelector("#acceptImport"),
  generatePlan: document.querySelector("#generatePlan"),
  buildQuiz: document.querySelector("#buildQuiz"),
  newQuizSet: document.querySelector("#newQuizSet"),
  quizTask: document.querySelector("#quizTask"),
  questionCount: document.querySelector("#questionCount"),
  quizOutput: document.querySelector("#quizOutput"),
  coachRegeneratePlan: document.querySelector("#coachRegeneratePlan"),
  coachModeToggle: document.querySelector("#coachModeToggle"),
  coachModeTitle: document.querySelector("#coachModeTitle"),
  coachAutoReduce: document.querySelector("#coachAutoReduce"),
  coachVerdict: document.querySelector("#coachVerdict"),
  coachReason: document.querySelector("#coachReason"),
  coachScoreLabel: document.querySelector("#coachScoreLabel"),
  coachStats: document.querySelector("#coachStats"),
  coachCheckinForm: document.querySelector("#coachCheckinForm"),
  coachCheckinDate: document.querySelector("#coachCheckinDate"),
  coachCheckinList: document.querySelector("#coachCheckinList"),
  coachRealityNote: document.querySelector("#coachRealityNote"),
  coachTomorrowChange: document.querySelector("#coachTomorrowChange"),
  coachActionList: document.querySelector("#coachActionList"),
  aiProvider: document.querySelector("#aiProvider"),
  aiApiKey: document.querySelector("#aiApiKey"),
  pasteAiKey: document.querySelector("#pasteAiKey"),
  toggleAiKeyVisibility: document.querySelector("#toggleAiKeyVisibility"),
  aiModel: document.querySelector("#aiModel"),
  aiStatus: document.querySelector("#aiStatus"),
  saveAiSettings: document.querySelector("#saveAiSettings"),
  clearAiSettings: document.querySelector("#clearAiSettings"),
  checkLocalAi: document.querySelector("#checkLocalAi"),
  clearChat: document.querySelector("#clearChat"),
  chatMessages: document.querySelector("#chatMessages"),
  aiChatForm: document.querySelector("#aiChatForm"),
  aiPrompt: document.querySelector("#aiPrompt"),
  sendAiPrompt: document.querySelector("#sendAiPrompt"),
  routineForm: document.querySelector("#routineForm"),
  routineName: document.querySelector("#routineName"),
  routineDay: document.querySelector("#routineDay"),
  routineStart: document.querySelector("#routineStart"),
  routineEnd: document.querySelector("#routineEnd"),
  routineList: document.querySelector("#routineList"),
  soundToggle: document.querySelector("#soundToggle"),
  appToast: document.querySelector("#appToast"),
  installApp: document.querySelector("#installApp"),
  resetDemo: document.querySelector("#resetDemo"),
};

generatePlanIfNeeded();
wireEvents();
registerServiceWorker();
switchView(getInitialView());
render();

function createDefaultSchoolSettings() {
  return {
    setupComplete: false,
    schoolName: "",
    schoolDays: [1, 2, 3, 4, 5],
    commuteStart: "07:45",
    schoolStart: "08:30",
    schoolEnd: "15:30",
    cycleEnabled: false,
    cycleLength: 5,
    cycleStartDate: "",
    cycleSubjects: {},
  };
}

function defaultState() {
  return {
    tasks: [],
    schoolSettings: createDefaultSchoolSettings(),
    routines: [],
    quickBlocks: [],
    studyBlocks: [],
    lifeBlocks: [],
    commandLog: {},
    aiSettings: {
      provider: "ollama",
      apiKey: "",
      model: "llama3.2",
      openAiModel: "gpt-5-mini",
      ollamaModel: "llama3.2",
    },
    chatMessages: [],
    quizSets: {},
    quizAnswers: {},
    checklist: {},
    coachSettings: {
      enabled: true,
      autoReduceBusiness: true,
    },
    coachCheckins: {},
    coachActions: [],
    soundEnabled: true,
  };
}

function routine(name, day, start, end, category = "routine") {
  return { id: crypto.randomUUID(), name, day, start, end, category };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY) || LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
  if (!saved) {
    const fresh = defaultState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const normalized = normalizeState(JSON.parse(saved));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    const fresh = defaultState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function normalizeState(candidate) {
  const normalized = {
    tasks: Array.isArray(candidate.tasks) ? candidate.tasks : [],
    schoolSettings: normalizeSchoolSettings(candidate.schoolSettings),
    routines: Array.isArray(candidate.routines) ? candidate.routines : [],
    quickBlocks: Array.isArray(candidate.quickBlocks) ? candidate.quickBlocks : [],
    studyBlocks: Array.isArray(candidate.studyBlocks) ? candidate.studyBlocks : [],
    lifeBlocks: Array.isArray(candidate.lifeBlocks) ? candidate.lifeBlocks : [],
    commandLog: candidate.commandLog && typeof candidate.commandLog === "object" ? candidate.commandLog : {},
    aiSettings: normalizeAiSettings(candidate.aiSettings),
    chatMessages: Array.isArray(candidate.chatMessages) ? candidate.chatMessages.slice(-24) : [],
    quizSets: candidate.quizSets && typeof candidate.quizSets === "object" ? candidate.quizSets : {},
    quizAnswers: candidate.quizAnswers && typeof candidate.quizAnswers === "object" ? candidate.quizAnswers : {},
    checklist: candidate.checklist && typeof candidate.checklist === "object" ? candidate.checklist : {},
    coachSettings: normalizeCoachSettings(candidate.coachSettings),
    coachCheckins: candidate.coachCheckins && typeof candidate.coachCheckins === "object" ? candidate.coachCheckins : {},
    coachActions: Array.isArray(candidate.coachActions) ? candidate.coachActions.slice(-30) : [],
    soundEnabled: typeof candidate.soundEnabled === "boolean" ? candidate.soundEnabled : true,
  };

  return normalized;
}

function normalizeAiSettings(settings = {}) {
  const savedProvider = ["ollama", "openai"].includes(settings.provider) ? settings.provider : "ollama";
  const provider = savedProvider === "openai" && settings.allowPaidOpenAi !== true ? "ollama" : savedProvider;
  const openAiModel = clean(settings.openAiModel) || (String(settings.model || "").startsWith("gpt-") ? clean(settings.model) : "gpt-5-mini");
  const ollamaModel = clean(settings.ollamaModel) || (!String(settings.model || "").startsWith("gpt-") ? clean(settings.model) : "llama3.2") || "llama3.2";
  return {
    provider,
    apiKey: typeof settings.apiKey === "string" ? settings.apiKey : "",
    model: clean(settings.model) || (provider === "openai" ? openAiModel : ollamaModel),
    openAiModel,
    ollamaModel,
    allowPaidOpenAi: settings.allowPaidOpenAi === true && provider === "openai",
  };
}

function normalizeSchoolSettings(settings = {}) {
  const defaults = createDefaultSchoolSettings();
  const rawDays = Array.isArray(settings.schoolDays) ? settings.schoolDays : defaults.schoolDays;
  const schoolDays = [...new Set(rawDays.map(Number).filter((day) => day >= 0 && day <= 6))].sort((a, b) => a - b);
  const cycleLength = clampNumber(Number(settings.cycleLength), 1, 20, defaults.cycleLength);
  const cycleSubjects = settings.cycleSubjects && typeof settings.cycleSubjects === "object" ? settings.cycleSubjects : {};

  return {
    setupComplete: settings.setupComplete === true,
    schoolName: clean(settings.schoolName),
    schoolDays: schoolDays.length ? schoolDays : defaults.schoolDays,
    commuteStart: validTime(settings.commuteStart) ? settings.commuteStart : defaults.commuteStart,
    schoolStart: validTime(settings.schoolStart) ? settings.schoolStart : defaults.schoolStart,
    schoolEnd: validTime(settings.schoolEnd) ? settings.schoolEnd : defaults.schoolEnd,
    cycleEnabled: settings.cycleEnabled === true,
    cycleLength,
    cycleStartDate: validDateInput(settings.cycleStartDate) ? settings.cycleStartDate : "",
    cycleSubjects: Object.fromEntries(
      Array.from({ length: cycleLength }, (_, index) => {
        const day = String(index + 1);
        const subjects = Array.isArray(cycleSubjects[day])
          ? cycleSubjects[day].map(clean).filter(Boolean)
          : splitTopics(cycleSubjects[day] || "");
        return [day, subjects];
      }),
    ),
  };
}

function normalizeCoachSettings(settings = {}) {
  return {
    enabled: settings.enabled !== false,
    autoReduceBusiness: settings.autoReduceBusiness !== false,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // The app still works without offline caching when opened as a local file.
    });
  });
}

function generatePlanIfNeeded() {
  const today = startOfDay(new Date());
  const end = addDays(today, 14);
  const activeTargets = upcomingTasks(false)
    .filter((task) => !task.completed)
    .filter((task) => ["test", "homework"].includes(task.type))
    .filter((task) => parseDate(task.dueDate) >= today && parseDate(task.dueDate) <= end);
  const completedIds = new Set(state.tasks.filter((task) => task.completed).map((task) => task.id));
  const hasCompletedStudyBlocks = state.studyBlocks.some((block) => completedIds.has(block.taskId));
  const hasMissingStudyTarget = activeTargets.some((task) => !state.studyBlocks.some((block) => block.taskId === task.id));

  if ((!state.studyBlocks.length && !state.lifeBlocks.length) || hasCompletedStudyBlocks || hasMissingStudyTarget) {
    generateStudyPlan();
    saveState();
  }
}

function wireEvents() {
  let installPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    elements.installApp.hidden = false;
  });

  elements.installApp.addEventListener("click", async () => {
    if (!installPrompt) return;
    playSound("tap");
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    elements.installApp.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    elements.installApp.hidden = true;
  });

  elements.navItems.forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
      playSound("tap");
    });
  });

  elements.soundToggle.addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    renderSoundToggle();
    if (state.soundEnabled) playSound("success", { force: true });
    showToast(state.soundEnabled ? "Sound effects on." : "Sound effects off.");
  });

  renderSetup();
  elements.setupForm.addEventListener("submit", handleSetupSubmit);

  elements.quickActivityDate.value = toDateInput(new Date());
  elements.quickActivityForm.addEventListener("submit", handleQuickActivitySubmit);

  elements.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.tasks.push({
      id: crypto.randomUUID(),
      type: elements.taskType.value,
      subject: clean(elements.subject.value),
      dueDate: elements.dueDate.value,
      priority: elements.priority.value,
      topics: clean(elements.topics.value),
      completed: false,
    });
    elements.taskForm.reset();
    elements.priority.value = "high";
    generateStudyPlan();
    saveState();
    render();
    playSound("success");
    showToast("Task added. Your plan was regenerated.");
  });

  elements.importImage.addEventListener("change", handleImportImage);

  elements.analyzeImport.addEventListener("click", () => {
    currentImportProposals = analyzeImportText(elements.importText.value);
    renderImportProposals();
    playSound(currentImportProposals.length ? "scan" : "warning");
    showToast(currentImportProposals.length ? "Review the proposed changes before accepting." : "No useful school info found yet.");
  });

  elements.clearImport.addEventListener("click", () => {
    currentImportProposals = [];
    elements.importText.value = "";
    elements.importImage.value = "";
    elements.importPreview.hidden = true;
    elements.importPreview.removeAttribute("src");
    elements.importStatus.textContent = "The app will propose changes first. Nothing is added until you accept.";
    renderImportProposals();
    playSound("tap");
    showToast("Import cleared.");
  });

  elements.acceptImport.addEventListener("click", () => {
    const acceptedTasks = readAcceptedImportProposals();
    if (!acceptedTasks.length) {
      elements.importStatus.textContent = "Select at least one proposal before accepting.";
      playSound("warning");
      showToast("Select a proposal first.");
      return;
    }

    state.tasks.push(...acceptedTasks);
    generateStudyPlan();
    saveState();
    currentImportProposals = [];
    elements.importStatus.textContent = `Added ${acceptedTasks.length} item${acceptedTasks.length === 1 ? "" : "s"} and regenerated your schedule.`;
    render();
    renderImportProposals();
    playSound("success");
    showToast(`Added ${acceptedTasks.length} item${acceptedTasks.length === 1 ? "" : "s"} to your plan.`);
  });

  elements.routineForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.routines.push(
      routine(
        clean(elements.routineName.value),
        Number(elements.routineDay.value),
        elements.routineStart.value,
        elements.routineEnd.value,
      ),
    );
    elements.routineForm.reset();
    generateStudyPlan();
    saveState();
    render();
    playSound("success");
    showToast("Routine block added.");
  });

  elements.generatePlan.addEventListener("click", () => {
    generateStudyPlan();
    saveState();
    render();
    playSound("plan");
    showToast("Study plan regenerated.");
  });

  elements.buildQuiz.addEventListener("click", () => {
    renderQuiz();
    playSound("tap");
    showToast("Quiz generated.");
  });

  elements.newQuizSet.addEventListener("click", () => {
    const taskId = elements.quizTask.value;
    if (!taskId) return;
    state.quizSets[taskId] = (state.quizSets[taskId] || 0) + 1;
    saveState();
    renderQuiz();
    playSound("scan");
    showToast("New question set ready.");
  });

  elements.coachCheckinDate.value = toDateInput(new Date());

  elements.coachModeToggle.addEventListener("change", () => {
    state.coachSettings.enabled = elements.coachModeToggle.checked;
    generateStudyPlan();
    logCoachAction(
      state.coachSettings.enabled ? "Coach Mode switched on." : "Coach Mode switched off.",
      state.coachSettings.enabled
        ? "The app will now challenge skipped work and protect school priorities."
        : "The planner will stop applying strict coach consequences.",
      state.coachSettings.enabled ? "focus" : "calm",
    );
    saveState();
    render();
    playSound(state.coachSettings.enabled ? "success" : "tap");
    showToast(state.coachSettings.enabled ? "Coach Mode on." : "Coach Mode off.");
  });

  elements.coachAutoReduce.addEventListener("change", () => {
    state.coachSettings.autoReduceBusiness = elements.coachAutoReduce.checked;
    generateStudyPlan();
    logCoachAction(
      state.coachSettings.autoReduceBusiness ? "Project time can be reduced." : "Project time protected from coach cuts.",
      state.coachSettings.autoReduceBusiness
        ? "If school work falls behind, Coach Mode will reclaim project blocks first."
        : "School catch-up will still be flagged, but project blocks will not be reduced automatically.",
      state.coachSettings.autoReduceBusiness ? "warning" : "calm",
    );
    saveState();
    render();
    playSound("plan");
    showToast("Coach rules updated.");
  });

  elements.coachRegeneratePlan.addEventListener("click", () => {
    generateStudyPlan();
    logCoachAction("Coach rebuilt the plan.", buildCoachVerdict(startOfDay(new Date())).reason, "focus");
    saveState();
    render();
    playSound("plan");
    showToast("Plan rebuilt with Coach Mode rules.");
  });

  elements.coachCheckinDate.addEventListener("change", renderCoach);
  elements.coachCheckinForm.addEventListener("submit", handleCoachCheckinSubmit);

  elements.pasteAiKey.addEventListener("click", pasteAiKeyFromClipboard);

  elements.toggleAiKeyVisibility.addEventListener("click", () => {
    const isHidden = elements.aiApiKey.type === "password";
    elements.aiApiKey.type = isHidden ? "text" : "password";
    elements.toggleAiKeyVisibility.textContent = isHidden ? "Hide key" : "Show key";
    playSound("tap");
  });

  elements.aiProvider.addEventListener("change", () => {
    state.aiSettings.provider = elements.aiProvider.value;
    state.aiSettings.allowPaidOpenAi = state.aiSettings.provider === "openai";
    elements.aiModel.value = getActiveAiModel();
    saveState();
    renderAiChat();
    playSound("tap");
  });

  elements.saveAiSettings.addEventListener("click", () => {
    const typedKey = elements.aiApiKey.value.trim();
    if (typedKey) state.aiSettings.apiKey = typedKey;
    state.aiSettings.provider = elements.aiProvider.value;
    state.aiSettings.allowPaidOpenAi = state.aiSettings.provider === "openai";
    if (state.aiSettings.provider === "openai") {
      state.aiSettings.openAiModel = clean(elements.aiModel.value) || "gpt-5-mini";
    } else {
      state.aiSettings.ollamaModel = clean(elements.aiModel.value) || "llama3.2";
    }
    state.aiSettings.model = getActiveAiModel();
    saveState();
    renderAiChat();
    playSound(canAskAi() ? "success" : "warning");
    showToast(canAskAi() ? "AI settings saved." : "OpenAI mode needs an API key.");
  });

  elements.clearAiSettings.addEventListener("click", () => {
    state.aiSettings.apiKey = "";
    elements.aiApiKey.value = "";
    saveState();
    renderAiChat();
    playSound("warning");
    showToast("AI key cleared from this app.");
  });

  elements.clearChat.addEventListener("click", () => {
    state.chatMessages = [];
    saveState();
    renderAiChat();
    playSound("tap");
    showToast("Chat cleared.");
  });

  elements.checkLocalAi.addEventListener("click", checkLocalAiStatus);

  elements.aiChatForm.addEventListener("submit", handleAiChatSubmit);

  elements.resetDemo.addEventListener("click", () => {
    const fresh = defaultState();
    Object.assign(state, fresh);
    generateStudyPlan();
    saveState();
    render();
    playSound("warning");
    showToast("Demo data reset.");
  });
}

function switchView(view) {
  elements.navItems.forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  elements.views.forEach((panel) => panel.classList.toggle("is-visible", panel.dataset.panel === view));
}

function getInitialView() {
  const requested = new URLSearchParams(window.location.search).get("view");
  if (document.querySelector(`[data-panel="${requested}"]`)) return requested;
  return state.schoolSettings.setupComplete ? "today" : "setup";
}

function render() {
  renderMetrics();
  renderSetup();
  renderTodayCommandCenter();
  renderWeekPlan();
  renderChecklist();
  renderTasks();
  renderCoach();
  renderRoutine();
  renderQuizOptions();
  renderAiChat();
  renderSoundToggle();
}

function renderSoundToggle() {
  elements.soundToggle.textContent = state.soundEnabled ? "Sound on" : "Sound off";
  elements.soundToggle.setAttribute("aria-pressed", state.soundEnabled ? "true" : "false");
}

function renderSetup() {
  const settings = state.schoolSettings;
  elements.setupSchoolName.value = settings.schoolName;
  elements.setupCommuteStart.value = settings.commuteStart;
  elements.setupSchoolStart.value = settings.schoolStart;
  elements.setupSchoolEnd.value = settings.schoolEnd;
  elements.setupCycleEnabled.checked = settings.cycleEnabled;
  elements.setupCycleLength.value = settings.cycleLength;
  elements.setupCycleStartDate.value = settings.cycleStartDate;
  elements.setupCycleSubjects.value = formatCycleSubjects(settings.cycleSubjects, settings.cycleLength);
  elements.setupSchoolDays.forEach((checkbox) => {
    checkbox.checked = settings.schoolDays.includes(Number(checkbox.value));
  });
}

function handleSetupSubmit(event) {
  event.preventDefault();

  const schoolDays = [...elements.setupSchoolDays]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => Number(checkbox.value));

  if (!schoolDays.length) {
    showToast("Pick at least one school day.");
    playSound("warning");
    return;
  }

  if (toMinutes(elements.setupSchoolEnd.value) <= toMinutes(elements.setupSchoolStart.value)) {
    showToast("School end time must be after start time.");
    playSound("warning");
    return;
  }

  const cycleLength = clampNumber(Number(elements.setupCycleLength.value), 1, 20, 5);
  const cycleSubjects = parseCycleSubjects(elements.setupCycleSubjects.value, cycleLength);
  state.schoolSettings = normalizeSchoolSettings({
    setupComplete: true,
    schoolName: elements.setupSchoolName.value,
    schoolDays,
    commuteStart: elements.setupCommuteStart.value,
    schoolStart: elements.setupSchoolStart.value,
    schoolEnd: elements.setupSchoolEnd.value,
    cycleEnabled: elements.setupCycleEnabled.checked,
    cycleLength,
    cycleStartDate: elements.setupCycleStartDate.value,
    cycleSubjects,
  });

  generateStudyPlan();
  saveState();
  render();
  playSound("success");
  showToast("School setup saved. Planner regenerated.");
}

function parseCycleSubjects(value, cycleLength) {
  const subjects = {};
  String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const match = line.match(/^day\s*(\d+)\s*:\s*(.+)$/i);
      if (!match) return;
      const day = Number(match[1]);
      if (day < 1 || day > cycleLength) return;
      subjects[String(day)] = splitTopics(match[2]);
    });

  return subjects;
}

function formatCycleSubjects(subjects = {}, cycleLength = 5) {
  return Array.from({ length: cycleLength }, (_, index) => {
    const day = String(index + 1);
    const entries = Array.isArray(subjects[day]) ? subjects[day] : [];
    return entries.length ? `Day ${day}: ${entries.join(", ")}` : "";
  })
    .filter(Boolean)
    .join("\n");
}

function renderCoach() {
  const today = startOfDay(new Date());
  const selectedDateKey = elements.coachCheckinDate.value || toDateInput(today);
  const selectedDate = parseDate(selectedDateKey);
  const verdict = buildCoachVerdict(today);
  const stats = buildCoachStats();
  const plannedItems = buildTodayMustDos(selectedDate);
  const savedCheckin = state.coachCheckins[selectedDateKey] || {};

  elements.coachModeToggle.checked = state.coachSettings.enabled;
  elements.coachAutoReduce.checked = state.coachSettings.autoReduceBusiness;
  elements.coachModeTitle.textContent = state.coachSettings.enabled ? "Coach Mode is active" : "Coach Mode is off";
  elements.coachVerdict.textContent = verdict.title;
  elements.coachReason.textContent = verdict.reason;
  elements.coachScoreLabel.textContent = `${stats.completionRate}%`;

  elements.coachStats.innerHTML = [
    ["Done", stats.done, "Completed planned items."],
    ["Skipped", stats.skipped, "Misses Coach Mode will not ignore."],
    ["Moved", stats.moved, "Work you pushed later."],
    ["Active", stats.active, "Still open today."],
  ]
    .map(
      ([label, value, detail]) => `
        <article class="coach-stat">
          <span>${label}</span>
          <strong>${value}</strong>
          <p>${detail}</p>
        </article>
      `,
    )
    .join("");

  elements.coachCheckinList.innerHTML = "";
  if (!plannedItems.length) {
    elements.coachCheckinList.innerHTML = `<p class="empty-state">No planned must-do items for this date.</p>`;
  } else {
    plannedItems.forEach((item) => {
      const status = getCommandStatus(selectedDateKey, item.id);
      const row = document.createElement("article");
      row.className = `coach-checkin-item ${status}`;
      row.innerHTML = `
        <div>
          <span class="pill">${escapeHtml(status)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.detail)}</p>
        </div>
        <div class="command-actions">
          <button class="ghost-button" type="button" data-action="done">Done</button>
          <button class="ghost-button" type="button" data-action="skipped">${state.coachSettings.enabled && isCoachImportantItem(item) ? "Skip / pay" : "Skip"}</button>
          <button class="ghost-button" type="button" data-action="moved">Move</button>
        </div>
      `;
      row.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => updateCommandItem(selectedDateKey, item, button.dataset.action));
      });
      elements.coachCheckinList.appendChild(row);
    });
  }

  elements.coachRealityNote.value = savedCheckin.realityNote || "";
  elements.coachTomorrowChange.value = savedCheckin.tomorrowChange || "";

  renderCoachActions();
}

function renderCoachActions() {
  elements.coachActionList.innerHTML = "";
  const actions = state.coachActions.slice(-8).reverse();

  if (!actions.length) {
    elements.coachActionList.innerHTML = `<p class="empty-state">No coach consequences logged yet. Skipping important work will show up here.</p>`;
    return;
  }

  actions.forEach((action) => {
    const item = document.createElement("article");
    item.className = `coach-action ${action.tone || "calm"}`;
    item.innerHTML = `
      <span>${escapeHtml(formatShortDate(action.dateKey || toDateInput(new Date())))}</span>
      <strong>${escapeHtml(action.title)}</strong>
      <p>${escapeHtml(action.detail)}</p>
    `;
    elements.coachActionList.appendChild(item);
  });
}

function buildCoachVerdict(date) {
  if (!state.coachSettings.enabled) {
    return {
      title: "Coach Mode is off. The app will organise, not challenge you.",
      reason: "Turn it on if you want the planner to treat skipped school work as a real tradeoff.",
    };
  }

  const pressure = getCoachPressureForDate(date);
  const stats = buildCoachStats();

  if (pressure.level >= 2) {
    return {
      title: "School work is ahead of projects today.",
      reason: `${pressure.reasons.join(" ")} Coach Mode can cut project time until this is under control.`,
    };
  }

  if (pressure.level === 1) {
    return {
      title: "You are close to slipping. Prove the work first.",
      reason: `${pressure.reasons.join(" ")} Finish one study/checklist item before low-value work.`,
    };
  }

  if (stats.skipped > stats.done && stats.skipped > 0) {
    return {
      title: "Your plan is not the problem. Follow-through is.",
      reason: "More skipped items than completed items in the recent log. Tighten today before adding new goals.",
    };
  }

  return {
    title: "No major warning. Keep the day clean.",
    reason: "Project time stays protected because school work is not visibly behind.",
  };
}

function buildCoachStats() {
  const todayKey = toDateInput(new Date());
  const currentActive = buildTodayMustDos(new Date()).filter((item) => getCommandStatus(todayKey, item.id) === "active").length;
  const recentStart = toDateInput(addDays(startOfDay(new Date()), -13));
  const entries = Object.entries(state.commandLog)
    .map(([key, value]) => ({ dateKey: key.slice(0, 10), status: value?.status }))
    .filter((entry) => entry.dateKey >= recentStart);

  const done = entries.filter((entry) => entry.status === "done").length;
  const skipped = entries.filter((entry) => entry.status === "skipped").length;
  const moved = entries.filter((entry) => entry.status === "moved").length;
  const measured = done + skipped + moved + currentActive;
  const completionRate = measured ? Math.round((done / measured) * 100) : 0;

  return { done, skipped, moved, active: currentActive, completionRate };
}

function handleCoachCheckinSubmit(event) {
  event.preventDefault();

  const dateKey = elements.coachCheckinDate.value || toDateInput(new Date());
  const plannedItems = buildTodayMustDos(parseDate(dateKey));
  const statuses = plannedItems.map((item) => ({
    id: item.id,
    title: item.title,
    status: getCommandStatus(dateKey, item.id),
  }));
  const openImportant = plannedItems.filter((item) => getCommandStatus(dateKey, item.id) === "active" && isCoachImportantItem(item));

  state.coachCheckins[dateKey] = {
    realityNote: cleanMultiline(elements.coachRealityNote.value),
    tomorrowChange: cleanMultiline(elements.coachTomorrowChange.value),
    statuses,
    completedAt: new Date().toISOString(),
  };

  if (state.coachSettings.enabled && openImportant.length) {
    openImportant.forEach((item) => {
      state.commandLog[commandLogKey(dateKey, item.id)] = {
        status: "skipped",
        updatedAt: new Date().toISOString(),
      };
    });
  }

  generateStudyPlan();
  logCoachAction(
    "End-of-day check-in logged.",
    openImportant.length
      ? `${openImportant.length} unfinished important item${openImportant.length === 1 ? "" : "s"} counted as skipped and the plan was rebuilt.`
      : "No unfinished important item was left active in the check-in.",
    openImportant.length ? "warning" : "success",
    dateKey,
  );
  saveState();
  render();
  playSound(openImportant.length ? "warning" : "success");
  showToast(openImportant.length ? "Unfinished important work counted as skipped. Plan rebuilt." : "Check-in logged. Plan rebuilt.");
}

function logCoachAction(title, detail, tone = "calm", dateKey = toDateInput(new Date())) {
  state.coachActions.push({
    id: crypto.randomUUID(),
    title,
    detail,
    tone,
    dateKey,
    createdAt: new Date().toISOString(),
  });
  state.coachActions = state.coachActions.slice(-30);
}

function showToast(message) {
  if (!elements.appToast) return;

  elements.appToast.textContent = message;
  elements.appToast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.appToast.classList.remove("is-visible");
  }, 2600);
}

function playSound(kind = "tap", options = {}) {
  if (!state.soundEnabled && !options.force) return;

  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;

  try {
    audioContext = audioContext || new Audio();
    audioContext.resume?.();

    const patterns = {
      tap: { notes: [220], duration: 0.035, type: "sine", gain: 0.018 },
      scan: { notes: [294, 392], duration: 0.045, type: "sine", gain: 0.02 },
      plan: { notes: [262, 330, 392], duration: 0.045, type: "triangle", gain: 0.018 },
      success: { notes: [523, 659], duration: 0.06, type: "sine", gain: 0.024 },
      warning: { notes: [196, 165], duration: 0.075, type: "triangle", gain: 0.019 },
    };
    const pattern = patterns[kind] || patterns.tap;

    pattern.notes.forEach((frequency, index) => {
      const start = audioContext.currentTime + index * (pattern.duration + 0.018);
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = pattern.type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(pattern.gain, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + pattern.duration);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + pattern.duration + 0.025);
    });
  } catch {
    // Sound is a bonus. If the browser blocks audio, the app keeps working.
  }
}

function renderTodayCommandCenter() {
  const today = startOfDay(new Date());
  const dateKey = toDateInput(today);
  const nextBlock = getNextBlockForDate(today);
  const mustDos = buildTodayMustDos(today);

  elements.todayTitle.textContent = `${dayNames[today.getDay()]} Command`;
  elements.todayDateLabel.textContent = formatLongDate(dateKey);
  renderDailyBriefing(today, nextBlock, mustDos);

  if (nextBlock) {
    elements.nextBlockTitle.textContent = nextBlock.name;
    elements.nextBlockDetail.textContent = `${nextBlock.time} · ${nextBlock.detail || "No extra detail."}`;
    elements.nextBlockCountdown.textContent = nextBlock.countdown;
  } else {
    elements.nextBlockTitle.textContent = "No more fixed blocks today";
    elements.nextBlockDetail.textContent = "Use the remaining time for rest, catch-up, or project build time.";
    elements.nextBlockCountdown.textContent = "Day clear";
  }

  const openCount = mustDos.filter((item) => getCommandStatus(dateKey, item.id) === "active").length;
  elements.mustDoStatus.textContent = `${openCount} active`;
  elements.todayMustDos.innerHTML = "";

  if (!mustDos.length) {
    elements.todayMustDos.innerHTML = `<p class="empty-state">No urgent items found. Add a task or quick activity if something real needs attention.</p>`;
  } else {
    mustDos.forEach((item, index) => {
      const status = getCommandStatus(dateKey, item.id);
      const row = document.createElement("article");
      row.className = `command-item ${status}`;
      row.style.setProperty("--item-index", String(index));
      row.innerHTML = `
        <div>
          <span class="pill">${escapeHtml(status)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="helper-text">${escapeHtml(item.detail)}</p>
        </div>
        <div class="command-actions">
          <button class="ghost-button" type="button" data-action="done">Done</button>
          <button class="ghost-button" type="button" data-action="skipped">${state.coachSettings.enabled && isCoachImportantItem(item) ? "Skip / pay" : "Skip"}</button>
          <button class="ghost-button" type="button" data-action="moved">Move</button>
        </div>
      `;
      row.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => updateCommandItem(dateKey, item, button.dataset.action));
      });
      elements.todayMustDos.appendChild(row);
    });
  }

  renderQuickActivityList();
}

function renderDailyBriefing(today, nextBlock, mustDos) {
  const briefing = buildDailyBriefing(today, nextBlock, mustDos);
  elements.dailyBriefingLead.textContent = briefing.lead;
  elements.dailyBriefingGrid.innerHTML = "";

  briefing.cards.forEach((card, index) => {
    const item = document.createElement("article");
    item.className = `briefing-card ${card.tone || ""}`;
    item.style.setProperty("--item-index", String(index));
    item.innerHTML = `
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.title)}</strong>
      <p>${escapeHtml(card.detail)}</p>
    `;
    elements.dailyBriefingGrid.appendChild(item);
  });
}

function buildDailyBriefing(today, nextBlock, mustDos) {
  const dateKey = toDateInput(today);
  if (!state.schoolSettings.setupComplete) {
    return {
      lead: "Set up your school hours first. A planner that does not know your class time will create fake free time.",
      cards: [
        {
          label: "Setup",
          title: "School profile missing",
          detail: "Open Setup, choose your school days, start/end times, and optional timetable cycle.",
          tone: "is-warning",
        },
        {
          label: "Next step",
          title: "Add one real task",
          detail: "After setup, add your next test or homework deadline so Coach Mode has something real to protect.",
          tone: "is-focus",
        },
      ],
    };
  }

  const tomorrow = addDays(today, 1);
  const activeTasks = upcomingTasks()
    .filter((task) => !task.completed)
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || parseDate(a.dueDate) - parseDate(b.dueDate));
  const urgentTests = activeTasks
    .filter((task) => task.type === "test" && parseDate(task.dueDate) <= tomorrow)
    .slice(0, 3);
  const doneToday = state.tasks
    .filter((task) => task.completed && taskCompletedDate(task) === dateKey)
    .map((task) => task.subject);
  const nextStudy = getNextStudyBlock(today);
  const openChecklist = buildChecklistItems().filter((item) => !state.checklist[item.id]);
  const noStudyForUrgent = urgentTests.length && !state.studyBlocks.some((block) => {
    const blockDate = parseDate(block.date);
    return blockDate >= today && blockDate <= parseDate(urgentTests[0].dueDate);
  });
  const priorityTask = urgentTests[0] || activeTasks[0];
  const coachVerdict = buildCoachVerdict(today);
  const coachPressure = getCoachPressureForDate(today);

  const lead = state.coachSettings.enabled && coachPressure.level
    ? `${coachVerdict.title} ${coachPressure.focusTask ? `${coachPressure.focusTask.subject} gets handled before project time.` : "School work gets handled before project time."}`
    : priorityTask
    ? `${priorityTask.subject} is the main focus. ${priorityTask.type === "test" ? "Use quiz practice plus checklist evidence, not vibes." : "Finish it before it becomes noise."}`
    : doneToday.length
      ? `${doneToday.join(", ")} logged done today. Keep the rest of the day clean and recover properly.`
      : "No urgent school task found. Protect homework, recovery, and project build time.";

  const riskTitle = noStudyForUrgent
    ? "No study block before test"
    : urgentTests.length
      ? `${urgentTests.length} test${urgentTests.length === 1 ? "" : "s"} due by tomorrow`
      : openChecklist.length
        ? `${openChecklist.length} checklist item${openChecklist.length === 1 ? "" : "s"} open`
        : "No major warning";

  const riskDetail = noStudyForUrgent
    ? `Regenerate the plan or quick-add a study block for ${urgentTests[0].subject}.`
    : urgentTests.length
      ? urgentTests.map((task) => `${task.subject} ${formatShortDate(task.dueDate)}`).join(" · ")
      : openChecklist.length
        ? "Finish one checklist item before doing low-value work."
        : "You are not blocked by a visible deadline right now.";

  return {
    lead,
    cards: [
      {
        label: "Priority",
        title: priorityTask ? priorityTask.subject : "No urgent task",
        detail: priorityTask ? `${priorityTask.type} due ${formatLongDate(priorityTask.dueDate)}.` : "Add anything real that appears from school.",
        tone: priorityTask ? "is-warning" : "is-calm",
      },
      {
        label: "Next study",
        title: nextStudy ? nextStudy.subject : "No study block",
        detail: nextStudy ? `${formatShortDate(nextStudy.date)} · ${nextStudy.start} - ${nextStudy.end}.` : "Regenerate the plan after adding new tasks.",
        tone: nextStudy ? "is-focus" : "is-warning",
      },
      {
        label: "Risk watch",
        title: riskTitle,
        detail: riskDetail,
        tone: noStudyForUrgent || urgentTests.length ? "is-warning" : "is-calm",
      },
      {
        label: "Coach",
        title: state.coachSettings.enabled ? (coachPressure.level ? "Project time can be cut" : "Project time protected") : "Coach off",
        detail: state.coachSettings.enabled ? coachVerdict.reason : "Turn on Coach Mode if you want strict accountability.",
        tone: state.coachSettings.enabled && coachPressure.level ? "is-warning" : "is-focus",
      },
      {
        label: "Logged done",
        title: doneToday.length ? doneToday.join(", ") : "Nothing logged today",
        detail: doneToday.length ? "This stays in Tasks as completed evidence." : "Mark tests done when they are actually finished.",
        tone: doneToday.length ? "is-success" : "is-calm",
      },
    ],
  };
}

function getNextStudyBlock(today) {
  const todayKey = toDateInput(today);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return state.studyBlocks
    .filter((block) => parseDate(block.date) >= today)
    .filter((block) => block.date !== todayKey || toMinutes(block.end) > nowMinutes)
    .slice()
    .sort((a, b) => parseDate(a.date) - parseDate(b.date) || a.start.localeCompare(b.start))[0];
}

function getNextBlockForDate(date) {
  const todayKey = toDateInput(new Date());
  const dateKey = toDateInput(date);
  const now = new Date();
  const nowMinutes = todayKey === dateKey ? now.getHours() * 60 + now.getMinutes() : 0;
  const events = getEventsForDate(date).filter((event) => event.start && event.end);
  const next = events.find((event) => toMinutes(event.end) > nowMinutes);
  if (!next) return null;

  const startsIn = toMinutes(next.start) - nowMinutes;
  const endsIn = toMinutes(next.end) - nowMinutes;
  const countdown = startsIn <= 0
    ? `Ends in ${formatDuration(Math.max(0, endsIn))}`
    : `Starts in ${formatDuration(startsIn)}`;

  return { ...next, countdown };
}

function buildTodayMustDos(date) {
  const dateKey = toDateInput(date);
  const tomorrow = addDays(date, 1);
  const candidates = [];

  state.tasks
    .filter((task) => !task.completed)
    .filter((task) => parseDate(task.dueDate) <= tomorrow)
    .sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate))
    .forEach((task) => {
      candidates.push({
        id: `task:${task.id}`,
        title: `${task.type === "test" ? "Prepare for" : "Finish"} ${task.subject}`,
        detail: `Due ${formatLongDate(task.dueDate)} · ${task.topics || "No topics listed."}`,
        priority: task.priority,
      });
    });

  state.studyBlocks
    .filter((block) => block.date === dateKey)
    .sort((a, b) => a.start.localeCompare(b.start))
    .forEach((block) => {
      candidates.push({
        id: `study:${block.id}`,
        title: `Study ${block.subject}`,
        detail: `${block.start} - ${block.end} · ${block.detail}`,
        blockType: "study",
        blockId: block.id,
        priority: "high",
      });
    });

  buildChecklistItems()
    .filter((item) => !state.checklist[item.id])
    .slice(0, 4)
    .forEach((item) => {
      candidates.push({
        id: `check:${item.id}`,
        title: item.title,
        detail: item.detail,
        priority: "medium",
      });
    });

  state.quickBlocks
    .filter((block) => block.date === dateKey)
    .sort((a, b) => a.start.localeCompare(b.start))
    .forEach((block) => {
      candidates.push({
        id: `quick:${block.id}`,
        title: block.name,
        detail: `${block.start} - ${block.end} · ${block.detail || "Sudden activity."}`,
        blockType: "quick",
        blockId: block.id,
        priority: "medium",
      });
    });

  state.lifeBlocks
    .filter((block) => block.date === dateKey && ["homework", "business", "coach"].includes(block.category))
    .sort((a, b) => a.start.localeCompare(b.start))
    .forEach((block) => {
      candidates.push({
        id: `life:${block.id}`,
        title: block.name,
        detail: `${block.start} - ${block.end} · ${block.detail}`,
        blockType: "life",
        blockId: block.id,
        priority: ["homework", "coach"].includes(block.category) ? "high" : "medium",
      });
    });

  const seen = new Set();
  return candidates
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 3);
}

function updateCommandItem(dateKey, item, status) {
  const movedCalendarBlock = status === "moved" && item.blockType;

  if (movedCalendarBlock && !moveCommandBlock(item)) {
    showToast("Could not find a later free slot for that block.");
    playSound("warning");
    return;
  }

  state.commandLog[commandLogKey(dateKey, item.id)] = {
    status,
    updatedAt: new Date().toISOString(),
  };

  const coachResult = status === "skipped" ? applyCoachConsequence(dateKey, item) : null;

  saveState();
  render();
  playSound(status === "done" ? "success" : status === "skipped" && coachResult?.applied ? "warning" : "tap");
  showToast(
    status === "done"
      ? "Marked done."
      : status === "moved" && movedCalendarBlock
        ? "Moved later and updated your calendar."
        : status === "moved"
          ? "Marked moved. Add a sudden activity if you know the new time."
          : coachResult?.message || "Marked skipped for today.",
  );
}

function isCoachImportantItem(item) {
  if (!item) return false;
  if (item.priority === "high") return true;
  if (["study", "life"].includes(item.blockType)) return true;
  return /prepare|finish|study|homework|test|master|quiz/i.test(`${item.title || ""} ${item.detail || ""}`);
}

function applyCoachConsequence(dateKey, item, reason = "You skipped an important planned item.") {
  if (!state.coachSettings.enabled || !isCoachImportantItem(item)) return null;

  if (!state.coachSettings.autoReduceBusiness) {
    logCoachAction(
      "Skip logged without automatic recovery.",
      `${item.title} was skipped. Coach Mode is on, but project-time reduction is off.`,
      "warning",
      dateKey,
    );
    return { applied: false, message: "Skipped. Coach logged it, but project reduction is off." };
  }

  const recovery = reclaimBusinessTimeForCoach(dateKey, item, reason);
  if (recovery.applied) {
    logCoachAction(recovery.title, recovery.detail, "warning", recovery.dateKey || dateKey);
    return { applied: true, message: "Skipped. Coach reclaimed project time for recovery work." };
  }

  logCoachAction(
    "Skip logged, but no recovery slot was available.",
    `${item.title} was skipped. Coach could not find project time or a free slot to reclaim.`,
    "warning",
    dateKey,
  );
  return { applied: false, message: "Skipped. Coach logged the miss, but no recovery slot was free." };
}

function reclaimBusinessTimeForCoach(dateKey, item, reason) {
  const startDate = parseDate(dateKey);
  const duration = item.blockType === "study" ? 50 : 45;

  for (let offset = 0; offset <= 2; offset += 1) {
    const date = addDays(startDate, offset);
    const targetDateKey = toDateInput(date);
    const businessBlock = state.lifeBlocks
      .filter((block) => block.date === targetDateKey && block.category === "business")
      .sort((a, b) => a.start.localeCompare(b.start))[0];

    if (!businessBlock) continue;

    const businessStart = toMinutes(businessBlock.start);
    const businessEnd = toMinutes(businessBlock.end);
    const recoveryEnd = Math.min(businessStart + duration, businessEnd);
    const recoveredMinutes = recoveryEnd - businessStart;
    if (recoveredMinutes < 30) continue;

    const recoveryBlock = {
      id: crypto.randomUUID(),
      date: targetDateKey,
      name: `Coach recovery: ${shortenTitle(item.title)}`,
      start: businessBlock.start,
      end: fromMinutes(recoveryEnd),
      category: "coach",
      detail: `${reason} Project time was reduced because school work came first.`,
    };

    state.lifeBlocks.push(recoveryBlock);

    if (businessEnd - recoveryEnd >= 30) {
      businessBlock.start = fromMinutes(recoveryEnd);
      businessBlock.detail = appendCoachReducedDetail(businessBlock.detail);
    } else {
      state.lifeBlocks = state.lifeBlocks.filter((block) => block.id !== businessBlock.id);
    }

    return {
      applied: true,
      title: "Project time reduced for missed school work.",
      detail: `${recoveredMinutes} minutes moved into ${recoveryBlock.name} on ${formatLongDate(targetDateKey)}.`,
      dateKey: targetDateKey,
    };
  }

  for (let offset = 0; offset <= 2; offset += 1) {
    const date = addDays(startDate, offset);
    const slot = findFreeSlot(date, duration, coachRecoveryWindowsForDate(date));
    if (!slot) continue;

    state.lifeBlocks.push({
      id: crypto.randomUUID(),
      date: toDateInput(date),
      name: `Coach recovery: ${shortenTitle(item.title)}`,
      start: slot.start,
      end: slot.end,
      category: "coach",
      detail: `${reason} No business block was available, so Coach Mode used the next free work slot.`,
    });

    return {
      applied: true,
      title: "Coach recovery block added.",
      detail: `${duration} minutes added on ${formatLongDate(toDateInput(date))} because ${item.title} was skipped.`,
      dateKey: toDateInput(date),
    };
  }

  return { applied: false };
}

function appendCoachReducedDetail(detail = "") {
  return detail.includes("Reduced by Coach Mode") ? detail : `${detail} Reduced by Coach Mode because school work was behind.`.trim();
}

function shortenTitle(title = "") {
  return title.replace(/^(Prepare for|Finish|Study)\s+/i, "").slice(0, 44);
}

function moveCommandBlock(item) {
  const collections = {
    study: state.studyBlocks,
    life: state.lifeBlocks,
    quick: state.quickBlocks,
  };
  const blocks = collections[item.blockType];
  const block = blocks?.find((candidate) => candidate.id === item.blockId);
  if (!block) return false;

  const duration = toMinutes(block.end) - toMinutes(block.start);
  const date = parseDate(block.date);
  const laterStart = Math.min(toMinutes(block.end) + 15, 21 * 60);
  const sameDaySlot = laterStart + duration <= 21 * 60 + 30
    ? findFreeSlot(date, duration, [[fromMinutes(laterStart), "21:30"]])
    : null;

  if (sameDaySlot) {
    block.start = sameDaySlot.start;
    block.end = sameDaySlot.end;
    block.detail = appendMovedDetail(block.detail);
    return true;
  }

  const nextDay = addDays(date, 1);
  const nextDaySlot = findFreeSlot(nextDay, duration, workWindowsForDate(nextDay));
  if (!nextDaySlot) return false;

  block.date = toDateInput(nextDay);
  block.start = nextDaySlot.start;
  block.end = nextDaySlot.end;
  block.detail = appendMovedDetail(block.detail);
  return true;
}

function appendMovedDetail(detail = "") {
  return detail.includes("Moved from Today Command") ? detail : `${detail} Moved from Today Command.`.trim();
}

function getCommandStatus(dateKey, itemId) {
  return state.commandLog[commandLogKey(dateKey, itemId)]?.status || "active";
}

function commandLogKey(dateKey, itemId) {
  return `${dateKey}:${itemId}`;
}

function handleQuickActivitySubmit(event) {
  event.preventDefault();

  const name = clean(elements.quickActivityName.value);
  const date = elements.quickActivityDate.value;
  const start = elements.quickActivityStart.value;
  const end = elements.quickActivityEnd.value;
  const type = elements.quickActivityType.value;
  const detail = clean(elements.quickActivityDetail.value);

  if (!name || !date || !start || !end) return;
  if (toMinutes(end) <= toMinutes(start)) {
    showToast("End time must be after start time.");
    playSound("warning");
    return;
  }

  const clashes = getEventsForDate(parseDate(date)).filter((eventBlock) =>
    eventBlock.start && eventBlock.end && toMinutes(start) < toMinutes(eventBlock.end) && toMinutes(end) > toMinutes(eventBlock.start)
  );

  state.quickBlocks.push({
    id: crypto.randomUUID(),
    name,
    date,
    start,
    end,
    category: "quick",
    type,
    detail: detail ? `${capitalize(type)} · ${detail}` : capitalize(type),
  });

  generateStudyPlan();
  saveState();
  elements.quickActivityForm.reset();
  elements.quickActivityDate.value = toDateInput(new Date());
  render();
  playSound(clashes.length ? "warning" : "success");
  showToast(clashes.length ? `Added, but it overlaps ${clashes.length} existing block${clashes.length === 1 ? "" : "s"}.` : "Sudden activity added to your calendar.");
}

function renderQuickActivityList() {
  const today = startOfDay(new Date());
  const end = addDays(today, 14);
  const upcoming = state.quickBlocks
    .filter((block) => parseDate(block.date) >= today && parseDate(block.date) <= end)
    .slice()
    .sort((a, b) => parseDate(a.date) - parseDate(b.date) || a.start.localeCompare(b.start));

  elements.quickActivityList.innerHTML = "";

  if (!upcoming.length) {
    elements.quickActivityList.innerHTML = `<p class="empty-state">No sudden activities added.</p>`;
    return;
  }

  upcoming.slice(0, 5).forEach((block) => {
    const row = document.createElement("article");
    row.className = "quick-activity-row";
    row.innerHTML = `
      <div>
        <h3>${escapeHtml(block.name)}</h3>
        <p class="helper-text">${formatShortDate(block.date)} · ${block.start} - ${block.end} · ${escapeHtml(block.detail || "Activity")}</p>
      </div>
      <button class="delete-button" type="button" title="Delete sudden activity" aria-label="Delete sudden activity">x</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      state.quickBlocks = state.quickBlocks.filter((candidate) => candidate.id !== block.id);
      generateStudyPlan();
      saveState();
      render();
      playSound("warning");
      showToast("Sudden activity removed. Plan updated.");
    });
    elements.quickActivityList.appendChild(row);
  });
}

function renderMetrics() {
  const tests = upcomingTasks().filter((task) => task.type === "test" && !task.completed);
  const nextTest = tests[0];
  const checklistItems = buildChecklistItems();
  const completeCount = checklistItems.filter((item) => state.checklist[item.id]).length;
  const readiness = checklistItems.length ? Math.round((completeCount / checklistItems.length) * 100) : 0;

  elements.nextTestMetric.textContent = nextTest
    ? `${nextTest.subject} ${formatShortDate(nextTest.dueDate)}`
    : "None";
  elements.studyMetric.textContent = String(state.studyBlocks.length);
  elements.readinessMetric.textContent = `${readiness}%`;

  if (!nextTest) {
    elements.proofSignal.textContent = "Add one real upcoming test.";
  } else if (readiness < 50) {
    elements.proofSignal.textContent = `${nextTest.subject}: not ready yet.`;
  } else if (readiness < 85) {
    elements.proofSignal.textContent = `${nextTest.subject}: close, keep going.`;
  } else {
    elements.proofSignal.textContent = `${nextTest.subject}: ready if quiz scores match.`;
  }
}

function renderWeekPlan() {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 14 }, (_, index) => addDays(today, index));
  elements.scheduleRange.textContent = `${formatShortDate(toDateInput(dates[0]))} - ${formatShortDate(toDateInput(dates[13]))}`;
  elements.weekPlan.innerHTML = "";

  dates.forEach((date, index) => {
    const column = document.querySelector("#dayTemplate").content.cloneNode(true);
    column.querySelector(".day-column").style.setProperty("--item-index", String(index));
    const title = column.querySelector(".day-title");
    const events = column.querySelector(".day-events");
    const dateKey = toDateInput(date);
    const cycleDay = schoolCycleDay(date);

    title.textContent = cycleDay
      ? `${shortDayNames[date.getDay()]} ${date.getDate()} · Day ${cycleDay}`
      : `${shortDayNames[date.getDay()]} ${date.getDate()}`;

    getEventsForDate(date).forEach((event) => events.appendChild(renderEvent(event)));

    state.tasks
      .filter((task) => task.dueDate === dateKey)
      .forEach((task) => events.appendChild(renderEvent(taskToEvent(task))));

    if (!events.children.length) {
      events.innerHTML = `<p class="empty-state">No fixed blocks. Use this for rest or catch-up.</p>`;
    }

    elements.weekPlan.appendChild(column);
  });
}

function renderEvent(event) {
  const item = document.createElement("div");
  item.className = `event ${event.category || ""}`;
  item.innerHTML = `
    <strong>${escapeHtml(event.name)}</strong>
    <span>${escapeHtml(event.time || "")}</span>
    ${event.detail ? `<em>${escapeHtml(event.detail)}</em>` : ""}
  `;
  return item;
}

function taskToEvent(task) {
  const label = task.completed ? "DONE" : task.type === "test" ? "TEST" : task.type.toUpperCase();
  return {
    name: `${label}: ${task.subject}`,
    detail: task.completed ? `Completed ${formatLongDate(taskCompletedDate(task))}.` : task.topics || "No topics listed",
    category: task.completed ? "done" : task.type === "test" ? "test" : task.priority,
  };
}

function getEventsForDate(date) {
  const dateKey = toDateInput(date);
  const studyEvents = state.studyBlocks
    .filter((block) => block.date === dateKey)
    .map((block) => ({
      name: `Study: ${block.subject}`,
      time: `${block.start} - ${block.end}`,
      start: block.start,
      end: block.end,
      detail: block.detail,
      category: "study",
    }));

  const lifeEvents = state.lifeBlocks
    .filter((block) => block.date === dateKey)
    .map((block) => ({
      name: block.name,
      time: `${block.start} - ${block.end}`,
      start: block.start,
      end: block.end,
      detail: block.detail,
      category: block.category,
    }));

  const quickEvents = state.quickBlocks
    .filter((block) => block.date === dateKey)
    .map((block) => ({
      name: block.name,
      time: `${block.start} - ${block.end}`,
      start: block.start,
      end: block.end,
      detail: block.detail,
      category: block.category || "quick",
    }));

  return [...getFixedEventsForDate(date), ...quickEvents, ...lifeEvents, ...studyEvents].sort((a, b) => a.start.localeCompare(b.start));
}

function getFixedEventsForDate(date) {
  const day = date.getDay();
  const cycleDay = schoolCycleDay(date);
  const settings = state.schoolSettings;
  const events = [];

  if (settings.schoolDays.includes(day)) {
    const schoolName = settings.schoolName || "School";
    const subjects = cycleDay ? subjectsForCycleDay(cycleDay).join(", ") : "";

    if (settings.commuteStart && toMinutes(settings.commuteStart) < toMinutes(settings.schoolStart)) {
      events.push({
        name: "Leave for school",
        time: `${settings.commuteStart} - ${settings.schoolStart}`,
        start: settings.commuteStart,
        end: settings.schoolStart,
        detail: "No work gets scheduled here.",
        category: "commute",
      });
    }

    events.push({
      name: cycleDay ? `${schoolName} · Day ${cycleDay}` : schoolName,
      time: `${settings.schoolStart} - ${settings.schoolEnd}`,
      start: settings.schoolStart,
      end: settings.schoolEnd,
      detail: subjects || "Classes from your school setup.",
      category: "school",
    });
  }

  state.routines
    .filter((block) => Number(block.day) === day)
    .forEach((block) => {
      events.push({
        name: block.name,
        time: `${block.start} - ${block.end}`,
        start: block.start,
        end: block.end,
        category: block.category || "routine",
      });
    });

  return events;
}

function renderChecklist() {
  const items = buildChecklistItems();
  const openCount = items.filter((item) => !state.checklist[item.id]).length;
  elements.checklistCount.textContent = `${openCount} left`;
  elements.checklist.innerHTML = "";

  if (!items.length) {
    elements.checklist.innerHTML = `<p class="empty-state">Add a test with topics. The app will build your readiness list.</p>`;
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("label");
    row.className = "check-row";
    row.innerHTML = `
      <input type="checkbox" ${state.checklist[item.id] ? "checked" : ""} />
      <span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></span>
    `;
    row.querySelector("input").addEventListener("change", (event) => {
      state.checklist[item.id] = event.target.checked;
      saveState();
      renderMetrics();
      renderChecklist();
      playSound(event.target.checked ? "success" : "tap");
      showToast(event.target.checked ? "Checklist item completed." : "Checklist item reopened.");
    });
    elements.checklist.appendChild(row);
  });
}

function buildChecklistItems() {
  return upcomingTasks()
    .filter((task) => !task.completed)
    .filter((task) => task.type === "test")
    .flatMap((task) => buildChecklistItemsForTask(task));
}

function buildChecklistItemsForTask(task) {
  const topics = splitTopics(task.topics);
  const base = [
    {
      id: `${task.id}:overview`,
      title: `${task.subject}: know the test scope`,
      detail: `Due ${formatLongDate(task.dueDate)}.`,
    },
    {
      id: `${task.id}:quiz`,
      title: `${task.subject}: finish one practice quiz`,
      detail: "Score at least 80% without looking at notes.",
    },
  ];

  return [
    ...base,
    ...topics.map((topic) => ({
      id: `${task.id}:topic:${topic.toLowerCase()}`,
      title: `Master ${topic}`,
      detail: "Explain it, do two examples, then fix mistakes.",
    })),
  ];
}

function taskReadiness(task) {
  const items = buildChecklistItemsForTask(task);
  if (!items.length) return 0;
  const done = items.filter((item) => state.checklist[item.id]).length;
  return Math.round((done / items.length) * 100);
}

function renderTasks() {
  elements.taskList.innerHTML = "";

  if (!state.tasks.length) {
    elements.taskList.innerHTML = `<p class="empty-state">No tasks yet. Add one real test or homework item.</p>`;
    return;
  }

  upcomingTasks(false).forEach((task) => {
    const item = document.createElement("article");
    item.className = `task-item ${task.completed ? "completed-task" : ""}`;
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(task.subject)}</h3>
        <div class="task-meta">
          <span class="pill">${escapeHtml(task.type)}</span>
          <span class="pill">${formatLongDate(task.dueDate)}</span>
          <span class="pill">${escapeHtml(task.priority)}</span>
          <span class="pill ${task.completed ? "done-pill" : ""}">${task.completed ? `done ${formatShortDate(taskCompletedDate(task))}` : "open"}</span>
        </div>
        <p class="helper-text">${escapeHtml(task.topics || "No topics added yet.")}</p>
      </div>
      <div class="task-actions">
        <button class="ghost-button" type="button" data-action="toggle">${task.completed ? "Reopen" : "Mark done"}</button>
        <button class="delete-button" type="button" data-action="delete" title="Delete task" aria-label="Delete task">x</button>
      </div>
    `;
    item.querySelector('[data-action="toggle"]').addEventListener("click", () => {
      task.completed = !task.completed;
      if (task.completed) {
        task.completedAt = new Date().toISOString();
      } else {
        delete task.completedAt;
      }
      generateStudyPlan();
      saveState();
      render();
      playSound(task.completed ? "success" : "tap");
      showToast(task.completed ? "Task marked done." : "Task reopened.");
    });
    item.querySelector('[data-action="delete"]').addEventListener("click", () => {
      state.tasks = state.tasks.filter((candidate) => candidate.id !== task.id);
      state.studyBlocks = state.studyBlocks.filter((block) => block.taskId !== task.id);
      delete state.quizSets[task.id];
      Object.keys(state.checklist).forEach((key) => {
        if (key.startsWith(task.id)) delete state.checklist[key];
      });
      generateStudyPlan();
      saveState();
      render();
      playSound("warning");
      showToast("Task deleted. Plan updated.");
    });
    elements.taskList.appendChild(item);
  });
}

async function handleImportImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  elements.importPreview.src = previewUrl;
  elements.importPreview.hidden = false;
  elements.importStatus.textContent = "Screenshot uploaded. Trying local OCR if this browser supports it.";
  playSound("scan");
  showToast("Screenshot added. Review the text before accepting changes.");

  if (!("TextDetector" in window)) {
    elements.importStatus.textContent =
      "Screenshot previewed. This browser does not support local OCR, so paste the copied text from the screenshot for analysis.";
    return;
  }

  try {
    const detector = new window.TextDetector();
    const bitmap = await createImageBitmap(file);
    const results = await detector.detect(bitmap);
    const extracted = results.map((result) => result.rawValue).filter(Boolean).join("\n");

    if (!extracted) {
      elements.importStatus.textContent = "Screenshot OCR found no readable text. Paste the text manually.";
      return;
    }

    elements.importText.value = `${elements.importText.value.trim()}\n${extracted}`.trim();
    elements.importStatus.textContent = "Screenshot text extracted. Review it, then analyze.";
  } catch {
    elements.importStatus.textContent = "Screenshot OCR failed in this browser. Paste the text manually.";
  }
}

function analyzeImportText(rawText) {
  const text = cleanMultiline(rawText);
  if (!text) {
    elements.importStatus.textContent = "Paste school info first.";
    return [];
  }

  const chunks = text
    .split(/\n+|(?<=\.)\s+/)
    .map((chunk) => clean(chunk))
    .filter((chunk) => chunk.length > 8);
  const usefulChunks = chunks.filter((chunk) => /test|quiz|assessment|exam|assignment|homework|due|submit|bring|remember|reminder|canvas|outlook/i.test(chunk));
  const sourceChunks = usefulChunks.length ? usefulChunks : [text];
  const proposals = sourceChunks.slice(0, 8).map((chunk) => buildImportProposal(chunk, text));

  elements.importStatus.textContent = proposals.length
    ? `Found ${proposals.length} proposed change${proposals.length === 1 ? "" : "s"}. Review before accepting.`
    : "No changes found. Try pasting more detail.";
  return proposals;
}

function buildImportProposal(chunk, fullText) {
  const type = inferImportType(chunk);
  const dueDate = inferImportDate(chunk, fullText);
  const subject = inferImportSubject(chunk, fullText);
  const topics = inferImportTopics(chunk, subject);
  const priority = /test|exam|assessment|overdue|tomorrow|urgent/i.test(chunk) ? "high" : "medium";
  const confidence = [
    subject !== "General school",
    Boolean(dueDate.found),
    topics.length > 16,
    type !== "reminder" || /bring|remember|meeting|event/i.test(chunk),
  ].filter(Boolean).length;

  return {
    id: crypto.randomUUID(),
    selected: true,
    type,
    subject,
    dueDate: dueDate.value,
    priority,
    topics,
    confidence,
    reason: buildImportReason(type, subject, dueDate, chunk),
  };
}

function buildImportReason(type, subject, dueDate, chunk) {
  const action = type === "test" ? "add a test" : type === "homework" ? "add homework" : "add a reminder";
  const dateText = dueDate.found ? formatLongDate(dueDate.value) : "a guessed date because no exact date was found";
  return `Would ${action} for ${subject}, due ${dateText}, then regenerate your study plan. Source: "${chunk.slice(0, 120)}${chunk.length > 120 ? "..." : ""}"`;
}

function inferImportType(text) {
  if (/test|quiz|assessment|exam/i.test(text)) return "test";
  if (/assignment|homework|due|submit|canvas|task/i.test(text)) return "homework";
  return "reminder";
}

function inferImportSubject(text, fallback) {
  const source = `${text} ${fallback}`.toLowerCase();
  const subjects = [
    ["English", ["english", "cartoon", "writing", "essay"]],
    ["Maths", ["maths", "math", "inequality", "algebra", "equation"]],
    ["Science", ["science", "mineral", "tectonic", "rock", "igneous", "sedimentary", "metamorphic"]],
    ["PRS", ["prs", "religion", "abraham", "islam", "christian", "judaism"]],
    ["Chinese", ["chinese", "mandarin"]],
    ["Humanities", ["humanities", "history", "geography"]],
    ["Business Studies", ["business", "economics", "commerce", "enterprise"]],
    ["Health and PE", ["health", "physical education", "pe", "sport"]],
    ["Visual Art", ["visual art", "art"]],
  ];

  const match = subjects.find(([, keywords]) => keywords.some((keyword) => source.includes(keyword)));
  return match ? match[0] : "General school";
}

function inferImportTopics(text, subject) {
  const topicMatch = text.match(/(?:on|about|based on|covering|topics?|testing|learn|revise)\s*:?\s*(.+)$/i);
  const topicText = topicMatch ? topicMatch[1] : text;
  return clean(`${subject}: ${topicText}`).slice(0, 360);
}

function inferImportDate(text, fallback) {
  const source = `${text} ${fallback}`;
  const today = startOfDay(new Date());
  const lower = source.toLowerCase();

  if (lower.includes("tomorrow")) return { value: toDateInput(addDays(today, 1)), found: true };
  if (lower.includes("next week")) return { value: toDateInput(addDays(today, 7)), found: true };

  const cycleMatch = lower.match(/\bday\s*(10|[1-9])\b/);
  if (cycleMatch) return { value: toDateInput(dateForNextCycleDay(Number(cycleMatch[1]))), found: true };

  const numericDate = source.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
  if (numericDate) {
    const day = Number(numericDate[1]);
    const month = Number(numericDate[2]);
    const year = numericDate[3] ? normalizeYear(Number(numericDate[3])) : today.getFullYear();
    return { value: toDateInput(startOfDay(new Date(year, month - 1, day))), found: true };
  }

  const monthDate = source.match(/\b(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  if (monthDate) {
    const day = Number(monthDate[1]);
    const month = monthIndex(monthDate[2]);
    return { value: toDateInput(startOfDay(new Date(today.getFullYear(), month, day))), found: true };
  }

  const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].find((day) =>
    lower.includes(day),
  );
  if (weekday) {
    const target = dayNames.map((day) => day.toLowerCase()).indexOf(weekday);
    const offset = mod(target - today.getDay(), 7) || 7;
    return { value: toDateInput(addDays(today, offset)), found: true };
  }

  return { value: toDateInput(addDays(today, 1)), found: false };
}

function normalizeYear(year) {
  return year < 100 ? 2000 + year : year;
}

function monthIndex(month) {
  return ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month.slice(0, 3).toLowerCase());
}

function renderImportProposals() {
  elements.acceptImport.disabled = !currentImportProposals.length;
  elements.importProposals.innerHTML = "";

  if (!currentImportProposals.length) {
    elements.importProposals.innerHTML = `<p class="empty-state">Paste text or upload a screenshot, then analyze it.</p>`;
    return;
  }

  currentImportProposals.forEach((proposal, index) => {
    const card = document.createElement("article");
    card.className = "proposal-card";
    card.dataset.id = proposal.id;
    card.style.setProperty("--item-index", String(index));
    card.innerHTML = `
      <label class="proposal-select">
        <input class="proposal-enabled" type="checkbox" ${proposal.selected ? "checked" : ""} />
        <span>Accept this change</span>
      </label>
      <div class="proposal-grid">
        <label>
          Type
          <select class="proposal-type">
            ${["test", "homework", "reminder"].map((type) => `<option value="${type}" ${proposal.type === type ? "selected" : ""}>${type}</option>`).join("")}
          </select>
        </label>
        <label>
          Subject
          <input class="proposal-subject" type="text" value="${escapeHtml(proposal.subject)}" />
        </label>
        <label>
          Due date
          <input class="proposal-date" type="date" value="${proposal.dueDate}" />
        </label>
        <label>
          Priority
          <select class="proposal-priority">
            ${["high", "medium", "low"].map((priority) => `<option value="${priority}" ${proposal.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}
          </select>
        </label>
        <label class="full-field">
          Topics / details
          <textarea class="proposal-topics" rows="3">${escapeHtml(proposal.topics)}</textarea>
        </label>
      </div>
      <p class="proposal-reason">${escapeHtml(proposal.reason)}</p>
      <span class="pill">confidence ${proposal.confidence}/4</span>
    `;
    elements.importProposals.appendChild(card);
  });
}

function readAcceptedImportProposals() {
  return [...elements.importProposals.querySelectorAll(".proposal-card")]
    .filter((card) => card.querySelector(".proposal-enabled").checked)
    .map((card) => ({
      id: crypto.randomUUID(),
      type: card.querySelector(".proposal-type").value,
      subject: clean(card.querySelector(".proposal-subject").value) || "General school",
      dueDate: card.querySelector(".proposal-date").value || toDateInput(addDays(new Date(), 1)),
      priority: card.querySelector(".proposal-priority").value,
      topics: clean(card.querySelector(".proposal-topics").value),
      completed: false,
    }));
}

function renderRoutine() {
  elements.routineList.innerHTML = "";
  renderCycleSummary();
  renderCustomRoutines();
}

function renderCycleSummary() {
  const settings = state.schoolSettings;
  const schoolDays = settings.schoolDays.map((day) => dayNames[day]).join(", ");
  const cycleDays = Array.from({ length: settings.cycleLength }, (_, index) => index + 1);
  const cycleSubjectPills = settings.cycleEnabled
    ? cycleDays
      .map((day) => {
        const subjects = subjectsForCycleDay(day);
        return subjects.length ? `<span class="pill">Day ${day}: ${escapeHtml(subjects.slice(0, 2).join(", "))}${subjects.length > 2 ? "..." : ""}</span>` : "";
      })
      .join("")
    : "";
  const summary = document.createElement("article");
  summary.className = "routine-item locked-routine";
  summary.innerHTML = `
    <div>
      <h3>${escapeHtml(settings.schoolName || "School profile")}</h3>
      <p class="helper-text">${settings.setupComplete ? "School hours are locked from Setup." : "Set up school hours first so the planner blocks class time correctly."}</p>
      <div class="routine-meta">
        <span class="pill">${escapeHtml(schoolDays)}</span>
        <span class="pill">${settings.schoolStart} - ${settings.schoolEnd}</span>
        ${settings.commuteStart ? `<span class="pill">commute from ${settings.commuteStart}</span>` : ""}
        ${settings.cycleEnabled ? `<span class="pill">${settings.cycleLength}-day cycle</span>` : `<span class="pill">weekly timetable</span>`}
        ${cycleSubjectPills}
      </div>
    </div>
  `;
  elements.routineList.appendChild(summary);
}

function renderCustomRoutines() {
  if (!state.routines.length) return;

  state.routines
    .slice()
    .sort((a, b) => Number(a.day) - Number(b.day) || a.start.localeCompare(b.start))
    .forEach((block) => {
      const item = document.createElement("article");
      item.className = "routine-item";
      item.innerHTML = `
        <div>
          <h3>${escapeHtml(block.name)}</h3>
          <div class="routine-meta">
            <span class="pill">${dayNames[Number(block.day)]}</span>
            <span class="pill">${block.start} - ${block.end}</span>
            <span class="pill">custom</span>
          </div>
        </div>
        <button class="delete-button" type="button" title="Delete routine block" aria-label="Delete routine block">x</button>
      `;
      item.querySelector("button").addEventListener("click", () => {
        state.routines = state.routines.filter((candidate) => candidate.id !== block.id);
        generateStudyPlan();
        saveState();
        render();
        playSound("warning");
        showToast("Routine block deleted.");
      });
      elements.routineList.appendChild(item);
    });
}

function renderQuizOptions() {
  const tests = upcomingTasks(false).filter((task) => task.type === "test" && !task.completed);
  elements.quizTask.innerHTML = "";

  if (!tests.length) {
    elements.quizTask.innerHTML = `<option value="">Add a test first</option>`;
    return;
  }

  tests.forEach((task) => {
    const option = document.createElement("option");
    option.value = task.id;
    option.textContent = `${task.subject} - ${formatShortDate(task.dueDate)}`;
    elements.quizTask.appendChild(option);
  });
}

function renderAiChat() {
  elements.aiProvider.value = state.aiSettings.provider || "ollama";
  elements.aiModel.value = getActiveAiModel();
  elements.aiApiKey.value = "";
  elements.aiApiKey.type = "password";
  elements.aiApiKey.placeholder = state.aiSettings.apiKey ? "Saved locally" : "sk-...";
  elements.toggleAiKeyVisibility.textContent = "Show key";
  elements.aiStatus.textContent = aiStatusText();
  elements.sendAiPrompt.disabled = !canAskAi();
  elements.chatMessages.innerHTML = "";

  if (!state.chatMessages.length) {
    elements.chatMessages.innerHTML = `
      <div class="chat-empty">
        <strong>Ask a question when AI is connected.</strong>
        <p>Good uses: explain a school concept, define a term, compare two ideas, or help you understand something without doing the work for you.</p>
      </div>
    `;
    return;
  }

  state.chatMessages.forEach((message) => {
    elements.chatMessages.appendChild(renderChatMessage(message));
  });
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function getActiveAiModel() {
  return state.aiSettings.provider === "openai"
    ? state.aiSettings.openAiModel || "gpt-5-mini"
    : state.aiSettings.ollamaModel || "llama3.2";
}

function canAskAi() {
  return state.aiSettings.provider === "ollama" || Boolean(state.aiSettings.apiKey);
}

function aiStatusText() {
  if (state.aiSettings.provider === "ollama") {
    return `Free local mode selected. Ollama must be running with ${getActiveAiModel()}.`;
  }

  return state.aiSettings.apiKey
    ? `OpenAI mode connected locally with ${getActiveAiModel()}.`
    : "OpenAI mode needs an API key and paid quota.";
}

async function checkLocalAiStatus() {
  try {
    const response = await fetch("http://127.0.0.1:11434/api/tags");
    if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
    const payload = await response.json();
    const models = (payload.models || []).map((model) => model.name);
    const activeModel = getActiveAiModel();
    const hasModel = models.some((name) => name === activeModel || name.startsWith(`${activeModel}:`));

    if (!models.length) {
      elements.aiStatus.textContent = "Ollama is running, but no models are installed. Run: ollama pull llama3.2";
      showToast("Ollama is running, but no model is installed.");
      playSound("warning");
      return;
    }

    elements.aiStatus.textContent = hasModel
      ? `Ollama is ready with ${activeModel}.`
      : `Ollama is running, but ${activeModel} is missing. Run: ollama pull ${activeModel}`;
    showToast(hasModel ? "Free local AI is ready." : "Model missing. Pull it in Terminal.");
    playSound(hasModel ? "success" : "warning");
  } catch {
    elements.aiStatus.textContent = "Ollama is not running. Install Ollama, open it, then run: ollama pull llama3.2";
    showToast("Ollama is not running yet.");
    playSound("warning");
  }
}

async function pasteAiKeyFromClipboard() {
  if (!navigator.clipboard?.readText) {
    showToast("Clipboard paste is blocked here. Click the key box and press Cmd+V.");
    playSound("warning");
    return;
  }

  try {
    const rawText = await navigator.clipboard.readText();
    const key = extractOpenAiKey(rawText);
    if (!key) {
      showToast("Clipboard does not look like an OpenAI API key.");
      playSound("warning");
      return;
    }

    elements.aiApiKey.value = key;
    elements.aiApiKey.type = "password";
    elements.toggleAiKeyVisibility.textContent = "Show key";
    playSound("success");
    showToast("Key pasted into the field. Press Save AI settings.");
  } catch {
    showToast("Clipboard permission was blocked. Click the key box and press Cmd+V.");
    playSound("warning");
  }
}

function extractOpenAiKey(value) {
  return String(value || "").match(/\bsk-[A-Za-z0-9_-]{20,}\b/)?.[0] || "";
}

function renderChatMessage(message) {
  const bubble = document.createElement("article");
  bubble.className = `chat-message ${message.role}`;
  bubble.innerHTML = `
    <span>${message.role === "assistant" ? "AI" : "You"}</span>
    <p>${escapeHtml(message.content)}</p>
  `;
  return bubble;
}

async function handleAiChatSubmit(event) {
  event.preventDefault();
  const question = cleanMultiline(elements.aiPrompt.value);
  if (!question) return;

  if (!canAskAi()) {
    showToast("OpenAI mode needs an API key first.");
    playSound("warning");
    return;
  }

  const userMessage = { role: "user", content: question, createdAt: new Date().toISOString() };
  state.chatMessages.push(userMessage);
  state.chatMessages = state.chatMessages.slice(-24);
  elements.aiPrompt.value = "";
  saveState();
  renderAiChat();
  setAiBusy(true);

  try {
    const answer = await askAi(question);
    state.chatMessages.push({ role: "assistant", content: answer, createdAt: new Date().toISOString() });
    state.chatMessages = state.chatMessages.slice(-24);
    saveState();
    renderAiChat();
    playSound("success");
    showToast("AI answered.");
  } catch (error) {
    state.chatMessages.push({
      role: "assistant",
      content: `AI connection failed: ${error.message}`,
      createdAt: new Date().toISOString(),
    });
    state.chatMessages = state.chatMessages.slice(-24);
    saveState();
    renderAiChat();
    playSound("warning");
    showToast("AI request failed.");
  } finally {
    setAiBusy(false);
  }
}

async function askAi(question) {
  return state.aiSettings.provider === "openai" ? askOpenAi(question) : askOllama(question);
}

async function askOllama(question) {
  const response = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getActiveAiModel(),
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "You are a clear, honest AI study assistant for a 14-year-old student. Answer general knowledge questions directly. If a topic is medical, legal, financial, dangerous, or current-news-dependent, say what you can safely explain and tell the student when to check a trusted source or ask an adult. Do not pretend to have live school email or Canvas access.",
        },
        ...state.chatMessages.slice(-10).map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content,
        })),
      ],
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Ollama returned ${response.status}. If the model is missing, run: ollama pull ${getActiveAiModel()}`);
  }

  const text = payload.message?.content || payload.response || "";
  if (!text.trim()) throw new Error("Ollama returned no readable text.");
  return text.trim();
}

async function askOpenAi(question) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.aiSettings.apiKey}`,
    },
    body: JSON.stringify({
      model: getActiveAiModel(),
      instructions:
        "You are a clear, honest AI study assistant for a 14-year-old student. Answer general knowledge questions directly. If a topic is medical, legal, financial, dangerous, or current-news-dependent, say what you can safely explain and tell the student when to check a trusted source or ask an adult. Do not pretend to have live school email or Canvas access.",
      input: [
        ...state.chatMessages.slice(-10).map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content,
        })),
      ],
      max_output_tokens: 700,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || `OpenAI returned ${response.status}`);
  }

  const text = extractOpenAiText(payload);
  if (!text) throw new Error("OpenAI returned no readable text.");
  return text;
}

function extractOpenAiText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();

  return (payload.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || part.output_text || "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function setAiBusy(isBusy) {
  elements.sendAiPrompt.disabled = isBusy || !canAskAi();
  elements.sendAiPrompt.textContent = isBusy ? "Thinking..." : "Ask AI";
  elements.aiStatus.textContent = isBusy ? "AI is thinking..." : aiStatusText();
}

function renderQuiz() {
  const task = state.tasks.find((candidate) => candidate.id === elements.quizTask.value);
  if (!task) {
    elements.quizOutput.innerHTML = `<p class="empty-state">Add a test first.</p>`;
    return;
  }

  const setNumber = state.quizSets[task.id] || 0;
  const questions = buildQuiz(task, Number(elements.questionCount.value || 8), setNumber);
  elements.quizOutput.innerHTML = `
    <h3>${escapeHtml(task.subject)} readiness quiz</h3>
    <p class="helper-text">Question set ${setNumber + 1}. Write your answer, then ask for feedback. The feedback is private and runs inside this app.</p>
    ${questions
      .map(
        (question, index) => {
          const answerKey = quizAnswerKey(task.id, setNumber, index);
          return `
          <div class="question">
            <strong>${index + 1}. ${escapeHtml(question.prompt)}</strong>
            <label class="answer-box">
              Your answer
              <textarea class="quiz-answer-input" data-index="${index}" rows="5" placeholder="Write your answer here before checking feedback.">${escapeHtml(state.quizAnswers[answerKey] || "")}</textarea>
            </label>
            <div class="question-actions">
              <button class="ghost-button feedback-button" data-index="${index}" type="button">Get AI feedback</button>
            </div>
            <div class="feedback-output" data-index="${index}" aria-live="polite"></div>
          </div>
        `;
        },
      )
      .join("")}
  `;
  elements.quizOutput.classList.remove("is-refreshed");
  void elements.quizOutput.offsetWidth;
  elements.quizOutput.classList.add("is-refreshed");

  elements.quizOutput.querySelectorAll(".question").forEach((question, index) => {
    question.style.setProperty("--item-index", String(index));
  });

  elements.quizOutput.querySelectorAll(".quiz-answer-input").forEach((input) => {
    input.addEventListener("input", () => {
      const index = Number(input.dataset.index);
      state.quizAnswers[quizAnswerKey(task.id, setNumber, index)] = input.value;
      saveState();
    });
  });

  elements.quizOutput.querySelectorAll(".feedback-button").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const input = elements.quizOutput.querySelector(`.quiz-answer-input[data-index="${index}"]`);
      const output = elements.quizOutput.querySelector(`.feedback-output[data-index="${index}"]`);
      const feedback = buildAnswerFeedback(task, questions[index], input.value);
      output.innerHTML = renderFeedback(feedback);
      output.classList.remove("is-visible");
      void output.offsetWidth;
      output.classList.add("is-visible");
      playSound(feedback.level === "weak" ? "warning" : "success");
      showToast("Feedback ready. Fix the weak points before the test.");
    });
  });
}

function quizAnswerKey(taskId, setNumber, index) {
  return `${taskId}:${setNumber}:${index}`;
}

function renderFeedback(feedback) {
  return `
    <div class="feedback-card ${feedback.level}">
      <strong>${escapeHtml(feedback.title)}</strong>
      <ul>
        ${feedback.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
      </ul>
      <p>${escapeHtml(feedback.nextStep)}</p>
    </div>
  `;
}

function buildAnswerFeedback(task, question, answer) {
  const raw = clean(answer);
  if (raw.length < 12) {
    return {
      level: "weak",
      title: "Not enough to mark yet.",
      points: ["Write at least two clear sentences.", "Answer the question first, then add evidence or working."],
      nextStep: "Add your actual answer, then ask for feedback again.",
    };
  }

  const subject = task.subject.toLowerCase();
  const context = clean(task.topics).toLowerCase();
  const text = raw.toLowerCase();
  const words = raw.split(/\s+/).filter(Boolean);
  const checks = feedbackChecks(subject, context, text, words);
  const passed = checks.filter((check) => check.pass);
  const missed = checks.filter((check) => !check.pass);
  const score = Math.round((passed.length / checks.length) * 100);
  const level = score >= 80 ? "strong" : score >= 55 ? "okay" : "weak";

  return {
    level,
    title: `${score}% ready for this question.`,
    points: [
      ...passed.slice(0, 2).map((check) => `Good: ${check.label}`),
      ...missed.slice(0, 3).map((check) => `Fix: ${check.label}`),
    ],
    nextStep: feedbackNextStep(subject, context, question),
  };
}

function feedbackChecks(subject, context, text, words) {
  if (subject.includes("english") && context.includes("cartoon")) {
    return [
      {
        label: "You answered with enough detail.",
        pass: words.length >= 35,
      },
      {
        label: "Name a visual technique accurately, such as symbol, colour, composition, tone, text, caricature, exaggeration, label, or caption.",
        pass: hasAny(text, ["symbol", "colour", "color", "composition", "tone", "text", "caricature", "exaggeration", "label", "caption"]),
      },
      {
        label: "Refer to the cartoon source with a specific detail.",
        pass: hasAny(text, ["source", "cartoon", "shows", "label", "caption", "image", "figure", "character", "object", "colour", "color"]),
      },
      {
        label: "Explain the cartoonist's message, perspective, or social commentary.",
        pass: hasAny(text, ["message", "perspective", "commentary", "suggests", "criticises", "criticizes", "persuades", "communicates", "implies"]),
      },
      {
        label: "Use cause-and-effect explanation, not just description.",
        pass: hasAny(text, ["because", "therefore", "this shows", "this suggests", "this communicates", "this makes"]),
      },
    ];
  }

  if (subject.includes("math") || context.includes("inequal")) {
    return [
      { label: "Show working, not just a final answer.", pass: words.length >= 12 || /[+\-*/=<>]/.test(text) },
      { label: "Use inequality notation such as <, >, <=, >=, or inequality words.", pass: /<|>|<=|>=|≤|≥|inequality|greater|less/.test(text) },
      { label: "Mention flipping the sign when multiplying or dividing by a negative if relevant.", pass: hasAny(text, ["flip", "negative", "divide by -", "multiply by -", "reverse"]) },
      { label: "Check or explain what the solution means.", pass: hasAny(text, ["check", "solution", "means", "therefore", "so x"]) },
    ];
  }

  if (subject.includes("science") || context.includes("tectonic") || context.includes("mineral")) {
    return [
      { label: "Use correct science vocabulary.", pass: hasAny(text, ["igneous", "sedimentary", "metamorphic", "mineral", "tectonic", "plate", "boundary", "magma", "lava"]) },
      { label: "Explain how or why, not just name terms.", pass: hasAny(text, ["because", "formed", "caused", "pressure", "heat", "movement", "cooling", "compacted"]) },
      { label: "Include an example or identifying feature.", pass: hasAny(text, ["example", "hardness", "lustre", "luster", "streak", "crystal", "cleavage", "earthquake", "volcano"]) },
      { label: "Answer with enough detail.", pass: words.length >= 25 },
    ];
  }

  if (subject.includes("prs") || subject.includes("relig")) {
    return [
      { label: "Use the key names or religions accurately.", pass: hasAny(text, ["abraham", "islam", "christianity", "judaism", "jewish", "muslim", "christian"]) },
      { label: "Include a memorised key term.", pass: hasAny(text, ["covenant", "prophet", "monotheism", "sacred", "torah", "bible", "quran", "mosque", "church", "synagogue"]) },
      { label: "Explain why the idea matters.", pass: hasAny(text, ["important", "because", "shows", "belief", "means", "central"]) },
      { label: "Answer with enough detail.", pass: words.length >= 25 },
    ];
  }

  return [
    { label: "Answer with enough detail.", pass: words.length >= 25 },
    { label: "Use topic vocabulary from the question.", pass: hasAny(text, context.split(/\s+|,/).filter(Boolean)) },
    { label: "Explain why your answer is true.", pass: hasAny(text, ["because", "therefore", "this shows", "this means", "for example"]) },
  ];
}

function feedbackNextStep(subject, context, question) {
  if (subject.includes("english") && context.includes("cartoon")) {
    return "Rewrite using this pattern: answer the question, name a technique, refer to one source detail, explain the cartoonist's message.";
  }

  if (subject.includes("math") || context.includes("inequal")) {
    return "Rewrite with every algebra step visible, then check the solution against the original inequality.";
  }

  if (subject.includes("science") || context.includes("tectonic") || context.includes("mineral")) {
    return "Add one precise vocabulary word and one example or identifying feature.";
  }

  if (subject.includes("prs") || subject.includes("relig")) {
    return "Add one memorised key term and explain why it matters.";
  }

  return `Make the answer more specific to: ${question.prompt}`;
}

function hasAny(text, terms) {
  return terms.some((term) => term && text.includes(term));
}

function buildQuiz(task, count, setNumber = 0) {
  const topics = splitTopics(task.topics);
  const subject = task.subject.toLowerCase();
  const context = clean(task.topics).toLowerCase();
  const safeTopics = topics.length ? topics : ["the key ideas", "definitions", "worked examples", "common mistakes"];
  const templates = getTemplates(subject, context);
  const questions = [];

  for (let index = 0; index < count; index += 1) {
    const topic = safeTopics[(index + setNumber) % safeTopics.length];
    const template = templates[(index + setNumber * 3) % templates.length];
    questions.push(template(topic, task.subject));
  }

  return questions;
}

function getTemplates(subject, context = "") {
  if (subject.includes("english") && context.includes("cartoon")) {
    return [
      (topic) => ({
        prompt: `Look at a political cartoon and identify the ${topic}. What visual evidence proves your answer?`,
        answer: "Name the technique accurately, refer to the source detail, then explain how it communicates the cartoonist's message or perspective.",
      }),
      () => ({
        prompt: "Write the cartoonist's underlying message or social commentary in one sentence.",
        answer: "A strong answer states the issue, the cartoonist's perspective, and what the viewer is meant to think.",
      }),
      () => ({
        prompt: "Find two visual techniques: symbol, colour, composition, tone, text, caricature, exaggeration, or caption.",
        answer: "For each technique, use the correct term and explain how it persuades or shapes the viewer's response.",
      }),
      () => ({
        prompt: "Answer a source question directly, then refer to one specific detail from the cartoon.",
        answer: "A strong answer names the idea first, then points to a clear source detail such as a label, symbol, expression, caption, or exaggerated feature.",
      }),
      () => ({
        prompt: "Explain how tone is created in a cartoon. What details would you look for?",
        answer: "Look at facial expressions, colour, wording, exaggeration, and composition. Then explain whether the tone is critical, mocking, angry, serious, or humorous.",
      }),
      () => ({
        prompt: "If a question asks what the cartoon suggests, how do you avoid just describing the image?",
        answer: "Explain the meaning behind the image. Use source details as proof, not as the whole answer.",
      }),
    ];
  }

  if (subject.includes("math")) {
    if (context.includes("inequal")) {
      return [
        () => ({
          prompt: "Solve: 3x - 7 < 11. Show every step and graph the solution on a number line.",
          answer: "Add 7, divide by 3, then show x < 6 on a number line with an open circle at 6.",
        }),
        () => ({
          prompt: "Solve: -2x + 5 >= 17. What happens to the inequality sign?",
          answer: "Subtract 5, divide by -2, flip the sign. The solution is x <= -6.",
        }),
        () => ({
          prompt: "Create a worded inequality for a real situation, then solve it.",
          answer: "Your answer needs the inequality, working, solution set, and a sentence explaining the meaning.",
        }),
        (topic) => ({
          prompt: `Explain the biggest mistake students make with ${topic}.`,
          answer: "The common danger is losing the inequality sign or forgetting to flip it with a negative multiplier/divider.",
        }),
      ];
    }

    return [
      (topic) => ({
        prompt: `Explain ${topic} in three steps, then write one worked example.`,
        answer: "Your answer should show the rule, substitution, working, and final answer.",
      }),
      (topic) => ({
        prompt: `Create and solve a medium-difficulty ${topic} question.`,
        answer: "Check each line of working. One careless step means this topic needs more practice.",
      }),
      (topic) => ({
        prompt: `What is the most common mistake students make with ${topic}?`,
        answer: "Name the mistake and write the corrected version.",
      }),
      (topic) => ({
        prompt: `Do two ${topic} problems without notes and time yourself for six minutes.`,
        answer: "You should finish with clear working and no guessing.",
      }),
    ];
  }

  if (subject.includes("science")) {
    if (context.includes("mineral") || context.includes("tectonic") || context.includes("rock")) {
      return [
        () => ({
          prompt: "Classify these rock types and explain how each forms: igneous, sedimentary, metamorphic.",
          answer: "Igneous forms from cooled magma/lava, sedimentary from compacted sediments, metamorphic from heat and pressure changing existing rock.",
        }),
        () => ({
          prompt: "What clues would you use to identify a mineral in a sample?",
          answer: "Use observable properties such as colour, lustre, hardness, streak, crystal shape, and cleavage/fracture.",
        }),
        () => ({
          prompt: "Explain how tectonic plates can cause earthquakes and volcanoes.",
          answer: "Plate movement at boundaries builds pressure or allows magma movement; released pressure causes earthquakes and magma can form volcanoes.",
        }),
        (topic) => ({
          prompt: `Define ${topic} and give one test-style example.`,
          answer: "Give the definition first, then connect it to a rock, mineral, boundary, earthquake, or volcano example.",
        }),
      ];
    }

    return [
      (topic) => ({
        prompt: `Define ${topic} and give one real example.`,
        answer: "Use the correct term, explain the process, and include one cause or effect.",
      }),
      (topic) => ({
        prompt: `Draw or describe the sequence involved in ${topic}.`,
        answer: "Your answer should be ordered and use scientific vocabulary correctly.",
      }),
      (topic) => ({
        prompt: `What evidence would prove you understand ${topic}?`,
        answer: "Name an observation, result, or experiment and explain what it shows.",
      }),
    ];
  }

  if (subject.includes("english")) {
    return [
      (topic) => ({
        prompt: `Write a paragraph about ${topic} using point, evidence, explanation.`,
        answer: "A strong answer makes a claim, uses a quote or detail, and explains why it matters.",
      }),
      (topic) => ({
        prompt: `List three useful quotes or examples for ${topic}.`,
        answer: "Each quote needs a short note explaining how you would use it.",
      }),
      (topic) => ({
        prompt: `Write a thesis sentence for a question about ${topic}.`,
        answer: "It should take a clear position, not just restate the question.",
      }),
    ];
  }

  if (subject.includes("prs") || subject.includes("relig")) {
    return [
      () => ({
        prompt: "Summarise the life of Abraham in five key points.",
        answer: "Include his role as a patriarch, covenant with God, journey, family line, and importance to Judaism, Christianity, and Islam.",
      }),
      () => ({
        prompt: "Compare Islam, Christianity, and Judaism using founder/key figure, sacred text, place of worship, and core belief.",
        answer: "Use a simple table. Accuracy matters more than fancy wording.",
      }),
      (topic) => ({
        prompt: `Define or explain ${topic} from memory.`,
        answer: "Write a short definition, then add why it matters in the religion or Abraham story.",
      }),
      () => ({
        prompt: "What do Judaism, Christianity, and Islam have in common?",
        answer: "They are Abrahamic monotheistic religions, meaning they trace importance to Abraham and believe in one God.",
      }),
    ];
  }

  return [
    (topic, subjectName) => ({
      prompt: `Teach ${topic} from ${subjectName} to a Year 7 student in under one minute.`,
      answer: "If you cannot explain it simply, you do not know it yet.",
    }),
    (topic) => ({
      prompt: `Write five facts or rules you must know for ${topic}.`,
      answer: "Each fact should be specific enough to check as right or wrong.",
    }),
    (topic) => ({
      prompt: `Make one hard question about ${topic}, then answer it.`,
      answer: "The answer should prove understanding, not memory only.",
    }),
    (topic) => ({
      prompt: `What would your teacher probably ask about ${topic}?`,
      answer: "Write the likely question and the best short answer.",
    }),
  ];
}

function generateStudyPlan() {
  state.studyBlocks = [];
  state.lifeBlocks = [];

  generateEssentialBlocks();
  generateTaskStudyBlocks();
  generateStandingHomeworkBlocks();
  generateCoachRecoveryBlocks();
  generateBusinessBlocks();
}

function generateEssentialBlocks() {
  const today = startOfDay(new Date());
  for (let offset = 0; offset < 14; offset += 1) {
    const date = addDays(today, offset);
    addLifeBlock(date, "Chill / reset", 45, chillWindowsForDate(date), "chill", "Protected downtime before more work.");
    addLifeBlock(date, mealNameForDate(date), 45, mealWindowsForDate(date), "meal", "Food is blocked so the planner does not pretend you can work nonstop.");
  }
}

function generateTaskStudyBlocks() {
  const today = startOfDay(new Date());
  const end = addDays(today, 14);

  const targets = upcomingTasks(false)
    .filter((task) => !task.completed)
    .filter((task) => ["test", "homework"].includes(task.type))
    .filter((task) => parseDate(task.dueDate) >= today && parseDate(task.dueDate) <= end);

  targets.forEach((task) => {
    const due = parseDate(task.dueDate);
    const rawDaysLeft = Math.max(0, Math.ceil((due - today) / 86400000));
    const topicCount = splitTopics(task.topics).length;
    const blocksNeeded =
      task.type === "test"
        ? Math.min(7, Math.max(3, Math.ceil(rawDaysLeft / 2), topicCount || 0))
        : task.priority === "high"
          ? 2
          : 1;
    const duration = task.priority === "high" ? 50 : 40;

    let placed = 0;
    const latestOffset = task.type === "test" ? Math.max(0, rawDaysLeft - 1) : rawDaysLeft;
    for (let offset = latestOffset; offset >= 0 && placed < blocksNeeded; offset -= 1) {
      const date = addDays(today, offset);
      const slot = findFreeSlot(date, duration, workWindowsForDate(date));
      if (!slot) continue;
      state.studyBlocks.push({
        id: crypto.randomUUID(),
        taskId: task.id,
        subject: task.subject,
        date: toDateInput(date),
        start: slot.start,
        end: slot.end,
        detail: task.type === "test" ? "Test prep from your topic list." : "Homework due soon.",
      });
      placed += 1;
    }
  });
}

function generateStandingHomeworkBlocks() {
  const today = startOfDay(new Date());
  for (let offset = 0; offset < 14; offset += 1) {
    const date = addDays(today, offset);
    const day = date.getDay();
    const duration = day === 3 ? 40 : day === 0 || day === 6 ? 60 : 50;
    addLifeBlock(date, "Homework catch-up", duration, workWindowsForDate(date), "homework", "Default schoolwork block. Tests can take priority when you add topics.");
  }
}

function generateBusinessBlocks() {
  const today = startOfDay(new Date());
  for (let offset = 0; offset < 14; offset += 1) {
    const date = addDays(today, offset);
    const day = date.getDay();
    const baseDuration = day === 0 ? 120 : day === 6 ? 90 : day === 3 ? 45 : 60;
    const pressure = getCoachPressureForDate(date);
    const reduction = state.coachSettings.enabled && state.coachSettings.autoReduceBusiness && pressure.level
      ? pressure.level >= 2
        ? 60
        : 30
      : 0;
    const duration = Math.max(0, baseDuration - reduction);
    if (duration < 30) continue;

    const detail = reduction
      ? `Reduced by Coach Mode because ${pressure.reasons[0] || "school work is behind"} Real project time only after school priorities.`
      : "Project build time. No scrolling and calling it research.";
    addLifeBlock(date, "Project build", duration, businessWindowsForDate(date), "business", detail);
  }
}

function generateCoachRecoveryBlocks() {
  if (!state.coachSettings.enabled || !state.coachSettings.autoReduceBusiness) return;

  const today = startOfDay(new Date());
  for (let offset = 0; offset < 14; offset += 1) {
    const date = addDays(today, offset);
    const pressure = getCoachPressureForDate(date);
    if (!pressure.level) continue;

    const duration = pressure.level >= 2 ? 50 : 35;
    addLifeBlock(
      date,
      pressure.focusTask ? `Coach recovery: ${shortenTitle(pressure.focusTask.subject)}` : "Coach recovery",
      duration,
      coachRecoveryWindowsForDate(date),
      "coach",
      `${pressure.reasons[0]} Project time comes after this.`,
    );
  }
}

function addLifeBlock(date, name, durationMinutes, windows, category, detail = "") {
  const slot = findFreeSlot(date, durationMinutes, windows);
  if (!slot) return false;

  state.lifeBlocks.push({
    id: crypto.randomUUID(),
    date: toDateInput(date),
    name,
    start: slot.start,
    end: slot.end,
    category,
    detail,
  });
  return true;
}

function findFreeSlot(date, durationMinutes, windows) {
  const occupied = getOccupiedRanges(date);

  for (const [startText, endText] of windows) {
    for (let cursor = toMinutes(startText); cursor + durationMinutes <= toMinutes(endText); cursor += 15) {
      const proposed = [cursor, cursor + durationMinutes];
      const clashes = occupied.some(([start, end]) => proposed[0] < end && proposed[1] > start);
      if (!clashes) {
        return { start: fromMinutes(proposed[0]), end: fromMinutes(proposed[1]) };
      }
    }
  }

  return null;
}

function getOccupiedRanges(date) {
  const dateKey = toDateInput(date);
  return [
    ...getFixedEventsForDate(date).map((event) => [toMinutes(event.start), toMinutes(event.end)]),
    ...state.quickBlocks.filter((block) => block.date === dateKey).map((block) => [toMinutes(block.start), toMinutes(block.end)]),
    ...state.lifeBlocks.filter((block) => block.date === dateKey).map((block) => [toMinutes(block.start), toMinutes(block.end)]),
    ...state.studyBlocks.filter((block) => block.date === dateKey).map((block) => [toMinutes(block.start), toMinutes(block.end)]),
  ];
}

function chillWindowsForDate(date) {
  if (isWeekend(date)) {
    return [
      ["13:30", "18:30"],
      ["18:30", "20:45"],
    ];
  }

  if (date.getDay() === 3) {
    return [["18:00", "20:00"]];
  }

  return [
    ["15:45", "18:45"],
    ["18:45", "21:15"],
  ];
}

function mealWindowsForDate(date) {
  if (date.getDay() === 6) {
    return [["17:30", "19:30"]];
  }

  if (date.getDay() === 0) {
    return [
      ["13:30", "15:00"],
      ["18:00", "19:30"],
    ];
  }

  return [
    ["18:00", "19:30"],
    ["19:30", "21:15"],
  ];
}

function workWindowsForDate(date) {
  if (date.getDay() === 6) {
    return [["17:30", "20:45"]];
  }

  if (date.getDay() === 0) {
    return [
      ["14:00", "18:00"],
      ["19:00", "20:45"],
    ];
  }

  return [["15:45", "21:15"]];
}

function businessWindowsForDate(date) {
  if (date.getDay() === 6) {
    return [["18:00", "20:45"]];
  }

  if (date.getDay() === 0) {
    return [
      ["15:00", "18:00"],
      ["19:00", "20:45"],
    ];
  }

  return [["16:00", "21:15"]];
}

function coachRecoveryWindowsForDate(date) {
  const windows = workWindowsForDate(date);
  const todayKey = toDateInput(new Date());
  if (toDateInput(date) !== todayKey) return windows;

  const now = new Date();
  const earliest = fromMinutes(Math.min(21 * 60, now.getHours() * 60 + now.getMinutes() + 15));
  return windows
    .map(([start, end]) => [maxTime(start, earliest), end])
    .filter(([start, end]) => toMinutes(start) < toMinutes(end));
}

function getCoachPressureForDate(date) {
  if (!state.coachSettings.enabled) return { level: 0, reasons: [], focusTask: null };

  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const horizon = addDays(target, 1);
  const recentMisses = countRecentCoachMisses(target);
  const activeTasks = upcomingTasks(false)
    .filter((task) => !task.completed)
    .filter((task) => ["test", "homework"].includes(task.type))
    .filter((task) => parseDate(task.dueDate) >= today && parseDate(task.dueDate) <= horizon)
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || parseDate(a.dueDate) - parseDate(b.dueDate));

  const overdue = upcomingTasks(false)
    .filter((task) => !task.completed)
    .filter((task) => parseDate(task.dueDate) < today);

  const urgentTest = activeTasks.find((task) => task.type === "test" && taskReadiness(task) < 85);
  const highPriorityTask = activeTasks.find((task) => task.priority === "high") || urgentTest || overdue[0];
  const reasons = [];

  if (urgentTest) {
    reasons.push(`${urgentTest.subject} is due ${formatShortDate(urgentTest.dueDate)} and readiness is ${taskReadiness(urgentTest)}%.`);
  }

  if (overdue.length) {
    reasons.push(`${overdue.length} school item${overdue.length === 1 ? "" : "s"} overdue.`);
  }

  if (recentMisses) {
    reasons.push(`${recentMisses} important miss${recentMisses === 1 ? "" : "es"} logged recently.`);
  }

  if (!reasons.length && highPriorityTask) {
    reasons.push(`${highPriorityTask.subject} is close enough that school gets priority.`);
  }

  let level = 0;
  if (urgentTest || overdue.length) level = 2;
  else if (activeTasks.length || recentMisses) level = 1;
  if (recentMisses >= 2) level = Math.max(level, 2);

  return { level, reasons, focusTask: highPriorityTask || urgentTest || null };
}

function countRecentCoachMisses(date) {
  const startKey = toDateInput(addDays(date, -3));
  const endKey = toDateInput(date);
  return Object.entries(state.commandLog)
    .filter(([key, value]) => key.slice(0, 10) >= startKey && key.slice(0, 10) <= endKey && value?.status === "skipped")
    .length;
}

function mealNameForDate(date) {
  return isWeekend(date) ? "Eat / recover" : "Dinner";
}

function upcomingTasks(onlyUpcoming = true) {
  const today = startOfDay(new Date());
  return state.tasks
    .filter((task) => !onlyUpcoming || parseDate(task.dueDate) >= today)
    .slice()
    .sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));
}

function taskCompletedDate(task) {
  if (!task.completedAt) return task.dueDate;
  const date = new Date(task.completedAt);
  return Number.isNaN(date.getTime()) ? task.dueDate : toDateInput(date);
}

function schoolCycleDay(date) {
  const settings = state.schoolSettings;
  if (!settings.cycleEnabled || !settings.cycleStartDate || !settings.schoolDays.includes(date.getDay())) return null;

  const anchor = parseDate(settings.cycleStartDate);
  const target = startOfDay(date);
  let weekdayOffset = 0;

  if (target >= anchor) {
    for (let cursor = addDays(anchor, 1); cursor <= target; cursor = addDays(cursor, 1)) {
      if (settings.schoolDays.includes(cursor.getDay())) weekdayOffset += 1;
    }
  } else {
    for (let cursor = anchor; cursor > target; cursor = addDays(cursor, -1)) {
      if (settings.schoolDays.includes(cursor.getDay())) weekdayOffset -= 1;
    }
  }

  return mod(weekdayOffset, settings.cycleLength) + 1;
}

function dateForNextCycleDay(cycleDay) {
  if (!state.schoolSettings.cycleEnabled) return startOfDay(new Date());
  const today = startOfDay(new Date());

  for (let offset = 0; offset < 30; offset += 1) {
    const date = addDays(today, offset);
    if (schoolCycleDay(date) === cycleDay) return date;
  }

  return today;
}

function subjectsForCycleDay(cycleDay) {
  return state.schoolSettings.cycleSubjects[String(cycleDay)] || [];
}

function splitTopics(topics) {
  return clean(topics)
    .split(/,|\n/)
    .map((topic) => topic.trim())
    .filter(Boolean);
}

function cleanMultiline(value) {
  return String(value || "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function clean(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return startOfDay(new Date(year, month - 1, day));
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value) {
  const date = parseDate(value);
  return `${shortDayNames[date.getDay()]} ${date.getDate()}`;
}

function formatLongDate(value) {
  const date = parseDate(value);
  return `${dayNames[date.getDay()]} ${date.getDate()} ${date.toLocaleString("en-AU", { month: "short" })}`;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(total) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function maxTime(first, second) {
  return toMinutes(first) >= toMinutes(second) ? first : second;
}

function validTime(value) {
  return /^\d{2}:\d{2}$/.test(String(value || "")) && toMinutes(value) >= 0 && toMinutes(value) < 24 * 60;
}

function validDateInput(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) && !Number.isNaN(parseDate(value).getTime());
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function formatDuration(minutes) {
  if (minutes <= 0) return "now";
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return `${remainder} min`;
  if (!remainder) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}

function priorityRank(priority) {
  return { high: 0, medium: 1, low: 2 }[priority] ?? 3;
}

function capitalize(value) {
  const text = clean(value);
  return text ? text[0].toUpperCase() + text.slice(1) : "";
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.StudentCommandDebug = {
  analyzeImportText,
  buildImportProposal,
  buildAnswerFeedback,
  buildQuiz,
};
