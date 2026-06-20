// Konfigurasi Pilihan Bahasa
const optionsMap = {
    'indo': [
        { val: 'ngoko', label: 'Jawa Ngoko' },
        { val: 'krama-lugu', label: 'Jawa Krama Lugu' },
        { val: 'krama-alus', label: 'Jawa Krama Alus' }
    ],
    'jawa': [
        { val: 'indo', label: 'Indonesia' }
    ]
};

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    updateOptions();
});

function updateOptions() {
    const fromVal = document.getElementById('lang-from').value;
    const toSelect = document.getElementById('lang-to');
    
    // Kosongkan opsi tujuan
    toSelect.innerHTML = '';
    
    // Isi opsi tujuan berdasarkan sumber
    optionsMap[fromVal].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.val;
        option.text = opt.label;
        toSelect.appendChild(option);
    });
}

function switchMode(mode) {
    const basaBtn = document.querySelectorAll('.mode-switcher button')[0];
    const aksaraBtn = document.querySelectorAll('.mode-switcher button')[1];
    
    const basaSec = document.getElementById('basa-section');
    const aksaraSec = document.getElementById('aksara-section');
    
    // Reset Hasil
    document.getElementById('result-text').innerText = '';
    document.getElementById('result-text').classList.add('placeholder');
    document.getElementById('result-text').innerText = 'Hasil terjemahan akan muncul di sini...';

    if (mode === 'basa') {
        basaBtn.classList.add('active');
        aksaraBtn.classList.remove('active');
        basaSec.style.display = 'block';
        aksaraSec.style.display = 'none';
    } else {
        basaBtn.classList.remove('active');
        aksaraBtn.classList.add('active');
        basaSec.style.display = 'none';
        aksaraSec.style.display = 'block';
    }
}

async function doTranslate() {
    const text = document.getElementById('input-text').value;
    const from = document.getElementById('lang-from').value;
    const to = document.getElementById('lang-to').value;
    
    if(!text) return alert("Mohon isi teks terlebih dahulu");

    showLoading(true);

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, from, to })
        });
        
        const data = await response.json();
        
        if(data.success) {
            displayResult(data.result);
        } else {
            displayResult("Error: " + data.error);
        }
    } catch (e) {
        displayResult("Terjadi kesalahan koneksi.");
    } finally {
        showLoading(false);
    }
}

async function doAksara() {
    const text = document.getElementById('input-aksara').value;
    const direction = document.getElementById('aksara-direction').value;

    if(!text) return alert("Mohon isi teks terlebih dahulu");

    showLoading(true);

    try {
        const response = await fetch('/api/aksara', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, direction })
        });
        
        const data = await response.json();
        
        if(data.success) {
            displayResult(data.result);
        } else {
            displayResult("Error: " + data.error);
        }
    } catch (e) {
        displayResult("Terjadi kesalahan koneksi.");
    } finally {
        showLoading(false);
    }
}

function displayResult(text) {
    const el = document.getElementById('result-text');
    el.classList.remove('placeholder');
    el.innerText = text;
}

function showLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
}

function copyText() {
    const text = document.getElementById('result-text').innerText;
    if (text && !text.includes('Hasil terjemahan')) {
        navigator.clipboard.writeText(text);
        alert("Teks disalin!");
    }
}
