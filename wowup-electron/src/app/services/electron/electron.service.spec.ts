import { TestBed } from "@angular/core/testing";
import { ElectronService } from "./electron.service";

describe("ElectronService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ElectronService = new ElectronService();
    expect(service).toBeTruthy();
  });
});
