/* Cancellation form (cancel.html, built by _tools/gencancel.py).
   Without this script the browser's own required/pattern checks still apply.
   With it, the messages are clearer and the ID number's check digit is
   verified. A valid form is then posted natively to Netlify Forms; nothing
   typed here is sent anywhere else. */
(function () {
  var form = document.getElementById("cancelForm");
  if (!form) return;
  form.noValidate = true;

  var MSG = {
    cName: "נא למלא שם מלא · Please enter a full name",
    cId: "מספר תעודת הזהות לא תקין · This ID number isn't valid",
    cEmail: "כתובת האימייל לא תקינה · This email address isn't valid"
  };

  /* Israeli ID: up to 9 digits, padded with leading zeros; the weighted
     digit sum (1,2,1,2,…, two-digit products summed) must divide by 10. */
  function validId(value) {
    var d = value.replace(/\D/g, "");
    if (d.length < 5 || d.length > 9) return false;
    d = ("000000000" + d).slice(-9);
    var sum = 0;
    for (var i = 0; i < 9; i++) {
      var n = Number(d[i]) * (i % 2 + 1);
      sum += n > 9 ? n - 9 : n;
    }
    return sum % 10 === 0;
  }

  function mark(input, bad) {
    var field = input.closest(".field");
    var box = form.querySelector('[data-err="' + input.id + '"]');
    field.classList.toggle("invalid", bad);
    if (bad) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    if (box) box.textContent = bad ? MSG[input.id] : "";
    return bad;
  }

  form.addEventListener("submit", function (ev) {
    var name = form.querySelector("#cName"),
        id = form.querySelector("#cId"),
        email = form.querySelector("#cEmail");
    var mail = email.value.trim();
    var bad = [
      mark(name, name.value.trim().length < 2),
      mark(id, !validId(id.value)),
      mark(email, !!mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail))
    ];
    if (bad.indexOf(true) > -1) {
      ev.preventDefault();
      var first = form.querySelector(".field.invalid input");
      if (first) first.focus();
    }
  });
})();
