/* Header show/hide on scroll */
const header = document.getElementById('header');
const hero = document.getElementById('hero');

window.addEventListener('scroll', () => {
  if (!header || !hero) return;
  if (window.scrollY > hero.offsetHeight - 80) {
    header.classList.add('show');
  } else {
    header.classList.remove('show');
  }
});

/* Load JSON content */
fetch("cv.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    // About
    const aboutEl = document.getElementById("about-content");
    if (aboutEl) aboutEl.textContent = data.about;

    // Education
    const eduDiv = document.getElementById("education-content");
    if (eduDiv) {
      eduDiv.innerHTML = `
        <p>
          <strong>${data.education.institution}</strong><br>
          ${data.education.degree}<br>
          ${data.education.duration}
        </p>
      `;
    }

    // Experience Timeline (group roles under the same organization)
    const expDiv = document.getElementById("experience-timeline");
    if (expDiv && Array.isArray(data.experience)) {
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

        (exp.roles || []).forEach(role => {
          const li = document.createElement("li");
          li.className = "role";
          const detailsHtml = Array.isArray(role.details) ? role.details.join("<br>") : "";
          li.innerHTML = `
            <div class="role-title">${role.title}</div>
            <span class="date">${role.duration}</span>
            <p>${detailsHtml}</p>
          `;
          rolesList.appendChild(li);
        });

        content.appendChild(orgEl);
        content.appendChild(rolesList);
        item.appendChild(dot);
        item.appendChild(content);
        expDiv.appendChild(item);
      });
    }

    // Projects
    const projList = document.getElementById("projects-list");
    if (projList && Array.isArray(data.projects)) {
      data.projects.forEach(proj => {
        const li = document.createElement("li");
        const skills = Array.isArray(proj.skills) ? proj.skills : [];
        li.innerHTML = `
          <strong>${proj.title}</strong><br>
          <p>${proj.description}</p>
          <div class="tags">
            ${skills.map(skill => `<span class="tag">${skill}</span>`).join(" ")}
          </div>
        `;
        projList.appendChild(li);
      });
    }

    // Certificates
    const certList = document.getElementById("certificates-list");
    if (certList && Array.isArray(data.certificates_and_awards)) {
      data.certificates_and_awards.forEach(cert => {
        const li = document.createElement("li");
        li.textContent = cert;
        certList.appendChild(li);
      });
    }
  })
  .catch(err => {
    console.error("Error loading cv.json:", err);
    const aboutEl = document.getElementById("about-content");
    if (aboutEl) aboutEl.textContent = "⚠️ Could not load content.";
  });

/* Contact form: send to Google Apps Script */
const ACTION_URL = "https://script.google.com/macros/s/AKfycbwryMCuMf0WMJVJEoLfLCDzKevLnrDPzZhONJdBHGaB01AafwSzlHHfzOe3aJmWCx03/exec"; // your Web App URL
const SECRET_TOKEN = ""; // if you set SECRET_TOKEN in GAS properties, put the same value here

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const sendBtn = document.getElementById("send-btn");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (statusEl) statusEl.textContent = "";

    // Native validation
    if (!form.reportValidity()) return;

    const payload = {
      firstName: (document.getElementById("firstName")?.value || "").trim(),
      lastName: (document.getElementById("lastName")?.value || "").trim(),
      email: (document.getElementById("email")?.value || "").trim(),
      organization: (document.getElementById("organization")?.value || "").trim(),
      message: (document.getElementById("message")?.value || "").trim(),
      website: (document.getElementById("website")?.value || "").trim(), // honeypot
      token: SECRET_TOKEN
    };

    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.dataset.label = sendBtn.textContent || "Send";
      sendBtn.textContent = "Sending…";
    }

    try {
      const res = await fetch(ACTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data = {};
      try { data = await res.json(); } catch (_e) {}

      if (res.ok && (!data.ok || data.ok === true)) {
        if (statusEl) statusEl.textContent = "Thanks! Your message has been sent.";
        form.reset();
      } else {
        const msg = (data && (data.error || data.message)) || "Sorry, something went wrong.";
        if (statusEl) statusEl.textContent = msg + " You can also email me at katiyarsarthak2004@gmail.com.";
      }
    } catch (err) {
      console.error("Send failed:", err);
      if (statusEl) statusEl.textContent = "Network error. Please try again, or email me at katiyarsarthak2004@gmail.com.";
    } finally {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = sendBtn.dataset.label || "Send";
      }
    }
  });
}
