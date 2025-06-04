<template>
  <footer class="app-footer">
    <div class="version-info">
      <span class="version-text">{{ formattedVersion }}</span>
      <a 
        v-if="commitHash" 
        :href="githubCommitUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="commit-link"
        :title="`View commit ${commitHash}`"
      >
        #{{ shortCommitHash }}
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VersionService } from '@/services/version';

const versionService = VersionService.getInstance();
const versionInfo = versionService.getVersionInfo();

const formattedVersion = computed(() => versionService.getFormattedVersion());
const commitHash = computed(() => versionInfo.commitHash);
const shortCommitHash = computed(() => 
  commitHash.value ? commitHash.value.substring(0, 7) : ''
);

const githubCommitUrl = computed(() => {
  if (!commitHash.value) return '';
  const repoUrl = 'https://github.com/PathfinderHonorManager/PathfinderHonorManagerUI';
  return `${repoUrl}/commit/${commitHash.value}`;
});
</script>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  padding: var(--itemMargin);
  margin: var(--itemMargin);
  font-family: var(--mainFont);
  font-size: var(--textSize);
  color: var(--noteColor);
}

.version-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-text {
  font-weight: 400;
  color: var(--noteColor);
}

.commit-link {
  color: var(--actionColor);
  text-decoration: none;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  background-color: var(--lightGrey);
  border-radius: 5px;
  border: 1px solid var(--lightGrey);
  transition: 0.2s;
}

.commit-link:hover {
  background-color: var(--bgColor);
  transform: translateY(-2px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 1080px) {
  .app-footer {
    position: static;
    margin: var(--itemMargin) auto;
    width: fit-content;
    text-align: center;
  }
}
</style> 