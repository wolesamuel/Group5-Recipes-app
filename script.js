
   const menuBtn = document.getElementById("menuBtn");
      const closeBtn = document.getElementById("closeBtn");
      const mobileSidebar = document.getElementById("mobileSidebar");

      menuBtn.addEventListener("click", () => {
        mobileSidebar.classList.remove("left-[-100%]");
        mobileSidebar.classList.add("left-0");
      });

      closeBtn.addEventListener("click", () => {
        mobileSidebar.classList.remove("left-0");
        mobileSidebar.classList.add("left-[-100%]");
      });
