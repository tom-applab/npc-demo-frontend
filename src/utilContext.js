import { createContext, useEffect, useState } from "react";

const UtilContext = createContext();

const UtilContextProvider = ({ children }) => {
  const [value, setValue] = useState("Initial Value");

  useEffect(() => {
    const rootElement = document.getElementById("root");
    const jsonString = rootElement.getAttribute("data-info");
    if (jsonString) {
      setValue(JSON.parse(jsonString));
    }
  }, []);

  // Provide the state and updater function to the context
  return <UtilContext.Provider value={{ value, setValue }}>{children}</UtilContext.Provider>;
};

export { UtilContext, UtilContextProvider };
