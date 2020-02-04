module.exports = function(RED) {
  function deviceNode(config) {
    try {
      RED.nodes.createNode(this, config);
      const node = this;
      const configNode = RED.nodes.getNode(config.account);
      let auth = false;
      let outputPath = {};

      node.on("input", msg => {
        if (auth) {
          inputHandler(msg.payload);
        } else {
          node.warn("Authentication Pending or error in user credentials.");
        }
      });

      node.on("close", () => {
        if (outputPath) outputPath.off();
      });

      // Subscribe after 2 seconds
      setTimeout(() => {
        if (configNode && configNode.auth && configNode.db) {
          configNode.auth.onAuthStateChanged(user => {
            if (user) {
              // User is signed in.
              node.warn("User Authenticated as " + user.email);
              auth = true;
              if (config.selectedOutput) {
                if (config.selectedOutput == "root") {
                  outputPath = configNode.db.ref(
                    "/devices/" + config.selectedDevice + "/status"
                  );
                } else {
                  outputPath = configNode.db.ref(
                    "/devices/" +
                      config.selectedDevice +
                      "/status/" +
                      config.selectedOutput
                  );
                }
                //subscribe to output path
                node.subscriber = outputPath.on("value", data => {
                  let payload = {};
                  if (config.selectedOutput == "root") {
                    Object.keys(data.val()).forEach(code => {
                      payload[code] = data.val()[code].value;
                    });
                  } else {
                    payload = outputConverter(
                      data.val().value,
                      config.outputConversion
                    );
                  }

                  node.send({
                    payload: payload,
                    completeData: data.val()
                  });
                });
              }
            } else {
              // User is signed out.
              node.warn("Authentication Pending or error in user credentials.");
              auth = false;
            }
          });
        }
      }, 5000);

      function inputHandler(inputValue) {
        if (config.selectedDevice && config.selectedInput) {
          const inputPath = configNode.db.ref(
            "/devices/" + config.selectedDevice + "/commands"
          );
          inputPath.set({
            commandCode: config.selectedInput,
            value: inputValue
          });
        } else {
          node.warn("Please select a device and an input channel");
        }
      }
    } catch (error) {
      node.warn(error);
    }
  }
  RED.nodes.registerType("device-node", deviceNode);
};

function outputConverter(input, enable) {
  if (!JSON.parse(enable)) {
    return input;
  }
  switch (input) {
    case true:
      return "ON";
    case false:
      return "OFF";
    default:
      return input;
  }
}
