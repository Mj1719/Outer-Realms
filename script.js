
// Outer Realms gallery script
document.addEventListener('DOMContentLoaded', function(){
  const gallery = document.getElementById('gallery');
  const filters = document.querySelectorAll('.filters button');

  // load manifest images
  fetch('images.json').then(r=>r.json()).then(data=>{
    window.OuterRealmsImages = data;
    renderGallery(data);
  }).catch(err=>{
    gallery.innerHTML = '<p style="color:#c6bfae">Failed to load images.json. Make sure it is present.</p>';
  });

  function renderGallery(images){
    gallery.innerHTML = '';
    images.forEach(img=>{
      const card = document.createElement('figure');
      card.className = 'card';
      card.setAttribute('data-type', img.type);
      const image = document.createElement('img');
      image.src = img.filename;
      image.alt = img.title;
      const cap = document.createElement('figcaption');
      cap.className = 'card-title';
      cap.textContent = img.title + ' — ' + img.type;
      card.appendChild(image);
      card.appendChild(cap);
      gallery.appendChild(card);
    });
  }

  filters.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      filterGallery(f);
    });
  });

  function filterGallery(filter){
    const cards = document.querySelectorAll('.card');
    cards.forEach(c=>{
      const t = c.getAttribute('data-type');
      if(filter === 'all'){ c.style.display = ''; return; }
      if(filter === t){ c.style.display = ''; return; }
      c.style.display = 'none';
    });
  }
});
