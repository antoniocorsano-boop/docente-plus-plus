<template>
  <div class="in-classe-page">
    <header class="in-classe-header">
      <h1>In Classe — {{ className }}</h1>
      <div class="controls">
        <button @click="refresh">Aggiorna</button>
      </div>
    </header>

    <main>
      <DailyCalendar
        :date="currentDate"
        :lessons="lessons"
        @select-slot="onSelectSlot"
      />

      <ClassOverlay
        v-if="overlayOpen"
        :lesson="selectedLesson"
        @close="closeOverlay"
        @start-session="startSession"
      />

      <SessionView
        v-if="sessionActive"
        :lesson="activeLesson"
        @end-session="endSession"
      />
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import DailyCalendar from '../components/DailyCalendar.vue';
import ClassOverlay from '../components/ClassOverlay.vue';
import SessionView from '../components/SessionView.vue';

export default {
  name: 'InClassePage',
  components: { DailyCalendar, ClassOverlay, SessionView },
  setup() {
    const className = ref('3A - Informatica');
    const currentDate = ref(new Date());
    const lessons = ref([
      { id: 'l1', title: 'Matematica', time: '08:00', duration: 60, room: 'A1' },
      { id: 'l2', title: 'Informatica', time: '09:00', duration: 60, room: 'Lab' },
      { id: 'l3', title: 'Storia', time: '10:00', duration: 60, room: 'B2' }
    ]);

    const overlayOpen = ref(false);
    const selectedLesson = ref(null);

    const sessionActive = ref(false);
    const activeLesson = ref(null);

    function onSelectSlot(lesson) {
      selectedLesson.value = lesson;
      overlayOpen.value = true;
    }
    function closeOverlay() {
      overlayOpen.value = false;
      selectedLesson.value = null;
    }
    function startSession(lesson) {
      activeLesson.value = lesson;
      sessionActive.value = true;
      closeOverlay();
    }
    function endSession() {
      sessionActive.value = false;
      activeLesson.value = null;
    }
    function refresh() {
      console.log('refresh lessons');
    }

    return {
      className,
      currentDate,
      lessons,
      overlayOpen,
      selectedLesson,
      sessionActive,
      activeLesson,
      onSelectSlot,
      closeOverlay,
      startSession,
      endSession,
      refresh
    };
  }
};
</script>

<style scoped>
.in-classe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--md-sys-color-outline, #e0e0e0);
}
main {
  padding: 12px;
}
</style>
