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
    {
        title: "Front-End",
        subtitle: "Java Script",
        image: "C:/Users/USER/Downloads/2.png",
        alt: "Front-End Icon"
    },
    {
        title: "Back-End",
        subtitle: "Node.js",
        image: "C:/Users/USER/Downloads/1.png",
        alt: "Back-End Icon"
    },
    {
        title: "BootCamp",
        subtitle: "MERN Full-Stack",
        image: "C:/Users/USER/Downloads/mern.jpg",
        alt: "MERN Icon"
    }
];

const renderWebsite = () => {
    const nav = document.querySelector('.navigation');
    let markup = ""; 
    
    navigationData.forEach(item => {
        markup += `<a href="${item.link}">${item.name}</a>`;
    });
    nav.innerHTML = markup;

    const coursesContainer = document.querySelector('.container');
    let courses = ""; 
    
    coursesData.forEach(course => {
        courses += `
            <div class="card">
                <img src="${course.image}" alt="${course.alt}" width="30" height="30">
                <p>${course.title} <br> (${course.subtitle})</p>
            </div>
        `;
    });
    coursesContainer.innerHTML = courses;
};

document.addEventListener('DOMContentLoaded', () => {
    renderWebsite();

    const startBtn = document.querySelector('.start');
    const viewBtn = document.querySelector('.view');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            alert('Welcome! Redirecting to the enrollment page...');
        });
    }

    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            console.log('Roadmaps section requested.');
        });
    }
});