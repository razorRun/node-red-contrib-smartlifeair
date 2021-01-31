module.exports = function(RED) {
  let lastOutPut = {};
  let auth = false;
  function deviceNode(config) {
    try {
      RED.nodes.createNode(this, config);
      const node = this;
      const configNode = RED.nodes.getNode(config.account);
      
      let outputPath = {};

      node.on("input", msg => {
        if (auth) {
          inputHandler(msg.payload);
        } else {
          node.warn("Authentication Pending or error in user credentials. - On User input");
        }
      });

      node.on("close", () => {
        if (outputPath) outputPath.off();
      });

      // Subscribe after 5 seconds
      setTimeout(() => {
        if (configNode && configNode.auth && configNode.db) {
          configNode.auth.onAuthStateChanged(user => {
            if (user) {
              // User is signed in.
              logWarn("User Authenticated as " + user.email);
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
                  lastOutPut = payload;
                  node.send({
                    payload: payload,
                    completeData: data.val()
                  });
                });
              }
            } else {
              // User is signed out.
              node.warn("Authentication Pending or error in user credentials. - On Startup");
              console.log("Smartlife Air: Auth Object")
              console.log(JSON.stringify(configNode.auth))
              auth = false;
            }
          });
        }
      }, 5000);

      function logWarn(msg){
        if(config.enabledDebugMsg === "true" || config.enabledDebugMsg === true){ // "WTF: NR keep passing string and Bool cov doesnt work To check later"
          node.warn(msg);
        }
      }

      function inputHandler(inputValue) {
        if (inputValue === "?"){
          node.send({
            payload:lastOutPut
          })
        }
        else {
          if (config.selectedDevice && config.selectedInput) {
            const inputPath = configNode.db.ref(
              "/devices/" + config.selectedDevice + "/commands"
            );
            console.log('Smartlife Air: Value Update Started'+ config.selectedDevice +' '+ config.selectedInput +' '+ inputValue);
            inputPath.set({
              commandCode: config.selectedInput,
              value: inputValue
            }).then(function() {
              console.log('Smartlife Air: Value Update Finished'+ config.selectedDevice +' '+ config.selectedInput +' '+ inputValue);
            }).catch(function(error) {
              console.log('Smartlife Air: Cannot connect to the server');
              console.log('Smartlife Air: Value Update Failed '+ config.selectedDevice +' '+ config.selectedInput +' '+ inputValue);
            });

          } else {
            logWarn("Please select a device and an input channel");
          }
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