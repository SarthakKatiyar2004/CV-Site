const header = document.getElementById('header');
const hero = document.getElementById('hero');

// Sticky Header Behavior
window.addEventListener('scroll', () => {
  if (window.scrollY > hero.offsetHeight - 80) {
    header.classList.add('show');
  } else {
    header.classList.remove('show');
  }
});

// Load Resume JSON and Populate Sections
fetch("cv.json")   // 🔥 changed from resume.json → cv.json
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

    // Experience Timeline
    const expDiv = document.getElementById("experience-timeline");
    data.experience.forEach(exp => {
      exp.roles.forEach(role => {
        const item = document.createElement("div");
        item.classList.add("timeline-item");
        item.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <strong>${exp.organization}</strong><br>
            ${role.title}<br>
            <span class="date">${role.duration}</span>
            <p>${role.details.join("<br>")}</p>
          </div>
        `;
        expDiv.appendChild(item);
      });
    });

    // Projects
    const projList = document.getElementById("projects-list");
    data.projects.forEach(proj => {
      const li = document.createElement("li");
      li.textContent = proj;
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
