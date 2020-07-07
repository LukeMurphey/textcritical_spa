import { setWorkProgress, getWorksLastRead, maxHistoryCount, setFavoriteWork, getFavoriteWorks } from "./index";

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

test("only stores the correct number of entries", () => {
  const storageMock = new LocalStorageMock();
  // Add some works
  setWorkProgress("new-testament", ["Luke", "15"], "Luke 15", storageMock);
  setWorkProgress("asv", ["Luke", "15"], "Luke 15", storageMock);
  setWorkProgress(
    "berean-study-bible",
    ["Genesis", "1"],
    "Genesis 1",
    storageMock
  );
  setWorkProgress("lxx", ["Genesis", "1"], "Genesis 1", storageMock);
  setWorkProgress("acharnians", [], "1", storageMock);
  setWorkProgress("abdicatus", [], "1", storageMock);
  setWorkProgress("republic", [], "1", storageMock);
  setWorkProgress("republic-english", [], "1", storageMock);

  // Make sure it only stores the correct number of entries
  expect(getWorksLastRead(storageMock)).toHaveLength(maxHistoryCount());
});

test("handles corrupted data", () => {
  const storageMock = new LocalStorageMock();
  storageMock.setItem("lastReadHistory", "[{");

  expect(getWorksLastRead(storageMock)).toBe(null);
});

test("ignores invalid entries", () => {
  const storageMock = new LocalStorageMock();
  storageMock.setItem(
    "lastReadHistory",
    '[{"workTitleSlugBAD":"republic-english","divisions":[],"divisionReference":"1"},{"workTitleSlug":"republic","divisions":[],"divisionReference":"1"}]'
  );

  expect(getWorksLastRead(storageMock)).toHaveLength(1);
});

test("the progress gets set for favorites", () => {
  const storageMock = new LocalStorageMock();
  
  // Set a work as a favorite
  setFavoriteWork('new-testament', storageMock);
  expect(getFavoriteWorks(storageMock)).toHaveLength(1);

  // Set progress for the work
  setWorkProgress(
    "new-testament",
    ["Luke", "15"],
    "Luke 15",
    storageMock
  );
  expect(getFavoriteWorks(storageMock)).toHaveLength(1);

  // Make sure the latest entry is correct
  const records = getFavoriteWorks(storageMock);
  expect(records[0].workTitleSlug).toBe("new-testament");
  expect(records[0].divisions).toEqual(["Luke", "15"]);
  expect(records[0].divisionReference).toBe("Luke 15");
});
