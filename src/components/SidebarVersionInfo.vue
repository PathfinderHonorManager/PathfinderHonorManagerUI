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
  </div>
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

const repoUrl = 'https://github.com/PathfinderHonorManager/PathfinderHonorManagerUI';

const githubReleasesUrl = computed(() => `${repoUrl}/releases`);

const githubCommitUrl = computed(() => {
  if (!commitHash.value) return '';
  return `${repoUrl}/commit/${commitHash.value}`;
});
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

.commit-link {
  color: var(--actionColor);
  text-decoration: none;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  background-color: var(--lightGrey);
  border-radius: 4px;
  border: 1px solid var(--lightGrey);
  transition: 0.2s;
  opacity: 0.8;
}

.commit-link:hover {
  background-color: var(--grey);
  text-decoration: none;
  transform: translateY(-1px);
  opacity: 1;
}

@media screen and (max-width: 1080px) {
  .sidebar-version {
    grid-column: span 2;
    margin-top: 0.5em;
    padding: 0.5em;
    font-size: 0.7em;
    border-top: none;
  }
  
  .version-info {
    gap: 6px;
  }
  
  .commit-link {
    font-size: 0.85em;
    padding: 1px 4px;
  }
}
</style> 