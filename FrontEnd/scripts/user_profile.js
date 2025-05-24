// Profile photo change logic
const photoInput = document.getElementById("photoInput");
const profileImage = document.getElementById("profileImage");
const displayName = document.getElementById("displayName");

photoInput.addEventListener("change", function () {
  const file = photoInput.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please choose a valid image.");
  }
});

// Save profile logic
const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const bioInput = document.getElementById("bio");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const bioError = document.getElementById("bioError");

profileForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Trimmed values
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const bio = bioInput.value.trim();

  let isValid = true;

  // Validate Name
  if (!name) {
    nameError.textContent = "Please enter your full name.";
    nameError.classList.add("visible");
    isValid = false;
  } else {
    nameError.textContent = "";
    nameError.classList.remove("visible");
  }

  // Validate Email
  if (!email) {
    emailError.textContent = "Please enter your email address.";
    emailError.classList.add("visible");
    isValid = false;
  } else {
    emailError.textContent = "";
    emailError.classList.remove("visible");
  }

  // Validate Bio
  if (!bio) {
    bioError.textContent = "Please enter your bio.";
    bioError.classList.add("visible");
    isValid = false;
  } else {
    bioError.textContent = "";
    bioError.classList.remove("visible");
  }

  if (!isValid) {
    // Focus first invalid input field
    if (!name) {
      nameInput.focus();
    } else if (!email) {
      emailInput.focus();
    } else {
      bioInput.focus();
    }
    return;
  }

  // If valid, update display name and show success alert
  displayName.textContent = name;
  alert("Profile updated successfully!");
});

// Clear error messages when user types
nameInput.addEventListener("input", () => {
  if (nameInput.value.trim() !== "") {
    nameError.textContent = "";
    nameError.classList.remove("visible");
  }
});
emailInput.addEventListener("input", () => {
  if (emailInput.value.trim() !== "") {
    emailError.textContent = "";
    emailError.classList.remove("visible");
  }
});
bioInput.addEventListener("input", () => {
  if (bioInput.value.trim() !== "") {
    bioError.textContent = "";
    bioError.classList.remove("visible");
  }
});

// Menu navigation logic
const menuItems = document.querySelectorAll(".menu li");
const sections = document.querySelectorAll(".section");

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    item.classList.add("active");
    sections[index].classList.add("active");
  });
});
