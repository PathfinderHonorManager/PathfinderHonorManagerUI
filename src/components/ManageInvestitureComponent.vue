<template>
  <div class="content-box">
    <h1>Pathfinder Investiture</h1>
    
    <div v-if="loading" class="loader">Loading...</div>
    <div v-else-if="error" class="error note">{{ error }}</div>
    <div v-else class="power">
      <div class="power-outline">
        <table style="width: 100%">
          <thead>
            <tr>
              <th style="width: 50px">
                <input 
                  type="checkbox" 
                  :checked="selectAll"
                  @change="handleSelectAll"
                >
              </th>
              <th>Name</th>
              <th>Current Grade</th>
              <th>New Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pathfinder in activePathfinders" :key="pathfinder.pathfinderID">
              <td>
                <input 
                  type="checkbox" 
                  :checked="selectionStore.isSelected('investiture', pathfinder.pathfinderID, 'pathfinders')"
                  @change="selectionStore.toggleSelection('investiture', pathfinder.pathfinderID, 'pathfinders')"
                >
              </td>
              <td>{{ `${pathfinder.firstName} ${pathfinder.lastName}` }}</td>
              <td>{{ formatGrade(pathfinder.grade) }}</td>
              <td>{{ formatGrade(getNextGrade(pathfinder.grade)) }}</td>
              <td>{{ pathfinder.isActive ? 'Active' : 'Inactive' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="content-box center-align">
        <button 
          class="primary button"
          @click="promoteSelected" 
          :disabled="!hasSelectedPathfinders"
        >
          Promote Selected ({{ selectionStore.selections.investiture.pathfinders.length }})
        </button>
        <p>
          This will promote all selected pathfinders to their next grade level.
        </p>
      </div>
    </div>
    <ToasterComponent 
      v-if="toasterMessage" 
      :message="toasterMessage"
      @hide="toasterMessage = ''"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import pathfindersApi from '@/api/pathfinders';
import { useSelectionStore } from '@/stores/selectionStore';
import { AxiosResponse } from 'axios';
import ToasterComponent from '@/components/ToasterComponent.vue';

interface Pathfinder {
  pathfinderID: string;
  firstName: string;
  lastName: string;
  grade: number | null;
  isActive: boolean;
}

interface BulkUpdateResponse {
  status: number;
  pathfinderId: string;
}

export default defineComponent({
  name: 'ManageInvestitureComponent',
  
  components: {
    ToasterComponent
  },
  
  setup() {
    const pathfinders = ref<Pathfinder[]>([]);
    const loading = ref(false);
    const error = ref('');
    const selectAll = ref(false);
    const toasterMessage = ref('');
    const selectionStore = useSelectionStore();

    const activePathfinders = computed(() => 
      pathfinders.value.filter(p => 
        p.grade !== null && 
        p.grade >= 5 && 
        p.grade <= 11
      )
    );

    const hasSelectedPathfinders = computed(() => 
      selectionStore.selections.investiture.pathfinders.length > 0
    );

    const loadPathfinders = async () => {
      loading.value = true;
      try {
        const response = await pathfindersApi.getAll();
        pathfinders.value = response.data;
      } catch (err) {
        error.value = 'Failed to load pathfinders';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const getNextGrade = (currentGrade: number | null): number | null => {
      if (currentGrade === null || currentGrade >= 12) return null;
      return currentGrade + 1;
    };

    const formatGrade = (grade: number | null): string => {
      return grade === null ? 'Staff' : `Grade ${grade}`;
    };

    const handleSelectAll = (event: Event) => {
      const checked = (event.target as HTMLInputElement).checked;
      selectAll.value = checked;
      if (checked) {
        activePathfinders.value.forEach(p => {
          if (!selectionStore.isSelected('investiture', p.pathfinderID, 'pathfinders')) {
            selectionStore.toggleSelection('investiture', p.pathfinderID, 'pathfinders');
          }
        });
      } else {
        selectionStore.clearSelection('investiture');
      }
    };

    const handleBulkUpdateResponse = (response: AxiosResponse<BulkUpdateResponse[]>) => {
      if (response.status === 207) {
        const failedUpdates = response.data.filter(update => update.status !== 200);
        if (failedUpdates.length > 0) {
          const successCount = response.data.length - failedUpdates.length;
          error.value = `Updated ${successCount} pathfinders, but ${failedUpdates.length} updates failed`;
          return false;
        }
        toasterMessage.value = `Successfully promoted ${response.data.length} pathfinders`;
      }
      return true;
    };

    const promoteSelected = async () => {
      const selectedIds = selectionStore.selections.investiture.pathfinders;
      const updates = selectedIds
        .map(id => {
          const pathfinder = pathfinders.value.find(p => p.pathfinderID === id);
          if (!pathfinder) {
            console.error(`Pathfinder with ID ${id} not found`);
            return null;
          }
          return {
            pathfinderId: id,
            grade: getNextGrade(pathfinder.grade),
            isActive: pathfinder.isActive
          };
        })
        .filter((update): update is NonNullable<typeof update> => update !== null);

      if (updates.length === 0) {
        error.value = 'No valid pathfinders to update';
        return;
      }

      try {
        const response = await pathfindersApi.bulkUpdatePathfinders([{ items: updates }]);
        const success = handleBulkUpdateResponse(response);
        await loadPathfinders();
        if (success) {
          selectionStore.clearSelection('investiture');
          selectAll.value = false;
        }
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to promote pathfinders';
        console.error(err);
      }
    };

    loadPathfinders();

    return {
      activePathfinders,
      loading,
      error,
      selectAll,
      toasterMessage,
      selectionStore,
      hasSelectedPathfinders,
      promoteSelected,
      handleSelectAll,
      formatGrade,
      getNextGrade
    };
  }
});
</script>

<style scoped>
.actions {
  margin-bottom: 20px;
}
</style> 