(function () {

  /* ======================================================
     ANGIE — FOUNTAIN PEN NIB CURSOR
     ====================================================== */


  /* 只在有真正滑鼠的裝置啟用 */
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!finePointer.matches) {
    return;
  }


  /* ======================================================
     1. 建立鋼筆筆尖
     ====================================================== */

  const nib = document.createElement("div");

  nib.className = "angie-pen-nib";


  /*
     SVG 設計：

     - 筆尖朝左上
     - 左上尖端就是實際點擊位置
     - 暖棕線條
     - 淡米金內部
     - 很輕的立體高光
  */

  nib.innerHTML = `
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

          <stop
            offset="0%"
            stop-color="#f4ede1"
          />

          <stop
            offset="52%"
            stop-color="#e8ddc6"
          />

          <stop
            offset="100%"
            stop-color="#cac6bd"
          />

        </linearGradient>


        <linearGradient
          id="angieNibGold"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >

          <stop
            offset="0%"
            stop-color="#eedf9a"
          />

          <stop
            offset="48%"
            stop-color="#d2b45e"
          />

          <stop
            offset="100%"
            stop-color="#bb9a88"
          />

        </linearGradient>

      </defs>


      <!-- 鋼筆筆尖主體 -->

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


      <!-- 筆尖中央導墨線 -->

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


      <!-- 呼吸孔至筆尾的細線 -->

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


      <!-- 非常淡的高光 -->

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


      <!-- 筆尖尾部金屬細環 -->

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


  document.body.appendChild(nib);

  document.documentElement.classList.add(
    "angie-pen-cursor"
  );


  /* ======================================================
     2. 滑鼠位置
     ====================================================== */

  let mouseX = -100;
  let mouseY = -100;

  let pointerVisible = false;


  function positionNib() {

    /*
       SVG 的筆尖尖端在約：
       x = 2
       y = 2

       所以讓尖端精準對齊真正鼠標位置。
    */

    nib.style.transform =
      `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0)`;

  }


  document.addEventListener(
    "mousemove",
    function (event) {

      mouseX = event.clientX;
      mouseY = event.clientY;

      pointerVisible = true;

      nib.style.opacity = "1";

      positionNib();


      /* 判斷目前是不是在可點擊元素上 */

      const clickable = event.target.closest(
        "a, button, input, textarea, select, label, [role='button']"
      );

      if (clickable) {

        nib.classList.add("is-link");

      } else {

        nib.classList.remove("is-link");

      }

    }
  );


  document.addEventListener(
    "mouseleave",
    function () {

      pointerVisible = false;

      nib.style.opacity = "0";

    }
  );


  document.addEventListener(
    "mouseenter",
    function () {

      pointerVisible = true;

    }
  );


  /* ======================================================
     3. 滴墨
     ====================================================== */

  function createInkDrop() {

    /* 鼠標不在頁面裡就不滴 */

    if (!pointerVisible) {
      return;
    }


    /* 分頁在背景時也不滴 */

    if (document.hidden) {
      return;
    }


    /* 使用者要求減少動畫時取消 */

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
       墨水從真正的筆尖位置出現，
       也就是目前鼠標位置。
    */

    drop.style.left =
      `${mouseX - 1}px`;

    drop.style.top =
      `${mouseY + 2}px`;


    document.body.appendChild(drop);


    /* 動畫結束後刪除 */

    window.setTimeout(
      function () {

        drop.remove();

      },
      1400
    );

  }


  /* ======================================================
     4. 每 30 秒一滴
     ====================================================== */

  window.setInterval(
    createInkDrop,
    30000
  );

})();
