import { Fragment } from "react";
import loadable from "@loadable/component";

const MinimizableWebChat = loadable(() => import("./lib/webchat/MinimizableWebChat"));

function App() {
  return (
    <Fragment>
        <MinimizableWebChat />
    </Fragment>
  );
}

export default App;
