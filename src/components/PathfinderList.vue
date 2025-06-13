<template>
  <div
    v-if="error"
    class="error-message"
  >
    <p>Unable to load pathfinders: {{ errorMessage }}</p>
    <button
      class="primary button"
      @click="retryLoading"
    >
      Retry
    </button>
  </div>
  <div
    v-if="loading"
    class="loading-container"
  >
    <span class="loader">Loading Pathfinders...</span>
  </div>
  <div
    v-if="pathfinders[0]"
    class="content-box"
  >
    <div class="header-container">
      <h3 class="member-count">
        {{ pathfinders.length }} Members
      </h3>
      <button
        v-if="canCreatePathfinder"
        class="biglogobutton"
        @click="$emit('create-pathfinder')"
      >
        +
      </button>
    </div>

    <DetailTableItemComponent
      v-for="(pathfinder, i) in pathfinders"
      :key="i"
    >
      <div class="pathfinder-header">
        <h2 class="pathfinder-name h2-with-bar">
          {{ pathfinder.firstName }} {{ pathfinder.lastName }}
        </h2>
        <div class="pathfinder-details-container">
          <h2
            v-if="pathfinder.className"
            class="pathfinder-details"
          >
            {{ pathfinder.className }} (Grade {{ pathfinder.grade }})
          </h2>
          <h2 v-else>
            Staff
          </h2>
          <FontAwesomeIcon
            v-if="canUpdatePathfinder"
            :icon="faPencil"
            size="sm"
            class="fontawesome-icon"
            @click="$emit('edit-pathfinder', pathfinder)"
          />
        </div>
      </div>

      <button
        v-if="!showing[pathfinder.pathfinderID]"
        class="outline button"
        style="margin: 0"
        @click="showing[pathfinder.pathfinderID] = true"
      >
        Show Honors ({{ pathfinder.pathfinderHonors?.length }})
      </button>
      <button
        v-if="showing[pathfinder.pathfinderID]"
        class="outline button"
        style="margin: 0"
        @click="showing[pathfinder.pathfinderID] = false"
      >
        Hide Honors ({{ pathfinder.pathfinderHonors?.length }})
      </button>

      <PostPathfinderHonorComponent
        v-if="showing[pathfinder.pathfinderID] && canUpdatePathfinder"
        :pathfinder-i-d="pathfinder.pathfinderID"
      />

      <PathfinderHonorsDisplay
        v-if="showing[pathfinder.pathfinderID]"
        :pathfinder-honors="pathfinder.pathfinderHonors"
        :pathfinder-id="pathfinder.pathfinderID"
        :can-update-pathfinder="canUpdatePathfinder"
      />
    </DetailTableItemComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DetailTableItemComponent from "./DetailTableItemComponent.vue";
import PostPathfinderHonorComponent from "./PostPathfinderHonorComponent.vue";
import PathfinderHonorsDisplay from "./PathfinderHonorsDisplay.vue";
import { Pathfinder } from "@/models/pathfinder";

const props = defineProps({
  pathfinders: {
    type: Array as () => Pathfinder[],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: "An unexpected error occurred"
  },
  canCreatePathfinder: {
    type: Boolean,
    default: false
  },
  canUpdatePathfinder: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['create-pathfinder', 'edit-pathfinder', 'retry-loading']);

const showing = ref({});

const retryLoading = () => {
  emit('retry-loading');
};
</script>

<style scoped>
.error-message {
  background-color: #ffeeee;
  border: 1px solid #ffcccc;
  color: #cc0000;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

.loader {
  display: inline-block;
  font-size: 1.2em;
  color: #666;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0;
  padding: 0;
}

.member-count {
  margin: 0;
}
</style> 