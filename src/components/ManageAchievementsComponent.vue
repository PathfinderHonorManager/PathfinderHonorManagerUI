<template>
  <div class="manage-achievements">
    <div class="header">
      <h2>{{ className }} Achievements</h2>
      <router-link :to="{ name: 'AchievementClasses' }" class="back-link">
        Back to Class Selection
      </router-link>
    </div>

    <div v-if="loading || autoAddingAchievements" class="loading">
      Loading achievements...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else>
      <div class="achievement-grid">
        <div class="achievement-header">
          <div class="achievement-info">Achievement</div>
          <div class="pathfinder-names desktop-only">
            <div v-for="pathfinder in classPathfinders" 
                 :key="pathfinder.pathfinderID" 
                 class="pathfinder-name"
                 :title="`${pathfinder.firstName} ${pathfinder.lastName}`">
              {{ pathfinder.firstName }} {{ pathfinder.lastName?.charAt(0) }}.
            </div>
          </div>
        </div>
        
        <div v-for="achievement in sortedAchievements" :key="achievement.achievementID" class="achievement-row">
          <div class="achievement-info">
            <div class="achievement-content">
              <div class="achievement-description">
                {{ achievement.description }}
              </div>
              <div class="badge-container">
                <span class="category-badge">{{ achievement.categoryName }}</span>
                <span class="level-badge" :class="'level' + achievement.level">
                  {{ achievement.levelName }}
                </span>
              </div>
            </div>
          </div>
          <div class="pathfinder-checkboxes desktop-only">
            <div v-for="pathfinder in classPathfinders" 
                 :key="pathfinder.pathfinderID" 
                 class="pathfinder-checkbox">
              <input type="checkbox"
                     :checked="isAchievementCompleted(pathfinder.pathfinderID, achievement.achievementID)"
                     @change="onCheckboxChange($event, pathfinder.pathfinderID, achievement.achievementID)">
            </div>
          </div>
          
          <div class="mobile-pathfinders">
            <div v-for="pathfinder in classPathfinders" 
                 :key="pathfinder.pathfinderID" 
                 class="mobile-pathfinder-row">
              <div class="mobile-pathfinder-name">
                {{ pathfinder.firstName }} {{ pathfinder.lastName?.charAt(0) }}.
              </div>
              <div class="mobile-pathfinder-checkbox">
                <input type="checkbox"
                       :checked="isAchievementCompleted(pathfinder.pathfinderID, achievement.achievementID)"
                       @change="onCheckboxChange($event, pathfinder.pathfinderID, achievement.achievementID)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ToasterComponent v-if="toasterMessage" :message="toasterMessage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
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
          // First sort by category
          if (a.categorySequenceOrder !== b.categorySequenceOrder) {
            return a.categorySequenceOrder - b.categorySequenceOrder;
          }
          // Then by achievement sequence within category
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

      const existingPathfinderAchievement = achievementsStore.pathfinderAchievements.find(pa =>
        pa.pathfinderID === pathfinderId &&
        pa.achievementID === achievementId
      );

      try {
        if (existingPathfinderAchievement) {
          await achievementsApi.putPathfinderAchievement(pathfinderId, achievementId, {
            isAchieved: newStatus
          });
        } else {
          await achievementsApi.postPathfinderAchievement(pathfinderId, {
            achievementID: achievementId,
            isAchieved: newStatus
          });
        }
        await achievementsStore.loadAllAchievements();
      } catch (err) {
        console.error('Failed to update achievement:', err);
        toasterMessage.value = 'Failed to update achievement';
      }
    };

    const getExpectedAchievementIdsForGrade = (grade: number) => {
      return achievementsStore.achievements.filter(a => a.grade === grade).map(a => a.achievementID);
    };

    const ensureAllPathfindersHaveAchievements = async () => {
      if (!achievementsStore.achievements.length || !achievementsStore.pathfinderAchievements.length || !pathfinderStore.pathfinders.length) {
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
            achievementIds: [] // API will auto-create for their grade
          });
          await achievementsStore.loadAllAchievements();
        } catch (err) {
          console.error('Failed to create missing achievements:', err);
        } finally {
          autoAddingAchievements.value = false;
        }
      }
    };

    onMounted(async () => {
      if (pathfinderStore.pathfinders.length === 0) {
        await pathfinderStore.getPathfinders();
      }
      await ensureAllPathfindersHaveAchievements();
    });

    return {
      loading,
      error,
      toasterMessage,
      autoAddingAchievements,
      className,
      classPathfinders,
      sortedAchievements,
      isAchievementCompleted,
      onCheckboxChange
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
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75em;
  font-weight: 500;
  background-color: #4a4a4a;
  color: white;
  opacity: 0.8;
}

.level-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75em;
  font-weight: 500;
  opacity: 0.8;
  width: fit-content;
}

.level1 {
  background-color: #2196F3;
  color: white;
}

.level2 {
  background-color: #9C27B0;
  color: white;
}

.desktop-only {
  display: none;
}

.mobile-pathfinders {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
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

@media (min-width: 768px) {
  .achievement-header {
    grid-template-columns: minmax(250px, 1fr) 1fr;
  }
  
  .achievement-row {
    grid-template-columns: minmax(250px, 1fr) 1fr;
  }
  
  .desktop-only {
    display: block;
  }
  
  .mobile-pathfinders {
    display: none;
  }
  
  .pathfinder-names {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 10px;
    text-align: center;
  }
  
  .pathfinder-checkboxes {
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