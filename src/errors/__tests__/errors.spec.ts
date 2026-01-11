import { describe, it, expect } from "vitest";
import { Errors } from "@/errors/errors";

describe("Errors", () => {
  it("builds api response errors with consistent text", () => {
    const statusError = Errors.apiResponse.status("500");
    const bodyError = Errors.apiResponse.body("Bad response");

    expect(statusError.text()).toBe("API response error: Status: 500");
    expect(bodyError.text()).toBe("API response error: Body: Bad response");
  });

  it("formats user input errors", () => {
    const selectError = Errors.selectHonor.alreadySelected;
    const emailError = Errors.postFormData.invalidEmail;

    expect(selectError.text()).toBe("input error: This honor is already selected.");
    expect(emailError.text()).toBe("input error: Invalid email");
  });

  it("keeps test errors consistent", () => {
    expect(Errors.test.testError.text()).toBe("test error: This is a test error.");
    expect(Errors.test.bulkAddReport(["One", "Two"]).text()).toBe(
      "test error: Bulk Add Status: \n One,Two"
    );
  });
});
