import { setCookiesAccepted, getCookiesAccepted } from "./cookiesAccepted";
import { LocalStorageMock } from "./worksList.test";

test("set cookies accepted", () => {
  const storageMock = new LocalStorageMock();

  expect(getCookiesAccepted(storageMock)).toBe(false);

  setCookiesAccepted(storageMock);
  expect(getCookiesAccepted(storageMock)).toBe(true);
});
