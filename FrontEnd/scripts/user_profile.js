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
profileForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  displayName.textContent = name;
  alert("Profile updated successfully!");
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
