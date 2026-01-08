(() => {
  console.log('Resume builder app loaded');

  function q(sel, ctx = document) {
    const el = ctx.querySelector(sel);
    if (!el) {
      console.warn(`Elemento não encontrado: ${sel}`);
    }
    return el;
  }
  function qa(sel, ctx = document) {
    return Array.from(ctx.querySelectorAll(sel));
  }

  // navigation
  qa('#nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      const el = document.getElementById(section);
      if (el) el.classList.add('active');
    });
  });

  // show first panel
  document.querySelectorAll('.panel')[0].classList.add('active');

  // Whatsapp mask
  function applyWhatsappMask(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }

  const whatsappInput = q('#headerWhatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', (e) => {
      e.target.value = applyWhatsappMask(e.target.value);
    });
  }

  // Personal links
  function createPersonalLinkRow(data) {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <input class="title" placeholder="Link name (e.g., Portfolio)" value="${data?.value ?? ''}" />
      <input class="url" placeholder="Link URL" value="${data?.ref ?? ''}" />
      <button class="remove">Remove</button>
    `;
    div.querySelector('.remove').addEventListener('click', () => div.remove());
    return div;
  }

  const personalLinksContainer = q('#personalLinks');
  const personalLinksAddBtn = q('#personalLinksAdd');
  if (personalLinksAddBtn && personalLinksContainer) {
    personalLinksAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      personalLinksContainer.appendChild(createPersonalLinkRow());
    });
  }

  // helper to create inputs
  function createSkillRow(data) {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <input class="title" placeholder="Title" value="${data?.title ?? ''}" />
      <select class="level">
        <option value="basic">basic</option>
        <option value="basic-average">basic-average</option>
        <option value="average">average</option>
        <option value="average-advanced">average-advanced</option>
        <option value="advanced">advanced</option>
        <option value="advanced-specialized">advanced-specialized</option>
        <option value="specialized">specialized</option>
      </select>
      <button class="remove">Remove</button>
    `;
    if (data?.level) div.querySelector('.level').value = data.level;
    div.querySelector('.remove').addEventListener('click', () => div.remove());
    return div;
  }

  function createExperienceRow(data) {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <input class="title" placeholder="Title" value="${data?.title ?? ''}" />
      <input class="company" placeholder="Company" value="${data?.company ?? ''}" />
      <input type="date" class="startsAt" value="${data?.startsAt ?? ''}" />
      <input type="date" class="endsAt" value="${data?.endsAt ?? ''}" style="display: ${data?.currently ? 'none' : 'block'}" />
      <label>Currently <input type="checkbox" class="currently" ${data?.currently ? 'checked' : ''}/></label>
      <textarea class="description" placeholder="Description">${data?.description ?? ''}</textarea>
      <div class="keywords-sub"></div>
      <button type="button" class="keywords-add">+ Add Keyword</button>
      <button class="remove">Remove</button>
    `;
    const keywordsSub = div.querySelector('.keywords-sub');
    const keywordsAddBtn = div.querySelector('.keywords-add');
    const currentlyCheckbox = div.querySelector('.currently');
    const endsAtInput = div.querySelector('.endsAt');

    // Toggle endsAt visibility based on currently checkbox
    currentlyCheckbox?.addEventListener('change', (e) => {
      if (endsAtInput) {
        endsAtInput.style.display = e.target.checked ? 'none' : 'block';
      }
    });

    // Add existing keywords
    if (data?.keywords?.length) {
      data.keywords.forEach(kw => {
        const kwDiv = document.createElement('div');
        kwDiv.className = 'keyword-tag-inline';
        kwDiv.innerHTML = `
          <input class="keyword-input" type="text" value="${kw}" />
          <button type="button" class="keyword-remove">×</button>
        `;
        kwDiv.querySelector('.keyword-remove').addEventListener('click', () => kwDiv.remove());
        keywordsSub.appendChild(kwDiv);
      });
    }

    keywordsAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const kwDiv = document.createElement('div');
      kwDiv.className = 'keyword-tag-inline';
      kwDiv.innerHTML = `
        <input class="keyword-input" type="text" placeholder="Keyword" />
        <button type="button" class="keyword-remove">×</button>
      `;
      kwDiv.querySelector('.keyword-remove').addEventListener('click', () => kwDiv.remove());
      keywordsSub.appendChild(kwDiv);
    });

    div.querySelector('.remove').addEventListener('click', () => div.remove());
    return div;
  }

  function createGenericRow(fields, data) {
    const div = document.createElement('div');
    div.className = 'item';

    let html = '';
    fields.forEach(f => {
      const val = data && data[f.name] ? data[f.name] : '';
      if (f.type === 'textarea') {
        html += `<textarea class="${f.name}" placeholder="${f.label}">${val}</textarea>`;
      } else if (f.type === 'date') {
        html += `<input type="date" class="${f.name}" value="${val}" />`;
      } else if (f.type === 'number') {
        html += `<input type="number" class="${f.name}" placeholder="${f.label}" value="${val}" />`;
      } else if (f.type === 'checkbox') {
        html += `<label>${f.label} <input type="checkbox" class="${f.name}" ${data?.[f.name] ? 'checked' : ''}/></label>`;
      } else if (f.type === 'image') {
        html += `<input type="file" class="${f.name}" accept="image/*" data-base64="" />`;
      } else if (f.type === 'link') {
        html += `<input class="${f.name}-value" placeholder="Display ${f.label}" value="${data?.[f.name]?.value ?? ''}" />`;
        html += `<input class="${f.name}-ref" placeholder="${f.label} URL" value="${data?.[f.name]?.ref ?? ''}" />`;
      } else {
        html += `<input class="${f.name}" placeholder="${f.label}" value="${val}" />`;
      }
    });

    html += '<div class="keywords-sub"></div>';
    html += '<button type="button" class="keywords-add">+ Add Keyword</button>';
    html += '<button class="remove">Remove</button>';

    div.innerHTML = html;

    // Handle keywords
    const keywordsSub = div.querySelector('.keywords-sub');
    const keywordsAddBtn = div.querySelector('.keywords-add');

    if (data?.keywords?.length) {
      data.keywords.forEach(kw => {
        const kwDiv = document.createElement('div');
        kwDiv.className = 'keyword-tag-inline';
        kwDiv.innerHTML = `
          <input class="keyword-input" type="text" value="${kw}" />
          <button type="button" class="keyword-remove">×</button>
        `;
        kwDiv.querySelector('.keyword-remove').addEventListener('click', () => kwDiv.remove());
        keywordsSub.appendChild(kwDiv);
      });
    }

    keywordsAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const kwDiv = document.createElement('div');
      kwDiv.className = 'keyword-tag-inline';
      kwDiv.innerHTML = `
        <input class="keyword-input" type="text" placeholder="Keyword" />
        <button type="button" class="keyword-remove">×</button>
      `;
      kwDiv.querySelector('.keyword-remove').addEventListener('click', () => kwDiv.remove());
      keywordsSub.appendChild(kwDiv);
    });

    // Handle image file inputs
    const imageInputs = div.querySelectorAll('input[type="file"]');
    imageInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            input.dataset.base64 = ev.target?.result || '';
          };
          reader.readAsDataURL(file);
        }
      });
    });

    div.querySelector('.remove').addEventListener('click', () => div.remove());
    return div;
  }

  // Helper to create and manage keywords
  function createKeywordElement(text = '') {
    const div = document.createElement('div');
    div.className = 'keyword-tag';
    div.innerHTML = `
      <input class="keyword-input" type="text" placeholder="Keyword" value="${text}" />
      <button type="button" class="keyword-remove">×</button>
    `;
    div.querySelector('.keyword-remove').addEventListener('click', () => div.remove());
    return div;
  }

  function setupKeywordContainer(containerId, addBtnId) {
    const container = q(`#${containerId}`);
    const addBtn = q(`#${addBtnId}`);

    console.log(`setupKeywordContainer: ${containerId}, ${addBtnId}`);
    console.log('container:', container);
    console.log('addBtn:', addBtn);

    if (addBtn && container) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Adding keyword to', containerId);
        container.appendChild(createKeywordElement());
      });
    } else {
      console.error(`Keywords setup failed for ${containerId}`);
    }
  }

  // Setup keyword containers
  setupKeywordContainer('skillsKeywords', 'skillsKeywordsAdd');
  setupKeywordContainer('aboutKeywords', 'aboutKeywordsAdd');
  setupKeywordContainer('targetKeywords', 'targetKeywordsAdd');

  // Helper to get keywords from container
  function getKeywordsFromContainer(containerId) {
    const container = q(`#${containerId}`);
    if (!container) return [];
    return qa('.keyword-input', container)
      .map(input => input.value.trim())
      .filter(Boolean);
  }

  // skills
  const skillsList = q('#skillsList');
  const skillsAddBtn = q('#skillsAdd');
  if (skillsAddBtn && skillsList) {
    skillsAddBtn.addEventListener('click', () => skillsList.appendChild(createSkillRow()));
  }

  // experience
  const experienceList = q('#experienceList');
  const experienceAddBtn = q('#experienceAdd');
  if (experienceAddBtn && experienceList) {
    experienceAddBtn.addEventListener('click', () => experienceList.appendChild(createExperienceRow()));
  }

  // graduation
  const graduationList = q('#graduationList');
  const graduationAddBtn = q('#graduationAdd');
  if (graduationAddBtn && graduationList) {
    graduationAddBtn.addEventListener('click', () => {
      const item = createGenericRow([
        { name: 'title', label: 'Title' },
        { name: 'institution', label: 'Institution' },
        { name: 'startsAt', label: 'Start', type: 'date' },
        { name: 'endsAt', label: 'End', type: 'date' },
        { name: 'currently', label: 'Currently', type: 'checkbox' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]);

      // Add toggle logic for currently checkbox
      const currentlyCheckbox = q('.currently', item);
      const endsAtInput = q('.endsAt', item);
      if (currentlyCheckbox && endsAtInput) {
        currentlyCheckbox.addEventListener('change', (e) => {
          endsAtInput.style.display = e.target.checked ? 'none' : 'block';
        });
      }

      graduationList.appendChild(item);
    });
  }

  // projects
  const projectsList = q('#projectsList');
  const projectsAddBtn = q('#projectsAdd');
  if (projectsAddBtn && projectsList) {
    projectsAddBtn.addEventListener('click', () => projectsList.appendChild(createGenericRow([
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'banner', label: 'Banner Image', type: 'image' },
      { name: 'link', label: 'Link', type: 'link' },
    ])));
  }

  // specialization
  const specList = q('#specializationList');
  const specAddBtn = q('#specializationAdd');
  if (specAddBtn && specList) {
    specAddBtn.addEventListener('click', () => specList.appendChild(createGenericRow([
      { name: 'title', label: 'Title' },
      { name: 'institution', label: 'Institution' },
      { name: 'duration', label: 'Duration (hours)', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ])));
  }

  // Helper to get keywords from item
  function getKeywordsFromItem(item) {
    return qa('.keyword-input', q('.keywords-sub', item))
      .map(input => input.value.trim())
      .filter(Boolean);
  }

  function collect() {
    const templateConfig = {
      name: 'default',
      language: q('#templateLanguage')?.value ?? '',
      monochrome: q('#templateMonochrome')?.checked ?? false,
      fontColor: q('#templateFontColor')?.value ?? '#000000',
      fontSize: Number(q('#templateFontSize')?.value ?? 12),
    };

    const headerSection = {
      header: {
        name: q('#headerName')?.value ?? '',
      },
      contact: {
        email: q('#headerEmail')?.value ? { value: q('#headerEmail').value } : undefined,
        address: q('#headerAddress')?.value ? { value: q('#headerAddress').value } : undefined,
        whatsapp: q('#headerWhatsapp')?.value ? { value: q('#headerWhatsapp').value.replace(/\D/g, '') } : undefined,
        github: q('#headerGithubUrl')?.value ? { value: q('#headerGithubDisplay')?.value ?? '', ref: q('#headerGithubUrl').value } : undefined,
        linkedin: q('#headerLinkedinUrl')?.value ? { value: q('#headerLinkedinDisplay')?.value ?? '', ref: q('#headerLinkedinUrl').value } : undefined,
        personal: qa('#personalLinks .item').map(item => ({
          value: q('.title', item)?.value ?? '',
          ref: q('.url', item)?.value ?? '',
        })).filter(p => p.value || p.ref),
      },
    };

    const aboutSection = {
      descriptions: (q('#aboutDescriptions')?.value ?? '').split('\n').map(s => s.trim()).filter(Boolean),
      keywords: getKeywordsFromContainer('aboutKeywords'),
    };

    const skills = qa('#skillsList .item').map(item => ({
      title: q('.title', item)?.value ?? '',
      level: q('.level', item)?.value ?? '',
    }));

    const skillSection = { skills, keywords: getKeywordsFromContainer('skillsKeywords') };

    const experiences = qa('#experienceList .item').map(item => {
      const currently = q('.currently', item)?.checked ?? false;
      return {
        title: q('.title', item)?.value ?? '',
        company: q('.company', item)?.value ?? '',
        startsAt: q('.startsAt', item)?.value || undefined,
        endsAt: !currently ? (q('.endsAt', item)?.value || undefined) : undefined,
        currently,
        description: q('.description', item)?.value ?? '',
        keywords: getKeywordsFromItem(item),
      };
    });

    const graduations = qa('#graduationList .item').map(item => {
      const currently = q('.currently', item)?.checked ?? false;
      return {
        title: q('.title', item)?.value ?? '',
        institution: q('.institution', item)?.value ?? '',
        startsAt: q('.startsAt', item)?.value || undefined,
        endsAt: !currently ? (q('.endsAt', item)?.value || undefined) : undefined,
        currently,
        description: q('.description', item)?.value ?? '',
        keywords: getKeywordsFromItem(item),
      };
    });

    const projects = qa('#projectsList .item').map(item => ({
      title: q('.title', item)?.value ?? '',
      description: q('.description', item)?.value ?? '',
      banner: q(`input[type="file"].banner`, item)?.dataset?.base64 || undefined,
      link: q('.link-ref', item)?.value ? { value: q('.link-value', item)?.value ?? '', ref: q('.link-ref', item).value } : undefined,
      keywords: getKeywordsFromItem(item),
    }));

    const specializations = qa('#specializationList .item').map(item => ({
      title: q('.title', item)?.value ?? '',
      institution: q('.institution', item)?.value ?? '',
      duration: q('.duration', item)?.value ?? '',
      description: q('.description', item)?.value ?? '',
      keywords: getKeywordsFromItem(item),
    }));

    const variables = {
      templateConfig,
      headerSection,
      aboutSection,
      skillSection,
      targetSection: { position: q('#targetPosition')?.value ?? '', keywords: getKeywordsFromContainer('targetKeywords') },
      graduationSection: { graduations },
      specializationSection: { specializations },
      projectSection: { projects },
      experienceSection: { experiences },
    };

    return variables;
  }

  const previewBtn = q('#preview');
  const downloadBtn = q('#downloadPdf');

  if (previewBtn) {
    previewBtn.addEventListener('click', async () => {
      const variables = collect();
      const resp = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });
      const html = await resp.text();
      const iframe = q('#previewFrame');
      iframe.srcdoc = html;
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      const variables = collect();
      const resp = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });
      if (!resp.ok) {
        const err = await resp.json();
        alert('Error: ' + (err?.error || resp.statusText));
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

})();
