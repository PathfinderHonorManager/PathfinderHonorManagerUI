/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import PathfinderList from "@/components/PathfinderList.vue";

const FontAwesomeIconStub = defineComponent({
  emits: ["click"],
  template: "<button class=\"edit-icon\" @click=\"$emit('click')\" />"
});

const PathfinderHonorsDisplayStub = defineComponent({
  props: {
    pathfinderHonors: { type: Array, required: true },
    pathfinderId: { type: String, required: true },
    canUpdatePathfinder: { type: Boolean, required: true }
  },
  template: "<div class=\"honors-display\" />"
});

const PostPathfinderHonorStub = defineComponent({
  template: "<div class=\"post-honor\" />"
});

const factory = (props = {}) =>
  mount(PathfinderList, {
    props: {
      pathfinders: [],
      ...props
    },
    global: {
      stubs: {
        FontAwesomeIcon: FontAwesomeIconStub,
        PathfinderHonorsDisplay: PathfinderHonorsDisplayStub,
        PostPathfinderHonorComponent: PostPathfinderHonorStub
      }
    }
  });

describe("PathfinderList", () => {
  it("shows an error state and emits retry", async () => {
    const wrapper = factory({ error: true, errorMessage: "Network down" });

    expect(wrapper.text()).toContain("Unable to load pathfinders: Network down");
    await wrapper.get("button").trigger("click");

    expect(wrapper.emitted("retry-loading")).toHaveLength(1);
  });

  it("shows a loading state", () => {
    const wrapper = factory({ loading: true });

    expect(wrapper.text()).toContain("Loading Pathfinders...");
  });

  it("renders pathfinders and handles actions", async () => {
    const pathfinder = {
      pathfinderID: "pf-1",
      firstName: "Avery",
      lastName: "Jones",
      className: "Friend",
      grade: 6,
      pathfinderHonors: [
        {
          pathfinderHonorID: "ph-1",
          honorID: "h-1",
          name: "Honor One",
          status: "Planned",
          patchFilename: "honor-one.png"
        }
      ]
    };

    const wrapper = factory({
      pathfinders: [pathfinder],
      canCreatePathfinder: true,
      canUpdatePathfinder: true
    });

    expect(wrapper.text()).toContain("1 Members");

    await wrapper.get(".biglogobutton").trigger("click");
    expect(wrapper.emitted("create-pathfinder")).toHaveLength(1);

    await wrapper.get(".edit-icon").trigger("click");
    expect(wrapper.emitted("edit-pathfinder")?.[0]).toEqual([pathfinder]);

    const showButton = wrapper
      .findAll("button")
      .find((button) => button.text().startsWith("Show Honors"));
    expect(showButton).toBeTruthy();
    await showButton?.trigger("click");

    expect(wrapper.find(".honors-display").exists()).toBe(true);
    expect(wrapper.find(".post-honor").exists()).toBe(true);
    expect(wrapper.text()).toContain("Hide Honors (1)");

    const hideButton = wrapper
      .findAll("button")
      .find((button) => button.text().startsWith("Hide Honors"));
    expect(hideButton).toBeTruthy();
    await hideButton?.trigger("click");

    expect(wrapper.find(".honors-display").exists()).toBe(false);
  });
});
