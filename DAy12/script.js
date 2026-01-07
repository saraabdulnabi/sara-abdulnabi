

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
    // 1. Populate Navigation Links
    const navContainer = document.querySelector('.navigation');
    const navMarkup = navigationData.map(item => `
        <a href="${item.link}">${item.name}</a>
    `).join('');
    navContainer.innerHTML = navMarkup;

    // 2. Populate Course Cards
    const coursesContainer = document.querySelector('.container');
    const coursesMarkup = coursesData.map(course => `
        <div class="card">
            <img src="${course.image}" alt="${course.alt}" width="30" height="30">
            <p>${course.title} <br> (${course.subtitle})</p>
        </div>
    `).join('');
    coursesContainer.innerHTML = coursesMarkup;
};

document.addEventListener('DOMContentLoaded', renderWebsite);


document.querySelector('.start').addEventListener('click', () => {
    alert('Welcome! Redirecting to the enrollment page...');
});

document.querySelector('.view').addEventListener('click', () => {
    console.log('Roadmaps section requested.');
});