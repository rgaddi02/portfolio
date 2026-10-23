import { fetchJSON, renderProjects } from './global.js';
// Add fetchGithubData to this import once it exists in global.js (Step 3)

const projects = (await fetchJSON('./lib/projects.json')) ?? [];
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');