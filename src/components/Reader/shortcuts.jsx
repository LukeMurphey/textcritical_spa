import React from "react";
import {
  Placeholder,
} from "semantic-ui-react";
import { toTitleCase } from "../Utils";
import AboutWorkDialog from "../AboutWorkDialog";
import WorkDownloadDialog from "../WorkDownloadDialog";
import UserNoteDialog from "../UserNoteDialog";

/**
 * Defines how long a division name can get before it is considered long.
 */
const LONG_DIVISION_NAME = 30;

/**
 * Determine if the divisions tend to have long names. This is useful for determining if we ought
 * to use the titles or the shorter descriptors.
 *
 * @param {array} divisions The list of divisions.
 */
export function hasLongDivisionNames(divisions) {
  const countLongNames = (accumulator, division) =>
    division.full_title && division.full_title.length > LONG_DIVISION_NAME
      ? accumulator + 1
      : accumulator;
  const longNames = divisions.reduce(countLongNames, 0);

  return longNames > 5 || longNames === divisions.length;
}

/**
 * Determine if the division descriptors appear to be names.
 *
 * @param {array} divisions The list of divisions.
 */
export function areDescriptorsNames(divisions) {
  const countIndicators = (accumulator, division) =>
    /^([0-9]+|[IVX]+|[A-Z])$/i.test(division.descriptor)
      ? accumulator + 1
      : accumulator;
  const indicators = divisions.reduce(countIndicators, 0);
  return indicators !== divisions.length;
}

/**
 * Get the the division descriptor.
 *
 * @param {array} division The list of divisions.
 * @param {*} useTitles Whether titles ought to be used.
 * @param {*} descriptorsAreNames Whether descriptors appear to be names.
 */
export function getDivisionText(division, useTitles, descriptorsAreNames) {
  // Use the title (from the full_title of the division)
  if (useTitles) {
    return toTitleCase(division.label);
  }
  // Are the descriptors names (like "Matthew" instead of "1")
  if (descriptorsAreNames) {
    return division.descriptor;
  }
  return `${division.type} ${division.descriptor}`;
}

/**
 * Convert the list of divisions to options that can be processed by the dropdown menu.
 *
 * @param {array} divisions The list of divisions.
 */
export function convertDivisionsToOptions(divisions) {
  const useTitles = !hasLongDivisionNames(divisions);
  const descriptorsAreNames = areDescriptorsNames(divisions);

  return divisions.map((d) => ({
    key: d.description,
    text: getDivisionText(d, useTitles, descriptorsAreNames),
    value: d.descriptor,
  }));
}

/**
 * This function looks for the chapter the user entered. It looks both in the description as well
 * as the key.
 * This is useful because the works often use a Greek name as the description but an English
 * description too and we want both to be searchable (don't want users to have to type Μαρκον).
 * @param {array} options List of dropdown options
 * @param {string} query The string that the user entered that we are searching for
 */
export function workSearch(options, query) {
  const queryLower = query.toLowerCase();
  return options.filter(
    (opt) =>
      opt.text.toLowerCase().includes(queryLower) ||
      opt.key.toLowerCase().includes(queryLower)
  );
}

/**
 * Get a placeholder for the content.
 */
export function getPlaceholder(inverted = false) {
  return (
    <div style={{ paddingTop: 16 }}>
      <Placeholder inverted={inverted}>
        <Placeholder.Header>
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
    </div>
  );
}

export const MODAL_ABOUT_WORK = "aboutWork";
export const MODAL_DOWNLOAD_WORK = "downloadWork";
export const MODAL_USER_NOTES = "userNotes";

/**
 * Get the dialogs that ought to be rendered.
 */
export function getDialogs(modal, data, loading, loadedWork, closeModal) {
  return (
    <>
      {data && !loading && modal === MODAL_ABOUT_WORK && (
        <AboutWorkDialog
          work={loadedWork}
          onClose={() => closeModal()}
        />
      )}
      {data && !loading && modal === MODAL_DOWNLOAD_WORK && (
        <WorkDownloadDialog
          work={loadedWork}
          onClose={() => closeModal()}
        />
      )}
      {data && !loading && modal === MODAL_USER_NOTES && (
        <UserNoteDialog
          onClose={() => closeModal()}
          work={data.work.title_slug}
          division={data.chapter.full_descriptor.split('/')}
        />
      )}
    </>
  );
}
