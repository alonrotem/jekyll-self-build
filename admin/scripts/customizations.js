var travisBuildStatusImageId = "travisBuildStatus";
var triggerBuildLiID = "triggerBuildLi";
var triggerBuildButtonID = "triggerBuildButton";
var buildStatusNotificationElementId = "buildStatusNotificationElement";
var travisCheckIntervalMSec = 7000;
var travisRepoId = "7843148";
var offlineImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAUCAYAAAAN+ioeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNWRHWFIAAAQxSURBVFhH3Zi5ThxBEIYHeAAgIYCIgASBTMqRIAQCxH3fJOQ8AeISMTeBJTIEC2gjLgkh4xfgjrE5BAGIY80RcJXnL22PemdrJGZHmMUt/arurt7q6m+KnrGNpqam5M7OTl9HR8eFacm0BKv0GWMyjP9K9d9zsgzzYH4cLpokJetWb6YuUlJoenqaTk9P6ezsjGZmZug8NZVeY2LYr1v7nBTTi4z29vaAKYomSYm6FSAfHh7SysoKvb6+0tvbG62trdHx8TGdpqXRS2ysBVhJn5NiepHR1tZG0SYpUbdCJS8vLzM81QBwdnaW/H6/BVRJQT7IzaXVri4xphcZra2tpIRDRsNYStStcF2gkhVgCO3p6Ynu7u6sOSikks12fX0txvQio6WlhZyEZA8ODkSfk6ampujq6oqt3rev29zcZN/Q0FCYT0rUrXAn47pA0yEC/v39vTUHyIHERLqLj7fW3NzciDG9yGhububDSRb32e7urqNfso2NjVRaWsp2cnKSLi8v2drXbWxssG9wcDAsjpSoW+HFhztZwUNDf25ujq8UBdnuR/sQ0ObnHTlJgZZ879HExATDhLX7FOiBgYEwn5SoW+HrAvnjTsZ1gUr2+Xx0cnJCvzIywq4LNMyhfQhoVB4OJ1kkGggEeHM0/KkDDCoUfVisw8sF6zAGVPhgddBq3fPzczAahYDW95USdSsAxNcF9sSdjOsClawgA/rP+nqxorkJMb3IaGhoIAgHVH01BuijoyPKy8uj7u5uBrO/v09jY2Pch8XahYUFur295bHyjY+Ph6wD7MfHR/7cQrylpSX29ff3h+0vJepW+BbWq1bJ6bpA0/tSTC8y6s2nisNJFqB3dnZ4XFdXR9vb2zynA8Q6CbS9v7i4SOfn59TT08Px1tfX2dfX1xe2r5SoWymwSgD8w7z//yQkhABV1wWaPi/F9CIGDYiSRTXjjlZjQAfo0dFRhgSL+fn5eQaNsQ5XX4eHAdAAi3g6aPu+UqJupf+LD/qdnh4k6FzFel+K6UVGbW0tH1CyAA24GAPcw8MDv8kBDmABD+v29vbYh/mRkREGCKuDHh4etn6DeHiA8PX29obtKyUaiRTkl7g4OszMDBJ0hqtXtxTPixh0TU0NH1BJjQFab1tbW1ReXk5VVVXcVw2VCoiAq4PW+9XV1bS6uhr8BfHLU4G27y8lGokURBSBDtrputD7UjwvMgAAB5VsUVERZWdnU05ODtuSkhLLX1xcbM0XFhZSfn4+P4DKykoqKChgizH6sPhdWVmZFQ/rlc++r5RoJOL/HAq291T0h4NWUkA+eywlGol0cE6gper+kO9oVXnRZKVEI5Fe0ddJScFeKGh9jd6X4nkRQAcqKir4gE76134p0a8uwzykHwfFSy5arJToVxdAJ5uH85m6wCGjQVKiX1mlw9+y/gK7pr3LgKUYRAAAAABJRU5ErkJggg==";
var isPublishingInProgress = false;
var travisTriggerPublishingBranch = "work";
var travisTriggerPublishingMessage = "Manual build triggered by admin panel";

(async function () {
    //Wait for the nav bar to appear
    var attempt = 0;
    var maxAttempts = 20;
    while (!document.querySelector("nav ul li") && attempt < maxAttempts) {
        await new Promise(r => { attempt++; setTimeout(r, 500); });
    }
    var nav = document.getElementsByTagName("nav");
    var header = document.getElementsByTagName("header");
    if (nav.length > 0) {
        var navUL = nav[0].getElementsByTagName("ul");
        if (navUL.length > 0) {
            var gotoGithubLi = document.createElement("li");
            gotoGithubLi.setAttribute("style", "margin:auto");
            gotoGithubLi.innerHTML = "<a href=\"https://github.com/literaturnirazgovori/literaturnirazgovori.github.io\" target=\"_blank\" id=\"lnkGotoSite\" title=\"Go to Github\" style=\"padding: 16px 0px;color: blue;\"><span style=\"display: inline-block;line-height: 0;width: 24px;height: 24px; margin: 0px 10px;\"><img src=\"images/github.png\"></span></a>";
            navUL[0].prepend(gotoGithubLi);

            var gotoSiteLi = document.createElement("li");
            gotoSiteLi.setAttribute("style", "margin:auto");
            gotoSiteLi.innerHTML = "<a href=\"/\" target=\"_blank\" id=\"lnkGotoSite\" title=\"Open site\" style=\"padding: 16px 0px;color: blue;\"><span style=\"display: inline-block;line-height: 0;width: 24px;height: 24px; margin: 0px 10px;\"><img src=\"/assets/images/logo-book.png\"></span><!--Go to site &#8640;--></a>";
            navUL[0].prepend(gotoSiteLi);

            var travisStatusLi = document.createElement("li");
            travisStatusLi.setAttribute("style", "margin:auto");
            var a = document.createElement("a");
            a.setAttribute("href", "https://travis-ci.com/literaturnirazgovori/literaturnirazgovori.github.io");
            a.setAttribute("target", "_blank");
            var img = document.createElement("img");
            img.setAttribute("src", "https://travis-ci.com/literaturnirazgovori/literaturnirazgovori.github.io.svg?branch=work");
            img.setAttribute("id", travisBuildStatusImageId);
            travisStatusLi.appendChild(a);
            a.appendChild(img);
            navUL[0].appendChild(travisStatusLi);

            var triggerBuildLi = document.createElement("li");
            triggerBuildLi.setAttribute("id", triggerBuildLiID);
            triggerBuildLi.innerHTML = "<a href=\"#\" id=\"" + triggerBuildButtonID + "\" title=\"Click to manually trigger a re-publishing/deployment of the site\"><img src='images/republish.png'/><span class=\"customActionText\" id=\"republishMsg\">Republish!</span></a>";
            navUL[0].appendChild(triggerBuildLi);

            var triggerBuildButton = document.getElementById(triggerBuildButtonID);
            triggerBuildButton.addEventListener("click", triggerRepublish);
        }
    }
    if (header.length > 0) {
        header[0].style.marginBottom = "40px";
        var notificationHeader = document.createElement("div");
        notificationHeader.setAttribute("id", buildStatusNotificationElementId);
        header[0].appendChild(notificationHeader);
    }
    if ((nav.length > 0) && (header.length > 0)) { getTravisStatus(); }
})();

function triggerRepublish() {
    if (!isPublishingInProgress) {
        var doTrigger = confirm("This will trigger a re-publishing.\nContinue?");
        if (doTrigger) {
            publishingInProgress(true);
            var travisApiRequest = new XMLHttpRequest();
            var url = "https://api.travis-ci.com/repo/" + travisRepoId + "/requests";
            travisApiRequest.open("POST", url);
            travisApiRequest.setRequestHeader("Travis-API-Version", "3");
            travisApiRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            travisApiRequest.setRequestHeader("Authorization", "token y1piqC-JCM4woaM1h5imyQ");
            travisApiRequest.send(JSON.stringify({
                "request": {
                    "message": travisTriggerPublishingMessage,
                    "branch": travisTriggerPublishingBranch
                }
            }));
        }
    }
}

function publishingInProgress(isInProgress) {
    if (isPublishingInProgress != isInProgress) {
        isPublishingInProgress = isInProgress;
        var triggerBuildButton = document.getElementById(triggerBuildButtonID);
        var republishMsg = document.getElementById("republishMsg");
        if (isInProgress) {
            triggerBuildButton.className = "publishingInProgress";
            republishMsg.innerText = "Publishing in progress..."
            triggerBuildButton.title = "Site re-publishing/deployment is in progress. Please wait.";
        }
        else {
            triggerBuildButton.className = "";
            republishMsg.innerText = "Re-publish!"
            triggerBuildButton.title = "Click to manually trigger a re-publishing/deployment of the site.";
        }
    }
}

function getTravisStatus() {
    var travisBuildStatusImg = document.getElementById(travisBuildStatusImageId);
    var notificationHeader = document.getElementById(buildStatusNotificationElementId);
    var imageSrc = travisBuildStatusImg.getAttribute("src");
    var url = "https://api.travis-ci.com/repo/" + travisRepoId + "/builds?limit=1&sort_by=finished_at:desc";

    var travisApiRequest = new XMLHttpRequest();
    travisApiRequest.ontimeout = function () {
        showError("The request for " + url + " timed out.");
    };
    travisApiRequest.onload = function () {
        if (travisApiRequest.readyState === 4) {
            if (travisApiRequest.status === 200) {
                var response = JSON.parse(travisApiRequest.responseText);
                if (response.builds && response.builds.length > 0) {
                    var buildInfo = response.builds[0];
                    var commitMessage = buildInfo.commit.message;
                    var finishedAt = buildInfo.finished_at;
                    var state = buildInfo.state;
                    publishingInProgress((state == "created") || (state == "started"));
                    var createdBy = buildInfo.created_by.login;
                    console.log("Build \"" + commitMessage + "\", State: " + state + ". Finished: " + finishedAt);
                    var statusImage = "images/build-" + state + ".png";

                    var whichBuild = ((state == "created") || (state == "started")) ? "Running" : "Last";
                    var finished = (finishedAt) ? ("<b>[Finished at:</b> " + finishedAt + ", ") : "<b>[</b>";
                    var notificationHeaderClassName = "build-" + state;
                    var notificationHeaderContent =
                        "<div class=\"infoleft\"><b>" + whichBuild + " publishing:</b> \"<em>" + commitMessage + "</em>\"</div><div class=\"inforight\">" + finished + "<b>Run by</b> " + createdBy + "<b>]</b></div>";
                    updateUI(statusImage, notificationHeaderClassName, notificationHeaderContent);
                }
            } else {
                showError(travisApiRequest.statusText);
            }
        }
    };
    travisApiRequest.open("GET", url, true);
    travisApiRequest.setRequestHeader("Travis-API-Version", "3");
    travisApiRequest.setRequestHeader("Authorization", "token y1piqC-JCM4woaM1h5imyQ");
    travisApiRequest.timeout = 5000;
    travisApiRequest.onerror = function () {
        showError();
    };
    function showError(err) {
        var notificationContent = "<div class=\"infoleft\">Failed to get data. You may be offline.</div>";
        updateUI(offlineImg, "build-unknown", notificationContent, err);
    }
    function updateUI(statusImage, notificationHeaderClassName, notificationHeaderContent, err) {
        if (err) { console.error(err); }
        if (imageSrc != statusImage) {
            travisBuildStatusImg.setAttribute("src", statusImage);
        }
        if (notificationHeader.className != notificationHeaderClassName) {
            notificationHeader.className = notificationHeaderClassName;
        }
        if (notificationHeader.innerHTML != notificationHeaderContent) {
            notificationHeader.innerHTML = notificationHeaderContent;
        }
        setTimeout(function () { getTravisStatus() }, travisCheckIntervalMSec);
    }
    travisApiRequest.send(null);
}