import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ToasterComponent from "@/components/ToasterComponent.vue";

describe("ToasterComponent", () => {
  it("renders a message and emits hide after timeout", () => {
    vi.useFakeTimers();
    const wrapper = mount(ToasterComponent, {
      props: { message: "Saved successfully" }
    });

    expect(wrapper.text()).toContain("Saved successfully");

    vi.advanceTimersByTime(10000);

    expect(wrapper.emitted("hide")).toHaveLength(1);
    vi.useRealTimers();
  });
});
