import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SidebarVersionInfo from "@/components/SidebarVersionInfo.vue";

vi.mock("@/services/version", () => ({
  VersionService: {
    getInstance: () => ({
      getFormattedVersion: () => "v1.2.3 (1/1/2024)"
    })
  }
}));

describe("SidebarVersionInfo", () => {
  it("renders a link to release notes with formatted version", () => {
    const wrapper = mount(SidebarVersionInfo);
    const link = wrapper.get("a.version-link");

    expect(link.text()).toBe("v1.2.3 (1/1/2024)");
    expect(link.attributes("href")).toBe(
      "https://github.com/PathfinderHonorManager/PathfinderHonorManagerUI/releases"
    );
  });
});
