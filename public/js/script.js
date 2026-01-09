const dropZone = document.getElementById('dropZone');
const dropZoneText = document.getElementById('dropZoneText');
const fileInput = document.getElementById('fileInput');
const statusDiv = document.getElementById('status');
const previewSection = document.getElementById('previewSection');
const previewBody = document.getElementById('previewBody');
const btnCancelar = document.getElementById('btnCancelar');
const btnConfirmar = document.getElementById('btnConfirmar');

let selectedFile = null;
let previewData = [];


function getDiasMesAnterior() {
    const hoje = new Date();
    const dataMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    return {
        totalDias: dataMesAnterior.getDate(),
        mes: dataMesAnterior.getMonth() + 1,
        ano: dataMesAnterior.getFullYear()
    };
}


async function processFile(file) {
    const valorBase = parseFloat(document.getElementById('valorBase').value);
    const tituloId = document.getElementById('tituloId').value;

    if (!valorBase || !tituloId) {
        alert('⚠️ Preencha o Valor Base e o Identificador do Título antes de carregar o arquivo.');
        resetFileInput();
        return;
    }

    const { totalDias } = getDiasMesAnterior();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const records = XLSX.utils.sheet_to_json(worksheet);

                previewData = records
                    .filter(record => record.NOME && record.Dias && !isNaN(parseInt(record.Dias)))
                    .map((record, index) => {
                        const dias = parseInt(record.Dias);
                        const valorCalculado = parseFloat(((valorBase / totalDias) * dias).toFixed(2));
                        return {
                            index,
                            nome: record.NOME,
                            dias: dias,
                            valor: valorCalculado
                        };
                    });

                const names = previewData.map(item => item.nome);

       
                fetch('/api/consultar-motoristas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nomes: names })
                })
                    .then(response => response.json())
                    .then(result => {
                   
                        const cpfMap = {};
                        if (result.resultados) {
                            result.resultados.forEach(r => {
                                cpfMap[r.nome] = r.cpf;
                            });
                        }

                    
                        previewData.forEach(item => {
                            item.cpf = cpfMap[item.nome] || null;
                        });

                        resolve(previewData);
                    })
                    .catch(err => reject(err));
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}


function renderPreview(data) {
    previewBody.innerHTML = '';

    data.forEach((item, idx) => {
        const row = document.createElement('tr');
        const cpfDisplay = item.cpf || '<span style="color: var(--error); font-weight: bold;">Não encontrado</span>';

        row.innerHTML = `
            <td style="text-align: center; width: 140px;">${cpfDisplay}</td>
            <td>${item.nome}</td>
            <td style="text-align: center; width: 80px;">${item.dias}</td>
            <td style="width: 120px;">
                <input type="number"
                       step="0.01"
                       value="${item.valor.toFixed(2)}"
                       data-index="${idx}"
                       onchange="updatePreviewValue(${idx}, this.value)">
            </td>
        `;
        previewBody.appendChild(row);
    });

    previewSection.style.display = 'block';
}


function updatePreviewValue(index, newValue) {
    previewData[index].valor = parseFloat(newValue) || 0;
}


window.updatePreviewValue = updatePreviewValue;


function resetFileInput() {
    selectedFile = null;
    fileInput.value = '';
    dropZoneText.textContent = '📁 Arraste o arquivo aqui (CSV ou Excel)';
    dropZone.classList.remove('has-file');
}


function cancelPreview() {
    previewSection.style.display = 'none';
    previewBody.innerHTML = '';
    previewData = [];
    statusDiv.style.display = 'none';
    resetFileInput();
}


async function confirmImport() {
    const valorBase = document.getElementById('valorBase').value;
    const tituloId = document.getElementById('tituloId').value;

    if (previewData.length === 0) {
        alert('⚠️ Nenhum dado para importar.');
        return;
    }

    btnConfirmar.disabled = true;
    btnCancelar.disabled = true;
    btnConfirmar.innerText = '⏳ Processando...';
    statusDiv.style.display = 'block';
    statusDiv.className = '';
    statusDiv.innerHTML = '<div style="text-align: center;">Enviando dados ao servidor...</div>';


    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('valorBase', valorBase);
    formData.append('tituloId', tituloId);
    formData.append('previewData', JSON.stringify(previewData));

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


            previewSection.style.display = 'none';
            previewBody.innerHTML = '';
            previewData = [];
            resetFileInput();
        } else {
            statusDiv.className = 'error';
            statusDiv.innerText = '❌ Erro: ' + (result.error || 'Erro desconhecido');
        }
    } catch (err) {
        statusDiv.className = 'error';
        statusDiv.innerText = '❌ Erro de conexão com o servidor. Verifique se o backend está rodando.';
    } finally {
        btnConfirmar.disabled = false;
        btnCancelar.disabled = false;
        btnConfirmar.innerText = 'Confirmar Importação';
    }
}

dropZone.onclick = () => fileInput.click();

dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
};

dropZone.ondragleave = () => {
    dropZone.classList.remove('active');
};

dropZone.ondrop = async (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    if (e.dataTransfer.files.length) {
        selectedFile = e.dataTransfer.files[0];
        await handleFileSelect();
    }
};

fileInput.onchange = async (e) => {
    selectedFile = e.target.files[0];
    await handleFileSelect();
};

async function handleFileSelect() {
    if (selectedFile) {
        dropZoneText.textContent = `⏳ Processando ${selectedFile.name}...`;
        dropZone.classList.add('has-file');

        try {
            const data = await processFile(selectedFile);
            if (data && data.length > 0) {
                dropZoneText.textContent = `✅ ${selectedFile.name} (${data.length} registros)`;
                renderPreview(data);
            } else {
                dropZoneText.textContent = '⚠️ Nenhum registro válido encontrado';
                resetFileInput();
            }
        } catch (err) {
            console.error('Erro ao processar arquivo:', err);
            alert('❌ Erro ao processar arquivo: ' + err.message);
            resetFileInput();
        }
    }
}

btnCancelar.onclick = cancelPreview;
btnConfirmar.onclick = confirmImport;