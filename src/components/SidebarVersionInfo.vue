<template>
  <div class="sidebar-version">
    <div class="version-info">
      <a 
        :href="githubReleasesUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="version-link"
        :title="'View release notes and changelog'"
      >
        {{ formattedVersion }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VersionService } from '@/services/version';

const versionService = VersionService.getInstance();

const formattedVersion = computed(() => versionService.getFormattedVersion());

const repoUrl = 'https://github.com/PathfinderHonorManager/PathfinderHonorManagerUI';
const githubReleasesUrl = computed(() => `${repoUrl}/releases`);
</script>

<style scoped>
.sidebar-version {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--itemMargin);
  margin-top: auto;
  font-size: 0.75em;
  color: var(--noteColor);
  border-top: 1px solid var(--lightGrey);
}

.version-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.version-text {
  font-weight: 400;
  color: var(--noteColor);
  text-align: center;
}

.version-link {
  color: var(--noteColor);
  text-decoration: none;
  font-weight: 400;
  padding: 4px 8px;
  border-radius: 4px;
  transition: 0.2s;
  border: 1px solid transparent;
}

.version-link:hover {
  color: var(--actionColor);
  background-color: var(--lightGrey);
  border-color: var(--lightGrey);
  text-decoration: none;
}

@media screen and (max-width: 1080px) {
  .sidebar-version {
    grid-column: span 2;
    margin-top: 1em;
    padding: 1em;
    font-size: 0.8em;
    border-top: 1px solid var(--lightGrey);
    text-align: center;
  }
  
  .version-info {
    gap: 8px;
    justify-content: center;
  }
  
  .version-link {
    padding: 8px 12px;
    font-size: 1em;
  }
}
</style> 