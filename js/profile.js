document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
  
  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  
    if (!currentPassword || !newPassword || !confirmPassword) {
    alert("All fields are required!");
      return;
    }
  
    if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match!");
      return;
    }
  
  alert("Password changed successfully!");
  });
  
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("cancel")?.addEventListener("click", function () {
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
  });
});
  
  // Select all sidebar links and sections
const sidebarLinks = document.querySelectorAll(".profile-links a");
const sections = document.querySelectorAll(".main-content .section");
  
  // Add event listeners to each sidebar link
  sidebarLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
      e.preventDefault();
    sidebarLinks.forEach((link) => link.classList.remove("active"));
    sections.forEach((section) => section.classList.remove("active"));
  
    link.classList.add("active");
    sections[index].classList.add("active");
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
// ===================================================================

// fetech the imformation log file and show it

const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

// دمج الأسم الأول والأسم الأخير في خانة Full Name
document.getElementById("full-name").value = `${currentUser.firstName || ""} ${
  currentUser.lastName || ""
}`;
document.getElementById("email").value = currentUser.email || "";
document.getElementById("password").value = currentUser.password || "";
document.getElementById("phone").value = currentUser.phone || "";
document.getElementById("gender").value = currentUser.gender || "";

// إخفاء أو إظهار الأزرار حسب الحاجة
const updateBtn = document.getElementById("update-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

// عند الضغط على "Update"
updateBtn.addEventListener("click", function () {
  // جعل الحقول قابلة للتعديل
  document.getElementById("full-name").readOnly = false;
  document.getElementById("email").readOnly = false;
  document.getElementById("password").readOnly = false;
  document.getElementById("phone").readOnly = false;
  document.getElementById("gender").readOnly = false;

  // إخفاء زر "Update" وإظهار زر "Save" و "Cancel"
  updateBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
  cancelBtn.style.display = "inline-block";
});

// عند الضغط على "Save"
saveBtn.addEventListener("click", function () {
  // تخزين البيانات الجديدة في localStorage
  const updatedUser = {
    firstName: document.getElementById("full-name").value.split(" ")[0], // استخراج الاسم الأول
    lastName: document.getElementById("full-name").value.split(" ")[1] || "", // استخراج الاسم الأخير
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    phone: document.getElementById("phone").value,
    gender: document.getElementById("gender").value,
  };

  localStorage.setItem("currentUser", JSON.stringify(updatedUser));

  // جعل الحقول غير قابلة للتعديل
  document.getElementById("full-name").readOnly = true;
  document.getElementById("email").readOnly = true;
  document.getElementById("password").readOnly = true;
  document.getElementById("phone").readOnly = true;
  document.getElementById("gender").readOnly = true;

  // إخفاء زر "Save" و "Cancel" وإظهار "Update"
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
});

// عند الضغط على "Cancel"
cancelBtn.addEventListener("click", function () {
  // إعادة الحقول إلى حالتها الأصلية (read-only)
  document.getElementById("full-name").readOnly = true;
  document.getElementById("email").readOnly = true;
  document.getElementById("password").readOnly = true;
  document.getElementById("phone").readOnly = true;
  document.getElementById("gender").readOnly = true;

  // إخفاء زر "Save" و "Cancel" وإظهار "Update"
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
});

// =============================
// // log out
// // عند الضغط على زر Yes
// document.getElementById("logout").addEventListener("click", function () {
//   // عرض نافذة تأكيد
//   const confirmLogout = confirm("Do you want to log out?! ");

//   // إذا اختار المستخدم "Yes" (تأكيد تسجيل الخروج)
//   if (confirmLogout) {
//     // حذف جميع البيانات من localStorage
//     // localStorage.clear();

//     currentUser = null;
//     // إعادة التوجيه إلى صفحة تسجيل الدخول أو الرئيسية
//     window.location.href = "./home.html"; // استبدل login.html برابط الصفحة المناسبة
//   }
// });

document.getElementById("logout").addEventListener("click", function () {
  const confirmLogout = confirm("Do you want to log out?!");

  if (confirmLogout) {
    try {
      localStorage.removeItem("currentUser"); // Remove user data
      window.location.href = "./home.html";  // Redirect to home page
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  }
});



// ====================================
// check if loggin as a seller
document.addEventListener("DOMContentLoaded", function () {
  // جلب بيانات المستخدم من localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // التحقق من وجود المستخدم ومن قيمة الدور
  if (currentUser && currentUser.role === "seller") {
    const profileLinks = document.getElementById("profileLinks");

    // التحقق إذا كان الزر موجود مسبقًا لتجنب التكرار
    if (!document.getElementById("sellerDashboard")) {
      // إنشاء عنصر الزر
      const sellerDashboardLink = document.createElement("li");
      const sellerDashboardAnchor = document.createElement("a");
      sellerDashboardAnchor.href = "../sellerDashboard.html"; // استبدل "#" برابط لوحة التحكم
      sellerDashboardAnchor.id = "sellerDashboard";
      sellerDashboardAnchor.textContent = "Seller Dashboard";
      sellerDashboardAnchor.className = "btn-seller";

      // إضافة الزر إلى القائمة
      sellerDashboardLink.appendChild(sellerDashboardAnchor);
      profileLinks.appendChild(sellerDashboardLink); // إضافة الزر إلى القائمة
    }
  }

  const orderTableBody = document.querySelector("#order-history-table tbody");
  const history = currentUser.history || [];

  orderTableBody.innerHTML = ""; // Clear existing rows

  history.forEach((order) => {
    const row = document.createElement("tr");
    const orderDate = new Date().toLocaleDateString(); // You can add actual date if available

    row.innerHTML = `
            <td>${order.title}</td>
            <td>${order.author}</td>
            <td>$${order.price}</td>
            <td>${order.quantity}</td>
            <td>$${(order.price * order.quantity).toFixed(2)}</td>
            <td>${orderDate}</td>
        `;

    orderTableBody.appendChild(row);
  });
});
