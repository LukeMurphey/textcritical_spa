import { setWorkProgress, getWorksLastRead } from "./index";

// Setup a local storage mock
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

test("setting work progress", () => {
  const storageMock = new LocalStorageMock();
  // Add some works
  setWorkProgress("new-testament", ["Luke", "15"], "Luke 15", storageMock);
  expect(getWorksLastRead(storageMock)).toHaveLength(1);

  setWorkProgress("asv", ["Luke", "15"], "Luke 15", storageMock);
  expect(getWorksLastRead(storageMock)).toHaveLength(2);

  setWorkProgress(
    "berean-study-bible",
    ["Genesis", "1"],
    "Genesis 1",
    storageMock
  );
  expect(getWorksLastRead(storageMock)).toHaveLength(3);

  setWorkProgress("lxx", ["Genesis", "1"], "Genesis 1", storageMock);
  expect(getWorksLastRead(storageMock)).toHaveLength(4);

  // Make sure the latest entry is correct
  const records = getWorksLastRead(storageMock);
  expect(records[0].workTitleSlug).toBe("lxx");
  expect(records[0].divisions).toEqual(["Genesis", "1"]);
  expect(records[0].divisionReference).toBe("Genesis 1");

  // Make sure the second to latest entry is correct
  expect(records[1].workTitleSlug).toBe("berean-study-bible");
  expect(records[1].divisions).toEqual(["Genesis", "1"]);
  expect(records[1].divisionReference).toBe("Genesis 1");
});
