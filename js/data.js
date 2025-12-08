// Sample data for Moltazim prototype

const users = [
  { id: 1, name: 'Noura Al-Qahtani', email: 'noura@moltazim.sa', role: 'manager', department: 'GRC' },
  { id: 2, name: 'Faisal Al-Harbi', email: 'faisal@moltazim.sa', role: 'employee', department: 'Network Security' },
  { id: 3, name: 'Laila Al-Suwailem', email: 'laila@moltazim.sa', role: 'employee', department: 'App Security' },
  { id: 4, name: 'Omar Al-Dossary', email: 'omar@moltazim.sa', role: 'employee', department: 'IT Ops' },
  { id: 5, name: 'Sara Al-Mutairi', email: 'sara@moltazim.sa', role: 'employee', department: 'Risk' },
];

const departments = ['GRC', 'Network Security', 'App Security', 'IT Ops', 'Risk'];

const eccControls = [
  { id: 1, code: 'GOV-01', title: 'Governance Charter', domain: 'GOV', description: 'Document governance structure and charter.', riskWeight: 10 },
  { id: 2, code: 'GOV-02', title: 'Policy Management', domain: 'GOV', description: 'Maintain ECC-aligned policies.', riskWeight: 12 },
  { id: 3, code: 'INF-01', title: 'Asset Inventory', domain: 'INF', description: 'Maintain inventory of assets.', riskWeight: 8 },
  { id: 4, code: 'APP-12', title: 'Application Updates', domain: 'APP', description: 'Patch and update applications frequently.', riskWeight: 9 },
  { id: 5, code: 'APP-16', title: 'Secure Development', domain: 'APP', description: 'Secure SDLC practices.', riskWeight: 12 },
  { id: 6, code: 'BCM-03', title: 'BCP Testing', domain: 'BCM', description: 'Test business continuity plans.', riskWeight: 7 },
  { id: 7, code: 'SEC-08', title: 'Access Control', domain: 'SEC', description: 'Role-based access control for systems.', riskWeight: 10 },
  { id: 8, code: 'OPS-04', title: 'Incident Response', domain: 'OPS', description: 'Incident response runbooks and drills.', riskWeight: 11 },
  { id: 9, code: 'DMN-05', title: 'Data Classification', domain: 'DMN', description: 'Classify and handle data properly.', riskWeight: 6 },
  { id: 10, code: 'PRV-02', title: 'Privacy Impact', domain: 'PRV', description: 'Perform privacy impact assessments.', riskWeight: 5 }
];

const tasks = [
  { id: 1, controlId: 4, title: 'Manage application updates', ownerId: 3, status: 'In Progress', dueDate: '2024-04-05', priority: 'High', progress: 55, comments: ['Ensure monthly release notes attached.'] },
  { id: 2, controlId: 1, title: 'Update governance charter', ownerId: 5, status: 'Submitted', dueDate: '2024-03-30', priority: 'Medium', progress: 80, comments: [] },
  { id: 3, controlId: 7, title: 'Review access control list', ownerId: 2, status: 'Assigned', dueDate: '2024-04-12', priority: 'High', progress: 20, comments: ['Pending MFA evidence.'] },
  { id: 4, controlId: 6, title: 'BCP test report', ownerId: 4, status: 'Approved', dueDate: '2024-03-10', priority: 'Low', progress: 100, comments: [] },
  { id: 5, controlId: 3, title: 'Asset inventory refresh', ownerId: 2, status: 'Returned', dueDate: '2024-03-25', priority: 'High', progress: 40, comments: ['Need updated CMDB exports.'] },
  { id: 6, controlId: 8, title: 'Incident drill evidence', ownerId: 4, status: 'Submitted', dueDate: '2024-04-02', priority: 'Medium', progress: 75, comments: ['Include post-mortem.'] },
  { id: 7, controlId: 9, title: 'Data classification run', ownerId: 5, status: 'In Progress', dueDate: '2024-04-20', priority: 'Low', progress: 45, comments: [] },
  { id: 8, controlId: 2, title: 'Policy gap analysis', ownerId: 3, status: 'In Progress', dueDate: '2024-04-18', priority: 'Medium', progress: 35, comments: ['Awaiting HR sign-off.'] },
  { id: 9, controlId: 5, title: 'Secure coding checklist', ownerId: 3, status: 'Submitted', dueDate: '2024-04-04', priority: 'High', progress: 70, comments: [] },
  { id: 10, controlId: 10, title: 'Privacy impact review', ownerId: 5, status: 'Assigned', dueDate: '2024-04-22', priority: 'Medium', progress: 10, comments: [] },
  { id: 11, controlId: 6, title: 'BCM tabletop', ownerId: 4, status: 'In Progress', dueDate: '2024-04-15', priority: 'High', progress: 60, comments: [] },
  { id: 12, controlId: 7, title: 'Access review evidence', ownerId: 2, status: 'Submitted', dueDate: '2024-04-01', priority: 'High', progress: 85, comments: [] },
  { id: 13, controlId: 4, title: 'App deployment checklist', ownerId: 3, status: 'Approved', dueDate: '2024-03-08', priority: 'Medium', progress: 100, comments: [] },
  { id: 14, controlId: 8, title: 'Incident response training', ownerId: 4, status: 'Assigned', dueDate: '2024-04-19', priority: 'Medium', progress: 30, comments: [] },
  { id: 15, controlId: 5, title: 'DevSecOps pipeline', ownerId: 3, status: 'In Progress', dueDate: '2024-04-28', priority: 'High', progress: 50, comments: [] },
  { id: 16, controlId: 3, title: 'Asset disposal policy', ownerId: 2, status: 'Returned', dueDate: '2024-03-27', priority: 'Low', progress: 25, comments: ['Clarify destruction steps.'] },
  { id: 17, controlId: 2, title: 'Policy distribution proof', ownerId: 5, status: 'Approved', dueDate: '2024-03-12', priority: 'Medium', progress: 100, comments: [] },
  { id: 18, controlId: 9, title: 'Data retention evidence', ownerId: 5, status: 'Submitted', dueDate: '2024-04-09', priority: 'Medium', progress: 65, comments: [] },
  { id: 19, controlId: 10, title: 'Vendor privacy attestation', ownerId: 2, status: 'Assigned', dueDate: '2024-04-30', priority: 'Medium', progress: 15, comments: [] },
  { id: 20, controlId: 8, title: 'Incident KPIs', ownerId: 4, status: 'In Progress', dueDate: '2024-04-06', priority: 'Low', progress: 55, comments: [] }
];

const evidence = [
  { id: 1, taskId: 1, title: 'Patch schedule', description: 'Monthly patch process.', ownerId: 3, status: 'Draft', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-20' },
  { id: 2, taskId: 1, title: 'Deployment pipeline screenshots', description: 'CI/CD proof.', ownerId: 3, status: 'Submitted', aiLabel: 'Applied', lastUpdatedAt: '2024-03-25' },
  { id: 3, taskId: 2, title: 'Governance charter v2', description: 'Updated charter.', ownerId: 5, status: 'Submitted', aiLabel: 'Applied', lastUpdatedAt: '2024-03-23' },
  { id: 4, taskId: 3, title: 'Access list export', description: 'Export from IAM.', ownerId: 2, status: 'Draft', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-19' },
  { id: 5, taskId: 4, title: 'BCP test report', description: 'Report with metrics.', ownerId: 4, status: 'Approved', aiLabel: 'Applied', lastUpdatedAt: '2024-03-10' },
  { id: 6, taskId: 5, title: 'CMDB extract', description: 'Hardware/software list.', ownerId: 2, status: 'Returned', aiLabel: 'Irrelevant', lastUpdatedAt: '2024-03-18' },
  { id: 7, taskId: 6, title: 'Incident drill deck', description: 'Slides and notes.', ownerId: 4, status: 'Submitted', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-24' },
  { id: 8, taskId: 7, title: 'Classification policy', description: 'Policy reference.', ownerId: 5, status: 'In Progress', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-21' },
  { id: 9, taskId: 8, title: 'Gap register', description: 'Policy gaps.', ownerId: 3, status: 'In Progress', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-22' },
  { id: 10, taskId: 9, title: 'Secure coding checklist', description: 'Checklist evidence.', ownerId: 3, status: 'Submitted', aiLabel: 'Applied', lastUpdatedAt: '2024-03-26' },
  { id: 11, taskId: 10, title: 'PIA template', description: 'Template filled.', ownerId: 5, status: 'Assigned', aiLabel: 'Irrelevant', lastUpdatedAt: '2024-03-27' },
  { id: 12, taskId: 11, title: 'Tabletop summary', description: 'Summary of tabletop test.', ownerId: 4, status: 'In Progress', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-23' },
  { id: 13, taskId: 12, title: 'Access review approvals', description: 'Manager approvals.', ownerId: 2, status: 'Submitted', aiLabel: 'Applied', lastUpdatedAt: '2024-03-28' },
  { id: 14, taskId: 13, title: 'Deployment checklist', description: 'Checklist file.', ownerId: 3, status: 'Approved', aiLabel: 'Applied', lastUpdatedAt: '2024-03-08' },
  { id: 15, taskId: 14, title: 'Training attendance', description: 'Sign-in sheet.', ownerId: 4, status: 'Assigned', aiLabel: 'Irrelevant', lastUpdatedAt: '2024-03-29' },
  { id: 16, taskId: 15, title: 'Pipeline screenshot', description: 'CI/CD security gates.', ownerId: 3, status: 'In Progress', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-24' },
  { id: 17, taskId: 16, title: 'Destruction SOP', description: 'SOP draft.', ownerId: 2, status: 'Returned', aiLabel: 'Irrelevant', lastUpdatedAt: '2024-03-17' },
  { id: 18, taskId: 17, title: 'Distribution log', description: 'Proof of distribution.', ownerId: 5, status: 'Approved', aiLabel: 'Applied', lastUpdatedAt: '2024-03-13' },
  { id: 19, taskId: 18, title: 'Retention matrix', description: 'Retention table.', ownerId: 5, status: 'Submitted', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-27' },
  { id: 20, taskId: 19, title: 'Vendor attestation', description: 'Signed attestation.', ownerId: 2, status: 'Assigned', aiLabel: 'Irrelevant', lastUpdatedAt: '2024-03-20' },
  { id: 21, taskId: 20, title: 'KPI sheet', description: 'Incident KPIs.', ownerId: 4, status: 'In Progress', aiLabel: 'Partially Applied', lastUpdatedAt: '2024-03-26' }
];

const aiReviews = [
  {
    id: 1,
    evidenceId: 2,
    role: 'employee',
    score0to100: 74,
    summary: 'Evidence is strong but missing rollback plan.',
    strengths: ['Clear deployment steps', 'Screenshots attached'],
    gaps: ['No rollback scenario', 'Missing patch approval record'],
    recommendations: ['Attach CAB approval', 'Add rollback SOP snippet']
  },
  {
    id: 2,
    evidenceId: 5,
    role: 'manager',
    score0to100: 82,
    summary: 'BCP testing demonstrates resilience with minor gaps.',
    strengths: ['Includes RTO/RPO metrics', 'Stakeholder attendance list'],
    gaps: ['No DR evidence', 'Limited tabletop scope'],
    recommendations: ['Include DR drill results', 'Expand tabletop to critical apps']
  },
  {
    id: 3,
    evidenceId: 10,
    role: 'employee',
    score0to100: 68,
    summary: 'Checklist covers basics but misses secure coding training proof.',
    strengths: ['Checklist aligned with OWASP', 'Includes code review samples'],
    gaps: ['No training logs', 'Missing SAST/DAST reports'],
    recommendations: ['Attach training attendance', 'Link SAST/DAST output']
  }
];

const complianceSummary = {
  overallScore0to100: 78,
  byDomain: [
    { domainName: 'GOV', score0to100: 70 },
    { domainName: 'INF', score0to100: 75 },
    { domainName: 'APP', score0to100: 80 },
    { domainName: 'BCM', score0to100: 85 },
    { domainName: 'SEC', score0to100: 72 },
    { domainName: 'OPS', score0to100: 74 },
    { domainName: 'DMN', score0to100: 66 },
    { domainName: 'PRV', score0to100: 62 }
  ],
  topRisks: [
    { controlCode: 'PRV-02', issueSummary: 'Privacy assessments pending for vendors.' },
    { controlCode: 'INF-01', issueSummary: 'Asset inventory incomplete for OT systems.' },
    { controlCode: 'SEC-08', issueSummary: 'MFA not enforced on legacy apps.' }
  ],
  lastUpdatedAt: '2024-03-29'
};

// Settings defaults
const platformSettings = {
  weights: {
    GOV: 1.1,
    INF: 1.0,
    APP: 1.2,
    BCM: 0.9,
    SEC: 1.1,
    OPS: 1.0,
    DMN: 0.8,
    PRV: 0.7
  },
  employeeAIEnabled: true,
  managerAIEnabled: true,
  eccVersion: 'NCA-ECC v3.0'
};
