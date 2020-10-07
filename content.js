chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action" ) {
            var firstHref = $("a[href^='http']").eq(0).attr("href");
    
            console.log(firstHref);
        }
    }
);

let anchors = document.querySelectorAll("a");

anchors.forEach((anchor) => {
    anchor.addEventListener("mouseover", async ( event ) => {
        var theTarget = event.currentTarget;
        
        /* document.querySelectorAll("a.link-previewed").forEach(e => {
            let link_preview_wrapper = e.getElementsByClassName("lp-link-info-wrapper");

            e.removeChild(link_preview_wrapper[0]);
            e.classList.remove("link-previewed");
        }); */

        if(!theTarget.classList.contains("link-previewed") && !/(^mailto:|^tel:)/.test(theTarget.href)) {
            let link_preview_wrapper = document.createElement("div");
            
            let link_preview_res = await fetch(`https://api.microlink.io/?url=${theTarget.href}&screenshot=true`);
            let link_preview_data = await link_preview_res.json();
            link_preview_data = link_preview_data.data;
            
            link_preview_wrapper.setAttribute("class", "lp-link-info-wrapper");
            link_preview_wrapper.innerHTML = `
                <figure class="lp-link-info-header"><img src="${link_preview_data.screenshot.url}" alt="${link_preview_data.title}"></figure>
                <div class="lp-link-info">
                    <h4 class="lp-link-title">${link_preview_data.title}</h4>
                    <div class="lp-link-url">
                        <p class="lp-link-url-text" id="lp-link-url-text">${link_preview_data.url}</p>
                        <div class="lp-link-actions">
                            <span id="lp-visit-link" data-href="${link_preview_data.url}" target="_h" title="visit - ${link_preview_data.url}" >
                                <figure>
                                    <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/external-link.svg" alt="visit - ${link_preview_data.url}"/>
                                </figure>
                            </span>
                            <span id="lp-copy-link" title="copy - ${link_preview_data.url}">
                                <figure>
                                    <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/copy.svg" alt="copy - ${link_preview_data.url}"/>
                                </figure>
                            </span>
                        </div>
                    </div>
                    <p class="lp-link-description">${link_preview_data.description}</p>
                </div>`;

            theTarget.appendChild(link_preview_wrapper);
            theTarget.classList.add("link-previewed");

            document.getElementById("lp-copy-link").onclick = (e) => {
                let currentLink = e.currentTarget;
                let href = e.currentTarget.dataset.href;

                window.open(href, '_blank');


            }

            document.getElementById("lp-copy-link").onclick = (e) => {
                let lpLinkUrl = document.getElementById("lp-link-url-text");
                let range = document.createRange();

                range.selectNode(lpLinkUrl);

                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);

                document.execCommand("copy");
                console.log("copied: "+lpLinkUrl.textContent);

                window.getSelection().removeAllRanges();

                return false;
            };
        }
    
    }, false);

    /* anchor.addEventListener("mouseout", ( event ) => {
        var theTarget = event.currentTarget;
    
        if(theTarget.classList.contains("link-previewed")) {
            let link_preview_wrapper = document.getElementsByClassName("lp-link-info-wrapper");

            theTarget.removeChild(link_preview_wrapper[0]);
            theTarget.classList.remove("link-previewed");
        }
    
    }, false); */
});

