
document.addEventListener("DOMContentLoaded", function () {
  // Display the current year in every footer.
  document.querySelectorAll(".current-year").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  // Validate the contact form.
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const formMessage = document.getElementById("formMessage");

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      formMessage.textContent = "";
      formMessage.className = "mt-3";

      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        formMessage.textContent = "Please correct the highlighted fields.";
        formMessage.classList.add("text-danger");
        return;
      }

      formMessage.textContent =
        "Your form is valid! This demo does not send messages to an inbox.";
      formMessage.classList.add("text-success");

      contactForm.reset();
      contactForm.classList.remove("was-validated");
    });
  }
});

