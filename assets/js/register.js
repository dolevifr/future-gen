/* Registration and signature (register.html, built by _tools/genregister.py).

   1. The plan comes from ?plan=monthly|yearly (the pricing section's button).
   2. The parent fills in the details and signs: drawn on the pad, or, for
      anyone who can't draw, by confirming the typed name as the signature.
   3. The details, the signature and the agreement's version go to the leads
      Apps Script (PAYMENT.signUrl). It saves the signed PDF to Google Drive,
      adds a row to the "הרשמות" tab and emails the parent a copy.
   4. Only when it answers "ok" does the page go on to the Grow payment link.

   Nothing typed here goes to analytics or into an address. */
(function () {
  var form = document.getElementById("signForm");
  if (!form) return;
  var PAY = window.PAYMENT || {};
  var agreement = document.getElementById("agreement");
  var status = document.getElementById("regStatus");
  var submit = document.getElementById("signSubmit");

  /* ---------- the plan ---------- */
  var asked = /[?&]plan=(monthly|yearly)\b/.exec(location.search);
  if (asked) {
    var radio = document.querySelector('input[name="plan"][value="' + asked[1] + '"]');
    if (radio) radio.checked = true;
  }
  function plan() {
    var on = document.querySelector('input[name="plan"]:checked');
    return on ? on.value : "yearly";
  }
  function payUrl() {
    return (plan() === "monthly" ? PAY.monthlyUrl : PAY.yearlyUrl) || "";
  }

  /* ---------- the signature pad ----------
     Strokes are kept as points from 0 to 1, so the drawing survives a resize
     (turning a phone) and is exported at one fixed size. */
  var pad = document.getElementById("sigPad");
  var ctx = pad.getContext("2d");
  var strokes = [], current = null;

  function sizePad() {
    var ratio = window.devicePixelRatio || 1;
    var w = pad.clientWidth, h = pad.clientHeight;
    if (!w || !h) return;
    pad.width = Math.round(w * ratio);
    pad.height = Math.round(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(ctx, w, h);
  }
  function draw(c, w, h) {
    c.clearRect(0, 0, w, h);
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = "#1A1440";
    c.lineWidth = Math.max(2, w / 220);
    strokes.forEach(function (s) {
      c.beginPath();
      s.forEach(function (p, i) {
        var x = p[0] * w, y = p[1] * h;
        if (i === 0) { c.moveTo(x, y); c.lineTo(x + 0.01, y); } else c.lineTo(x, y);
      });
      c.stroke();
    });
  }
  function point(ev) {
    var r = pad.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width)),
            Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height))];
  }
  pad.addEventListener("pointerdown", function (ev) {
    ev.preventDefault();
    pad.setPointerCapture(ev.pointerId);
    current = [point(ev)];
    strokes.push(current);
    sizePad();
    showError("sig", "");
  });
  pad.addEventListener("pointermove", function (ev) {
    if (!current) return;
    current.push(point(ev));
    draw(ctx, pad.clientWidth, pad.clientHeight);
  });
  function endStroke() { current = null; }
  pad.addEventListener("pointerup", endStroke);
  pad.addEventListener("pointercancel", endStroke);
  document.getElementById("sigClear").addEventListener("click", function () {
    strokes = []; current = null;
    draw(ctx, pad.clientWidth, pad.clientHeight);
  });
  window.addEventListener("resize", sizePad);
  sizePad();

  /* A few dots are not a signature: ask for some length of line. */
  function hasSignature() {
    var length = 0;
    strokes.forEach(function (s) {
      for (var i = 1; i < s.length; i++) length += Math.hypot(s[i][0] - s[i - 1][0], (s[i][1] - s[i - 1][1]) / 3);
    });
    return length > 0.25;
  }
  function signatureImage() {
    var out = document.createElement("canvas");
    out.width = 900; out.height = 300;
    var c = out.getContext("2d");
    c.fillStyle = "#fff"; c.fillRect(0, 0, 900, 300);
    draw(c, 900, 300);
    return out.toDataURL("image/png");
  }

  /* ---------- checks ---------- */
  /* Israeli ID: up to 9 digits, padded with zeros; the weighted digit sum divides by 10 */
  function validId(value) {
    var d = String(value).replace(/\D/g, "");
    if (d.length < 5 || d.length > 9) return false;
    d = ("000000000" + d).slice(-9);
    var sum = 0;
    for (var i = 0; i < 9; i++) {
      var n = Number(d[i]) * (i % 2 + 1);
      sum += n > 9 ? n - 9 : n;
    }
    return sum % 10 === 0;
  }
  var MSG = {
    rName: "נא למלא שם מלא",
    rId: "מספר תעודת הזהות לא תקין",
    rPhone: "נא למלא מספר טלפון",
    rEmail: "נא למלא כתובת אימייל תקינה, לשם יישלח ההסכם",
    rStudent: "נא למלא את שם התלמיד/ה",
    rAge: "נא לבחור גיל",
    rAgree: "כדי להירשם צריך לאשר את תנאי המסמך",
    sig: "נא לחתום בתוך המסגרת, או לסמן שהשם המוקלד הוא החתימה"
  };
  function showError(id, text) {
    var box = form.querySelector('[data-err="' + id + '"]');
    if (box) box.textContent = text;
    var input = id === "sig" ? pad : document.getElementById(id);
    if (input) {
      var field = input.closest(".field");
      if (field) field.classList.toggle("invalid", !!text);
      if (text) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    }
    return !!text;
  }
  function val(id) { return document.getElementById(id).value.trim(); }
  function validate() {
    var bad = [
      showError("rName", val("rName").length < 2 ? MSG.rName : ""),
      showError("rId", validId(val("rId")) ? "" : MSG.rId),
      showError("rPhone", val("rPhone").replace(/\D/g, "").length < 9 ? MSG.rPhone : ""),
      showError("rEmail", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val("rEmail")) ? "" : MSG.rEmail),
      showError("rStudent", val("rStudent").length < 2 ? MSG.rStudent : ""),
      showError("rAge", val("rAge") ? "" : MSG.rAge),
      showError("rAgree", document.getElementById("rAgree").checked ? "" : MSG.rAgree),
      showError("sig", hasSignature() || document.getElementById("rTyped").checked ? "" : MSG.sig)
    ];
    return bad.indexOf(true) < 0;
  }

  /* ---------- sending ---------- */
  function say(html, kind) {
    status.hidden = false;
    status.className = "reg-status" + (kind ? " is-" + kind : "");
    status.innerHTML = html;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var CONTACT = 'אפשר גם להירשם בטלפון <a href="tel:+972525281662" dir="ltr">052-5281662</a> או בוואטסאפ.';

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (submit.disabled) return;
    if (!validate()) {
      var first = form.querySelector(".field.invalid input, .field.invalid select");
      if (first) first.focus();
      else if (form.querySelector('[data-err="sig"]').textContent) pad.scrollIntoView({ block: "center" });
      return;
    }
    if (!PAY.signUrl || !payUrl()) {
      say("ההרשמה באתר עוד לא פעילה. " + CONTACT, "error");
      return;
    }
    var typed = document.getElementById("rTyped").checked && !hasSignature();
    var data = {
      version: agreement.getAttribute("data-version"),
      plan: plan(),
      parent_name: val("rName"),
      parent_id: val("rId").replace(/\D/g, ""),
      phone: val("rPhone"),
      email: val("rEmail"),
      student_name: val("rStudent"),
      student_age: val("rAge"),
      agree: true,
      typed: typed,
      signature: typed ? "" : signatureImage(),
      company: form.querySelector('[name="company"]').value,
      ua: navigator.userAgent.slice(0, 300)
    };

    submit.disabled = true;
    say("שומרים את ההסכם החתום…");
    var abort = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (abort) abort.abort(); }, 45000);
    /* a plain text body keeps this a "simple" request, which Apps Script answers without a preflight */
    fetch(PAY.signUrl + (PAY.signUrl.indexOf("?") > -1 ? "&" : "?") + "action=sign", {
      method: "POST", body: JSON.stringify(data), signal: abort ? abort.signal : undefined
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        clearTimeout(timer);
        if (res.result === "ok") {
          var go = payUrl();
          say("<b>ההסכם נחתם ונשמר.</b> מספר אסמכתא: <bdi>" + esc(res.ref || "") + "</bdi>. עותק נשלח אל <bdi>" +
              esc(data.email) + "</bdi>.<br>מעבירים אתכם לתשלום המאובטח… <a class=\"btn btn-primary\" href=\"" + esc(go) +
              "\">למעבר לתשלום</a>", "ok");
          form.querySelectorAll("input, select, button").forEach(function (el) { if (el.type !== "submit") el.disabled = true; });
          setTimeout(function () { location.href = go; }, 3500);
          return;
        }
        submit.disabled = false;
        if (res.result === "outdated") {
          say("המסמך עודכן בזמן שמילאתם את הטופס. רעננו את העמוד, קראו את הנוסח המעודכן וחתמו שוב.", "error");
        } else if (res.result === "invalid" && res.field && MSG[res.field]) {
          say("יש שדה שצריך לתקן.", "error");
          showError(res.field, MSG[res.field]);
          var input = document.getElementById(res.field);
          if (input) input.focus();
        } else {
          say("לא הצלחנו לשמור את ההסכם. נסו שוב בעוד רגע. " + CONTACT, "error");
        }
      })
      .catch(function () {
        clearTimeout(timer);
        submit.disabled = false;
        say("לא הצלחנו לשמור את ההסכם (אין חיבור או שהשרת לא ענה). נסו שוב בעוד רגע. " + CONTACT, "error");
      });
  });
})();
