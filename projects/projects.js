import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = (await fetchJSON('../lib/projects.json')) ?? [];

const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

function updateTitle(count) {
  if (projectsTitle) {
    projectsTitle.textContent = `${count} Project${count === 1 ? '' : 's'}`;
  }
}

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let query = '';
let selectedYear = null; 

function searchFilter(list) {
  let q = query.toLowerCase();
  return list.filter((project) =>
    Object.values(project).join('\n').toLowerCase().includes(q),
  );
}

function yearFilter(list) {
  if (selectedYear === null) return list;
  return list.filter((project) => project.year === selectedYear);
}

function selectYear(label) {
  selectedYear = selectedYear === label ? null : label;
  update();
}

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  let newSVG = d3.select('#projects-pie-plot');
  newSVG.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  newArcs.forEach((arc, idx) => {
    let label = newData[idx].label;
    newSVG.append('path')
      .attr('d', arc)
      .attr('fill', colors(label))
      .classed('selected', label === selectedYear)
      .on('click', () => selectYear(label));
  });

  newData.forEach((d) => {
    legend.append('li')
      .attr('style', `--color:${colors(d.label)}`)
      .attr('class', 'legend-item')
      .classed('selected', d.label === selectedYear)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => selectYear(d.label));
  });
}

function update() {
  let searched = searchFilter(projects);

  if (selectedYear !== null && !searched.some((p) => p.year === selectedYear)) {
    selectedYear = null;
  }

  let visible = yearFilter(searched);

  renderPieChart(searched);
  renderProjects(visible, projectsContainer, 'h2');
  updateTitle(visible.length);
}

update();

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  update();
});