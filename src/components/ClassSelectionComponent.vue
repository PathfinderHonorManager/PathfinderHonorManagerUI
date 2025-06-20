<script setup lang="ts">
const PATHFINDER_CLASSES = [
  { name: 'Friend', grade: 5 },
  { name: 'Companion', grade: 6 },
  { name: 'Explorer', grade: 7 },
  { name: 'Ranger', grade: 8 },
  { name: 'Voyager', grade: 9 },
  { name: 'Guide', grade: 10 }
] as const;
</script>

<template>
  <div class="class-selection">
    <h2>Select a Class</h2>
    <div class="class-grid">
      <router-link 
        v-for="pfClass in PATHFINDER_CLASSES" 
        :key="pfClass.name"
        :to="{ name: 'Achievements', params: { className: pfClass.name }}"
        class="class-card"
      >
        <h3>{{ pfClass.name }}</h3>
        <p class="grade">Grade {{ pfClass.grade }}</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.class-selection {
  padding: 20px;
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.class-card {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: white;
  transition: transform 0.2s, background-color 0.2s;
}

.class-card:hover {
  transform: translateY(-2px);
  background-color: #3a3a3a;
}

.class-card h3 {
  margin: 0 0 10px 0;
  color: #ffd700;
}

.grade {
  margin: 0;
  color: #ccc;
  font-size: 0.9em;
}
</style> 