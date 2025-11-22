// Lightweight runtime prop checker to detect string boolean props ("true"/"false")
// that may be passed to components where a native boolean is expected.
// It monkey-patches React.createElement and logs a warning including a stack
// trace when a likely problematic prop is detected.
import React from "react";

const origCreateElement = React.createElement;
const boolNameRE = /^(is|has|with|enable|enabled|disable|disabled|secure|visible|show|hide|allow|can|should)/i;

function isStringBoolean(val) {
  return typeof val === "string" && (val === "true" || val === "false");
}

React.createElement = function patchedCreateElement(type, props, ...children) {
  try {
    if (props && typeof props === "object") {
      for (const key of Object.keys(props)) {
        const val = props[key];
        if (isStringBoolean(val) && boolNameRE.test(key)) {
          const componentName =
            typeof type === "string"
              ? type
              : (type && (type.displayName || type.name)) || "Unknown";

          // Provide concise structured log to help trace the origin
          /* eslint-disable no-console */
          console.warn(
            `[PROP-Debug] ${componentName} received string boolean prop ${key}="${val}"`
          );
          console.warn("Props snapshot:", props);
          console.warn(new Error("[PROP-Debug] stack").stack);
          /* eslint-enable no-console */
          break; // report only once per element creation
        }
      }
    }
  } catch (err) {
    try {
      console.error("propDebug error", err);
    } catch (e) {}
  }

  return origCreateElement.apply(this, [type, props, ...children]);
};

export default null;
