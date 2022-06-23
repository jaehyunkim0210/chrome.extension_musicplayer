// Initialize button with user's preferred color
let getList = document.getElementById("getList");
let checkboxList = document.getElementById("checkboxList")
let checkedPlayList = [];
let interval;
let start_button = document.getElementById("start");
let stop_button = document.getElementById("stop");

start_button.addEventListener("click",async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func : music_start,
    args : [checkedPlayList]
  });
});

stop_button.addEventListener("click",async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func : music_stop
  });
});
function music_stop(){
  clearInterval(interval);

}
function music_start(checkedPlayList){
  let playButton = document.getElementsByClassName("ytp-play-button ytp-button")[0];
  if(playButton.title == "재생(k)"){
    playButton.click();
  }
   interval = setInterval(()=>{

    let title = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].innerText;
    console.log(title);
    if(checkedPlayList.indexOf(title) == -1){
      document.getElementsByClassName("ytp-next-button ytp-button")[0].click();
    }
    
  },2000);
};

// When the button is clicked, inject setPageBackgroundColor into current page
getList.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getPlaylist,
  },(data)=>{
    let listArray = data[0].result;
    for(i=0; i < listArray.length; i++){
      var newInput = document.createElement("input");
      newInput.setAttribute("type", "checkbox");
      newInput.setAttribute("value", listArray[i]);
      newInput.addEventListener("click",setPlaylist);
      
      var newPlaylist = document.createElement("li");
      newPlaylist.appendChild(newInput);
  
      var title = document.createTextNode(listArray[i] );
      newPlaylist.appendChild(title);
  
      var playlist = document.querySelector("#checkboxList");
      playlist.appendChild(newPlaylist);
    }

  });
  
});
function setPlaylist(e) {
  if(e.target.checked){
    checkedPlayList.push(e.target.defaultValue);
  }  
  else{
    checkedPlayList.splice(checkedPlayList.indexOf(e.target.defaultValue));
  }
  console.log(checkedPlayList);
}

// The body of this function will be executed as a content script inside the
// current page
function getPlaylist() {
  let videolist = document.querySelectorAll("#wc-endpoint #video-title");
  let list = [];
  for (let i = 0; i < videolist.length; i++){
    list.push(videolist[i].title.toString());
  }
  return list;
}
