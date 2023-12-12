var alertSound = document.getElementById("zabbix-error-sound");

function checkStatus() {
  const widgets = [...document.getElementsByClassName("dashboard-grid-widget-container")];
  const targetWidget = widgets.filter((w) => w.querySelector(".dashboard-grid-widget-head").innerText === "障害")[0];
  if (!targetWidget) return true;
  const columns = [...targetWidget.querySelector("thead tr").children];
  const severityIndex = columns.findIndex((n) => n.textContent === "障害 • 深刻度");
  const confirmedIndex = columns.findIndex((n) => n.textContent === "確認済");
  if (severityIndex === -1 || confirmedIndex === -1) return true;
  const rows = [...targetWidget.querySelectorAll("tbody tr")];

  // 深刻度が情報/未分類以外かつ未確認の障害がある場合にアラートを鳴らす
  if (
    rows.some(
      (row) =>
        !(
          row.children[severityIndex].classList.contains("info-bg") ||
          row.children[severityIndex].classList.contains("na-bg")
        ) && row.children[confirmedIndex].textContent === "いいえ"
    )
  )
    return true;
  else return false;
}

function callback() {
  const nodes = Array.from(
    document.getElementsByClassName("by-severity-widget totals-list totals-list-horizontal")[0].children
  );
  nodes.forEach((e) => {
    "0" === e.getElementsByClassName("count")[0].textContent
      ? (e.style.backgroundColor = "white")
      : (e.style.backgroundColor = "");
  });
  if (nodes.some((e, idx) => idx < 4 && "0" !== e.getElementsByClassName("count")[0].textContent)) {
    if (checkStatus()) alertSound.play();
  }
}

const observe = () => {
  const main = () => {
    alertSound = document.getElementById("zabbix-error-sound");
    let targetRoot = [...document.getElementsByClassName("dashboard-grid-widget-head")].filter(
      (e) => "深刻度ごとの障害数" === e.textContent
    )[0]?.parentElement;
    if (!targetRoot) throw new Error("There is no valid node.");
    const option = { childList: !0, subtree: !0 };
    const observer = new MutationObserver(callback);
    observer.observe(targetRoot, option);
  };
  try {
    main();
  } catch (e) {
    setTimeout(main, 3000);
  }
};
window.addEventListener("load", observe);
