<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Llonvne Online Judge
        </q-toolbar-title>

        <div>Version Beta0.0.1</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          链接
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Home',
    caption: 'Homepage of the website',
    icon: 'home',
    link: '/home'
  },
  {
    title: 'Problem',
    caption: 'A place where you can find the topics you like',
    icon: 'code',
    link: '/problem'
  },
  {
    title: 'Status',
    caption: 'A place where you can check the status of your topic submissions',
    icon: 'gavel',
    link: '/status'
  },
  {
    title: 'Contest',
    caption: 'A place where you can create and participate in contests',
    icon: 'sports_score',
    link: '/contest'
  },
  {
    title: 'User',
    caption: 'A place where you can find and interact with other users',
    icon: 'account_circle',
    link: '/user'
  },
  {
    title: 'Group',
    caption: 'A place where you can create user groups and participate in them',
    icon: 'groups',
    link: '/group'
  },
  {
    title: 'Forum',
    caption: 'A place where you can view and share articles and ideas',
    icon: 'forum',
    link: '/forum'
  }
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(true)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
});
</script>
