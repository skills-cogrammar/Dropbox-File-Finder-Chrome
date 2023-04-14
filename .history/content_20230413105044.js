
let inputField1 = document.createElement("input");
let inputField2 = document.createElement("input");
let getFilesBtn = document.createElement("button");
let routeList = document.createElement("div")
let hashParams = new URLSearchParams(window.location.hash.substr(1)); //get token from url
let rootPath = "";
let fileName = "";



//! Dropbox credentials
  let accessToken = hashParams.get("access_token"); //save token to variable
  const dropboxClientId = "lqp7zeiwcl5toer"; //hd: gsw6a2m0r2u44lt //me: lqp7zeiwcl5toer
  const clientSecret = "4jcwnu9bagjrc89"; //HD: nwpi7lk0yyp2v44 //me:4jcwnu9bagjrc89
  const redirectHomeUrl = "http://localhost:3000/testRoute/index.html"; // your redirect URI

  // get access token from local storage
  if (localStorage.getItem("access_token") != null) {
    accessToken = localStorage.getItem("access_token");
  }


  let dbx = new Dropbox.Dropbox({
    clientId: dropboxClientId,
    clientSecret: clientSecret,
    accessToken: accessToken,
  });

checkToken(dbx)

  //! 1 Check token validity
function checkToken(dbx) {
    dbx
      .usersGetCurrentAccount()
      .then(function (response) {
        console.log("Access token is still valid");
        createUI();
      })
      .catch(function (error) {
        console.log("Access token has expired or is invalid");
        localStorage.removeItem("access_token");
        auth2Flow();
      });
}

  //! Step 1.1: If needed, get access
  function auth2Flow() {
    console.log("dbx", dbx);
  
    // Remove the token from the URL
    //replaceState() method modifies the browser's history object
    history.replaceState({}, document.title, window.location.href.split("#")[0]);
  
    // Redirect the user to the authorization URL
    const authUrl =
      "https://www.dropbox.com/oauth2/authorize" +
      "?response_type=token" +
      "&client_id=" +
      dropboxClientId +
      "&redirect_uri=" +
      encodeURIComponent(redirectHomeUrl);
      window.location.href = authUrl;
  }


// Step 3: Handle redirect from Dropbox auth page
console.log('window.location.pathname', window.location.pathname)

if (window.location.pathname === "http://localhost:3000/testRoute/index.html") {
  const hashParams = new URLSearchParams(window.location.hash.substr(1));
  const accessToken = hashParams.get("access_token");

  // save token to local storage
  localStorage.setItem("access_token", accessToken);
  if (accessToken) {
    // Send the access token back to the auth tab
    chrome.runtime.sendMessage({ token: accessToken });
    // Close this tab
    window.close();
  }
}



//! Step 2:  Create Floating the UI elements
function createUI() {
  // Create the floating element properties
  routeList.className = "query-results";
  routeList.textContent = "Route List";
  const inputContainer = document.createElement("div");
  inputContainer.className = "main-input-container";
  let getFilesBtnContainer = document.createElement("div");
  getFilesBtn.className = "button button1 getFIles";
  getFilesBtn.textContent = "Get Files";
  getFilesBtn.addEventListener("click", () => {

  })
  getFilesBtnContainer.appendChild(getFilesBtn);

  const floatingElement = document.createElement("div");
  const header = document.createElement("h1");
  header.innerText = "Floating Element";
  floatingElement.className = "box-layout slide-in-left";
  

  //create the toggle button
  let slideBtn = document.createElement("button");
    slideBtn.className="slide-btn"
    slideBtn.textContent = "Toggle Slide"
    slideBtn.addEventListener('click', () => {
     
        floatingElement.classList.toggle('slide-out-left');
        slideBtn.classList.toggle('toggleBtn')
      });

  inputField1.id = "myInputField1";
  inputField1.type = "text";
  inputField1.placeholder = "Student number";

  inputField2.id = "myInputField2";
  inputField2.type = "text";
  inputField2.placeholder = "Task name / PDF name";

  floatingElement.prepend(slideBtn);
  floatingElement.appendChild(header);
  inputContainer.appendChild(inputField1);
  inputContainer.appendChild(inputField2);
  
  inputContainer.appendChild(getFilesBtnContainer);
  inputContainer.appendChild(routeList);
  floatingElement.appendChild(inputContainer);


  document.body.appendChild(floatingElement);

  // Call function to get page values and update UI elements

  extractStudentNumber() //! Step 2.1 : Call function to "Extract the student number"
}


//! Extracts the task name from the page elements
function extractTaskName(studentNumber) {
  // Find all h6 elements containing the word "Task"
  let h6Tags = [...document.querySelectorAll("h6")].filter((task) =>
    task.textContent.includes("Task")
  );

  // Loop through each h6 element and extract the text after "-"
  h6Tags.forEach((task) => {
    const text = task.textContent.trim();
    const index = text.indexOf("-") + 1;

    let result;

    // If the text contains "-", extract the text after "-" and check if it contains ":"
    if (index !== 0) {
      result = text.substring(index).trim();

      // If the result contains ":", extract the text after the last ":" instead
      if (result.includes(":")) {
        const lastIndex = result.lastIndexOf(":") + 1;
        result = result.substring(lastIndex).trim();
      }
    }

    inputField2.value = result;
    filesSearch(studentNumber, result)
  });
}

//! Extract the student number from the page elements
function extractStudentNumber() {
  // Select all h6 elements on the page
  const h6Element = [...document.querySelectorAll("h6")].filter((task) =>
  task.textContent.includes("Student number")
)
    const studentNumber = h6Element[0]?.textContent?.split(":")[1].trim();
    inputField1.value = studentNumber;

    extractTaskName(studentNumber); //! Step 2.1 :  Call function to "Extracts the task name"
}


//! Step 3 Find a specific file by name - Display results
//if more then one root folder exists for example "myFolder and myFolder (1)...",
//first search for my myFolder, then using an incrementor to control the value
//between the brackets, and making up to 3 searches each time adding its results to the UI

async function filesSearch(studentNumber, taskName) {
  let inc = 0;
  let retry = inc;
  const query = taskName;
  const path = inc > 0 ? studentNumber + ` (${retry})` : studentNumber;

  // Call the Dropbox API to search for a file
  await dbx.filesSearchV2({
      query: query,
      options: {
        path: "/" + path,
        //file_extensions: [".pdf"],
        max_results: 5,
      },
    })
    .then(function (response) {
      //loadingImage.style.display = "none";
      //wait(2000).then(()=> buttonContainer.removeChild(loadingImage))
      //inc++; //after 1rst request look for a 2nd folder
      let results = response.result.matches;
      console.log('results', results)

      // //if results are 0 and we did 3 searches already? stop
      // if (results.length === 0 && inc >= 3) {
      //   currentRouteUI.innerHTML = `No files files with name ${fileName} was found`;
      //   return;
      // } else {
      //   if (!foundFiles) {
      //     //foundFiles = true;

      //     results.forEach((item, i) => {
      //       console.log('item', item)
      //       let btnAndListContainer = document.createElement("div");
      //       btnAndListContainer.className = "btnAndListContainer";
      //       let foundRes = document.createElement("p");
      //       foundRes.textContent = item.metadata.metadata.path_display;

      //       let dlIcon = document.createElement("img");
      //       let linkIcon = document.createElement("img");
      //       linkIcon.title = "Open Folder in dropbox";
      //       linkIcon.src = "./images/externalLink.png";
      //       const lastIndex = item.metadata.metadata.path_display.lastIndexOf("/");
      //       const folderPath = item.metadata.metadata.path_display.substring(0, lastIndex);
      //       //linkIcon.href = createExternalLink(folderPath)
      //       let type = document.createElement("img");
      //       type.alt = item.metadata.metadata.name;
      //       dlIcon.src = "./images/dlFolder.png";
      //       dlIcon.alt = "dl-icon";
      //       dlIcon.className = "dl-icon-list";
      //       dlIcon.title =
      //         "Download " +
      //         item.metadata.metadata.name
      //           .slice(0)
      //           .substring(item.metadata.metadata.name.lastIndexOf("/") + 1);
      //       dlIcon.addEventListener("click", async (e) => {
      //         loadingImage.style.display = "block";
      //         e.stopPropagation(); //prevent the route from being selected
      //         //! Download selected Folder or file
      //         downloadFolder(item.metadata.metadata); //folder
      //       });

      //       btnAndListContainer.appendChild(dlIcon);
      //       btnAndListContainer.appendChild(linkIcon);
      //       btnAndListContainer.appendChild(foundRes);
      //       resultsContainer.appendChild(btnAndListContainer);
      //     });
      //     loadingImage.style.display = "none";
      //     highlightInputName(inputQueryFile.value)
      //     //look in 2nd and 3rd folder
      //     if (inc >= 3) {
      //       return;
      //     }
      //     filesSearch(retry);
      //   }
      // }
    })
    .catch(function (error) {
      console.error(error.error);
    });

}
