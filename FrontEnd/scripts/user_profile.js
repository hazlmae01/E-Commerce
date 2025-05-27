// Elements
const photoInput = document.getElementById("photoInput");
const profileImage = document.getElementById("profileImage");
const displayName = document.getElementById("displayName");

const profileForm = document.getElementById("profileForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const bioInput = document.getElementById("bio");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const bioError = document.getElementById("bioError");

const menuItems = document.querySelectorAll(".menu li");
const sections = document.querySelectorAll(".section");
const contactNumberInput = document.getElementById("contactNumber");
const contactNumberError = document.getElementById("contactNumberError");

// --- Load user profile data on page load ---
async function loadUserProfile() {
  try {
    const res = await fetch("/api/user/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();

    nameInput.value = data.name || "";
    emailInput.value = data.email || "";
    bioInput.value = data.bio || "";
    displayName.textContent = data.name || "";
    profileImage.src = data.profile_photo || "default.jpg";
    contactNumberInput.value = data.contact_number || "";

  } catch (err) {
    console.error("Error loading profile:", err);
  }
}
loadUserProfile();

// --- Profile photo upload ---
photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  if (!file || !file.type.startsWith("image/")) {
    alert("Please choose a valid image.");
    return;
  }

  // Preview locally
  const reader = new FileReader();
  reader.onload = e => {
    profileImage.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Upload photo to server
  const formData = new FormData();
  formData.append("photo", file);

  try {
    const res = await fetch("/api/user/profile/photo", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (res.ok && result.success) {
      profileImage.src = result.photoUrl;  // Fixed field name
      alert("Profile photo updated successfully!");
    } else {
      alert(result.message || "Failed to upload photo.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Error uploading photo.");
  }
});

// --- Clear error messages when typing ---
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
  bioError.textContent = "";
  bioError.classList.remove("visible");
});
contactNumberInput.addEventListener("input", () => {
  if (contactNumberInput.value.trim() !== "") {
    contactNumberError.textContent = "";
    contactNumberError.classList.remove("visible");
  }
});

// --- Save profile form submission ---
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Trimmed values
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const bio = bioInput.value.trim();
  const contactNumber = contactNumberInput.value.trim();

  let isValid = true;

  // Validation
  if (!name) {
    nameError.textContent = "Please enter your full name.";
    nameError.classList.add("visible");
    isValid = false;
  } else {
    nameError.textContent = "";
    nameError.classList.remove("visible");
  }

  if (!email) {
    emailError.textContent = "Please enter your email address.";
    emailError.classList.add("visible");
    isValid = false;
  } else {
    emailError.textContent = "";
    emailError.classList.remove("visible");
  }

  if (!contactNumber) {
    contactNumberError.textContent = "Please enter your contact number.";
    contactNumberError.classList.add("visible");
    isValid = false;
  } else {
    contactNumberError.textContent = "";
    contactNumberError.classList.remove("visible");
  }

  // Bio is optional, clear error anyway
  bioError.textContent = "";
  bioError.classList.remove("visible");

  if (!isValid) {
    // Focus first invalid input
    if (!name) {
      nameInput.focus();
    } else if (!email) {
      emailInput.focus();
    } else if (!contactNumber) {
      contactNumberInput.focus();
    }
    return;
  }

  // Send updated profile to server including contact_number
  try {
    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, bio, contact_number: contactNumber }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      displayName.textContent = name;
      alert("Profile updated successfully!");
    } else {
      alert(result.message || "Failed to update profile.");
    }
  } catch (err) {
    console.error("Profile update error:", err);
    alert("Error updating profile.");
  }
});

// --- Menu navigation ---
menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active"));
    item.classList.add("active");
    sections[index].classList.add("active");
  });
});

// --- Addresses management ---
const addressesList = document.getElementById("addressesList");
const addressForm = document.getElementById("addressForm");

// Load addresses on page load
async function loadAddresses() {
  try {
    const res = await fetch("/api/user/addresses");
    if (!res.ok) throw new Error("Failed to fetch addresses");
    const addresses = await res.json();

    if (addresses.length === 0) {
      addressesList.innerHTML = "<p>No addresses saved. Add one below.</p>";
      return;
    }

    // Create list of addresses
    addressesList.innerHTML = "";
    addresses.forEach(addr => {
      const div = document.createElement("div");
      div.className = "address-item";
      div.innerHTML = `
        <p><strong>${addr.address_line1}</strong> ${addr.address_line2 || ""}</p>
        <p>${addr.city}, ${addr.state} ${addr.zip}</p>
        <p>${addr.country}</p>
      `;
      addressesList.appendChild(div);
    });
  } catch (err) {
    addressesList.innerHTML = "<p>Error loading addresses.</p>";
    console.error(err);
  }
}

// Handle new address form submit
addressForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const addressLine1 = document.getElementById("addressLine1").value.trim();
  const addressLine2 = document.getElementById("addressLine2").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zip = document.getElementById("zip").value.trim();
  const country = document.getElementById("country").value.trim();

  // Basic validation could be added here

  try {
    const res = await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressLine1, addressLine2, city, state, zip, country }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      alert("Address added successfully!");
      addressForm.reset();
      loadAddresses();
    } else {
      alert(result.message || "Failed to add address.");
    }
  } catch (err) {
    alert("Error adding address.");
    console.error(err);
  }
});
loadAddresses();

// --- Change password form ---
const changePasswordForm = document.getElementById("changePasswordForm");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const currentPasswordError = document.getElementById("currentPasswordError");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const passwordSuccessMessage = document.getElementById("passwordSuccessMessage");

changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear previous errors and messages
  currentPasswordError.textContent = "";
  newPasswordError.textContent = "";
  confirmPasswordError.textContent = "";
  passwordSuccessMessage.textContent = "";
  passwordSuccessMessage.style.color = "";

  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  let isValid = true;

  if (!currentPassword) {
    currentPasswordError.textContent = "Please enter your current password.";
    currentPasswordError.classList.add("visible");
    isValid = false;
  }

  if (!newPassword) {
    newPasswordError.textContent = "Please enter a new password.";
    newPasswordError.classList.add("visible");
    isValid = false;
  } else if (newPassword.length < 6) {
    newPasswordError.textContent = "New password must be at least 6 characters.";
    newPasswordError.classList.add("visible");
    isValid = false;
  }

  if (newPassword !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match.";
    confirmPasswordError.classList.add("visible");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      passwordSuccessMessage.textContent = "Password changed successfully!";
      passwordSuccessMessage.style.color = "green";
      changePasswordForm.reset();
    } else {
      passwordSuccessMessage.textContent = result.message || "Failed to change password.";
      passwordSuccessMessage.style.color = "red";
    }
  } catch (err) {
    console.error("Change password error:", err);
    passwordSuccessMessage.textContent = "Error changing password.";
    passwordSuccessMessage.style.color = "red";
  }
});
