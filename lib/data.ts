import { Persona, Project, Token, Comment, UpdateLog } from './types';

export const INITIAL_PERSONAS: Persona[] = [
  {
    id: 'alex',
    name: 'Alex Rivera',
    roleType: 'developer',
    title: 'Senior Dev',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpDK1cBpeD9dlaYcswiz_3n52_jnPu1ZOMetdxUi1RVPnOyjL7s6Jlkwg6EVKY1dOIGAIYV0HBcmjbXOMQTGHp11iZOfMC4bHb26b8tBa1boJymMS29fhzT23CBSufk1nHxiSGL14YmEf0kEsKKe54lpEajBKHIU7JGLvTHL-b4atJtLHHVEiWsx6_LNcbA0W-YOYWqKNcMiRWRkBFJRF4dW-5hS7qXfKq1g6BfsaSFfXqjR2kLwl5d5jQqJN34CUw3n8Wm6VBy9M',
    checkedIn: true,
    checkInTime: '08:30 AM'
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    roleType: 'manager',
    title: 'Project Manager',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwTGUCfQIDeOdUtsSBYeWgbpEKmLnJZOEwu9M3HDfs95TMRCr8Ccr45BDm8lPCAUOPMY6HSBqVoFLlhCLvqxyWSpdzCnnwePvdyo30Yxb-VskgcWojBn32hM-KofvqUHbTa_QQgyiI-f0vUNQxN1_RJcwjo19-qqivcqULIqdQQlrxdbre8qGPoZNvplTcD1UvtMwK3rAw1syJUy5ZGXWiRybyoeDZNPVwucujCLH6AVpGhwENA8XpkRTd3THHUcxjL2HaajJcjxM',
    checkedIn: true,
    checkInTime: '09:00 AM'
  },
  {
    id: 'james',
    name: 'James Sterling',
    roleType: 'executive',
    title: 'CEO | Executive',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSMgjf70-Qd1GaJKrHrdqFHfn1R5Xul1tf1s37tFpDfWUmaDfSdZ9UI8UvKqcju4tw1qog8uXcMNhPKqGd9OjzBka1-8LjmGMKuKu23I9MzgF5wtljYZdUk-E6n_RfSG5f3X4EEzWiq5r5lKNPQOn1gPKeDefz0gl2cpWMT-vIYrlz4ieG-g9shEIxy_QiMYhWt0Gf2ntfxCQDC_LaXEeOEKQ_zQTmZu7wCgNXyr7B1crK6Gu9mqrRIxIiOLimMAoIeQPRhcrz-dw',
    checkedIn: false
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'q-core-migration',
    name: 'Quantum Core Migration',
    code: 'QCM',
    description: 'Comprehensive overhaul of the primary database architecture to support real-time data streaming and improved latency across regional hubs.',
    status: 'On Track',
    priority: 'High Priority',
    manager: 'Sarah Chen',
    managerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0_bWxRztfV42w1DcNpdXQOSVKPfY6Jt2WyUfgB9M7bi-fm4wSSTj0nPYYTUH6RGdBPutWIVBzO1YoU5VRhqJSXthG_T8Nzj6bjozSdk8RjGoZr5sPaYdl5UorlU5gwXjfPlGwQmFUwsz_Z7q1a9_iYoyQDVbY7Pi0s8pYZnODd7wXfsbBLDfOvWpHKDcjNCVkX7ZOA8mgs9o3JNHpsD7u0i-VuKiOq-Q0CFyOBV3UBELpY1eDDwT53pCe46G4oTVBNZHe1yFtbs',
    dueDate: 'Oct 24, 2026',
    progress: 65,
    budget: '$1.2M',
    spent: '$2.0M',
    activeTokensCount: 24,
    initiativeType: 'tech',
    teamAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAv2GM19lSM-rIlEmU0iv9uQtxAogltwLt30XQETMTyhaV0vBWRz7PprETfCcOuHRCYTCaGZRLWA2IgsbC73ePAVvo_O7MfmXPgC_jG6JLeLgv3pFl9kvo6rv2Tb7yPfRlXtHBId-kuVnybnO8ool5zoe9hxH6O2EndIdi6OCjiEQXFjszEIb2YTU7O9McVgEzqQYbsnN5Pqs963bEy9I_IRoTrWgUJA6bIJvuUjJ-vH8Z2A51bHf7v5AgfC7qcO3-DKmjI0MmpzIY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAP1cVR8xFXCiHSSWJECwcFGtkW9pOFsbvHGWfPo_NM9mFe4Zb4K3eNek8a43NFJ_FrHb3nTQCaafRLyWt8yrDXUEOcvozp2LuxaqS2pRjX-FP3rzxJc7kMvCYCv-mrf-UQwGU-23Rl7DW4CkZfmrXQQ5sFusuAxkTrmrFKiD2qtuo5cYWmTYrEWRwTLY5uO7M5RtAC032JFQNEgRvb7u4GAGvMb_nd134bDQLJTlmzV31YdwWIpOh0d5mtRLMUt6-KAh3tT6ZG9LY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbPG8rIsElv35oQYEn0qskwOch1YcDm97w263dIUEzav4QgRzoOGE_COCe1dQjJS5DJD2G1eesS1YfBE3jqRmo9jv_yTNfH3Q90pcqAehM7EM55Ay9qmfzOy89A4hIvGD5jxbI50gXy2GQqEIClyPmq43BBV0HG1wQ_BJeOJ7QAI6-1gNkbbV2zo8p9NKp70JfiNNDMI-Yie9GLIcGVXy46E44ACCkk3ql8XjBQi69QsI3bbK7c-oPdSejKepYpmV4axU2AoXfuDc'
    ]
  },
  {
    id: 'project-hyperion',
    name: 'Project Hyperion',
    code: 'PRJ-242',
    description: 'Enterprise-grade cloud distribution engine for optimized microservice coordination and edge replication.',
    status: 'On Track',
    priority: 'High Priority',
    manager: 'Marcus Thorne',
    managerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwTGUCfQIDeOdUtsSBYeWgbpEKmLnJZOEwu9M3HDfs95TMRCr8Ccr45BDm8lPCAUOPMY6HSBqVoFLlhCLvqxyWSpdzCnnwePvdyo30Yxb-VskgcWojBn32hM-KofvqUHbTa_QQgyiI-f0vUNQxN1_RJcwjo19-qqivcqULIqdQQlrxdbre8qGPoZNvplTcD1UvtMwK3rAw1syJUy5ZGXWiRybyoeDZNPVwucujCLH6AVpGhwENA8XpkRTd3THHUcxjL2HaajJcjxM',
    dueDate: 'Nov 12, 2026',
    progress: 65,
    budget: '$1.5M',
    spent: '$2.5M',
    activeTokensCount: 12,
    initiativeType: 'tech',
    teamAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDBNLH-4JPVMTEsDseQaQMfqIjbeLpcvCM5obUi8-Nwovup5beSQ-x8JKcACc45Gx-orq1pYceehjndb-q7RAKlS7yJa7P9FZs-e4rpwSC0XWK3y-oiyVZ0P72uyxihxV3lIayZUQ_raUmdmyBm9jjjDB0Ar8xzpd4fLB7JAl46CzlxbJuR16Ol5L20Y6flZdZG_Ju9c8cu3N2hLWHpR08_QK7-mwan9eMRzNZT7xYDq6RUk6U8hpKJikzS59wCI3UwO97WIJ6Eeg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAliqzl8QYLdMXbo3-arf3xmUPVAYy0O3Lx1xkdV0YXZIeAA5lG4cW2mrgqbTbQThPHCDHJvM2IiSEDHejqZrF8CreZ3uRe8M4XTHpYpsGCndvjY0mbu3DP0DYTyt4THSqBx-GgU2NPl3JY7yuffBYs8Hk-j9iwD81kzvpvTvzMX32hTT1An5hOXnvzpXpP6iuBS_jP1jg-VE6bK3jtAJcWUien5YOrnG-a0EqGMpqgRMAzkhT4nN3jhewHZSEnw-3fXIre2HfTX_w'
    ]
  },
  {
    id: 'core-design-system',
    name: 'Core Design System',
    code: 'PRJ-109',
    description: 'Standardizing UI patterns across all HR products including light/dark templates and WCAG 2.1 auditing.',
    status: 'Maintenance',
    priority: 'Maintenance',
    manager: 'Sarah Chen',
    managerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0_bWxRztfV42w1DcNpdXQOSVKPfY6Jt2WyUfgB9M7bi-fm4wSSTj0nPYYTUH6RGdBPutWIVBzO1YoU5VRhqJSXthG_T8Nzj6bjozSdk8RjGoZr5sPaYdl5UorlU5gwXjfPlGwQmFUwsz_Z7q1a9_iYoyQDVbY7Pi0s8pYZnODd7wXfsbBLDfOvWpHKDcjNCVkX7ZOA8mgs9o3JNHpsD7u0i-VuKiOq-Q0CFyOBV3UBELpY1eDDwT53pCe46G4oTVBNZHe1yFtbs',
    dueDate: 'Dec 31, 2026',
    progress: 88,
    budget: '$250K',
    spent: '$500K',
    activeTokensCount: 5,
    initiativeType: 'marketing',
    teamAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgLOuXHBgWwwW3QvGHPdS-9zwq0i2ObVhTp3qmhM7K5m2x7hzgWnxOXjra9Q_EUwrcmCmoXcE783H4uMiKPR2jw4FlgilU5ExDtEuJ2KV2HesGZKhzOD1OaKNuypCxPoHY_QbCZ9dtGQRO85_EiipfRqpwSYHAauE_ejBTFcAnQID5hu0Rvef7eY60kDhZ8YeuCGTVukmQ-Xuw23xZ26a3qy9l1wleDh3o3RHxa5TOs5DZkVhaAt81R5RVoRXxcbBJfVWFmrPqfrw'
    ]
  },
  {
    id: 'neptune-migration',
    name: 'Project Neptune Migration',
    code: 'PRJ-302',
    description: 'Legacy SAP integration and Oracle Cloud infrastructure relocation with complex zero-downtime checkpoints.',
    status: 'At Risk',
    priority: 'High Priority',
    manager: 'Sarah Chen',
    managerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0_bWxRztfV42w1DcNpdXQOSVKPfY6Jt2WyUfgB9M7bi-fm4wSSTj0nPYYTUH6RGdBPutWIVBzO1YoU5VRhqJSXthG_T8Nzj6bjozSdk8RjGoZr5sPaYdl5UorlU5gwXjfPlGwQmFUwsz_Z7q1a9_iYoyQDVbY7Pi0s8pYZnODd7wXfsbBLDfOvWpHKDcjNCVkX7ZOA8mgs9o3JNHpsD7u0i-VuKiOq-Q0CFyOBV3UBELpY1eDDwT53pCe46G4oTVBNZHe1yFtbs',
    dueDate: 'Nov 12, 2026',
    progress: 42,
    budget: '$840K',
    spent: '$900K',
    activeTokensCount: 14,
    initiativeType: 'fin',
    teamAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnG2fi_j9tyXupQora58q5md0Jay2CQSyGiU2uKXGKJ5a6t2UybNUavhhHq-4ulop_l2qSliG9-4rs3U3xtBinmuC65BvD4C3b2ZL9BR-Shq0EkF2hJDfvyTlyNc-YnHgxAfG-2uy_nLAqTPgOhJqBnU4j5K9HKlSlPEhIw5KdPnw-kCM61P_gcTa1KWwiCdeRIztmCA_pELKkqmWJpppbP7Af7hNqPFJRoYM85Hp-KkN1zEqbI63iFG7OLav_S4PF7ERedYc1vwU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA08k9-Rnyclfj5RxO8VO008eDw0s5pZKRp2-vmRw3BGV9jZGBGZRNONA0IPiom2u_DXYLR8TtEa6-fGCpVa2s6B04AbVHWZijMo1Q6oi_eva5Sqvoeq0SRi788G5Wt9KF1hKTSBguO6oxroj7hi0yy-4mCH1iUR6yB602G1PyxpzCCgp9rsW9CzFdvVAvo8bx8Ff26ixXe8260Llccxd97JCtkZsm4vnmpxA86G1Zco442om80CdTOQgtEpZPMgmAYDYuZsWiAPT8'
    ]
  }
];

export const INITIAL_TOKENS: Token[] = [
  {
    id: 'token-1',
    code: 'PRJ-242: HYPERION',
    projectTitle: 'HYPERION',
    title: 'Refactor API Middleware',
    description: 'Optimize request handling for high-concurrency clusters in the authentication service.',
    status: 'in_progress',
    priority: 'High Priority',
    assignee: {
      name: 'Alex Rivera',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpDK1cBpeD9dlaYcswiz_3n52_jnPu1ZOMetdxUi1RVPnOyjL7s6Jlkwg6EVKY1dOIGAIYV0HBcmjbXOMQTGHp11iZOfMC4bHb26b8tBa1boJymMS29fhzT23CBSufk1nHxiSGL14YmEf0kEsKKe54lpEajBKHIU7JGLvTHL-b4atJtLHHVEiWsx6_LNcbA0W-YOYWqKNcMiRWRkBFJRF4dW-5hS7qXfKq1g6BfsaSFfXqjR2kLwl5d5jQqJN34CUw3n8Wm6VBy9M'
    },
    durationElapsed: '02:45:12'
  },
  {
    id: 'token-2',
    code: 'PRJ-109: CORE UI',
    projectTitle: 'CORE UI',
    title: 'Accessibility Audit',
    description: 'Verify WCAG 2.1 compliance for the new design system components.',
    status: 'available',
    priority: 'Medium',
    assignee: undefined,
    pausedAt: '01:12'
  },
  {
    id: 'token-3',
    code: 'QCM-01',
    projectTitle: 'QUANTUM CORE',
    title: 'Implement API throttling for Batch-Z exports',
    description: 'Protect regional node boundaries with custom dynamic IP leak parameters.',
    status: 'available',
    priority: 'High Priority'
  },
  {
    id: 'token-4',
    code: 'QCM-02',
    projectTitle: 'QUANTUM CORE',
    title: 'Refactor schema for Legacy Connectors',
    description: 'Clean up old column mapping files and eliminate string padding issues.',
    status: 'available',
    priority: 'Medium'
  },
  {
    id: 'token-5',
    code: 'QCM-03',
    projectTitle: 'QUANTUM CORE',
    title: 'WebSocket connection heartbeats',
    description: 'Maintain stable continuous sync loops without standard reconnect crashes.',
    status: 'in_progress',
    priority: 'High Priority',
    assignee: {
      name: 'Sarah J.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-C8W0otmz5woUts7fVtGsUl5yBFBBRmC46Xm9RYr7zFXbkynddEHP5gVs-yRLoBrsvUVgpcaqSQMEgOaq5GK4rSsBXPPJX8_q2qMkFrlKrbyTS0OCkFt6ekWanePVjrpz5XWzBFcVXrS57_lUbKZQHAAT63m5mpEsmkN7d8JKVVeDhoFrcGBbjr8oON-XT7GZWfSUrQW1C-BYLvwgO72o5bafHNXZaL6ULmnhGoFDLvgYjb-oJUs_-rP7etzy1CRFiPsgq-MHe2U'
    }
  },
  {
    id: 'token-6',
    code: 'QCM-04',
    projectTitle: 'QUANTUM CORE',
    title: 'Security audit of Node.js dependencies',
    description: 'Complete yarn audit and solve nested prototype pollution vectors.',
    status: 'completed',
    priority: 'Medium',
    assignee: {
      name: 'Mark R.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIK3YHzIYKKtEpi4tes6b2u0qxjhODQ9-4rHWmDt1nmqptzbE_uLB77Xgsl8zVewEgqcZ0LxmPHtMJRFAUD_K2TSZCu5w1VJ9MNVQMEM7us04G7BiLDpeZnk4ybglx5lehREi76l9nSuZQ75b86dMzZulw3mGH7gBwW3aJMEssvp4NGB75P1O6eMAteftSOXLZoeZlWmhsgjF-ZTtJnpq8Y4ncqwvVtJCS678fGRjWSGlnTW9gnMDIybB4WtZ2wjAD16K8FyLweWo'
    }
  }
];

export const INITIAL_DISCUSSIONS: Comment[] = [
  {
    id: 'c1',
    author: 'Alex Thompson',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA08k9-Rnyclfj5RxO8VO008eDw0s5pZKRp2-vmRw3BGV9jZGBGZRNONA0IPiom2u_DXYLR8TtEa6-fGCpVa2s6B04AbVHWZijMo1Q6oi_eva5Sqvoeq0SRi788G5Wt9KF1hKTSBguO6oxroj7hi0yy-4mCH1iUR6yB602G1PyxpzCCgp9rsW9CzFdvVAvo8bx8Ff26ixXe8260Llccxd97JCtkZsm4vnmpxA86G1Zco442om80CdTOQgtEpZPMgmAYDYuZsWiAPT8',
    timestamp: '10:42 AM',
    content: "Hey team, I've updated the PRD for the database migration. Specifically looking for feedback on Section 4: Replication Strategy.",
    isMe: false
  },
  {
    id: 'c2',
    author: 'David Chen',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJMh6B16vwXxUHB8rkabQTrpg2_Z4Cj-Qxl9xdfzKL9CCSELnKxa2sZnFUOoy50EaoV1hlAG2yDCYvHRqY_A2Yg1sDtz6ghUrQBzs52MVpel9bwIHSrrzO1od6uivh2oRmfndO6UVNweyyJXENay9KQIT4kajyikeYp91NM4lGW0R6Gfy8AQQowroWPCKLylrUVXFw4PXzWyLTDfrSpbfduVH5MAPemKgp_p4LZ6yGnOeiufOkY0wUL-XidGGPQNF_OpI0pvtm7Bk',
    timestamp: '11:15 AM',
    content: "Looks solid. I'll run the numbers on the estimated downtime during the switchover. We should probably do it at 2 AM UTC.",
    isMe: false
  },
  {
    id: 'c3',
    author: 'You',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpDK1cBpeD9dlaYcswiz_3n52_jnPu1ZOMetdxUi1RVPnOyjL7s6Jlkwg6EVKY1dOIGAIYV0HBcmjbXOMQTGHp11iZOfMC4bHb26b8tBa1boJymMS29fhzT23CBSufk1nHxiSGL14YmEf0kEsKKe54lpEajBKHIU7JGLvTHL-b4atJtLHHVEiWsx6_LNcbA0W-YOYWqKNcMiRWRkBFJRF4dW-5hS7qXfKq1g6BfsaSFfXqjR2kLwl5d5jQqJN34CUw3n8Wm6VBy9M',
    timestamp: '11:20 AM',
    content: "Agree on 2 AM. I'll pick up the throttling token now to prepare.",
    isMe: true
  }
];

export const INITIAL_UPDATES: UpdateLog[] = [
  {
    id: 'u1',
    author: 'Sarah Chen',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0_bWxRztfV42w1DcNpdXQOSVKPfY6Jt2WyUfgB9M7bi-fm4wSSTj0nPYYTUH6RGdBPutWIVBzO1YoU5VRhqJSXthG_T8Nzj6bjozSdk8RjGoZr5sPaYdl5UorlU5gwXjfPlGwQmFUwsz_Z7q1a9_iYoyQDVbY7Pi0s8pYZnODd7wXfsbBLDfOvWpHKDcjNCVkX7ZOA8mgs9o3JNHpsD7u0i-VuKiOq-Q0CFyOBV3UBELpY1eDDwT53pCe46G4oTVBNZHe1yFtbs',
    timeAgo: '10m ago',
    content: 'Merged #245-auth-fix into production main.',
    codeSnippet: 'fix(auth): resolved token expiration leak in redis',
    badgeColor: 'primary'
  },
  {
    id: 'u2',
    author: 'System Monitor',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv2GM19lSM-rIlEmU0iv9uQtxAogltwLt30XQETMTyhaV0vBWRz7PprETfCcOuHRCYTCaGZRLWA2IgsbC73ePAVvo_O7MfmXPgC_jG6JLeLgv3pFl9kvo6rv2Tb7yPfRlXtHBId-kuVnybnO8ool5zoe9hxH6O2EndIdi6OCjiEQXFjszEIb2YTU7O9McVgEzqQYbsnN5Pqs963bEy9I_IRoTrWgUJA6bIJvuUjJ-vH8Z2A51bHf7v5AgfC7qcO3-DKmjI0MmpzIY',
    timeAgo: '45m ago',
    content: 'New high-priority Internal Token assigned to your queue.',
    badgeColor: 'warning'
  },
  {
    id: 'u3',
    author: 'Design Team',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3zU3-Y7JnvNMF9_lkYwBhgWrrTCzdvzc_53tZjxuAqbnspx1dmsISBs-am7LBWPXhVKNor20EufdmDWjSBe_SH5eS_mN9YJjLeJrtuOGRqBQIOk62gOBdCOsTID6S7eBBZxOiOfi5iv71DgQVTErWXd8X3aCjhhMKEtwRyUtUePiMn0p2LQcvnl5j7lbej1mr-Df2IocSQNqcGYsDvoMC30tiC3FP9XuhyZIxWY3t_prZyh-PrqEn3R3pJAP1ub_JH1IHTVRk2JM',
    timeAgo: '2h ago',
    content: 'Updated the Style Guidance for interactive components.',
    badgeColor: 'success'
  }
];

export const TEAM_WORKLOAD_LIST = [
  {
    name: 'Elena Rodriguez',
    role: 'Senior Developer',
    roleTag: 'Dev',
    capacity: 95,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3zU3-Y7JnvNMF9_lkYwBhgWrrTCzdvzc_53tZjxuAqbnspx1dmsISBs-am7LBWPXhVKNor20EufdmDWjSBe_SH5eS_mN9YJjLeJrtuOGRqBQIOk62gOBdCOsTID6S7eBBZxOiOfi5iv71DgQVTErWXd8X3aCjhhMKEtwRyUtUePiMn0p2LQcvnl5j7lbej1mr-Df2IocSQNqcGYsDvoMC30tiC3FP9XuhyZIxWY3t_prZyh-PrqEn3R3pJAP1ub_JH1IHTVRk2JM',
    status: 'online'
  },
  {
    name: 'Julian Vose',
    role: 'Product Designer',
    roleTag: 'Design',
    capacity: 60,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDs_u63CbMnnNBk5BvMq3k-sHogvKioB1f0DHPDnSfdsmaO9k9DQx_ZEUTiiGHvxd7GVS1oNeqtuXdpLstg9kzxG3gN08G-UmQoBKcfRKOosS6UXQ-Rr_bqnzoPTPtUZHbfoGAtLB6MEsPIw7igviSzYbFLav3RPusBjPjFb-vf08rSr5Ts1ZdA1r7B40BLbiXkKyqKjCPUFY1pS0EN7MrGOcXgdX_Xy6rYlIPdZGmr-6zYYJGCuajQWhbGtkC1WWOrFE1djajKlI',
    status: 'online'
  },
  {
    name: 'Liam Smith',
    role: 'Data Analyst',
    roleTag: 'Ops',
    capacity: 35,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWyUQPA2EoNWo5a3esgbD3JNHOVIzq09qdpDKLVZ8UR8TeHelXLxHXMsfJLWQ7GD3imYIctc6Z9UGNo6rHBfEKCMjz9UaeGsivsfyt4-hBJctiF5T22AT7gnRCIerRtfFD1wx3oc4m-5Z06HguusQsDBqUEkuaf-QBXYPh5nn5H9YuR0CBpSiFz2O4uqAERgVDGCR5BMl1yOxVsM478fDWLcqJXEaQtusa0RA1jucA6CBi_ar4Mqlej1MdAhnKJb5ynb9fpkpqj_8',
    status: 'away'
  }
];

export const EXECUTIVE_PULSE_TILES = [
  {
    id: 'pulse-1',
    category: 'Development',
    timeElapsed: '2h 45m elapsed',
    title: 'Refactoring Auth Middleware for Multi-Tenancy',
    teamMember: 'Alex Murphy',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnG2fi_j9tyXupQora58q5md0Jay2CQSyGiU2uKXGKJ5a6t2UybNUavhhHq-4ulop_l2qSliG9-4rs3U3xtBinmuC65BvD4C3b2ZL9BR-Shq0EkF2hJDfvyTlyNc-YnHgxAfG-2uy_nLAqTPgOhJqBnU4j5K9HKlSlPEhIw5KdPnw-kCM61P_gcTa1KWwiCdeRIztmCA_pELKkqmWJpppbP7Af7hNqPFJRoYM85Hp-KkN1zEqbI63iFG7OLav_S4PF7ERedYc1vwU',
    iconType: 'bolt'
  },
  {
    id: 'pulse-2',
    category: 'Strategy',
    timeElapsed: '0h 18m elapsed',
    title: 'Drafting Q4 Budget Allocation Proposal',
    teamMember: 'Sarah Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB0_bWxRztfV42w1DcNpdXQOSVKPfY6Jt2WyUfgB9M7bi-fm4wSSTj0nPYYTUH6RGdBPutWIVBzO1YoU5VRhqJSXthG_T8Nzj6bjozSdk8RjGoZr5sPaYdl5UorlU5gwXjfPlGwQmFUwsz_Z7q1a9_iYoyQDVbY7Pi0s8pYZnODd7wXfsbBLDfOvWpHKDcjNCVkX7ZOA8mgs9o3JNHpsD7u0i-VuKiOq-Q0CFyOBV3UBELpY1eDDwT53pCe46G4oTVBNZHe1yFtbs',
    iconType: 'edit_note'
  },
  {
    id: 'pulse-3',
    category: 'Operations',
    timeElapsed: '5h 12m elapsed',
    title: 'Vendor Contract Review: AWS Enterprise Support',
    teamMember: 'David Lowe',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0pTaxt1Js3EB_zIGk0Ksge7u-KMWNrk4XGcScpf4h31qZ5SqsUWxH0Njyfx5sj2LhCRnpN6gM42POWXKE3827WsTaKU9RTm1i1RlSuzTJDFGxDGE-vpTpq8pcVdG7fz0UtumMTRinfyT3YnCCcLrMTYf8i2zj9cwmprFB3Zbbh0D4-m1uBzevNXNelL7yNbSfZPbrYM6_HydjzB-_bn2eU9CLI7jaisVihyv6YAvdOpsp-JrhOrqsRU3nwCa2vS2vmk716qLFbS4',
    iconType: 'description'
  },
  {
    id: 'pulse-4',
    category: 'Design',
    timeElapsed: '1h 04m elapsed',
    title: 'Design Audit: Mobile Dashboard Responsive States',
    teamMember: 'Elena Park',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3pijZgequ8I9Bye7-Qpwx8-ytDvkr8U0MgVSKBtw8wnh8_cEt8aae9DGLIz50pCuVbX7GPd3wehqhd7Y9KdQOJFKp94aqn-1WxgwFRogGnIMEUuz2wVYjQ4AVQUjcz-wjezjq75zLcUcLhm-rONM0l6Lo1PZKjpqF_iawYJN8S7n0NltoUs9nf7SJlOHD69pyyUG5jPeXpzJQNWK7pMeVhO7Oo2wUwjbwP-dShX3wy8QHmwy1Y3sQioB4cafO9DRuU_HlaT9Opdc',
    iconType: 'palette'
  }
];
