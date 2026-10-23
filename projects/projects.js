import { fetchJSON, renderProjects } from '../global.js';

// Path resolves relative to the page URL (/projects/), so ../lib/ is the root lib folder.
// fetchJSON returns undefined on failure, so fall back to an empty array.
const projects = (await fetchJSON('../lib/projects.json')) ?? [];

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// Step 1.6: project count in the page title
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.textContent = `${projects.length} Projects`;
}