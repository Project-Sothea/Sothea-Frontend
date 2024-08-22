<template>
  <!-- Overlay -->
  <div v-if="isOpen" class="overlay"></div>

  <!-- Records Modal -->
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h1>Records</h1>
      <button @click="$emit('close')" class="close-btn">×</button>
      <div class="pt-2 pl-2">
        <RecordSection />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RecordSection from './RecordSection.vue'

export default defineComponent({
  name: 'RecordsModal',
  components: {
    RecordSection
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  }
})
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.modal-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

h1 {
  font-size: 1.25rem;
  font-weight: 500;
  margin-left: 10px;
}
</style>
