// Simple SPA interactions for Moltazim prototype

const state = {
  currentUser: null,
  selectedTaskId: tasks[0]?.id,
  selectedDomain: complianceSummary.byDomain[0]?.domainName,
  settings: JSON.parse(JSON.stringify(platformSettings))
};

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const userPill = document.getElementById('userPill');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  applyTheme(saved || 'light');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

function setActiveSection(id) {
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  navLinks.forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
}

navLinks.forEach(btn => btn.addEventListener('click', () => setActiveSection(btn.dataset.target)));

document.querySelectorAll('[data-target="login"]').forEach(btn => btn.addEventListener('click', () => setActiveSection('login')));

// Helpers
const findUser = email => users.find(u => u.email === email);
const getUserById = id => users.find(u => u.id === id);
const getControlById = id => eccControls.find(c => c.id === id);
const getTaskById = id => tasks.find(t => t.id === id);

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB');
}

function badgeForStatus(status) {
  const map = {
    Assigned: 'neutral',
    'In Progress': 'primary',
    Submitted: 'warning',
    Approved: 'success',
    Returned: 'danger',
    Draft: 'neutral'
  };
  const tone = map[status] || 'neutral';
  return `<span class="badge ${tone}">${status}</span>`;
}

function renderManagerDashboard() {
  const scoreCard = document.getElementById('overallScoreCard');
  scoreCard.innerHTML = `
    <div class="score-ring" style="--score:${complianceSummary.overallScore0to100}">
      <div class="ring" style="--score:${complianceSummary.overallScore0to100/100}">${complianceSummary.overallScore0to100}</div>
      <div>
        <div class="muted">Overall ECC score</div>
        <strong>Updated ${formatDate(complianceSummary.lastUpdatedAt)}</strong>
        <div class="muted">AI-assisted view</div>
      </div>
    </div>`;

  const statusCounts = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});
  document.getElementById('taskStatusCard').innerHTML = `
    <div class="flex-between"><h3>Task Status</h3><span class="badge primary">${tasks.length} tasks</span></div>
    <div class="tag-list">
      ${Object.entries(statusCounts).map(([k,v]) => `<span class="badge neutral">${k}: ${v}</span>`).join('')}
    </div>`;

  const gaps = complianceSummary.topRisks.map(r => `<li>${r.controlCode}: ${r.issueSummary}</li>`).join('');
  document.getElementById('gapsCard').innerHTML = `
    <div class="flex-between"><h3>Gaps & Risks</h3><span class="badge danger">${complianceSummary.topRisks.length}</span></div>
    <ul>${gaps}</ul>`;

  populateFilters();
  populateManagerTable();
}

function populateFilters() {
  const statusSelect = document.getElementById('filterStatus');
  const ownerSelect = document.getElementById('filterOwner');
  const domainSelect = document.getElementById('filterDomain');

  const statuses = ['All', ...new Set(tasks.map(t => t.status))];
  statusSelect.innerHTML = statuses.map(s => `<option value="${s}">${s}</option>`).join('');
  ownerSelect.innerHTML = ['All', ...users.filter(u=>u.role==='employee').map(u => u.name)].map(o => `<option value="${o}">${o}</option>`).join('');
  domainSelect.innerHTML = ['All', ...new Set(eccControls.map(c => c.domain))].map(d => `<option value="${d}">${d}</option>`).join('');

  statusSelect.onchange = populateManagerTable;
  ownerSelect.onchange = populateManagerTable;
  domainSelect.onchange = populateManagerTable;
}

function populateManagerTable() {
  const tbody = document.querySelector('#managerTasksTable tbody');
  const statusFilter = document.getElementById('filterStatus').value;
  const ownerFilter = document.getElementById('filterOwner').value;
  const domainFilter = document.getElementById('filterDomain').value;

  const rows = tasks.filter(task => {
    const owner = getUserById(task.ownerId);
    const control = getControlById(task.controlId);
    const statusMatch = statusFilter === 'All' || task.status === statusFilter;
    const ownerMatch = ownerFilter === 'All' || owner?.name === ownerFilter;
    const domainMatch = domainFilter === 'All' || control?.domain === domainFilter;
    return statusMatch && ownerMatch && domainMatch;
  }).map(task => {
    const control = getControlById(task.controlId);
    const owner = getUserById(task.ownerId);
    return `<tr data-task="${task.id}">
      <td>${control?.code}</td>
      <td>${task.title}</td>
      <td>${owner?.name}</td>
      <td>${badgeForStatus(task.status)}</td>
      <td>${formatDate(task.dueDate)}</td>
      <td><div class="progress"><span style="width:${task.progress}%"></span></div></td>
      <td><button class="ghost-btn" data-open-task="${task.id}">Open</button></td>
    </tr>`;
  }).join('');

  tbody.innerHTML = rows || '<tr><td colspan="7">No tasks match filters.</td></tr>';
  tbody.querySelectorAll('[data-open-task]').forEach(btn => btn.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.openTask);
    state.selectedTaskId = id;
    renderTaskDetail();
    setActiveSection('task-detail');
  }));
}

function renderEmployeeDashboard() {
  const tbody = document.querySelector('#employeeTasksTable tbody');
  const current = state.currentUser?.role === 'employee' ? state.currentUser : users.find(u => u.role === 'employee');
  const assignedTasks = tasks.filter(t => t.ownerId === current.id);
  const overdue = assignedTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Approved');
  document.getElementById('employeeStats').textContent = `${assignedTasks.length} tasks | ${overdue.length} overdue`;

  tbody.innerHTML = assignedTasks.map(task => {
    const control = getControlById(task.controlId);
    const overdueFlag = new Date(task.dueDate) < new Date() && task.status !== 'Approved';
    return `<tr data-task="${task.id}">
      <td>${task.title}</td>
      <td>${control?.code}</td>
      <td>${badgeForStatus(task.status)}</td>
      <td class="${overdueFlag ? 'overdue' : ''}">${formatDate(task.dueDate)}</td>
      <td><div class="progress"><span style="width:${task.progress}%"></span></div></td>
      <td>
        <button class="ghost-btn" data-open-task="${task.id}">Open Task</button>
      </td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('[data-open-task]').forEach(btn => btn.addEventListener('click', (e) => {
    state.selectedTaskId = Number(e.target.dataset.openTask);
    renderTaskDetail();
    setActiveSection('task-detail');
  }));
}

function renderTaskDetail() {
  const task = getTaskById(state.selectedTaskId) || tasks[0];
  if (!task) return;
  const control = getControlById(task.controlId);
  const owner = getUserById(task.ownerId);
  document.getElementById('taskSubtitle').textContent = `${control.code} · ${task.title}`;

  const info = `
    <div class="flex-between"><h3>${task.title}</h3><span class="badge primary">${task.priority} priority</span></div>
    <p>${control.title} (${control.domain})</p>
    <p class="muted">${control.description}</p>
    <div class="tag-list">
      <span class="badge neutral">Owner: ${owner.name}</span>
      <span class="badge neutral">Due: ${formatDate(task.dueDate)}</span>
      <span class="badge neutral">Progress: ${task.progress}%</span>
    </div>
    <div class="progress"><span style="width:${task.progress}%"></span></div>
  `;
  document.getElementById('taskInfoCard').innerHTML = info;

  const steps = ['Assigned', 'In Progress', 'Submitted', 'Approved', 'Returned'];
  const timeline = steps.map(step => `<div class="step ${task.status === step ? 'active' : ''}">${step}</div>`).join('');
  document.getElementById('timelineCard').innerHTML = `<h3>Status</h3><div class="timeline">${timeline}</div>`;

  renderEvidenceList(task.id);
  renderAiReview(task.id);
  renderTaskActions(task);
}

function renderEvidenceList(taskId) {
  const list = evidence.filter(e => e.taskId === taskId).map(ev => {
    return `<div class="card" style="margin-bottom:10px;">
      <div class="flex-between"><strong>${ev.title}</strong> ${badgeForStatus(ev.status)}</div>
      <p class="muted">${ev.description}</p>
      <div class="tag-list">
        <span class="badge neutral">AI label: ${ev.aiLabel}</span>
        <span class="badge neutral">Updated: ${formatDate(ev.lastUpdatedAt)}</span>
      </div>
      <div class="tag-list">
        <button class="ghost-btn" data-ai-review="${ev.id}">Run Employee AI Review</button>
        ${state.currentUser?.role === 'manager' ? `<button class="ghost-btn" data-approve="${ev.id}">Approve</button><button class="ghost-btn" data-return="${ev.id}">Return</button>` : ''}
      </div>
    </div>`;
  }).join('');

  document.getElementById('evidenceListCard').innerHTML = `<h3>Evidence</h3>${list || '<p>No evidence yet.</p>'}`;

  document.querySelectorAll('[data-ai-review]').forEach(btn => btn.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.aiReview);
    showAiReviewForEvidence(id);
  }));

  document.querySelectorAll('[data-approve]').forEach(btn => btn.addEventListener('click', (e) => {
    const ev = evidence.find(ev => ev.id === Number(e.target.dataset.approve));
    ev.status = 'Approved';
    const task = getTaskById(taskId);
    task.status = 'Approved';
    renderTaskDetail();
  }));

  document.querySelectorAll('[data-return]').forEach(btn => btn.addEventListener('click', (e) => {
    const ev = evidence.find(ev => ev.id === Number(e.target.dataset.return));
    ev.status = 'Returned';
    const task = getTaskById(taskId);
    task.status = 'Returned';
    renderTaskDetail();
  }));
}

function renderAiReview(taskId) {
  const firstEvidence = evidence.find(e => e.taskId === taskId);
  if (!firstEvidence) {
    document.getElementById('aiReviewCard').innerHTML = '<h3>AI Review</h3><p>No evidence selected.</p>';
    return;
  }
  showAiReviewForEvidence(firstEvidence.id);
}

function showAiReviewForEvidence(evidenceId) {
  const review = aiReviews.find(r => r.evidenceId === evidenceId);
  const ev = evidence.find(e => e.id === evidenceId);
  const container = document.getElementById('aiReviewCard');
  if (!review) {
    container.innerHTML = `<h3>AI Review</h3><p>No AI feedback yet for <strong>${ev?.title}</strong>.</p>`;
    return;
  }
  const strengths = review.strengths.map(s => `<li>${s}</li>`).join('');
  const gaps = review.gaps.map(s => `<li>${s}</li>`).join('');
  const recs = review.recommendations.map(s => `<li>${s}</li>`).join('');
  container.innerHTML = `
    <div class="flex-between"><h3>AI Feedback: ${ev?.title}</h3><span class="badge primary">${review.role} view</span></div>
    <div class="score-ring" style="--score:${review.score0to100}">
      <div class="ring" style="--score:${review.score0to100/100}">${review.score0to100}</div>
      <div class="muted">Quality score</div>
    </div>
    <p>${review.summary}</p>
    <h4>Strengths</h4><ul>${strengths}</ul>
    <h4>Gaps</h4><ul>${gaps}</ul>
    <h4>Recommendations</h4><ul>${recs}</ul>
  `;
}

function renderEvidenceLibrary() {
  const tbody = document.querySelector('#evidenceTable tbody');
  const domainFilter = document.getElementById('filterDomainEvidence');
  const ownerFilter = document.getElementById('filterOwnerEvidence');
  const labelFilter = document.getElementById('filterLabelEvidence');
  const statusFilter = document.getElementById('filterStatusEvidence');

  const domains = ['All', ...new Set(eccControls.map(c => c.domain))];
  domainFilter.innerHTML = domains.map(d => `<option value="${d}">${d}</option>`).join('');
  ownerFilter.innerHTML = ['All', ...users.map(u => u.name)].map(o => `<option value="${o}">${o}</option>`).join('');
  labelFilter.innerHTML = ['All', 'Applied', 'Partially Applied', 'Irrelevant'].map(l => `<option value="${l}">${l}</option>`).join('');
  statusFilter.innerHTML = ['All', ...new Set(evidence.map(e => e.status))].map(s => `<option value="${s}">${s}</option>`).join('');

  const filtered = evidence.filter(ev => {
    const task = getTaskById(ev.taskId);
    const control = getControlById(task.controlId);
    const owner = getUserById(ev.ownerId);
    const matchesDomain = domainFilter.value === 'All' || control.domain === domainFilter.value;
    const matchesOwner = ownerFilter.value === 'All' || owner.name === ownerFilter.value;
    const matchesLabel = labelFilter.value === 'All' || ev.aiLabel === labelFilter.value;
    const matchesStatus = statusFilter.value === 'All' || ev.status === statusFilter.value;
    return matchesDomain && matchesOwner && matchesLabel && matchesStatus;
  });

  tbody.innerHTML = filtered.map(ev => {
    const task = getTaskById(ev.taskId);
    const control = getControlById(task.controlId);
    const owner = getUserById(ev.ownerId);
    return `<tr data-task="${task.id}">
      <td>${control.code}</td>
      <td>${task.title}</td>
      <td>${ev.title}</td>
      <td>${owner.name}</td>
      <td><span class="badge primary">${ev.aiLabel}</span></td>
      <td>${badgeForStatus(ev.status)}</td>
      <td>${formatDate(ev.lastUpdatedAt)}</td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('tr').forEach(row => row.addEventListener('click', () => {
    const id = Number(row.dataset.task);
    state.selectedTaskId = id;
    renderTaskDetail();
    setActiveSection('task-detail');
  }));

  [domainFilter, ownerFilter, labelFilter, statusFilter].forEach(sel => sel.onchange = renderEvidenceLibrary);
}

function renderAiManagerView() {
  document.getElementById('aiSummaryCard').innerHTML = `
    <div class="score-ring" style="--score:${complianceSummary.overallScore0to100}">
      <div class="ring" style="--score:${complianceSummary.overallScore0to100/100}">${complianceSummary.overallScore0to100}</div>
      <div>
        <div class="muted">Overall ECC readiness</div>
        <strong>AI-assist, manual approval required</strong>
      </div>
    </div>
    <p class="muted">${complianceSummary.topRisks.length} key gaps identified. Last updated ${formatDate(complianceSummary.lastUpdatedAt)}.</p>
  `;

  const domainList = complianceSummary.byDomain.map(d => `<div class="flex-between" data-domain="${d.domainName}">
      <div><strong>${d.domainName}</strong><div class="muted">Score rationale</div></div>
      <span class="badge ${d.score0to100 >= 75 ? 'success' : d.score0to100 >= 60 ? 'warning' : 'danger'}">${d.score0to100}</span>
    </div>`).join('');
  document.getElementById('domainListCard').innerHTML = `<h3>Domains</h3><div class="form-grid">${domainList}</div>`;

  document.querySelectorAll('[data-domain]').forEach(el => el.addEventListener('click', () => {
    state.selectedDomain = el.dataset.domain;
    renderDomainDetail();
  }));
  renderDomainDetail();
}

function renderDomainDetail() {
  const domain = state.selectedDomain;
  const domainScore = complianceSummary.byDomain.find(d => d.domainName === domain);
  const domainTasks = tasks.filter(t => getControlById(t.controlId)?.domain === domain);
  const approved = domainTasks.filter(t => t.status === 'Approved').length;
  const submitted = domainTasks.filter(t => t.status === 'Submitted').length;
  const gaps = complianceSummary.topRisks.filter(r => r.controlCode.startsWith(domain));

  document.getElementById('domainDetailCard').innerHTML = `
    <div class="flex-between"><h3>${domain} details</h3><span class="badge primary">Score ${domainScore?.score0to100 || '--'}</span></div>
    <p>AI rationale: blending approved evidence, submitted tasks, and weight (${state.settings.weights[domain] || 1}).</p>
    <div class="tag-list">
      <span class="badge success">Approved: ${approved}</span>
      <span class="badge warning">Submitted: ${submitted}</span>
      <span class="badge danger">Gaps: ${gaps.length || '0'}</span>
    </div>
    <h4>Key Evidence</h4>
    <ul>${evidence.filter(ev => getControlById(getTaskById(ev.taskId).controlId)?.domain === domain && ev.status === 'Approved').slice(0,3).map(ev => `<li>${ev.title}</li>`).join('') || '<li>No approved evidence yet.</li>'}</ul>
    <h4>Recommendations</h4>
    <ul>
      <li>Prioritize controls with Returned status.</li>
      <li>Request stronger evidence for gaps.</li>
      <li>Use AI suggestions but validate manually.</li>
    </ul>
    <p class="muted">AI is assistive only; manager decides final compliance.</p>
  `;
}

function renderReports() {
  document.getElementById('reportOverview').innerHTML = `
    <h3>Compliance Report</h3>
    <p>Organization: Moltazim Labs</p>
    <p>Date: ${formatDate(new Date())}</p>
    <div class="score-ring" style="--score:${complianceSummary.overallScore0to100}">
      <div class="ring" style="--score:${complianceSummary.overallScore0to100/100}">${complianceSummary.overallScore0to100}</div>
      <div class="muted">Overall ECC score</div>
    </div>
    <p>Summary: AI-assisted calculation combining approved evidence and weights. Main risks remain in privacy and data management.</p>
  `;

  document.getElementById('reportChartMock').innerHTML = `
    <h3>Trend Snapshot</h3>
    <p class="muted">Mock chart placeholder</p>
    <div class="progress" style="height: 14px"><span style="width:${complianceSummary.overallScore0to100}%"></span></div>
  `;

  const rows = complianceSummary.byDomain.map(d => `<tr><td>${d.domainName}</td><td>${d.score0to100}</td><td>${state.settings.weights[d.domainName] || 1}</td></tr>`).join('');
  document.getElementById('reportTable').innerHTML = `
    <h3>Domain Scores</h3>
    <table class="data-table"><thead><tr><th>Domain</th><th>Score</th><th>Weight</th></tr></thead><tbody>${rows}</tbody></table>
  `;

  document.getElementById('downloadPdf').onclick = () => showToast('Mock PDF download triggered');
  document.getElementById('exportCsv').onclick = () => showToast('Mock CSV/Excel export');
}

function renderAdmin() {
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = users.map(u => `<tr data-user="${u.id}"><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.department}</td><td><button class="ghost-btn" data-edit="${u.id}">Edit</button></td></tr>`).join('');
  tbody.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', (e) => {
    const user = users.find(u => u.id === Number(e.target.dataset.edit));
    const form = document.getElementById('userForm');
    form.id.value = user.id;
    form.name.value = user.name;
    form.email.value = user.email;
    form.role.value = user.role;
    form.department.value = user.department;
  }));

  document.getElementById('departmentList').innerHTML = departments.map(dep => `<li>${dep}</li>`).join('');

  const form = document.getElementById('userForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const id = Number(formData.get('id'));
    const user = {
      id: id || Math.max(...users.map(u => u.id)) + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      department: formData.get('department')
    };
    if (id) {
      const index = users.findIndex(u => u.id === id);
      users[index] = user;
    } else {
      users.push(user);
    }
    form.reset();
    renderAdmin();
  };

  document.getElementById('addDepartment').onclick = () => {
    const input = document.getElementById('newDepartment');
    if (input.value && !departments.includes(input.value)) {
      departments.push(input.value);
      input.value = '';
      renderAdmin();
    }
  };
}

function renderSettings() {
  const weightsCard = document.getElementById('weightsCard');
  weightsCard.innerHTML = '<h3>ECC Domain Weights</h3>' + complianceSummary.byDomain.map(d => {
    return `<label>${d.domainName}
      <input type="number" step="0.1" min="0" value="${state.settings.weights[d.domainName] || 1}" data-weight="${d.domainName}">
    </label>`;
  }).join('');
  weightsCard.querySelectorAll('[data-weight]').forEach(inp => inp.addEventListener('input', (e) => {
    state.settings.weights[e.target.dataset.weight] = Number(e.target.value);
    renderReports();
    renderAiManagerView();
  }));

  const togglesCard = document.getElementById('togglesCard');
  togglesCard.innerHTML = `
    <h3>AI & Platform</h3>
    <label><input type="checkbox" id="employeeAI" ${state.settings.employeeAIEnabled ? 'checked' : ''}> Enable Employee AI helper</label><br>
    <label><input type="checkbox" id="managerAI" ${state.settings.managerAIEnabled ? 'checked' : ''}> Enable Manager AI analytics</label><br>
    <label>ECC Version
      <select id="eccVersion">
        <option value="NCA-ECC v3.0">NCA-ECC v3.0</option>
        <option value="NCA-ECC v2.2">NCA-ECC v2.2</option>
      </select>
    </label>
  `;
  document.getElementById('eccVersion').value = state.settings.eccVersion;
  document.getElementById('employeeAI').onchange = (e) => {
    state.settings.employeeAIEnabled = e.target.checked;
    document.getElementById('aiReviewCard').classList.toggle('hidden', !e.target.checked);
  };
  document.getElementById('managerAI').onchange = (e) => {
    state.settings.managerAIEnabled = e.target.checked;
    document.getElementById('manager-ai-review').classList.toggle('hidden', !e.target.checked);
  };
  document.getElementById('eccVersion').onchange = (e) => {
    state.settings.eccVersion = e.target.value;
    showToast(`ECC version set to ${e.target.value}`);
  };
}

function renderTaskActions(task) {
  const container = document.getElementById('taskActions');
  const isManager = state.currentUser?.role === 'manager';
  container.innerHTML = `
    <span class="badge neutral">${isManager ? 'Manager view' : 'Employee view'}</span>
    <button class="ghost-btn" data-target="manager-ai-review">Manager AI Review</button>
    <button class="ghost-btn" data-target="evidence">Evidence Library</button>
  `;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function handleRegistration() {
  const form = document.getElementById('registerForm');
  const success = document.getElementById('registerSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.remove('hidden');
  });
}

function handleLogin() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('email');
    const role = formData.get('role');
    const found = findUser(email) || users.find(u => u.role === role);
    state.currentUser = found;
    userPill.textContent = `${found.name} (${found.role})`;
    if (role === 'manager') {
      renderManagerDashboard();
      setActiveSection('manager-dashboard');
    } else {
      renderEmployeeDashboard();
      setActiveSection('employee-dashboard');
    }
  });
}

function initNavigationDefaults() {
  setActiveSection('login');
}

function bootstrap() {
  initTheme();
  handleRegistration();
  handleLogin();
  renderManagerDashboard();
  renderEmployeeDashboard();
  renderTaskDetail();
  renderEvidenceLibrary();
  renderAiManagerView();
  renderReports();
  renderAdmin();
  renderSettings();
  initNavigationDefaults();
}

bootstrap();
