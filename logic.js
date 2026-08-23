 const categories = document.querySelectorAll(".category"); 

let selectedCategory = "all";

 //CATEGORY FILTER
categories.forEach(category => { category.addEventListener("click", function () { //Remove active from all 
  categories.forEach(c => { c.classList.remove("active"); });
  //Activate clicked category
this.classList.add("active"); selectedCategory = this.dataset.category; filterItems(); });  }); 



const categoryButtons = document.querySelectorAll(".category");
const categoryOverlay = document.getElementById("categoryOverlay");
const categoryHeading = document.getElementById("categoryHeading");
const categoryContent = document.getElementById("categoryContent");
const closeCategory = document.getElementById("closeCategory");

categoryButtons.forEach(category => {

    category.addEventListener("click", function () {

        const categoryName = this.textContent.trim();

        // Display clicked category as heading
        categoryHeading.textContent = categoryName;

        // Example content
        categoryContent.innerHTML = `
            <p>
                Browse content available under
                <strong>${categoryName}</strong>.
            </p>
        `;

        // Open overlay
        categoryOverlay.classList.add("show");
      

    });

});


// Close button
if (closeCategory) {
    closeCategory.addEventListener("click", function () {
        categoryOverlay.classList.remove("show");
    });
}


// Close when clicking outside the popup
if (categoryOverlay) {
    categoryOverlay.addEventListener("click", function () {
        categoryOverlay.classList.remove("show");
    });
}


// Prevent popup itself from closing
const categoryPopup = document.querySelector(".category-popup");

if (categoryPopup) {
    categoryPopup.addEventListener("click", function (e) {
        e.stopPropagation();
    });
}







document.addEventListener("click", function(e) {

    // Mentor dropdown
    const toggle = e.target.closest(".mega-col .top-item");

    if (toggle) {
        e.stopPropagation();

        const li = toggle.closest("li");

        if (li) {
            li.classList.toggle("expanded");
        }

        return;
    }


    // Course submenu selection
    const btn = e.target.closest(".submenu button");

    if (btn) {
        e.stopPropagation();

        btn.classList.toggle("selected");
      
    }

});



