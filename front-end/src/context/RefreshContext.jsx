// RefreshContext.js
import React from "react";

const RefreshContext = React.createContext({
  refreshKey: 0,
  setRefreshKey: () => {},
});

export default RefreshContext;
