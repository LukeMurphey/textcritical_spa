import { setWorkProgress, getWorksLastRead } from "./index";

/*
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

global.localStorage = new LocalStorageMock();
*/
test("setting work progress", () => {
  // Add some works
  setWorkProgress("new-testament", ["Luke", "15"], "Luke 15");
  expect(getWorksLastRead()).toHaveLength(1);

  setWorkProgress("asv", ["Luke", "15"], "Luke 15");
  expect(getWorksLastRead()).toHaveLength(2);

  setWorkProgress("berean-study-bible", ["Genesis", "1"], "Genesis 1");
  expect(getWorksLastRead()).toHaveLength(3);

  setWorkProgress("lxx", ["Genesis", "1"], "Genesis 1");
  expect(getWorksLastRead()).toHaveLength(4);

  // Make sure the latest entry is correct
  expect(getWorksLastRead()[0].workTitleSlug).toBe("lxx");
  expect(getWorksLastRead()[0].divisions).toBe(["Luke", "15"]);
  expect(getWorksLastRead()[0].divisionTitle).toBe("Genesis 1");
});
