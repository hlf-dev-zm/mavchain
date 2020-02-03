import { Route, Redirect } from "react-router-dom";
import React, { Suspense, lazy, Fragment } from "react";
import Loader from "react-loaders";

import { ToastContainer } from "react-toastify";

// const RegisterBoxed = lazy(() =>
//   import("../../DemoPages/UserPages/RegisterBoxed")
// );

const BlockChain = lazy(() => import("../../BlockChain/index"));

const AppMain = () => {
  return (
    <Fragment>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale-party" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all the Pages examples
                <small>
                  Because this is a demonstration we load at once all the Pages
                  examples. This wouldn't happen in a real live app!
                </small>
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/home" component={BlockChain} />
      </Suspense>

      {/* Applications */}

      {/* Dashboards */}

      <Route exact path="/" render={() => <Redirect to="/home" />} />
      <ToastContainer />
    </Fragment>
  );
};

export default AppMain;
