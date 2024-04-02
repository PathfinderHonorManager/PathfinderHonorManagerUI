import { Ref } from "vue";
import { PathfinderStoreType } from "@/stores/pathfinders";
import { HonorStoreType } from "@/stores/honors";

export async function addOrUpdateSelectedToClub(
  pathfinderStore: PathfinderStoreType,
  honorStore: HonorStoreType,
  recipients: Ref<Array<{ pathfinderID: string }>>,
  selectedHonors: Ref<Array<{ honorID: string }>>,
  action: "plan" | "earn",
  bulkAdd: Ref<boolean>,
) {
  const { successful, failed } =
    await pathfinderStore.bulkManagePathfinderHonors(
      recipients.value.map((p) => p.pathfinderID),
      selectedHonors.value.map((h) => h.honorID),
      action,
    );
  console.log(`${successful.length} honors were successfully updated.`);
  console.log(`${failed.length} honors failed to update.`, failed);

  if (successful.length > 0) {
    pathfinderStore.selected = [];
    honorStore.selected = [];
    selectedHonors.value = [];
    recipients.value = [];
    bulkAdd.value = true;
  }
  bulkAdd.value = false;

}
