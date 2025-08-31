const header = document.getElementById('header');
const hero = document.getElementById('hero');

window.addEventListener('scroll', () => {
  if (window.scrollY > hero.offsetHeight - 80) {
    header.classList.add('show');
  } else {
    header.classList.remove('show');
  }
});

fetch("cv.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    // About
    document.getElementById("about-content").textContent = data.about;

    // Education
    const eduDiv = document.getElementById("education-content");
    eduDiv.innerHTML = `
      <p>
        <strong>${data.education.institution}</strong><br>
        ${data.education.degree}<br>
        ${data.education.duration}
      </p>
    `;

    // Experience Timeline (group roles under the same organization)
    const expDiv = document.getElementById("experience-timeline");
    data.experience.forEach(exp => {
      const item = document.createElement("div");
      item.classList.add("timeline-item");

      const dot = document.createElement("div");
      dot.className = "timeline-dot";

      const content = document.createElement("div");
      content.className = "timeline-content";

      // Organization heading once
      const orgEl = document.createElement("strong");
      orgEl.textContent = exp.organization;

      // Roles list under the organization
      const rolesList = document.createElement("ul");
      rolesList.className = "roles";

      exp.roles.forEach(role => {
        const li = document.createElement("li");
        li.className = "role";
        li.innerHTML = `
          <div class="role-title">${role.title}</div>
          <span class="date">${role.duration}</span>
          <p>${role.details.join("<br>")}</p>
        `;
        rolesList.appendChild(li);
      });

      content.appendChild(orgEl);
      content.appendChild(rolesList);
      item.appendChild(dot);
      item.appendChild(content);
      expDiv.appendChild(item);
    });

    // Projects
    const projList = document.getElementById("projects-list");
    data.projects.forEach(proj => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${proj.title}</strong><br>
        <p>${proj.description}</p>
        <div class="tags">
          ${proj.skills.map(skill => `<span class="tag">${skill}</span>`).join(" ")}
        </div>
      `;
      projList.appendChild(li);
    });

    // Certificates
    const certList = document.getElementById("certificates-list");
    data.certificates_and_awards.forEach(cert => {
      const li = document.createElement("li");
      li.textContent = cert;
      certList.appendChild(li);
    });
  })
  .catch(err => {
    console.error("Error loading cv.json:", err);
    document.getElementById("about-content").textContent = "⚠️ Could not load content.";
  });
