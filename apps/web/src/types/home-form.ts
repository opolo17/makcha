export type HomeFormState = {
  appointmentName: string;
  hour: string;
  minute: string;
  meridiem: "AM" | "PM";
};

export const DEFAULT_HOME_FORM: HomeFormState = {
  appointmentName: "",
  hour: "9",
  minute: "0",
  meridiem: "PM",
};
