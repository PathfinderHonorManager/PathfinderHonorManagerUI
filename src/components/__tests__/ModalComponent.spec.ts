import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ModalComponent from "@/components/ModalComponent.vue";

describe("ModalComponent", () => {
  it("renders header and emits close", async () => {
    const wrapper = mount(ModalComponent, {
      props: { header: "Example Header" },
      slots: { default: "<p>Modal body</p>" }
    });

    expect(wrapper.find(".modal").exists()).toBe(true);
    expect(wrapper.text()).toContain("Example Header");
    expect(wrapper.text()).toContain("Modal body");

    await wrapper.get(".close-button").trigger("click");

    expect(wrapper.emitted("modal-closed")).toHaveLength(1);
  });

  it("does not render when closed", () => {
    const wrapper = mount(ModalComponent, {
      props: { closed: true }
    });

    expect(wrapper.find(".modal").exists()).toBe(false);
  });
});
