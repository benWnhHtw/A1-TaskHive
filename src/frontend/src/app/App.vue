<template>
  <div class="app-shell">
    <aside class="sidebar" aria-label="Hauptnavigation">
      <button class="brand brand-button" type="button" @click="activeView = 'dashboard'">
        <div class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m12 4 7 4v8l-7 4-7-4V8z" />
          </svg>
        </div>
        <span>TaskHive</span>
      </button>

      <button class="home-pill home-button" type="button" @click="activeView = 'dashboard'">
        <span class="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 11 12 4l8 7" />
            <path d="M6 10v10h12V10" />
            <path d="M10 20v-6h4v6" />
          </svg>
        </span>
        <span>WG Sonnenstrasse</span>
      </button>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.view"
          class="nav-item"
          :class="{ 'nav-item-active': activeView === item.view }"
          type="button"
          @click="activeView = item.view"
        >
          <span class="nav-icon" aria-hidden="true" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <button class="sidebar-user sidebar-user-button" type="button" @click="activeView = 'settings'">
        <div class="avatar avatar-yellow">AS</div>
        <div>
          <strong>Alex Schneider</strong>
          <span>Administrator</span>
        </div>
      </button>
    </aside>

    <main class="app-main">
      <TaskDashboardView
        :active-view="activeView"
        @open-create="activeView = 'create'"
        @open-settings="activeView = 'settings'"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import TaskDashboardView from '@/features/tasks/views/TaskDashboardView.vue'

const activeView = ref('dashboard')

const navItems = [
  {
    view: 'dashboard',
    label: 'Dashboard',
    icon: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
  },
  {
    view: 'tasks',
    label: 'Aufgabenliste',
    icon: '<svg viewBox="0 0 24 24"><path d="M5 7h14"/><path d="M5 12h14"/><path d="M5 17h10"/><path d="m16 16 2 2 3-4"/></svg>',
  },
  {
    view: 'calendar',
    label: 'Kalender',
    icon: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/></svg>',
  },
  {
    view: 'chat',
    label: 'Chat',
    icon: '<svg viewBox="0 0 24 24"><path d="M5 6h14v9H9l-4 4z"/></svg>',
  },
  {
    view: 'create',
    label: 'Aufgabe erstellen',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
  },
  {
    view: 'stats',
    label: 'Statistiken',
    icon: '<svg viewBox="0 0 24 24"><path d="M5 19V9"/><path d="M12 19V5"/><path d="M19 19v-7"/><path d="M3 19h18"/></svg>',
  },
  {
    view: 'settings',
    label: 'Einstellungen',
    icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="m5.6 5.6 2.1 2.1"/><path d="m16.3 16.3 2.1 2.1"/><path d="m18.4 5.6-2.1 2.1"/><path d="m7.7 16.3-2.1 2.1"/></svg>',
  },
]
</script>
