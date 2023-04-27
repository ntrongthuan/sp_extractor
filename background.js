chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      switch (request.directive) {
      case "popup-click":
          //Add jquery
          chrome.tabs.executeScript({
            file: 'jquery-3.6.4.min.js'
          });
          // execute the content script
          chrome.tabs.executeScript(null, { // defaults to the current tab
              file: "contentscript.js", // script to inject into page and run in sandbox
              allFrames: true // This injects script into iframes in the page and doesn't work before 4.0.266.0.
          });
          sendResponse({}); // sending back empty response to sender
          break;
      default:
          // helps debug when request directive doesn't match
          alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
      }
  }
);

//Auto download
chrome.tabs.onUpdated.addListener(
  function ( tabId, changeInfo, tab )
  {
      if ( changeInfo.status === "complete" )
      {
        // execute the content script
        chrome.tabs.executeScript(null, { // defaults to the current tab
            file: "contentscript.js", // script to inject into page and run in sandbox
            allFrames: true // This injects script into iframes in the page and doesn't work before 4.0.266.0.
        });
        sendResponse({}); // sending back empty response to sender
      }
  }
  );