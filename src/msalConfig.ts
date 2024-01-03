import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "f0920ef7-01a9-48b1-bbd0-72dae6ef3869",
    authority:
      "https://login.microsoftonline.com/1a3889b2-f76f-4dd8-831e-b2d5e716c986",
    redirectUri: "http://localhost:5173",
  },
};
