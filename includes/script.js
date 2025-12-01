document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('multiplier-display');
    const logs = document.getElementById('log-content');
    const inputField = document.getElementById('input-multiplier');
    const btnOverclock = document.getElementById('btn-overclock');
    const btnReset = document.getElementById('btn-reset');
    const btnBenchmark = document.getElementById('btn-benchmark');
    const arr = new Array(5).fill(0);
    let count = 0; 

    function addLog(msg, color = '#0f0') {
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.innerHTML = `[${time}] <span style="color:${color}">${msg}</span>`;
        logs.appendChild(entry);
        logs.scrollTop = logs.scrollHeight;
    }

    function isSorted(arr) {
      for (let i = 1; i < arr.length; i++)
        {
          if (arr[i] < arr[i-1])
            return false;
        }
      return true;
    } 

    btnOverclock.addEventListener('click', () => {
        const val = parseInt(inputField.value);
        display.innerText = val + "x";
        btnBenchmark.style.display = "none";
        if (val <= 50) {
            display.style.color = "#0f0";
            addLog(`Core multiplier set to ${val}x.`);
        } 
        else if (val > 50 && val <= 55) {
            addLog(`OC active at ${val}x.`);
            if (count < 5) {
              arr[count] = val;
              count = count + 1;
            }
            console.log(arr);
        } 
        else if (val >= 56 && val < 76) {
            display.style.color = "#5555ff"; 
            display.innerText = ":(";
            if (isSorted(arr) && arr.every(element => element !== 0)) {
              addLog(`Whoops! System BSOD'd, maybe it left me some logs...`, "#5555ff");
              fetch('/leConfig', {
                method: 'POST'
              });
              console.log(arr); 
            }
            else {
              addLog(`Unstable OC detected, resets`, "#5555ff");
              arr.fill(0);
              count = 0;
              console.log(arr);
            }
            
        } 
        else if (val === 76) {
            display.style.color = "#00ffff"; 
            addLog(`Welp, sytem seems stable, i hope the requests come in perfect now...`);
            btnBenchmark.style.display = "block";
        }
        else {
            addLog(`System instability detected at ${val}x.`);
        }
    });

    btnReset.addEventListener('click', () => {
        display.innerText = "30x";
        display.style.color = "#0f0";
        inputField.value = 30;
        btnBenchmark.style.display = "none";
        addLog("System reset.");
    });

    btnBenchmark.addEventListener('click', () => {
        window.location.href = "/api/benchmark?url=https://google.com";
    });
});
