import { Ref, nextTick } from "vue";
import { PathfinderStoreType } from "@/stores/pathfinders";
import { HonorStoreType } from "@/stores/honors";
import { SelectionStoreType, SelectionType } from "@/stores/selectionStore";

export async function addOrUpdateSelectedToClub(
  pathfinderStore: PathfinderStoreType,
  honorStore: HonorStoreType,
  selectionStore: SelectionStoreType,
  recipients: Ref<Array<{ pathfinderID: string }>>,
  selectedHonors: Ref<Array<{ honorID: string }>>,
  action: SelectionType,
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
    selectionStore.clearSelection(action);
    recipients.value = [];
    selectedHonors.value = [];
    await nextTick();
    bulkAdd.value = true;
  }
}
