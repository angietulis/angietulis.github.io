(function () {

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!finePointer.matches) {
    return;
  }


  /* ======================================================
     建立鋼筆游標
     ====================================================== */

  const pen = document.createElement("div");

  pen.className = "angie-pen-nib";


  pen.innerHTML = `
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >

      <defs>

        <!-- 筆尖的暖米金光影 -->
        <linearGradient
          id="angieNibFill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#f7f1e7"/>
          <stop offset="42%" stop-color="#e8ddc6"/>
          <stop offset="72%" stop-color="#d8c8ae"/>
          <stop offset="100%" stop-color="#cac6bd"/>
        </linearGradient>


        <!-- 香檳金 -->
        <linearGradient
          id="angieNibGold"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#fff3b3"/>
          <stop offset="35%" stop-color="#eedf9a"/>
          <stop offset="68%" stop-color="#d2b45e"/>
          <stop offset="100%" stop-color="#bb9a88"/>
        </linearGradient>


        <!-- 筆桿 -->
        <linearGradient
          id="angiePenBarrel"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stop-color="#c8ad9b"/>
          <stop offset="42%" stop-color="#bb9a88"/>
          <stop offset="72%" stop-color="#a98572"/>
          <stop offset="100%" stop-color="#916f60"/>
        </linearGradient>

      </defs>


      <!-- =========================
           鋼筆筆尖
           尖端朝左上
           ========================= -->

      <path
        d="
          M 2.2 2.2
          L 17.5 7.7
          Q 14.5 11.0 13.9 14.8
          Q 17.0 15.7 19.8 18.5
          L 15.9 20.2
          Q 12.7 17.0 9.0 16.3
          Q 8.0 11.9 2.2 2.2
          Z
        "
        fill="url(#angieNibFill)"
        stroke="#8b6f55"
        stroke-width="1.05"
        stroke-linejoin="round"
      />


      <!-- 中央導墨線 -->

      <path
        d="
          M 2.6 2.6
          L 10.1 10.3
        "
        fill="none"
        stroke="#9a7b60"
        stroke-width="0.75"
        stroke-linecap="round"
      />


      <!-- 呼吸孔 -->

      <circle
        cx="10.4"
        cy="10.7"
        r="1.15"
        fill="#f2eee7"
        stroke="#8b6f55"
        stroke-width="0.8"
      />


      <!-- 下方導墨線 -->

      <path
        d="
          M 11.1 11.6
          L 15.1 16.5
        "
        fill="none"
        stroke="#9a7b60"
        stroke-width="0.7"
        stroke-linecap="round"
      />


      <!-- 筆尖高光 -->

      <path
        d="
          M 4.1 3.4
          L 14.9 8.1
        "
        fill="none"
        stroke="rgba(255,255,255,0.78)"
        stroke-width="0.65"
        stroke-linecap="round"
      />


      <!-- =========================
           香檳金筆環
           ========================= -->

      <path
        d="
          M 15.0 17.6
          L 18.3 16.2
          L 21.1 19.0
          L 17.0 20.9
          Z
        "
        fill="url(#angieNibGold)"
        stroke="#8b6f55"
        stroke-width="0.8"
        stroke-linejoin="round"
      />


      <!-- =========================
           短筆桿
           ========================= -->

      <path
        d="
          M 17.0 20.9
          L 21.1 19.0
          L 29.2 26.0
          Q 30.2 27.0 29.3 28.0
          L 27.5 29.5
          Q 26.6 30.3 25.6 29.4
          Z
        "
        fill="url(#angiePenBarrel)"
        stroke="#8b6f55"
        stroke-width="0.9"
        stroke-linejoin="round"
      />


      <!-- 筆桿高光 -->

      <path
        d="
          M 20.3 21.0
          L 27.4 27.1
        "
        fill="none"
        stroke="rgba(255,255,255,0.40)"
        stroke-width="0.7"
        stroke-linecap="round"
      />

    </svg>
  `;


  document.body.appendChild(pen);

  document.documentElement.classList.add(
    "angie-pen-cursor"
  );


  /* ======================================================
     滑鼠位置
     ====================================================== */

  let mouseX = -100;
  let mouseY = -100;

  let pointerVisible = false;


  function positionPen() {

    /*
      最左上筆尖就是真正點擊位置
    */

    pen.style.transform =
      `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;

  }


  document.addEventListener(
    "mousemove",
    function (event) {

      mouseX = event.clientX;
      mouseY = event.clientY;

      pointerVisible = true;

      pen.style.opacity = "1";

      positionPen();


      const clickable =
        event.target.closest(
          "a, button, input, textarea, select, label, [role='button']"
        );


      if (clickable) {

        pen.classList.add("is-link");

      } else {

        pen.classList.remove("is-link");

      }

    }
  );


  document.addEventListener(
    "mouseleave",
    function () {

      pointerVisible = false;

      pen.style.opacity = "0";

    }
  );


  document.addEventListener(
    "mouseenter",
    function () {

      pointerVisible = true;

    }
  );


  /* ======================================================
     滴墨
     ====================================================== */

  function createInkDrop() {

    if (!pointerVisible) {
      return;
    }

    if (document.hidden) {
      return;
    }


    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    if (reduceMotion.matches) {
      return;
    }


    const drop =
      document.createElement("span");

    drop.className =
      "angie-ink-drop";


    /*
      從鋼筆尖端滴落
    */

    drop.style.left =
      `${mouseX - 2}px`;

    drop.style.top =
      `${mouseY + 3}px`;


    document.body.appendChild(drop);


    window.setTimeout(
      function () {

        drop.remove();

      },
      1550
    );

  }


  /* ======================================================
     每 15 秒滴一次
     ====================================================== */

  window.setInterval(
    createInkDrop,
    15000
  );

})();
