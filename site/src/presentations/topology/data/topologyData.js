/** Lab topology — workshop focus: platforms + NSO-managed routers */

export const DEVICE_CREDENTIALS = 'cisco / cisco';

export const topologyNodes = [
  // Workshop platforms (top row)
  {
    id: 'nso-dev',
    name: 'NSO (Development)',
    category: 'platform',
    zone: 'platform',
    ip: '10.10.20.47',
    os: 'NSO 6.x',
    protocol: 'HTTPS',
    url: 'http://10.10.20.47:8080/login.html',
    login: 'developer / C1sco12345',
    role: 'Test and validate loopback service packages before promotion.',
    managedDevices: ['dev-core-rtr01', 'dev-dist-rtr01'],
  },
  {
    id: 'nso-prod',
    name: 'NSO (Production)',
    category: 'platform',
    zone: 'platform',
    ip: '10.10.20.48',
    os: 'NSO 6.x',
    protocol: 'HTTPS',
    url: 'http://10.10.20.48:8080/login.html',
    login: 'developer / C1sco12345',
    role: 'Production NSO instance — target for main-branch deploy jobs.',
    managedDevices: ['core-rtr01', 'dist-rtr01'],
  },
  {
    id: 'devbox',
    name: 'DevBox (Workstation)',
    category: 'platform',
    zone: 'platform',
    ip: '10.10.20.50',
    role: 'Developer workstation VM for local edits and browser access to lab services.',
  },
  {
    id: 'devtools',
    name: 'DevTools (GitLab)',
    category: 'platform',
    zone: 'platform',
    ip: '10.10.20.54',
    protocol: 'HTTP',
    url: 'http://devtools-gitlab.lab.devnetsandbox.local/developer/nso_cicd',
    login: 'developer / C1sco12345',
    role: 'GitLab CE, CI runner, and Web IDE for the nso_cicd project.',
  },

  // Development NSO targets
  {
    id: 'dev-core-rtr01',
    name: 'dev-core-rtr01',
    category: 'router',
    zone: 'development',
    ip: '10.10.20.174',
    os: 'IOS XR',
    protocol: 'Telnet',
    nsoManaged: 'development',
    workshopNote: 'IOS-XR loopback test target in CI pipeline',
  },
  {
    id: 'dev-dist-rtr01',
    name: 'dev-dist-rtr01',
    category: 'router',
    zone: 'development',
    ip: '10.10.20.176',
    os: 'IOS-XE',
    protocol: 'SSH',
    nsoManaged: 'development',
    workshopNote: 'IOS loopback test + apply.py target',
  },

  // Production NSO targets
  {
    id: 'core-rtr01',
    name: 'core-rtr01',
    category: 'router',
    zone: 'production',
    ip: '10.10.20.173',
    os: 'IOS XR',
    protocol: 'Telnet',
    nsoManaged: 'production',
  },
  {
    id: 'dist-rtr01',
    name: 'dist-rtr01',
    category: 'router',
    zone: 'production',
    ip: '10.10.20.175',
    os: 'IOS-XE',
    protocol: 'SSH',
    nsoManaged: 'production',
  },
];

const PLATFORM_W = 780;
const COL_W = 360;
const COL_GAP = 48;
const PLATFORM_NODE_W = 158;
const ROUTER_NODE_W = 138;
const colsTotal = COL_W * 2 + COL_GAP;
const colOffset = (PLATFORM_W - colsTotal) / 2;
const platformGap = (PLATFORM_W - PLATFORM_NODE_W * 4) / 5;
const routerX = (zoneX) => zoneX + (COL_W - ROUTER_NODE_W) / 2;

export const topologyZones = [
  {
    id: 'zone-platform',
    label: 'Workshop platforms',
    zone: 'platform',
    width: PLATFORM_W,
    height: 100,
  },
  {
    id: 'zone-development',
    label: 'Development targets',
    zone: 'development',
    width: COL_W,
    height: 220,
  },
  {
    id: 'zone-production',
    label: 'Production targets',
    zone: 'production',
    width: COL_W,
    height: 220,
  },
];

/** Centered layout — zones and nodes aligned to column centers */
export const nodePositions = {
  'zone-platform': { x: 0, y: 16 },
  'zone-development': { x: colOffset, y: 140 },
  'zone-production': { x: colOffset + COL_W + COL_GAP, y: 140 },

  'nso-dev': { x: platformGap, y: 38 },
  'nso-prod': { x: platformGap * 2 + PLATFORM_NODE_W, y: 38 },
  devbox: { x: platformGap * 3 + PLATFORM_NODE_W * 2, y: 38 },
  devtools: { x: platformGap * 4 + PLATFORM_NODE_W * 3, y: 38 },

  'dev-core-rtr01': { x: routerX(colOffset), y: 176 },
  'dev-dist-rtr01': { x: routerX(colOffset), y: 268 },

  'core-rtr01': { x: routerX(colOffset + COL_W + COL_GAP), y: 176 },
  'dist-rtr01': { x: routerX(colOffset + COL_W + COL_GAP), y: 268 },
};

export const topologyEdges = [
  // NSO management (dashed)
  {
    source: 'nso-dev',
    target: 'dev-core-rtr01',
    sourceHandle: 'bottom-source',
    targetHandle: 'top-target',
    label: 'manages',
    dashed: true,
  },
  {
    source: 'nso-dev',
    target: 'dev-dist-rtr01',
    sourceHandle: 'bottom-source',
    targetHandle: 'top-target',
    label: 'manages',
    dashed: true,
  },
  {
    source: 'nso-prod',
    target: 'core-rtr01',
    sourceHandle: 'bottom-source',
    targetHandle: 'top-target',
    label: 'manages',
    dashed: true,
  },
  {
    source: 'nso-prod',
    target: 'dist-rtr01',
    sourceHandle: 'bottom-source',
    targetHandle: 'top-target',
    label: 'manages',
    dashed: true,
  },

  // Student workflow
  {
    source: 'devtools',
    target: 'devbox',
    sourceHandle: 'left-source',
    targetHandle: 'right-target',
    label: 'Web IDE',
    dashed: true,
  },

  // In-lab router pairs (optional context)
  {
    source: 'dev-core-rtr01',
    target: 'dev-dist-rtr01',
    sourceHandle: 'bottom-source',
    targetHandle: 'top-target',
    label: 'G0/3 → G2',
  },
  {
    source: 'core-rtr01',
    target: 'dist-rtr01',
    sourceHandle: 'bottom-source',
    targetHandle: 'top-target',
    label: 'G0/3 → G2',
  },
];

export const deviceTable = topologyNodes
  .filter((n) => n.ip)
  .map((n) => ({
    name: n.name,
    os: n.os || '—',
    ip: n.ip,
    protocol: n.protocol || '—',
  }));
