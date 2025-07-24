export type JustForTodayAndroidWidgetsModule = {
  /**
   * Save the daily intention text and associated date (formatted as yyyy-MM-dd)
   */
  setIntention: (value: string, date: string) => void;

  /**
   * Save a gratitude message to be displayed in the widget
   */
  setGratitude: (value: string) => void;

  /**
   * Triggers the Intention widget to update using latest stored data
   */
  updateIntentionWidget: () => void;

  /**
   * Triggers the Gratitude widget to update using latest stored data
   */
  updateGratitudeWidget: () => void;

  /**
   * Sets the user display name for the widget
   */
  setUserDisplayName: (name: string) => void;
};
