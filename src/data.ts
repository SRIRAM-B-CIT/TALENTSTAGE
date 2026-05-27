/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Talent, Engagement, ProjectProposal, ProfileCore } from './types';

export const USER_AVATARS = {
  client: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTjrglOkJI4ofctOxWvUo1GPfeA4Jca63mciycWAZyvo5Q524kkzvqL0P6gbv5J3G032NhjcvTgNaUMfVcluce6k8m87Vu1vaTUJ6bRM4IxlvcNR3RtaKmCJlGK9BuCTN0OUUCTDSGiZYU5EewPaw8K9H7kYenw_w7Ko43qIMtqn84X9mDPH0Ju3mMTlK5G2Q4pmhC9zNxNMwUS1NjR_A_DAno1xiWLriuDaxkX5heK-TWhE1ct2aZFhN_Kxe7DNzG2FQh7aJepZg',
  freelancerActive: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApKA1WTq8JYpuWpRykGuz9wIdPyeqkqhHjjwcURX_My1kto2vtIDaBhEQQFJVGcygcL-uUAFyb1uEtQKM2dc3Q271L4fTRgk0KbcgOfCdcM9GQq-RWgk8sQCMimNZknbpxmoZl1GPQ6KqRp3ErIoXjF0xgLAzjRz28q22vll1qRLBwcbz-vV4y6J28BdE8_5WH_wkNuAfoDYoSavXJp03WvovAQzNZ9y9Hfk1g15E3dZkbZ-quNToxtE0j4gPSO48wvK_WkAfhdS8',
  freelancerAlternative: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVH-u6G22w--MK8Q2-5emhdzCyE9n8JTvMRofcRXVoQLzyy-zY4GHRwOzZVjEyoV0yCFwH7y8bX8uXolanbch9xRoYZztTrifZHa4oXiG10OKumBbP8BaTNOZ-unFEUgjcrM3asQqTwQKAWZdTJ8aNf1-weItdBoL9ePL4cwrrBVAIIt_qAeD5tnuaimfq7RUIw-xjd0EV8I2v3HMcKqniOUNVWfsytcReNys2vASxhSYHSjPdEr2sDJxMU36h3VrBJe7gTSA3Noo',
  freelancerSearch: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5xe_-mQ37JaWmC5lhscKYsnbHi43dpaQ83KpFEJzKhw1XTk3ixa8xPtvy7x68sCdfSqWnoYKaKVHYTg1TjP-wdgxOqQ096C6_95hHkqnbHspN8BSE3HS_pFn8eRsVJq3b8DrImsugovtBwbavcxixwaiKsxcwrl3fdcy9DeqE1E22MVmpQlt4jcM_BO-wOoZvZKmh5ZzQkzUDQhjca7NaQtF1y_16xCRHoNqwHhID33KTMXCdg9gLXKfUlL5OiFlLssejwfRx-4'
};

export const INITIAL_TALENTS: Talent[] = [
  {
    id: 'talent-1',
    name: 'Marcus Thorne',
    title: 'Sr. AI Architecture Lead',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuTeWyaFrJUojDJ_ogwEYYdwqnTDDAcwy3TTpvYbLjE2bkn0MiC56OQks5YMrvfFFasqGSr2mzKyw0Rkup6068x-0TbfaVTZn_gnslk-GzNFQYbaemo1I7UeJkLGA5R9TFStNLh-kbo7MiXJnQs2eppg7DpgBICv5gQ-Rqcg-99IDX4c0FWvnOXNaDhzfMPYkOhC0Ul98pUWp1UtF-ZHO0fbxJcfQhYjjray_CHbrEHHCWBRFvReAhIdH6SuU2ydsrOnod436TLEZE',
    status: 'Available Now',
    successRate: '98.2%',
    experience: '12 Years',
    skills: ['AI Architecture', 'PyTorch', 'Model Fine-tuning', 'Python']
  },
  {
    id: 'talent-2',
    name: 'Elena Rossi',
    title: 'Frontend Systems Designer',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzJfUSxNUCfkJky3gFeVph3-eY4zxhx-h--zsy7e2qaL7oPxMLB5Qb9o6Kv0VaWBkbRlXB1GNPmLsz0rIpjdOsPAZRhIOnegnpVICROewlUDtAsIOyUw7INSOUkAxuohJnRv8D_FHvXbAPwiQhxpbFDewgmcGvNqOJTuvgLElXBg9Ycw1zZqAnR3ZsrqPdivlJxR2rdqMlDuLl_qGsuOJbTJfIZZ-NyIPDni4zqVKOcpg8BlPXLBOwiPDYcP_B7WyAeZ9aa7dBN9c',
    status: 'In Contract',
    successRate: '100%',
    experience: '8 Years',
    skills: ['Design Systems', 'React', 'Figma', 'Tailwind CSS']
  },
  {
    id: 'talent-3',
    name: 'David Chen',
    title: 'Blockchain Security Audit',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeExtN_W8RtyP4HWVxIc6nNrWUA0hgO3XiYujR3GQ3kcitMQsIL1aDDM1rZC5-SEvGssaV35YPF0PBoYDYDMVCotbkz6cydmtm470FQJcJmHAqByCS7QpYoWI-2RZYMFeoSPA3a9sQ1iTzxMrh10DhUR4InG03gvbpNGkG6LzcQnvxoMGkwa0S8Ia-HehFJaFdKI4rMoVTHOBKZg5ibEEoWYv5O49JQXDzhcOPffA9raN7dJ0NcQtsJoWKtxQmQLs0n3040f6tb5g',
    status: 'Available Now',
    successRate: '94.5%',
    experience: '15 Years',
    skills: ['Smart Contracts', 'Solidity', 'Rust', 'EVM Auditing']
  },
  {
    id: 'talent-4',
    name: 'Sasha Vankov',
    title: 'UX Strategy Lead',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDexL9KzRhnwnqAd2Ks6whONmkhKpKeOFcM2Fxi9WkU5YHSWLr76lfMpWZHU25SDsWYL9teeHTMvnI62vAgiMe6xNkrOtlP9ozcFqEueo70zr397jhD2DQ3hXqess5ykL5PIa9xL8JsYuYktcwL_tMTKz8yV7omsCRNpi9Mju7ty5lz426wFuNzuPxax3JQ0wqQHIMOsaOhsjOC8g37Gr6J0mnEj0CPkcplTmmBBU4lGjOzsyHfnoRrGvWwW9oIAZv4qJlY8BFSukg',
    status: 'Available Now',
    successRate: '99.0%',
    experience: '10 Years',
    skills: ['UX Metrics', 'Information Architecture', 'User Research', 'Web3 Strategy']
  }
];

export const INITIAL_ENGAGEMENTS: Engagement[] = [
  {
    id: '#TS-2026-042',
    talentId: 'talent-2',
    talentName: 'Elena Rossi',
    talentAvatar: '',
    dateClosed: 'Oct 12, 2025',
    status: 'COMPLETED',
    reviewed: false,
    projectName: 'Fintech Core UI Revision'
  },
  {
    id: '#TS-2026-038',
    talentId: 'talent-5',
    talentName: 'Jordan Vance',
    talentAvatar: '',
    dateClosed: 'Sep 28, 2025',
    status: 'COMPLETED',
    reviewed: true,
    score: 5,
    reviewNotes: 'Excellent performance scoping and deploying local model caches. Very skilled.',
    projectName: 'Private LLM Cluster Setup'
  },
  {
    id: '#TS-2026-015',
    talentId: 'talent-1',
    talentName: 'Marcus Thorne',
    talentAvatar: '',
    dateClosed: 'Aug 05, 2025',
    status: 'COMPLETED',
    reviewed: false,
    projectName: 'Solaris AI Brand Launch'
  }
];

export const INITIAL_PROPOSALS: ProjectProposal[] = [
  {
    id: 'prop-1',
    title: 'Global Fintech Platform Design System',
    category: 'FINTECH / ENTERPRISE',
    description: 'Seeking a Senior UI Architect to lead the design system evolution for a Tier-1 Fintech expansion. Focus on scalability, multi-region accessibility, and high-density data visualization components.',
    estimateMin: 15000,
    estimateMax: 22000,
    duration: '3 months',
    level: 'EXPERT LEVEL',
    roles: ['UI', 'RX', 'DS'],
    matchScore: 98,
    verified: true,
    saved: false
  },
  {
    id: 'prop-2',
    title: 'Ethereum Validator Dashboard',
    category: 'WEB3 / INFRASTRUCTURE',
    description: 'Create a high-fidelity monitoring dashboard for large-scale validator nodes. Requires experience with D3.js and real-time WebSocket data integration.',
    estimateMin: 8500,
    estimateMax: 8500,
    duration: '1 - 3 months',
    level: 'EXPERT LEVEL',
    roles: ['W3', 'D3', 'TS'],
    matchScore: 92,
    verified: false,
    fixedPrice: 8500,
    saved: false
  },
  {
    id: 'prop-3',
    title: 'Prompt Engineer Interface',
    category: 'AI / LLM OPS',
    description: 'Internal tooling for prompt versioning and A/B testing outputs. Minimalist, developer-centric UI with focus on keyboard shortcuts.',
    estimateMin: 12000,
    estimateMax: 12000,
    duration: '1 - 3 months',
    level: 'EXPERT LEVEL',
    roles: ['AI', 'UX', 'KB'],
    matchScore: 89,
    verified: false,
    fixedPrice: 12000,
    saved: false
  }
];

export const DEFAULT_PROFILE: ProfileCore = {
  fullName: 'Alex Sterling',
  title: 'Senior Creative Technologist',
  hourlyRate: 110,
  skills: 'React, Node.js, WebGL, D3.js, Tailwind CSS',
  companyName: 'Sterling Creative Labs',
  industry: 'Technology & SaaS',
  websiteUrl: 'https://sterlingcreativelabs.com',
  description: 'Specializing in premium high-density visualization dashboards, Web3 secure frontends, and custom AI scoping engine integrations for high-end enterprises.'
};
