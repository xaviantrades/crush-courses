import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
    import {
        getFirestore,
        collection,
        getDocs,
        query,
        orderBy
    } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

    // ==========================================
    // FIREBASE CONFIG
    // ==========================================
    const firebaseConfig = {
        apiKey: "AIzaSyCywqYls2mJfY9maHRhsHRTP6OmPgC1Kf0",
        authDomain: "x-shopping-6611d.firebaseapp.com",
        projectId: "x-shopping-6611d",
        storageBucket: "x-shopping-6611d.firebasestorage.app",
        messagingSenderId: "177602183210",
        appId: "1:177602183210:web:011c708002426b37cb8353",
        measurementId: "G-QKLP9H1N9P"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

// ======================================================
// STANDALONE HTML CREATION FUNCTION
// ======================================================
const browseBtn = document.getElementById('browseBtn');
const mega = document.getElementById('megaMenu');
const coursesList = document.getElementById('coursesList');

function closeMegaAndShowCourses() {
  mega.classList.remove('open');
  browseBtn.setAttribute('aria-expanded', 'false');
  coursesList.style.display = 'block';
}

function saveCourseData(data) {

    const courseData = {
        title: data.title,
        mentor: data.mentor
    };

    sessionStorage.setItem(
        "selectedCourse",
        JSON.stringify(courseData)
    );
}

function clearCoursesList() {
    const coursesList = document.getElementById("coursesList");

    coursesList.innerHTML = "";
}

function createCourseHTML(data, docId = "") {

    const coursesList = document.getElementById("coursesList");

    if (!coursesList) {
        console.error('Element with id="coursesList" was not found.');
        return;
    }

    if (!data) {
        console.error("createCourseHTML: data is missing.");
        return;
    }

    const card = document.createElement("article");
    card.className = "card";
  


    card.innerHTML = `
        ${
            data.imgurl
                ? `
                    <div class="thumb">
                        <img
                            src="${data.imgurl}"
                            alt="${data.title || "Course"}"
                        >
                    </div>
                `
                : `
                    <div class="thumb" aria-hidden="true"></div>
                `
        }

        <div class="stamp">
            <span class="n">${data.rating || "4.8"}</span>
            <span class="s">${data.rated || "0"} RATED</span>
        </div>

        <div class="card-body">

            <div class="card-tags">
                <span class="tag free">
                    ${data.style || "Free"}
                </span>

                <span class="tag">
                    ${data.type || "Video"}
                </span>

                <span class="tag">
                    ${data.timeframe || "All Time frames"}
                </span>
            </div>

            <h3 class="course-title">
                ${data.title || "Untitled Course"}
            </h3>

            <p class="blurb">
                ${data.description || "No description provided."}
            </p>

            <div class="mentor-row">

                <span class="mentor-name">
                    ${data.mentor || "Unknown"}

                    <span class="doc-id">
                        ${docId}
                    </span>
                </span>

                <a class="view-link" href="course-access.html">
                    View →
                </a>

            </div>

        </div>
    `;

coursesList.appendChild(card);
  
  const viewLink = card.querySelector(".view-link");

viewLink.addEventListener("click", function () {

    sessionStorage.setItem("selectedCourse", JSON.stringify({
        title: data.title || "Untitled Course",
        mentor: data.mentor || "Unknown"
    }));

});
}

    // ==========================================
    // FETCH AND DISPLAY FUNCTION
    // ========================

async function fetchCourses() {
    const coursesRef = collection(db, "courses");

    const q = query(
        coursesRef,
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const courses = [];

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        courses.push({
            id: docSnap.id,
            ...data
        });
    });

    // Shuffle (Fisher-Yates)
    for (let i = courses.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [courses[i], courses[j]] = [courses[j], courses[i]];
    }

    return courses;
}





// ==========================================
// LOAD ALL HOMEPAGE COURSES
// ==========================================


const mydata = await fetchCourses();
console.log(mydata);

mydata.forEach(course => {
    createCourseHTML(course);
});



// ==========================================
// LOAD MENTORS
// ==========================================


const mentorCourses = [...new Set(
    mydata
        .map(course => course.mentor)
        .filter(Boolean)
)];

console.log(mentorCourses);


const mentorList = document.querySelector(".mega-col > ul");

mentorList.innerHTML = "";

mentorCourses.forEach(mentor => {

    const li = document.createElement("li");

    const button = document.createElement("button");
    button.className = "top-item";
    button.innerHTML = `
        ${mentor}
        <span class="chev" aria-hidden="true">›</span>
    `;

    const submenu = document.createElement("ul");
    submenu.className = "submenu";

    li.appendChild(button);
    li.appendChild(submenu);

    const mentorList = document.querySelector(".mega-col > ul");

mentorList.innerHTML = "";

mentorCourses.forEach(mentor => {

    const li = document.createElement("li");

    const button = document.createElement("button");
    button.className = "top-item";

    button.innerHTML = `
        ${mentor}
        <span class="chev" aria-hidden="true">›</span>
    `;

    const submenu = document.createElement("ul");
    submenu.className = "submenu";

    li.appendChild(button);
    li.appendChild(submenu);

    button.addEventListener("click", function(e) {
    e.stopPropagation();

    li.classList.toggle("expanded");

    const matchingCourses = mydata.filter(
        course => course.mentor === mentor
    );

    submenu.innerHTML = "";

    matchingCourses.forEach(course => {

        const courseItem = document.createElement("li");

        courseItem.textContent = course.title;

        submenu.appendChild(courseItem);

        courseItem.addEventListener("click", function(e) {
            e.stopPropagation();
          clearCoursesList();
            createCourseHTML(course);
          
           closeMegaAndShowCourses();
        });

    });
});
    mentorList.appendChild(li);
});

    mentorList.appendChild(li);
});





// ==========================================
// LOAD LEVELS
// ==========================================

const levelCourses = [...new Set(
    mydata
        .map(course => course.level)
        .filter(Boolean)
)];

console.log(levelCourses);


// Level list container
const levelList = document.getElementById("levell");

if (levelList) {

    // Remove Loading...
    levelList.innerHTML = "";

    levelCourses.forEach(level => {

        // Parent <li>
        const li = document.createElement("li");

        // Level button
        const button = document.createElement("button");
        button.className = "top-item";

        button.innerHTML = `
            ${level}
            <span class="chev" aria-hidden="true">›</span>
        `;

        // Submenu for this level
        const submenu = document.createElement("ul");
        submenu.className = "submenu";

        li.appendChild(button);
        li.appendChild(submenu);

        // ==========================================
        // LEVEL CLICK
        // ==========================================

        button.addEventListener("click", function(e) {

            e.stopPropagation();

            // Open / close this level
            li.classList.toggle("expanded");

            // Get courses belonging to this level
            const matchingCourses = mydata.filter(
                course => course.level === level
            );

            // Clear previous courses
            submenu.innerHTML = "";

            // Create course list
            matchingCourses.forEach(course => {

                const courseItem = document.createElement("li");

                courseItem.textContent = course.title;

                submenu.appendChild(courseItem);

                // ==========================================
                // COURSE CLICK
                // ==========================================

                courseItem.addEventListener("click", function(e) {

                    e.stopPropagation();

                    // Create/display the selected course
                    clearCoursesList();
                  createCourseHTML(course);
                  
  closeMegaAndShowCourses();
                });

            });

        });

        // Add level to the Level list
        levelList.appendChild(li);

    });
}



// ==========================================
// LOAD STYLES
// ==========================================

const styleCourses = [...new Set(
    mydata
        .map(course => course.style)
        .filter(Boolean)
)];

console.log(styleCourses);


// Style list container
const styleList = document.getElementById("style");

if (styleList) {

    // Remove Loading...
    styleList.innerHTML = "";

    styleCourses.forEach(style => {

        // Parent <li>
        const li = document.createElement("li");

        // Style button
        const button = document.createElement("button");
        button.className = "top-item";

        button.innerHTML = `
            ${style}
            <span class="chev" aria-hidden="true">›</span>
        `;

        // Submenu for this style
        const submenu = document.createElement("ul");
        submenu.className = "submenu";

        li.appendChild(button);
        li.appendChild(submenu);


        // ==========================================
        // STYLE CLICK
        // ==========================================

        button.addEventListener("click", function(e) {

            e.stopPropagation();

            // Open / close this style
            li.classList.toggle("expanded");

            // Get courses belonging to this style
            const matchingCourses = mydata.filter(
                course => course.style === style
            );

            // Clear previous courses
            submenu.innerHTML = "";


            // Create course list
            matchingCourses.forEach(course => {

                const courseItem = document.createElement("li");

                courseItem.textContent = course.title;

                submenu.appendChild(courseItem);


                // ==========================================
                // COURSE CLICK
                // ==========================================

                courseItem.addEventListener("click", function(e) {

                    e.stopPropagation();

                    // Create/display the selected course
                   clearCoursesList();
                  createCourseHTML(course);
                  closeMegaAndShowCourses();

                });

            });

        });


        // Add style to the Style list
        styleList.appendChild(li);

    });

}


// ==========================================
// LOAD ENTITIES
// ==========================================

const entityCourses = [...new Set(
    mydata
        .map(course => course.entity)
        .filter(Boolean)
)];

console.log(entityCourses);


// Entity list container
const entityList = document.getElementById("entity");

if (entityList) {

    // Remove Loading...
    entityList.innerHTML = "";

    entityCourses.forEach(entity => {

        // Parent <li>
        const li = document.createElement("li");

        // Entity button
        const button = document.createElement("button");
        button.className = "top-item";

        button.innerHTML = `
            ${entity}
            <span class="chev" aria-hidden="true">›</span>
        `;

        // Submenu for this entity
        const submenu = document.createElement("ul");
        submenu.className = "submenu";

        li.appendChild(button);
        li.appendChild(submenu);

        // ==========================================
        // ENTITY CLICK
        // ==========================================

        button.addEventListener("click", function(e) {

            e.stopPropagation();

            // Open / close this entity
            li.classList.toggle("expanded");

            // Get courses belonging to this entity
            const matchingCourses = mydata.filter(
                course => course.entity === entity
            );

            // Clear previous courses
            submenu.innerHTML = "";

            // Create course list
            matchingCourses.forEach(course => {

                const courseItem = document.createElement("li");

                courseItem.textContent = course.title;

                submenu.appendChild(courseItem);

                // ==========================================
                // COURSE CLICK
                // ==========================================

                courseItem.addEventListener("click", function(e) {

                    e.stopPropagation();

                    // Create/display the selected course
                  clearCoursesList();
                  createCourseHTML(course);
                  closeMegaAndShowCourses();

                });

            });

        });

        // Add entity to the Entity list
        entityList.appendChild(li);

    });
}

// ==========================================
// LOAD FILES
// ==========================================

const fileCourses = [...new Set(
    mydata
        .map(course => course.file)
        .filter(Boolean)
)];

console.log(fileCourses);


// File list container
const fileList = document.getElementById("file");

if (fileList) {

    // Remove Loading...
    fileList.innerHTML = "";

    fileCourses.forEach(file => {

        // Parent <li>
        const li = document.createElement("li");

        // File button
        const button = document.createElement("button");
        button.className = "top-item";

        button.innerHTML = `
            ${file}
            <span class="chev" aria-hidden="true">›</span>
        `;

        // Submenu for this file
        const submenu = document.createElement("ul");
        submenu.className = "submenu";

        li.appendChild(button);
        li.appendChild(submenu);

        // ==========================================
        // FILE CLICK
        // ==========================================

        button.addEventListener("click", function(e) {

            e.stopPropagation();

            // Open / close this file
            li.classList.toggle("expanded");

            // Get courses belonging to this file
            const matchingCourses = mydata.filter(
                course => course.file === file
            );

            // Clear previous courses
            submenu.innerHTML = "";

            // Create course list
            matchingCourses.forEach(course => {

                const courseItem = document.createElement("li");

                courseItem.textContent = course.title;

                submenu.appendChild(courseItem);

                // ==========================================
                // COURSE CLICK
                // ==========================================

                courseItem.addEventListener("click", function(e) {

                    e.stopPropagation();

                    // Create/display the selected course
                   clearCoursesList();
                  createCourseHTML(course);
                  closeMegaAndShowCourses();

                });

            });

        });

        // Add file to the File list
        fileList.appendChild(li);

    });
}

// ==========================================
// LOAD TIMEFRAMES
// ==========================================

const timeframeCourses = [...new Set(
    mydata
        .map(course => course.timeframe)
        .filter(Boolean)
)];

console.log(timeframeCourses);


// Timeframe list container
const timeframeList = document.getElementById("timeframe");

if (timeframeList) {

    // Remove Loading...
    timeframeList.innerHTML = "";

    timeframeCourses.forEach(timeframe => {

        // Parent <li>
        const li = document.createElement("li");

        // Timeframe button
        const button = document.createElement("button");
        button.className = "top-item";

        button.innerHTML = `
            ${timeframe}
            <span class="chev" aria-hidden="true">›</span>
        `;

        // Submenu for this timeframe
        const submenu = document.createElement("ul");
        submenu.className = "submenu";

        li.appendChild(button);
        li.appendChild(submenu);

        // ==========================================
        // TIMEFRAME CLICK
        // ==========================================

        button.addEventListener("click", function(e) {

            e.stopPropagation();

            // Open / close this timeframe
            li.classList.toggle("expanded");

            // Get courses belonging to this timeframe
            const matchingCourses = mydata.filter(
                course => course.timeframe === timeframe
            );

            // Clear previous courses
            submenu.innerHTML = "";

            // Create course list
            matchingCourses.forEach(course => {

                const courseItem = document.createElement("li");

                courseItem.textContent = course.title;

                submenu.appendChild(courseItem);

                // ==========================================
                // COURSE CLICK
                // ==========================================

                courseItem.addEventListener("click", function(e) {

                    e.stopPropagation();

                    // Create/display the selected course
                   clearCoursesList();
                  createCourseHTML(course);
closeMegaAndShowCourses();
                });

            });

        });

        // Add timeframe to the Timeframe list
        timeframeList.appendChild(li);

    });
}

// ==========================================
// LOAD RATINGS
// ==========================================

const courseRatings = [...new Set(
    mydata
        .map(course => course.rating)
        .filter(Boolean)
)];

console.log(courseRatings);


// Rating list container
const ratingList = document.getElementById("rating");

if (ratingList) {

    // Remove Loading...
    ratingList.innerHTML = "";

    courseRatings.forEach(rating => {

        // Parent <li>
        const li = document.createElement("li");

        // Rating button
        const button = document.createElement("button");
        button.className = "top-item";

        button.innerHTML = `
            ${rating}
            <span class="chev" aria-hidden="true">›</span>
        `;

        // Submenu for this rating
        const submenu = document.createElement("ul");
        submenu.className = "submenu";

        li.appendChild(button);
        li.appendChild(submenu);

        // ==========================================
        // RATING CLICK
        // ==========================================

        button.addEventListener("click", function(e) {

            e.stopPropagation();

            // Open / close this rating
            li.classList.toggle("expanded");

            // Get courses belonging to this rating
            const matchingCourses = mydata.filter(
                course => course.rating === rating
            );

            // Clear previous courses
            submenu.innerHTML = "";

            // Create course list
            matchingCourses.forEach(course => {

                const courseItem = document.createElement("li");

                courseItem.textContent = course.title;

                submenu.appendChild(courseItem);

                // ==========================================
                // COURSE CLICK
                // ==========================================

                courseItem.addEventListener("click", function(e) {

                    e.stopPropagation();

                    // Create/display the selected course
                 clearCoursesList();
                  createCourseHTML(course);
                  
closeMegaAndShowCourses();
                });

            });

        });

        // Add rating to the Rating list
        ratingList.appendChild(li);

    });
}

/*

// Get the Mentors column
const mentorColumn = document.querySelector(".mega-col");

// Find the <ul> inside the Mentors column
const mentorList = mentorColumn.querySelector("ul");

// Clear the existing hard-coded mentor items
mentorList.innerHTML = "";


// Get unique mentors
const mentors = [
    ...new Set(
        allcousre
            .map(course => course.mentor)
            .filter(mentor => mentor)
    )
];


//Create the mentor dropdowns
mentors.forEach(mentor => {

    // Main mentor <li>
    const mentorLi = document.createElement("li");

    // Mentor button
    const mentorButton = document.createElement("button");
    mentorButton.className = "top-item";
    mentorButton.innerHTML = `
        ${mentor}
        <span class="chev" aria-hidden="true">›</span>
    `;

    // Submenu
    const submenu = document.createElement("ul");
    submenu.className = "submenu";




    // Create a submenu item for each course
    // Get all courses belonging to this mentor
const mentorCourses = allcousre.filter(course =>
    course.mentor === mentor
);

// Create a submenu item for each course
mentorCourses.forEach(course => {

    const courseLi = document.createElement("li");

    const courseButton = document.createElement("button");
    courseButton.textContent = course.title || "Untitled Course";

    // Click the specific course
    courseButton.addEventListener("click", function () {

        // Display only the selected course
        renderCourseCards(
            [course],
            document.getElementById("coursesList")
        );

    });

    courseLi.appendChild(courseButton);
    submenu.appendChild(courseLi);
});


    // Put everything together
    mentorLi.appendChild(mentorButton);
    mentorLi.appendChild(submenu);

    mentorList.appendChild(mentorLi);
});

**/




// ------------------------------------------------
// ---------------------------------------------------------
// 1. Fetch + cache all courses
// ---------------------------------------------------------

let _coursesCache = null;
let _coursesCachePromise = null;

async function getCachedCourses({ forceRefresh = false } = {}) {

    if (forceRefresh) {
        _coursesCache = null;
        _coursesCachePromise = null;
    }

    if (_coursesCache) {
        return _coursesCache;
    }

    if (!_coursesCachePromise) {

        _coursesCachePromise = fetchCourses()
            .then((courses) => {

                _coursesCache =
                    Array.isArray(courses)
                        ? courses
                        : [];

                return _coursesCache;
            })
            .catch((error) => {

                _coursesCachePromise = null;

                console.error(
                    "Failed to fetch courses:",
                    error
                );

                throw error;
            });
    }

    return _coursesCachePromise;
}


// ---------------------------------------------------------
// 2. Convert all course data into searchable text
// ---------------------------------------------------------

function flattenToSearchString(
    value,
    seen = new WeakSet()
) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    // Firestore Timestamp
    if (
        typeof value === "object" &&
        typeof value.toDate === "function"
    ) {

        try {

            return value
                .toDate()
                .toLocaleDateString();

        } catch {

            return "";
        }
    }


    if (typeof value === "string") {
        return value;
    }


    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }


    if (Array.isArray(value)) {

        return value
            .map(v =>
                flattenToSearchString(
                    v,
                    seen
                )
            )
            .join(" ");
    }


    if (typeof value === "object") {

        if (seen.has(value)) {
            return "";
        }

        seen.add(value);

        return Object.values(value)
            .map(v =>
                flattenToSearchString(
                    v,
                    seen
                )
            )
            .join(" ");
    }


    return "";
}


// ---------------------------------------------------------
// 3. Build searchable text for each course
// ---------------------------------------------------------

function getSearchHaystack(course) {

    if (course.__searchHaystack) {
        return course.__searchHaystack;
    }


    const {
        id,
        __searchHaystack,
        ...rest
    } = course;


    const haystack =
        flattenToSearchString(rest)
            .toLowerCase()
            .trim();


    course.__searchHaystack =
        haystack;


    return haystack;
}


// ---------------------------------------------------------
// 4. Search courses
// ---------------------------------------------------------

function searchCourses(
    courses,
    term
) {

    const trimmed =
        String(term ?? "")
            .trim()
            .toLowerCase();


    // IMPORTANT:
    // Empty text OR spaces only = NO RESULTS
    if (!trimmed) {
        return [];
    }


    // Split multiple words
    const words =
        trimmed
            .split(/\s+/)
            .filter(Boolean);


    return courses.filter(course => {

        const haystack =
            getSearchHaystack(course);


        // Every search word must exist
        // somewhere inside the course data
        return words.every(word =>
            haystack.includes(word)
        );
    });
}


// ---------------------------------------------------------
// 5. Search controller
// ---------------------------------------------------------

function createCourseSearch({
    onResults
}) {

    const runSearch =
        async function(term) {

            try {

                const courses =
                    await getCachedCourses();


                const results =
                    searchCourses(
                        courses,
                        term
                    );


                // Console output
                console.log(
                    "Search term:",
                    term
                );

                console.log(
                    "Matching courses:",
                    results
                );


                // Update HTML
                if (
                    typeof onResults ===
                    "function"
                ) {

                    onResults(
                        results,
                        term
                    );
                }


            } catch (error) {

                console.error(
                    "Course search failed:",
                    error
                );
            }
        };


    return {

        // Search immediately
        // whenever the user types
        onInputChange(term) {

            runSearch(term);
        },


        // Initial load
        async init() {

            try {

                const courses =
                    await getCachedCourses();


                /*
                 * We deliberately do NOT
                 * display all courses here.
                 *
                 * Search starts empty,
                 * therefore HTML stays empty
                 * until the user types.
                 */

                if (
                    typeof onResults ===
                    "function"
                ) {

                    onResults(
                        [],
                        ""
                    );
                }


            } catch (error) {

                console.error(
                    "Course search initialization failed:",
                    error
                );
            }
        },


        // Refresh Firestore/cache
        async refresh() {

            try {

                const courses =
                    await getCachedCourses({
                        forceRefresh: true
                    });


                console.log(
                    "Courses refreshed:",
                    courses
                );


                if (
                    typeof onResults ===
                    "function"
                ) {

                    onResults(
                        [],
                        ""
                    );
                }


            } catch (error) {

                console.error(
                    "Course refresh failed:",
                    error
                );
            }
        }
    };
}


// ---------------------------------------------------------
// 6. Get HTML elements
// ---------------------------------------------------------

const input =
    document.getElementById(
        "courseSearchInput"
    );


const courseResults =
    document.getElementById(
        "courseResults"
    );


// ---------------------------------------------------------
// 7. Render search results into HTML
// ---------------------------------------------------------

function displaySearchResults(
    results
) {

    if (!courseResults) {

        console.warn(
            'Element "#courseResults" was not found.'
        );

        return;
    }


    // Clear old results
    courseResults.innerHTML = "";


    // No matching results
    if (!results.length) {

        courseResults.innerHTML = `
            <div class="no-results"></div>
        `;

        return;
    }


    // Create HTML for each course
    results.forEach(course => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "course-card";


        card.innerHTML = `

            <h3 class="course-title">
                ${course.title || "Untitled Course"}
            </h3>

            <p class="course-info">
                Mentor:
                ${course.mentor || "N/A"}
            </p>

        `;


        // Get the title element
        const title =
            card.querySelector(
                ".course-title"
            );


        // Click the course title
        title.addEventListener(
            "click",
            function(e) {

                e.stopPropagation();

const input = document.getElementById("courseSearchInput");

input.value = "";
courseResults.innerHTML = "";
                clearCoursesList();
                createCourseHTML(course);

            }
        );


        courseResults.appendChild(
            card
        );
    });
}
// ---------------------------------------------------------
// 8. CREATE ONLY ONE SEARCH CONTROLLER
// ---------------------------------------------------------

const search =
    createCourseSearch({

        onResults: function(
            results,
            term
        ) {

            // Console
            console.log(
                "Displaying results:",
                results
            );


            // HTML
            displaySearchResults(
                results
            );
        }
    });


// ---------------------------------------------------------
// 9. Connect search input
// ---------------------------------------------------------

if (input) {

    input.addEventListener(
        "input",
        function(e) {

            const term =
                e.target.value;


            // Search immediately
            // as the user types
            search.onInputChange(
                term
            );
        }
    );


    // Start search system
    search.init();


} else {

    console.warn(
        'Element "#courseSearchInput" was not found.'
    );
}