<template>
  <div class="manage-achievements">
    <div class="header">
      <h2>{{ className }} Achievements</h2>
      <router-link
        :to="{ name: 'AchievementClasses' }"
        class="back-link"
      >
        Back to Class Selection
      </router-link>
    </div>

    <div
      v-if="loading || autoAddingAchievements"
      class="loading"
    >
      Loading achievements...
    </div>
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>
    <div v-else>
      <div class="achievement-grid">
        <div
          class="achievement-header"
          :class="{ 'force-mobile': shouldUseMobileLayout }"
        >
          <div class="achievement-info">
            Achievement
          </div>
          <div
            class="pathfinder-names desktop-only"
            :class="{ 'force-mobile': shouldUseMobileLayout }"
          >
            <div
              v-for="pathfinder in classPathfindersWithMatchingGrade" 
              :key="pathfinder.pathfinderID" 
              class="pathfinder-name"
              :title="`${pathfinder.firstName} ${pathfinder.lastName}`"
            >
              {{ pathfinder.firstName }} {{ pathfinder.lastName?.charAt(0) }}.
            </div>
          </div>
        </div>
        
        <div
          v-for="achievement in sortedAchievements"
          :key="achievement.achievementID"
          class="achievement-row"
          :class="{ 'force-mobile': shouldUseMobileLayout }"
        >
          <div class="achievement-info">
            <div class="achievement-content">
              <div class="achievement-description">
                {{ achievement.description }}
              </div>
              <div class="badge-container">
                <span
                  class="category-badge"
                  :class="getCategoryClass(achievement.categoryName)"
                >
                  {{ achievement.categoryName }}
                </span>
                <span
                  class="level-badge"
                  :class="'level' + achievement.level"
                >
                  {{ achievement.levelName }}
                </span>
              </div>
            </div>
          </div>
          <div
            class="pathfinder-checkboxes desktop-only"
            :class="{ 'force-mobile': shouldUseMobileLayout }"
          >
            <div
              v-for="pathfinder in classPathfindersWithMatchingGrade" 
              :key="pathfinder.pathfinderID" 
              class="pathfinder-checkbox"
            >
              <input
                type="checkbox"
                :checked="isAchievementCompleted(pathfinder.pathfinderID, achievement.achievementID)"
                @change="onCheckboxChange($event, pathfinder.pathfinderID, achievement.achievementID)"
              >
            </div>
          </div>
          
          <div
            class="mobile-pathfinders"
            :class="{ 'force-mobile': shouldUseMobileLayout }"
          >
            <div
              v-for="pathfinder in classPathfindersWithMatchingGrade" 
              :key="pathfinder.pathfinderID" 
              class="mobile-pathfinder-row"
            >
              <div class="mobile-pathfinder-name">
                {{ pathfinder.firstName }} {{ pathfinder.lastName }}
              </div>
              <div class="mobile-pathfinder-checkbox">
                <input
                  type="checkbox"
                  :checked="isAchievementCompleted(pathfinder.pathfinderID, achievement.achievementID)"
                  @change="onCheckboxChange($event, pathfinder.pathfinderID, achievement.achievementID)"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ToasterComponent
      v-if="toasterMessage"
      :message="toasterMessage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePathfinderStore } from '@/stores/pathfinders';
import { useAchievementsStore } from '@/stores/achievements';
import achievementsApi from '@/api/achievements';
import ToasterComponent from '@/components/ToasterComponent.vue';

const CLASS_GRADE_MAP: Record<string, number> = {
  'Friend': 5,
  'Companion': 6,
  'Explorer': 7,
  'Ranger': 8,
  'Voyager': 9,
  'Guide': 10
};

export default defineComponent({
  name: 'ManageAchievementsComponent',
  
  components: {
    ToasterComponent
  },
  
  setup() {
    const route = useRoute();
    const pathfinderStore = usePathfinderStore();
    const achievementsStore = useAchievementsStore();
    const loading = computed(() => achievementsStore.loading);
    const error = computed(() => achievementsStore.error);
    const toasterMessage = ref('');
    const autoAddingAchievements = ref(false);

    const className = computed(() => {
      const routeClassName = route.params.className;
      return typeof routeClassName === 'string' ? routeClassName : 
             Array.isArray(routeClassName) ? routeClassName[0] : '';
    });

    const classGrade = computed(() => CLASS_GRADE_MAP[className.value]);

    const classPathfinders = computed(() =>
      pathfinderStore.pathfinders.filter(p => p.className === className.value)
    );

    const classPathfindersWithMatchingGrade = computed(() =>
      classPathfinders.value.filter(p => p.grade === classGrade.value)
    );

    const shouldUseMobileLayout = computed(() => {
      return classPathfindersWithMatchingGrade.value.length > 5;
    });

    const sortedAchievements = computed(() => {
      const uniqueAchievements = new Map();
      
      achievementsStore.achievements
        .filter(a => a.grade === classGrade.value)
        .forEach(a => {
          if (!uniqueAchievements.has(a.achievementID)) {
            uniqueAchievements.set(a.achievementID, {
              achievementID: a.achievementID,
              description: a.description || 'No description available',
              level: a.level,
              levelName: a.level === 1 ? 'Basic' : 'Advanced',
              achievementSequenceOrder: a.achievementSequenceOrder,
              grade: a.grade,
              className: a.className,
              categoryName: a.categoryName || 'Uncategorized',
              categorySequenceOrder: a.categorySequenceOrder
            });
          }
        });
      
      return Array.from(uniqueAchievements.values())
        .sort((a, b) => {
          if (a.categorySequenceOrder !== b.categorySequenceOrder) {
            return a.categorySequenceOrder - b.categorySequenceOrder;
          }
          return a.achievementSequenceOrder - b.achievementSequenceOrder;
        });
    });

    const isAchievementCompleted = (pathfinderId: string, achievementId: string): boolean => {
      return achievementsStore.pathfinderAchievements.some(pa => 
        pa.pathfinderID === pathfinderId && 
        pa.achievementID === achievementId && 
        pa.isAchieved === true
      );
    };

    const onCheckboxChange = async (event: Event, pathfinderId: string, achievementId: string) => {
      const target = event.target as HTMLInputElement;
      const newStatus = target.checked;
      const originalStatus = !newStatus; // Store the original state

      const existingPathfinderAchievement = achievementsStore.pathfinderAchievements.find(pa =>
        pa.pathfinderID === pathfinderId &&
        pa.achievementID === achievementId
      );

      try {
        if (existingPathfinderAchievement) {
          const response = await achievementsApi.putPathfinderAchievement(pathfinderId, achievementId, {
            isAchieved: newStatus
          });
          // Update the existing record in the store
          const index = achievementsStore.pathfinderAchievements.findIndex(pa =>
            pa.pathfinderID === pathfinderId && pa.achievementID === achievementId
          );
          if (index !== -1) {
            achievementsStore.pathfinderAchievements[index] = response.data;
          }
        } else {
          const response = await achievementsApi.postPathfinderAchievement(pathfinderId, {
            achievementID: achievementId,
            isAchieved: newStatus
          });
          // Add the new record to the store
          achievementsStore.pathfinderAchievements.push(response.data);
        }
      } catch (err) {
        console.error('Failed to update achievement:', err);
        toasterMessage.value = 'Failed to update achievement';
        // Revert the checkbox to its original state
        target.checked = originalStatus;
      }
    };

    const getExpectedAchievementIdsForGrade = (grade: number) => {
      return achievementsStore.achievements.filter(a => a.grade === grade).map(a => a.achievementID);
    };

    const getCategoryClass = (categoryName: string | null): string => {
      if (!categoryName) return 'category-default';
      
      const category = categoryName.toLowerCase();
      
      if (category.includes('personal growth')) {
        return 'category-personal-growth';
      } else if (category.includes('spiritual discovery')) {
        return 'category-spiritual-discovery';
      } else if (category.includes('serving others')) {
        return 'category-serving-others';
      } else if (category.includes('making friends')) {
        return 'category-making-friends';
      } else if (category.includes('health and fitness')) {
        return 'category-health-fitness';
      } else if (category.includes('nature study')) {
        return 'category-nature-study';
      } else if (category.includes('outdoor living')) {
        return 'category-outdoor-living';
      } else if (category.includes('honor enrichment')) {
        return 'category-honor-enrichment';
      } else {
        return 'category-default';
      }
    };

    const ensureAllPathfindersHaveAchievements = async () => {
      if (!achievementsStore.achievements.length || !achievementsStore.pathfinderAchievements.length || !classPathfinders.value.length) {
        return;
      }
      
      const missingForPathfinder: string[] = [];
      for (const pathfinder of classPathfinders.value) {
        if (typeof pathfinder.grade !== 'number') {
          continue;
        }
        
        const expectedAchievementIds = new Set(getExpectedAchievementIdsForGrade(pathfinder.grade));
        const actualAchievementIds = new Set(
          achievementsStore.pathfinderAchievements
            .filter(pa => pa.pathfinderID === pathfinder.pathfinderID && pa.grade === pathfinder.grade)
            .map(pa => pa.achievementID)
        );
        
        const missingAchievements = Array.from(expectedAchievementIds).filter(id => !actualAchievementIds.has(id));
        if (missingAchievements.length > 0) {
          missingForPathfinder.push(pathfinder.pathfinderID);
        }
      }
      
      if (missingForPathfinder.length > 0) {
        autoAddingAchievements.value = true;
        try {
          await achievementsApi.postPathfinderAchievementsForGrade({
            pathfinderIds: Array.from(new Set(missingForPathfinder)),
            achievementIds: []
          });
          await achievementsStore.loadAllAchievements(true);
        } catch (err) {
          console.error('Failed to create missing achievements:', err);
        } finally {
          autoAddingAchievements.value = false;
        }
      }
    };

    // Watch for both pathfinders and achievements to be loaded
    watch([classPathfinders, () => achievementsStore.achievements.length, () => achievementsStore.pathfinderAchievements.length], 
      async ([newPathfinders, achievementsCount, pathfinderAchievementsCount]) => {
        if (newPathfinders.length > 0 && achievementsCount > 0 && pathfinderAchievementsCount > 0) {
          await ensureAllPathfindersHaveAchievements();
        }
      }, 
      { immediate: true }
    );

    onMounted(async () => {
      // Always refresh pathfinders to ensure we have latest data after investiture
      await pathfinderStore.getPathfinders();
      if (achievementsStore.achievements.length === 0) {
        await achievementsStore.loadAllAchievements();
      }
    });

    return {
      loading,
      error,
      toasterMessage,
      autoAddingAchievements,
      className,
      classPathfinders,
      classPathfindersWithMatchingGrade,
      shouldUseMobileLayout,
      sortedAchievements,
      isAchievementCompleted,
      onCheckboxChange,
      getCategoryClass
    };
  }
});
</script>

<style scoped>
.manage-achievements {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-link {
  font-size: 1.1em;
  font-weight: 600;
  color: #ffd700;
  text-decoration: none;
}

.back-link:hover {
  color: #fffbe7;
}

.achievement-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 20px;
}

.achievement-header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}

.achievement-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: start;
  padding: 15px 0;
  border-bottom: 1px solid #333;
}

.achievement-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.achievement-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-description {
  font-size: 1em;
  color: #fff;
  line-height: 1.5;
}

.badge-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-badge {
  display: inline-block;
  padding: 1px 4px;
  border-radius: 5px;
  font-size: 0.55em;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.category-personal-growth {
  background: #8B5CF6;
}

.category-spiritual-discovery {
  background: #3B82F6;
}

.category-serving-others {
  background: #10B981;
}

.category-making-friends {
  background: #F59E0B;
}

.category-health-fitness {
  background: #EF4444;
}

.category-nature-study {
  background: #059669;
}

.category-outdoor-living {
  background: #7C3AED;
}

.category-honor-enrichment {
  background: #EC4899;
}

.category-default {
  background: var(--lightGrey);
}

.level-badge {
  display: inline-block;
  padding: 1px 4px;
  border-radius: 5px;
  font-size: 0.55em;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.level1 {
  background: #6B7280;
}

.level2 {
  background: #4B5563;
}

.desktop-only {
  display: none;
}

.desktop-only.force-mobile {
  display: none !important;
}

.mobile-pathfinders {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.mobile-pathfinders.force-mobile {
  display: flex !important;
}

.mobile-pathfinder-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #3a3a3a;
  border-radius: 4px;
}

.mobile-pathfinder-name {
  font-size: 0.9em;
  color: #fff;
  font-weight: 500;
}

.mobile-pathfinder-checkbox {
  display: flex;
  align-items: center;
}

.mobile-pathfinder-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: #ff4444;
}

@media (min-width: 1024px) {
  .achievement-header:not(.force-mobile) {
    grid-template-columns: minmax(250px, 1fr) 1fr;
  }
  
  .achievement-row:not(.force-mobile) {
    grid-template-columns: minmax(250px, 1fr) 1fr;
  }
  
  .desktop-only:not(.force-mobile) {
    display: block;
  }
  
  .mobile-pathfinders:not(.force-mobile) {
    display: none;
  }
  
  .pathfinder-names:not(.force-mobile) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 10px;
    text-align: center;
  }
  
  .pathfinder-checkboxes:not(.force-mobile) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 10px;
    justify-items: center;
  }
  
  .pathfinder-name {
    font-size: 0.9em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 4px;
  }
}
</style> 