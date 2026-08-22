/* Naisuyo Campsite — progressive-enhancement JS.
   Every feature here enhances markup that already works without it:
   mobile nav (plain links still reachable), lightbox (images still open
   full-size via <a> href), enquiry builder (plain wa.me link already
   present). If this file fails to load, nothing breaks. */
(function () {
  "use strict";

  /* Mark JS-enabled for the fade-up scroll animation (see styles.css). */
  document.documentElement.classList.add("js-anim");

  /* ---------------- Mobile navigation ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.querySelector(".site-nav__panel");
  var backdrop = document.querySelector(".nav-backdrop");
  var closeBtn = document.querySelector(".nav-close");

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')
    );
  }

  function openNav() {
    if (!panel) return;
    panel.classList.add("is-open");
    backdrop.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var focusables = getFocusable(panel);
    if (focusables.length) focusables[0].focus();
  }

  function closeNav(returnFocus) {
    if (!panel) return;
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (returnFocus) toggle.focus();
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) { closeNav(true); } else { openNav(); }
    });
    backdrop.addEventListener("click", function () { closeNav(false); });
    if (closeBtn) closeBtn.addEventListener("click", function () { closeNav(true); });

    panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeNav(true);
        return;
      }
      if (e.key === "Tab") {
        var focusables = getFocusable(panel);
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    /* Close the drawer automatically if the viewport grows past mobile. */
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) closeNav(false);
    });
  }

  /* ---------------- Lightbox gallery ---------------- */
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (galleryLinks.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Photo viewer");
    lightbox.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close photo viewer">&times;</button>' +
      '<button type="button" class="lightbox__prev" aria-label="Previous photo">&#8249;</button>' +
      '<figure class="lightbox__figure">' +
        '<img alt="">' +
        '<figcaption class="lightbox__caption"></figcaption>' +
      "</figure>" +
      '<button type="button" class="lightbox__next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector(".lightbox__caption");
    var lbClose = lightbox.querySelector(".lightbox__close");
    var lbPrev = lightbox.querySelector(".lightbox__prev");
    var lbNext = lightbox.querySelector(".lightbox__next");
    var currentIndex = 0;
    var lastTrigger = null;

    function showImage(index) {
      currentIndex = (index + galleryLinks.length) % galleryLinks.length;
      var link = galleryLinks[currentIndex];
      var fullSrc = link.getAttribute("href");
      var caption = link.getAttribute("data-caption") || "";
      lbImg.src = fullSrc;
      lbImg.alt = caption;
      lbCaption.textContent = caption;
    }

    function openLightbox(index, trigger) {
      lastTrigger = trigger;
      showImage(index);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      lbImg.src = "";
      if (lastTrigger) lastTrigger.focus();
    }

    galleryLinks.forEach(function (link, index) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(index, link);
      });
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showImage(currentIndex - 1); });
    lbNext.addEventListener("click", function () { showImage(currentIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeLightbox(); return; }
      if (e.key === "ArrowLeft") { showImage(currentIndex - 1); return; }
      if (e.key === "ArrowRight") { showImage(currentIndex + 1); return; }
      if (e.key === "Tab") {
        var focusables = [lbClose, lbPrev, lbNext];
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------------- WhatsApp enquiry builder ---------------- */
  var enquiryForm = document.querySelector("#enquiry-form");
  var waLink = document.querySelector("#send-whatsapp");
  var waNumber = waLink ? waLink.getAttribute("data-wa-number") : null;

  if (enquiryForm && waLink && waNumber) {
    function buildMessage() {
      var name = enquiryForm.querySelector("#enq-name").value.trim();
      var arrival = enquiryForm.querySelector("#enq-arrival").value;
      var nights = enquiryForm.querySelector("#enq-nights").value.trim();
      var guests = enquiryForm.querySelector("#enq-guests").value.trim();
      var notes = enquiryForm.querySelector("#enq-notes").value.trim();
      var interests = Array.prototype.slice
        .call(enquiryForm.querySelectorAll('input[name="interest"]:checked'))
        .map(function (cb) { return cb.value; });

      var lines = ["Hello Naisuyo, I'd like to enquire about a stay."];
      if (name) lines.push("Name: " + name);

      var stayBits = [];
      if (arrival) {
        var d = new Date(arrival + "T00:00:00");
        if (!isNaN(d.getTime())) {
          var formatted = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
          stayBits.push("Arriving " + formatted);
        }
      }
      if (nights) stayBits.push("for " + nights + " night" + (nights === "1" ? "" : "s"));
      if (guests) stayBits.push(guests + " guest" + (guests === "1" ? "" : "s"));
      if (stayBits.length) lines.push(stayBits.join(", ") + ".");

      if (interests.length) lines.push("Interested in: " + interests.join(", ") + ".");
      if (notes) lines.push("Notes: " + notes);

      return lines.join("\n");
    }

    function updateLink() {
      var text = encodeURIComponent(buildMessage());
      waLink.setAttribute("href", "https://wa.me/" + waNumber + "?text=" + text);
    }

    enquiryForm.addEventListener("input", updateLink);
    updateLink();
  }

  /* ---------------- Gentle scroll-reveal ---------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".fade-up"));
  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
