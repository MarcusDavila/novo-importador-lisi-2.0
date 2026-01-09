// File Import Logic
const dropZone = document.getElementById('dropZone');
const dropZoneText = document.getElementById('dropZoneText');
const fileInput = document.getElementById('fileInput');
const btnImportar = document.getElementById('btnImportar');
const statusDiv = document.getElementById('status');

let selectedFile = null;

dropZone.onclick = () => fileInput.click();

dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
};

dropZone.ondragleave = () => {
    dropZone.classList.remove('active');
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    if (e.dataTransfer.files.length) {
        selectedFile = e.dataTransfer.files[0];
        updateFileInfo();
    }
};

fileInput.onchange = (e) => {
    selectedFile = e.target.files[0];
    updateFileInfo();
};

function updateFileInfo() {
    if (selectedFile) {
        dropZoneText.textContent = `✅ ${selectedFile.name}`;
        dropZone.classList.add('has-file');
    } else {
        dropZoneText.textContent = '📁 Arraste o arquivo aqui (CSV ou Excel)';
        dropZone.classList.remove('has-file');
    }
}

btnImportar.onclick = async () => {
    const valorBase = document.getElementById('valorBase').value;
    const tituloId = document.getElementById('tituloId').value;

    if (!selectedFile || !valorBase || !tituloId) {
        alert('⚠️ Preencha todos os campos e selecione um arquivo.');
        return;
    }

    btnImportar.disabled = true;
    btnImportar.innerText = '⏳ Processando...';
    statusDiv.style.display = 'block';
    statusDiv.className = '';
    statusDiv.innerHTML = '<div style="text-align: center;">Enviando dados ao servidor...</div>';

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('valorBase', valorBase);
    formData.append('tituloId', tituloId);

    try {
        const response = await fetch('/api/importar', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            const hasErrors = result.totalErros > 0;
            statusDiv.className = hasErrors ? 'error' : 'success';

            let htmlContent = `<strong>${result.message}</strong><br><br>`;

            result.resultados.forEach(res => {
                const itemClass = res.semSucesso ? 'error' : 'success';
                const icon = res.semSucesso ? '❌' : '✅';

                htmlContent += `
                    <div class="log-item ${itemClass}">
                        <span>${icon} ${res.nome}</span>
                        <span>${res.status} ${res.seq ? '(SEQ: ' + res.seq + ')' : ''}</span>
                    </div>`;
            });

            statusDiv.innerHTML = htmlContent;
        } else {
            statusDiv.className = 'error';
            statusDiv.innerText = '❌ Erro: ' + (result.error || 'Erro desconhecido');
        }
    } catch (err) {
        statusDiv.className = 'error';
        statusDiv.innerText = '❌ Erro de conexão com o servidor. Verifique se o backend está rodando.';
    } finally {
        btnImportar.disabled = false;
        btnImportar.innerText = 'Iniciar Importação';
    }
};