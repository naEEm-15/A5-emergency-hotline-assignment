document.addEventListener("DOMContentLoaded", () => {
    
  const heartCounterEl = document.getElementById("heartCount"); 
  const coinCounterEl  = document.getElementById("coinCount"); 
  const copyCounterEl  = document.getElementById("copyCount");  
  const cardSection = document.querySelector(".card-section");
  const callHistory = document.getElementById("callHistory");
  const clearBtn    = document.getElementById("clearHistory"); 
  const historyList = document.getElementById("historyList");

  
  const intFrom = (el) => parseInt(el.textContent.trim(), 10) || 0;

  function getServiceName(card) {
    const h1 = card.querySelector("h1");
    return h1 ? h1.textContent.trim() : "Unknown Service";
  }

  function getServiceNumber(card) {
    const numSpan = card.querySelector("span");
    return numSpan ? numSpan.textContent.trim() : "";
  }

  function formatTime(date = new Date()) {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      return true;
    } catch {
      return false;
    }
  }

  function addHistoryItem({ name, number, time }) {
    const li = document.createElement("li");
    li.className = "bg-[#f7fff8] rounded-xl p-4 border border-[#e5f7ea] flex flex-col gap-1";
    
    const title = document.createElement("div");
    title.className = "font-semibold";
    title.textContent = name;

    const detail = document.createElement("div");
    detail.className = "text-sm";
    detail.textContent = `Number: ${number}`;

    const stamp = document.createElement("div");
    stamp.className = "text-xs opacity-70";
    stamp.textContent = `Called at: ${time}`;

    li.append(title, detail, stamp);
    historyList.appendChild(li);
  }

 
  cardSection.addEventListener("click", async (e) => {
    const card = e.target.closest(".card-section > div");
    if (!card) return;

    
    const heartImg = e.target.closest('img[src$="heart.png"]');
    if (heartImg) {
      heartCounterEl.textContent = intFrom(heartCounterEl) + 1;
      return;
    }

   
    const copyBtn = e.target.closest("button");
    if (copyBtn && copyBtn.querySelector(".fa-copy")) {
      const serviceName = getServiceName(card);
      const number = getServiceNumber(card);
      if (!number) {
        alert("No number found to copy.");
        return;
      }
      const ok = await copyToClipboard(number);
      if (ok) {
        copyCounterEl.textContent = intFrom(copyCounterEl) + 1;
        alert(`Copied ${serviceName} number: ${number}`);
      } else {
        alert("Failed to copy. Please try manually.");
      }
      return;
    }

    if (copyBtn && copyBtn.querySelector(".fa-phone")) {
      const serviceName = getServiceName(card);
      const number = getServiceNumber(card);
      let coins = intFrom(coinCounterEl);

      if (coins < 20) {
        alert("Not enough coins to place a call. You need 20 coins.");
        return;
      }

      coins -= 20;
      coinCounterEl.textContent = coins;

      alert(`Calling ${serviceName} at ${number}...`);

      addHistoryItem({
        name: serviceName,
        number,
        time: formatTime(new Date()),
      });
    }
  });

  
  clearBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
  });
});
