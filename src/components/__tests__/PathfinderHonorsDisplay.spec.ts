import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import PathfinderHonorsDisplay from "@/components/PathfinderHonorsDisplay.vue";

const PathfinderHonorStub = defineComponent({
  name: "PathfinderHonorComponent",
  props: {
    pathfinderID: { type: String, required: true },
    honorID: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    display: { type: Boolean, required: true },
    image: { type: String, required: false },
    canUpdatePathfinder: { type: Boolean, required: true }
  },
  template: "<div class=\"honor-stub\" />"
});

describe("PathfinderHonorsDisplay", () => {
  it("renders honors with expected props", () => {
    const honors = [
      {
        pathfinderHonorID: "ph-1",
        honorID: "h-1",
        name: "Honor One",
        status: "Planned",
        patchFilename: "one.png"
      },
      {
        pathfinderHonorID: "ph-2",
        honorID: "h-2",
        name: "Honor Two",
        status: "Earned",
        patchFilename: "two.png"
      }
    ];

    const wrapper = mount(PathfinderHonorsDisplay, {
      props: {
        pathfinderHonors: honors,
        pathfinderId: "pf-1",
        canUpdatePathfinder: true
      },
      global: {
        stubs: {
          PathfinderHonorComponent: PathfinderHonorStub
        }
      }
    });

    const honorComponents = wrapper.findAllComponents(PathfinderHonorStub);
    expect(honorComponents).toHaveLength(2);
    expect(honorComponents[0].props()).toMatchObject({
      pathfinderID: "pf-1",
      honorID: "h-1",
      name: "Honor One",
      status: "Planned",
      display: true,
      image: "one.png",
      canUpdatePathfinder: true
    });
    expect(honorComponents[1].props()).toMatchObject({
      pathfinderID: "pf-1",
      honorID: "h-2",
      name: "Honor Two",
      status: "Earned",
      display: true,
      image: "two.png",
      canUpdatePathfinder: true
    });
  });
});
