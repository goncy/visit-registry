/**
 * Checks if the action dispatched is a failure action
 * @param {object} action
 * @return {boolean} boolean
 */
export const isError = ({ type }) => ['FAILURE'].indexOf(type.slice(type.lastIndexOf('_') + 1)) >= 0

/**
 * Checks if the action dispatched is a notification
 * @param {object} action
 * @return {boolean} boolean
 */
export const isNotification = ({ payload }) => payload && payload.notification
