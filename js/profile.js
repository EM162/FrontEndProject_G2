document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('All fields are required!');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
  
    alert('Password changed successfully!');
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cancel').addEventListener('click', function () {
      document.querySelectorAll('input').forEach(input => {
        input.value = '';
      });
    });
  });
  
  
  
  
  
  
  
  
  
  
  // Select all sidebar links and sections
  const sidebarLinks = document.querySelectorAll('.profile-links a');
  const sections = document.querySelectorAll('.main-content .section');
  
  // Add event listeners to each sidebar link
  sidebarLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sidebarLinks.forEach((link) => link.classList.remove('active'));
      sections.forEach((section) => section.classList.remove('active'));
  
      link.classList.add('active');
      sections[index].classList.add('active');
    });
  });
  
  
  
  
  const fileInput = document.getElementById("fileInput");
  const profileImage = document.getElementById("profileImage");
  
  profileImage.addEventListener("click", () => {
    fileInput.click();
  });
  
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        profileImage.src = reader.result;
      };
  
      reader.readAsDataURL(file);
    }
  });