(function () {

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!finePointer.matches) {
    return;
  }

  /* ======================================================
     建立鋼筆筆尖
     ====================================================== */

  const pen = document.createElement("div");
  pen.className = "angie-pen-nib";

  pen.innerHTML = `
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >

      <defs>

        <linearGradient
          id="angieNibFill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#f7f1e7" />
          <stop offset="48%" stop-color="#e8ddc6" />
          <stop offset="78%" stop-color="#d8c8ae" />
          <stop offset="100%" stop-color="#cac6bd" />
        </linearGradient>

        <linearGradient
          id="angieNibGold"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#fff3b3" />
          <stop offset="42%" stop-color="#eedf9a" />
          <stop offset="72%" stop-color="#d2b45e" />
          <stop offset="100%" stop-color="#bb9a88" />
        </linearGradient>

      </defs>

      <!-- 筆尖主體 -->
      <path
        d="
          M 2.1 2.1
          L 17.6 7.9
          Q 14.4 11.1 13.8 15.1
          Q 17.1 15.7 20.3 18.9
          L 15.9 20.7
          Q 12.6 17.2 8.8 16.6
          Q 8.0 12.2 2.1 2.1
          Z
        "
        fill="url(#angieNibFill)"
        stroke="#8b6f55"
        stroke-width="1.15"
        stroke-linejoin="round"
      />

      <!-- 中央導墨線 -->
      <path
        d="
          M 2.4 2.4
          L 10.1 10.5
        "
        fill="none"
        stroke="#9a7b60"
        stroke-width="0.85"
        stroke-linecap="round"
      />

      <!-- 呼吸孔 -->
      <circle
        cx="10.35"
        cy="10.8"
        r="1.2"
        fill="#f2eee7"
        stroke="#8b6f55"
        stroke-width="0.85"
      />

      <!-- 下方導墨線 -->
      <path
        d="
          M 11.15 11.7
          L 15.4 16.8
        "
        fill="none"
        stroke="#9a7b60"
        stroke-width="0.72"
        stroke-linecap="round"
      />

      <!-- 淡高光 -->
      <path
        d="
          M 4.0 3.4
          L 15.0 8.2
        "
        fill="none"
        stroke="rgba(255,255,255,0.72)"
        stroke-width="0.65"
        stroke-linecap="round"
      />

      <!-- 香檳金尾環 -->
      <path
        d="
          M 14.8 17.9
          L 18.4 16.4
          L 20.5 18.8
          L 16.1 20.7
          Z
        "
        fill="url(#angieNibGold)"
        stroke="#8b6f55"
        stroke-width="0.85"
        stroke-linejoin="round"
      />

    </svg>
  `;

  document.body.appendChild(pen);
  document.documentElement.classList.add("angie-pen-cursor");

  /* ======================================================
     滑鼠位置
     ====================================================== */

  let mouseX = -100;
  let mouseY = -100;
  let pointerVisible = false;

  function positionPen() {
    pen.style.transform =
      `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
  }

  document.addEventListener("mousemove", function (event) {

    mouseX = event.clientX;
    mouseY = event.clientY;

    pointerVisible = true;
    pen.style.opacity = "1";

    positionPen();

    const clickable = event.target.closest(
      "a, button, input, textarea, select, label, [role='button']"
    );

    if (clickable) {
      pen.classList.add("is-link");
    } else {
      pen.classList.remove("is-link");
    }

  });

  document.addEventListener("mouseleave", function () {
    pointerVisible = false;
    pen.style.opacity = "0";
  });

  document.addEventListener("mouseenter", function () {
    pointerVisible = true;
  });

  window.addEventListener("blur", function () {
    pointerVisible = false;
    pen.style.opacity = "0";
  });

  window.addEventListener("focus", function () {
    if (mouseX > -100 && mouseY > -100) {
      pointerVisible = true;
      pen.style.opacity = "1";
      positionPen();
    }
  });

  /* ======================================================
     滴墨
     ====================================================== */

  function createSingleInkDrop(xOffset, yOffset, delay) {

    window.setTimeout(function () {

      if (!pointerVisible || document.hidden) {
        return;
      }

      const drop = document.createElement("span");
      drop.className = "angie-ink-drop";

      drop.style.left = `${mouseX + xOffset}px`;
      drop.style.top = `${mouseY + yOffset}px`;

      document.body.appendChild(drop);

      window.setTimeout(function () {
        drop.remove();
      }, 1900);

    }, delay);

  }

  function createInkDrop() {

    if (!pointerVisible) {
      return;
    }

    if (document.hidden) {
      return;
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    /* 兩滴慢慢落下 */
    createSingleInkDrop(-1, 4, 0);
    createSingleInkDrop(2, 5, 280);

  }

  /* 每 10 秒滴一次 */
  window.setInterval(createInkDrop, 10000);

})();
