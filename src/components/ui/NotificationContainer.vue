<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <NotificationItem
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @close="removeNotification"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import NotificationItem from './NotificationItem.vue'

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

const removeNotification = (id: string) => {
  notificationStore.removeNotification(id)
}
</script>

<style scoped>
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>