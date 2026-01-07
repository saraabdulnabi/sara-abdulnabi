const navigationData = [
    { name: "Home", link: "#" },
    { name: "Courses", link: "#" },
    { name: "BootCamp", link: "#" },
    { name: "Road Maps", link: "#" },
    { name: "Paths", link: "#" },
    { name: "About", link: "#" },
    { name: "Contact", link: "#" }
];

const coursesData = [
    { title: "Front-End", subtitle: "Java Script", image: "img/two.png", alt: "Front-End Icon" },
    { title: "Back-End", subtitle: "Node.js", image: "img/one.png", alt: "Back-End Icon" },
    { title: "BootCamp", subtitle: "MERN Full-Stack", image: "img/mern.jpg", alt: "MERN Icon" }
];

const renderNav = () => {
    const nav = document.querySelector('.navigation');
    let markup = ""; 
    navigationData.forEach(item => {
        markup += `<a href="${item.link}">${item.name}</a>`;
    });
    nav.innerHTML = markup;
};

const renderCourses = (dataToRender) => {
    const coursesContainer = document.querySelector('.container');
    let coursesMarkup = ""; 
    
    dataToRender.forEach(course => {
        coursesMarkup += `
            <div class="card">
                <img src="${course.image}" alt="${course.alt}" width="30" height="30">
                <p>${course.title} <br> (${course.subtitle})</p>
            </div>
        `;
    });
    coursesContainer.innerHTML = coursesMarkup || `<p style="color:white; font-weight:bold;">No courses found.</p>`;
};

document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    renderCourses(coursesData);

    const searchInput = document.getElementById('courseSearch');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = coursesData.filter(course => 
            course.title.toLowerCase().includes(term) || 
            course.subtitle.toLowerCase().includes(term)
        );
        renderCourses(filtered);
    });

    const startBtn = document.querySelector('.start');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            alert('Welcome! Redirecting to the enrollment page...');
        });
    }

    const viewBtn = document.querySelector('.view');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            console.log('Roadmaps section requested.');
        });
    }
});